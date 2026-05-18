/**
 * Supabase data layer. Every screen/store reads and writes through these
 * functions — they own the SQL-equivalent queries and map snake_case rows to
 * the camelCase domain types. Row-level security scopes results automatically,
 * so most reads need no explicit company filter.
 */

import { supabase } from '@/src/supabase/client';
import type {
  Company,
  Item,
  Location,
  LowStockNote,
  OrderLine,
  OrderList,
  ServiceArea,
  StockStatus,
  Urgency,
  UserRole,
  Vendor,
} from '@/src/domain';

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const ms = (iso: string | null): number => (iso ? Date.parse(iso) : 0);

export type AccountUser = {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Invitation = {
  id: string;
  companyId: string;
  code: string;
  email: string;
  role: Exclude<UserRole, 'admin'>;
  locationIds: string[];
  status: 'pending' | 'accepted';
  createdAt: number;
};

export type InvitationEmailInput = {
  companyName: string;
  invitedByName: string;
  invitedByEmail?: string;
  inviteeEmail: string;
  code: string;
  role: Exclude<UserRole, 'admin'>;
  locationNames: string[];
};

// ------------------------------------------------------------------- mappers

const mapProfile = (r: any): AccountUser => ({
  id: r.id,
  companyId: r.company_id,
  name: r.name,
  email: r.email,
  role: r.role,
});

const mapLocation = (r: any): Location => ({
  id: r.id,
  companyId: r.company_id,
  name: r.name,
  address: r.address ?? undefined,
});

const mapVendor = (r: any): Vendor => ({ id: r.id, companyId: r.company_id, name: r.name });

const mapItem = (r: any): Item => ({
  id: r.id,
  companyId: r.company_id,
  name: r.name,
  nameEs: r.name_es ?? undefined,
  unit: r.unit,
  category: r.category,
  area: r.area as ServiceArea,
  parLevel: Number(r.par_level),
  packSize: Number(r.pack_size),
  vendorId: r.vendor_id ?? undefined,
});

const mapNote = (r: any): LowStockNote => ({
  id: r.id,
  itemId: r.item_id,
  locationId: r.location_id,
  area: r.area as ServiceArea,
  status: r.status as StockStatus,
  urgency: r.urgency as Urgency,
  quantityOnHand: r.quantity_on_hand ?? undefined,
  note: r.note ?? undefined,
  createdByUserId: r.created_by ?? '',
  createdAt: ms(r.created_at),
  resolvedAt: r.resolved_at ? ms(r.resolved_at) : undefined,
});

const mapOrderList = (r: any): OrderList => ({
  id: r.id,
  locationId: r.location_id,
  area: r.area as ServiceArea,
  status: r.status,
  createdAt: ms(r.created_at),
  verifiedAt: r.verified_at ? ms(r.verified_at) : undefined,
  verifiedByUserId: r.verified_by ?? undefined,
});

const mapOrderLine = (r: any): OrderLine => ({
  id: r.id,
  orderListId: r.order_list_id,
  itemId: r.item_id,
  suggestedQty: Number(r.suggested_qty),
  finalQty: Number(r.final_qty),
  reason: r.reason,
});

const mapInvitation = (r: any): Invitation => ({
  id: r.id,
  companyId: r.company_id,
  code: r.code,
  email: r.email,
  role: r.role,
  locationIds: r.location_ids ?? [],
  status: r.status,
  createdAt: ms(r.created_at),
});

// --------------------------------------------------------------------- reads

export async function getMyProfile(userId: string): Promise<AccountUser | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProfile(data) : null;
}

export type CompanySnapshot = {
  company: Company;
  locations: Location[];
  users: AccountUser[];
  vendors: Vendor[];
  items: Item[];
  notes: LowStockNote[];
  orderLists: OrderList[];
  orderLines: OrderLine[];
  userLocations: { userId: string; locationId: string }[];
  invitations: Invitation[];
};

/** Loads everything the signed-in user is allowed to see in one shot. */
export async function loadCompanySnapshot(): Promise<CompanySnapshot> {
  const [company, locations, users, vendors, items, notes, orderLists, orderLines, ul, invites] =
    await Promise.all([
      supabase.from('companies').select('*').single(),
      supabase.from('locations').select('*').order('created_at'),
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('vendors').select('*').order('name'),
      supabase.from('items').select('*').order('name'),
      supabase.from('low_stock_notes').select('*').order('created_at', { ascending: false }),
      supabase.from('order_lists').select('*').order('created_at', { ascending: false }),
      supabase.from('order_list_lines').select('*'),
      supabase.from('user_locations').select('*'),
      supabase.from('invitations').select('*').order('created_at', { ascending: false }),
    ]);

  const c = unwrap(company);
  return {
    company: { id: c.id, name: c.name, createdByUserId: c.created_by },
    locations: unwrap(locations).map(mapLocation),
    users: unwrap(users).map(mapProfile),
    vendors: unwrap(vendors).map(mapVendor),
    items: unwrap(items).map(mapItem),
    notes: unwrap(notes).map(mapNote),
    orderLists: unwrap(orderLists).map(mapOrderList),
    orderLines: unwrap(orderLines).map(mapOrderLine),
    userLocations: unwrap(ul).map((r: any) => ({ userId: r.profile_id, locationId: r.location_id })),
    invitations: unwrap(invites).map(mapInvitation),
  };
}

