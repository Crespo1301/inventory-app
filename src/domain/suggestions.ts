/**
 * Order suggestion engine — V1.
 *
 * Deterministic and explainable. Every suggested quantity ships with a
 * plain-language reason the manager can read and trust. See docs/architecture.md.
 */

import type { Item, LowStockNote, Urgency } from '@/src/domain';

/** Extra units added for high-urgency items so a busy weekend has a cushion. */
const SAFETY_BUFFER = 1;

export type Suggestion = {
  suggestedQty: number;
  reason: string;
};

function roundUpToPack(qty: number, packSize: number): number {
  if (packSize <= 1) return Math.ceil(qty);
  return Math.ceil(qty / packSize) * packSize;
}

function urgencyRank(urgency: Urgency): number {
  return urgency === 'high' ? 3 : urgency === 'medium' ? 2 : 1;
}

/**
 * Suggest how much of `item` to order.
 *
 * @param item        the catalog item, with par level and vendor pack size
 * @param onHand      best-known current count (0 when an item is flagged "out")
 * @param notes       open low-stock notes for this item, used as urgency signal
 */
export function suggestOrderQuantity(
  item: Item,
  onHand: number,
  notes: LowStockNote[],
): Suggestion {
  const needed = Math.max(item.parLevel - onHand, 0);

  const topUrgency = notes.reduce<Urgency>((acc, n) => (urgencyRank(n.urgency) > urgencyRank(acc) ? n.urgency : acc), 'low');
  const urgentBonus = topUrgency === 'high' ? SAFETY_BUFFER : 0;

  const rawQty = needed + urgentBonus;
  const suggestedQty = roundUpToPack(rawQty, item.packSize);

  const reason = buildReason({ item, onHand, needed, urgentBonus, suggestedQty, noteCount: notes.length });

  return { suggestedQty, reason };
}

function buildReason(args: {
  item: Item;
  onHand: number;
  needed: number;
  urgentBonus: number;
  suggestedQty: number;
  noteCount: number;
}): string {
  const { item, onHand, needed, urgentBonus, suggestedQty, noteCount } = args;
  const u = item.unit;

  if (needed === 0 && urgentBonus === 0) {
    return `On-hand (${onHand} ${u}) is at or above par (${item.parLevel} ${u}). No reorder needed.`;
  }

  const parts: string[] = [];
  parts.push(`Par is ${item.parLevel} ${u}, on-hand is ${onHand} ${u}`);
  if (urgentBonus > 0) parts.push(`+${urgentBonus} ${u} buffer for a high-urgency flag`);
  if (item.packSize > 1) parts.push(`rounded up to a ${item.packSize}-${u} pack`);
  if (noteCount > 0) parts.push(`${noteCount} team note${noteCount > 1 ? 's' : ''} this week`);

  return `Suggested ${suggestedQty} ${u}: ${parts.join(', ')}.`;
}
