export type InventoryUrgency = 'low' | 'medium' | 'high';

export type LowStockNote = {
  itemName: string;
  quantity?: number;
  unit?: string;
  urgency: InventoryUrgency;
  note?: string;
};