// ------------------------------------------------------------------- writes

export async function insertNote(input: {
  itemId: string;
  locationId: string;
  area: ServiceArea;
  status: StockStatus;
  urgency: Urgency;
  quantityOnHand?: number;
  note?: string;
  createdBy: string;
}): Promise<LowStockNote> {
  const res = await supabase
    .from('low_stock_notes')
    .insert({
      item_id: input.itemId,
      location_id: input.locationId,
      area: input.area,
      status: input.status,
      urgency: input.urgency,
      quantity_on_hand: input.quantityOnHand ?? null,
      note: input.note ?? null,
      created_by: input.createdBy,
    })
    .select()
    .single();
  return mapNote(unwrap(res));
}

export async function resolveNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('low_stock_notes')
    .update({ resolved_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function resolveNotesForItems(itemIds: string[], locationId: string): Promise<void> {
  if (itemIds.length === 0) return;
  const { error } = await supabase
    .from('low_stock_notes')
    .update({ resolved_at: new Date().toISOString() })
    .is('resolved_at', null)
    .eq('location_id', locationId)
    .in('item_id', itemIds);
  if (error) throw new Error(error.message);
}

export async function createOrderList(input: {
  locationId: string;
  area: ServiceArea;
  lines: { itemId: string; suggestedQty: number; reason: string }[];
}): Promise<{ list: OrderList; lines: OrderLine[] }> {
  const listRes = await supabase
    .from('order_lists')
    .insert({ location_id: input.locationId, area: input.area, status: 'open' })
    .select()
    .single();
  const list = mapOrderList(unwrap(listRes));

  if (input.lines.length === 0) return { list, lines: [] };

  const linesRes = await supabase
    .from('order_list_lines')
    .insert(
      input.lines.map((l) => ({
        order_list_id: list.id,
        item_id: l.itemId,
        suggested_qty: l.suggestedQty,
        final_qty: l.suggestedQty,
        reason: l.reason,
      })),
    )
    .select();
  return { list, lines: unwrap(linesRes).map(mapOrderLine) };
}

export async function updateOrderLineFinalQty(id: string, finalQty: number): Promise<void> {
  const { error } = await supabase.from('order_list_lines').update({ final_qty: finalQty }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function verifyOrderList(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('order_lists')
    .update({ status: 'verified', verified_at: new Date().toISOString(), verified_by: userId })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function insertItem(input: Omit<Item, 'id'>): Promise<Item> {
  const res = await supabase
    .from('items')
    .insert({
      company_id: input.companyId,
      name: input.name,
      name_es: input.nameEs ?? null,
      unit: input.unit,
      category: input.category,
      area: input.area,
      par_level: input.parLevel,
      pack_size: input.packSize,
      vendor_id: input.vendorId ?? null,
    })
    .select()
    .single();
  return mapItem(unwrap(res));
}

export async function updateItem(item: Item): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({
      name: item.name,
      name_es: item.nameEs ?? null,
      unit: item.unit,
      category: item.category,
      area: item.area,
      par_level: item.parLevel,
      pack_size: item.packSize,
      vendor_id: item.vendorId ?? null,
    })
    .eq('id', item.id);
  if (error) throw new Error(error.message);
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function insertLocation(companyId: string, name: string, address?: string): Promise<Location> {
  const res = await supabase
    .from('locations')
    .insert({ company_id: companyId, name, address: address ?? null })
    .select()
    .single();
  return mapLocation(unwrap(res));
}

export async function updateLocation(id: string, name: string, address?: string): Promise<void> {
  const { error } = await supabase
    .from('locations')
    .update({ name, address: address ?? null })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createInvitation(input: {
  companyId: string;
  email: string;
  role: Exclude<UserRole, 'admin'>;
  locationIds: string[];
  invitedBy: string;
}): Promise<Invitation> {
  const res = await supabase
    .from('invitations')
    .insert({
      company_id: input.companyId,
      email: input.email.toLowerCase(),
      role: input.role,
      location_ids: input.locationIds,
      invited_by: input.invitedBy,
    })
    .select()
    .single();
  return mapInvitation(unwrap(res));
}

export async function sendInvitationEmail(input: InvitationEmailInput): Promise<void> {
  const { data, error } = await supabase.functions.invoke('send-invitation-email', {
    body: input,
  });

  if (error) throw new Error(error.message);

  if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
    throw new Error(data.error);
  }
}

export async function deleteInvitation(id: string): Promise<void> {
  const { error } = await supabase.from('invitations').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProfile(id: string): Promise<void> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
