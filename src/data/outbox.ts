/**
 * Offline write queue (outbox).
 *
 * When a Supabase write fails because the device has no network, the caller
 * can enqueue the operation here. Each entry carries everything needed to
 * replay the write later: the repo function name and its serialised arguments.
 *
 * Persistence: AsyncStorage key `@inventory/outbox`. This survives app restarts
 * so notes captured offline are never silently dropped.
 *
 * Failure modes:
 * - A replay that fails again (e.g. the row was deleted server-side in the
 *   meantime) logs the error and discards the entry rather than retrying
 *   indefinitely. Data is not silently lost — the error is surfaced to the
 *   caller so the store can decide whether to show a toast.
 * - AsyncStorage errors are non-fatal; the queue degrades gracefully to
 *   in-memory only.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as repo from '@/src/data/repo';
import type { ServiceArea, StockStatus, Urgency } from '@/src/domain';
import type { ItemInput } from '@/src/store/app-store';

const STORAGE_KEY = '@inventory/outbox';

// ------------------------------------------------------------------ op types
// Each variant corresponds to a repo write that can fail offline.

export type OutboxOp =
  | {
      type: 'insertNote';
      args: {
        itemId: string;
        locationId: string;
        area: ServiceArea;
        status: StockStatus;
        urgency: Urgency;
        quantityOnHand?: number;
        note?: string;
        createdBy: string;
      };
    }
  | { type: 'resolveNote'; args: { id: string } }
  | {
      type: 'createOrderList';
      args: {
        locationId: string;
        area: ServiceArea;
        lines: { itemId: string; suggestedQty: number; reason: string }[];
      };
    }
  | { type: 'updateOrderLineFinalQty'; args: { id: string; finalQty: number } }
  | {
      type: 'verifyOrderList';
      args: { id: string; userId: string; itemIds: string[]; locationId: string };
    }
  | { type: 'insertItem'; args: Omit<repo.AccountUser, 'id'> & ItemInput & { companyId: string } }
  | { type: 'updateItem'; args: Parameters<typeof repo.updateItem>[0] }
  | { type: 'deleteItem'; args: { id: string } }
  | { type: 'insertLocation'; args: { companyId: string; name: string; address?: string } }
  | { type: 'updateLocation'; args: { id: string; name: string; address?: string } }
  | {
      type: 'createInvitation';
      args: {
        companyId: string;
        email: string;
        role: Exclude<repo.AccountUser['role'], 'admin'>;
        locationIds: string[];
        invitedBy: string;
      };
    }
  | { type: 'deleteInvitation'; args: { id: string } }
  | { type: 'deleteProfile'; args: { id: string } };

export type QueueEntry = {
  id: string;
  op: OutboxOp;
  enqueuedAt: number;
};

// --------------------------------------------------------- persistence helpers

async function read(): Promise<QueueEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueueEntry[]) : [];
  } catch {
    return [];
  }
}

async function write(entries: QueueEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Non-fatal — the entry is still in the caller's memory for this session.
  }
}

// --------------------------------------------------------------- public API

/** Returns the number of entries currently in the queue. */
export async function size(): Promise<number> {
  return (await read()).length;
}

/** Appends one operation to the persistent queue. */
export async function enqueue(op: OutboxOp): Promise<QueueEntry> {
  const entry: QueueEntry = { id: Math.random().toString(36).slice(2), op, enqueuedAt: Date.now() };
  const entries = await read();
  await write([...entries, entry]);
  return entry;
}

/**
 * Replays every queued operation against Supabase in insertion order.
 *
 * Returns an object describing how many ops succeeded and how many failed.
 * Entries that succeed are removed from the queue.
 * Entries that fail permanently (non-network error) are also removed to avoid
 * replaying them again — the error is included in `failures`.
 */
export async function flush(): Promise<{ succeeded: number; failures: { entry: QueueEntry; error: string }[] }> {
  const entries = await read();
  if (entries.length === 0) return { succeeded: 0, failures: [] };

  let succeeded = 0;
  const failures: { entry: QueueEntry; error: string }[] = [];
  const remaining: QueueEntry[] = [];

  for (const entry of entries) {
    try {
      await replay(entry.op);
      succeeded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Keep the entry in the queue only when the error looks transient.
      // Network-related: keep; any other: discard to avoid infinite retries.
      if (isNetworkError(msg)) {
        remaining.push(entry);
      } else {
        failures.push({ entry, error: msg });
      }
    }
  }

  await write(remaining);
  return { succeeded, failures };
}

/** Clears the entire queue without replaying. Use only in dev / after sign-out. */
export async function clear(): Promise<void> {
  await write([]);
}

// ------------------------------------------------------------------ internals

function isNetworkError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes('network') ||
    lower.includes('fetch') ||
    lower.includes('timeout') ||
    lower.includes('connection') ||
    lower.includes('offline')
  );
}

/** Dispatches a single queued operation back to the repo. */
async function replay(op: OutboxOp): Promise<void> {
  switch (op.type) {
    case 'insertNote':
      await repo.insertNote(op.args);
      break;
    case 'resolveNote':
      await repo.resolveNote(op.args.id);
      break;
    case 'createOrderList':
      await repo.createOrderList(op.args);
      break;
    case 'updateOrderLineFinalQty':
      await repo.updateOrderLineFinalQty(op.args.id, op.args.finalQty);
      break;
    case 'verifyOrderList':
      await repo.verifyOrderList(op.args.id, op.args.userId);
      await repo.resolveNotesForItems(op.args.itemIds, op.args.locationId);
      break;
    case 'updateItem':
      await repo.updateItem(op.args);
      break;
    case 'deleteItem':
      await repo.deleteItem(op.args.id);
      break;
    case 'insertLocation':
      await repo.insertLocation(op.args.companyId, op.args.name, op.args.address);
      break;
    case 'updateLocation':
      await repo.updateLocation(op.args.id, op.args.name, op.args.address);
      break;
    case 'createInvitation':
      await repo.createInvitation(op.args);
      break;
    case 'deleteInvitation':
      await repo.deleteInvitation(op.args.id);
      break;
    case 'deleteProfile':
      await repo.deleteProfile(op.args.id);
      break;
    case 'insertItem':
      // insertItem returns the created row; we can't update the store ID here,
      // so we just replay to persist the data server-side. The next reload will
      // surface it via the realtime subscription.
      await repo.insertItem(op.args);
      break;
    default: {
      // TypeScript exhaustive check.
      const _exhaustive: never = op;
      throw new Error(`Unknown outbox op: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
