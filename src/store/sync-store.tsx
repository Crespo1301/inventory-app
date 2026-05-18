/**
 * Sync status store.
 *
 * Tracks whether the device is online and how many writes are pending in the
 * outbox. Provides a `flushOutbox` function that the app-store calls after each
 * mutation and that is triggered automatically on reconnect.
 *
 * Kept separate from app-store so connectivity state never pollutes the
 * data snapshot logic.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as outbox from '@/src/data/outbox';
import { useConnectivity } from '@/hooks/use-connectivity';

export type SyncStatus = 'online' | 'offline' | 'syncing';

export type SyncValue = {
  /** Current network + sync state. */
  syncStatus: SyncStatus;
  /** Number of writes queued but not yet sent to Supabase. */
  pendingCount: number;
  /**
   * Attempt to send all queued writes now. Safe to call when already online;
   * resolves immediately when the queue is empty. Passes the reload callback
   * to app-store so it can refresh after a successful flush.
   */
  flushOutbox: (afterFlush?: () => Promise<void>) => Promise<void>;
};

const SyncContext = createContext<SyncValue | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const afterFlushRef = useRef<(() => Promise<void>) | undefined>(undefined);

  /** Reads the queue length from storage and updates the counter. */
  const refreshCount = useCallback(async () => {
    const n = await outbox.size();
    setPendingCount(n);
  }, []);

  // Seed the count from whatever survived the previous session.
  useEffect(() => {
    void refreshCount();
  }, [refreshCount]);

  const doFlush = useCallback(
    async (afterFlush?: () => Promise<void>) => {
      const count = await outbox.size();
      if (count === 0) return;

      setSyncing(true);
      try {
        await outbox.flush();
        await refreshCount();
        // Reload the snapshot so the store reflects any server-generated IDs
        // (e.g. a note row that was inserted offline now has its real UUID).
        await (afterFlush ?? afterFlushRef.current)?.();
      } finally {
        setSyncing(false);
      }
    },
    [refreshCount],
  );

  const isOnline = useConnectivity({
    onReconnect: () => void doFlush(afterFlushRef.current),
  });

  const flushOutbox = useCallback(
    async (afterFlush?: () => Promise<void>) => {
      if (afterFlush) afterFlushRef.current = afterFlush;
      if (isOnline) await doFlush(afterFlush);
      else await refreshCount();
    },
    [isOnline, doFlush, refreshCount],
  );

  let syncStatus: SyncStatus;
  if (!isOnline) syncStatus = 'offline';
  else if (syncing) syncStatus = 'syncing';
  else syncStatus = 'online';

  return (
    <SyncContext.Provider value={{ syncStatus, pendingCount, flushOutbox }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync(): SyncValue {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used inside <SyncProvider>');
  return ctx;
}
