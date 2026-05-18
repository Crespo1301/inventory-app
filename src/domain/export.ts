/** Formats an order list as shareable plain text (SMS, email, notes app). */

import type { Item, OrderLine, OrderList, ServiceArea } from '@/src/domain';

const areaLabel: Record<ServiceArea, string> = {
  foh: 'Front of House',
  boh: 'Back of House',
};

export function formatOrderForShare(args: {
  list: OrderList;
  lines: OrderLine[];
  items: Item[];
  locationName: string;
}): string {
  const { list, lines, items, locationName } = args;
  const date = new Date(list.createdAt).toLocaleDateString();
  const itemName = (id: string) => items.find((i) => i.id === id)?.name ?? id;
  const itemUnit = (id: string) => items.find((i) => i.id === id)?.unit ?? '';

  const header = [`Order — ${locationName} · ${areaLabel[list.area]}`, date, ''].join('\n');

  const body = lines
    .filter((l) => l.finalQty > 0)
    .map((l) => `• ${itemName(l.itemId)} — ${l.finalQty} ${itemUnit(l.itemId)}`)
    .join('\n');

  return `${header}${body || '(no items)'}\n`;
}
