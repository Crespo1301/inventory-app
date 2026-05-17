import { z } from 'zod';

export const lowStockNoteSchema = z.object({
  itemName: z.string().trim().min(1).max(120),
  quantity: z.number().positive().optional(),
  unit: z.string().trim().max(32).optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  note: z.string().trim().max(500).optional(),
});

export type LowStockNoteInput = z.infer<typeof lowStockNoteSchema>;

