/**
 * Core domain model for Inventory App.
 *
 * Hierarchy: Company -> Location -> ServiceArea (FOH / BOH).
 * Roles scope what a user can see and do. The model is designed so a future
 * Supabase backend (auth + per-location row-level security) drops in without
 * reshaping these types.
 */

/** Front of house vs. back of house. Orders are split along this line. */
export type ServiceArea = 'foh' | 'boh';

/**
 * - admin   — business owner. Full company access, manages locations + people.
 * - manager — runs ordering for the location(s) granted to them. Verifies counts.
 * - member  — line cook / cashier. Can only flag items low or out.
 */
export type UserRole = 'admin' | 'manager' | 'member';

export type StockStatus = 'ok' | 'low' | 'out';

export type Urgency = 'low' | 'medium' | 'high';

export type Company = {
  id: string;
  name: string;
  /** Admin who created the company — approves later admin sign-ups. */
  createdByUserId: string;
};

export type Location = {
  id: string;
  companyId: string;
  name: string;
  address?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

/**
 * A user's role within a company. Managers and members are additionally
 * scoped to specific locations via `locationIds`; admins see every location.
 */
export type Membership = {
  userId: string;
  companyId: string;
  role: UserRole;
  /** Empty for admins (implicit access to all). */
  locationIds: string[];
};

export type Vendor = {
  id: string;
  companyId: string;
  name: string;
};

export type Item = {
  id: string;
  companyId: string;
  name: string;
  /** Optional Latin-American Spanish name for the translation toggle. */
  nameEs?: string;
  unit: string;
  category: string;
  area: ServiceArea;
  /** Target on-hand quantity. Drives order suggestions. */
  parLevel: number;
  /** Vendor sells in multiples of this — suggestions round up to it. */
  packSize: number;
  vendorId?: string;
};

/** A team member's "the whiteboard" entry: this item is running low or out. */
export type LowStockNote = {
  id: string;
  itemId: string;
  locationId: string;
  area: ServiceArea;
  status: StockStatus;
  urgency: Urgency;
  /** Optional rough count the member entered. */
  quantityOnHand?: number;
  note?: string;
  createdByUserId: string;
  createdAt: number;
  /** Cleared once the item lands on a verified order. */
  resolvedAt?: number;
};

export type OrderListStatus = 'open' | 'verified';

export type OrderList = {
  id: string;
  locationId: string;
  area: ServiceArea;
  status: OrderListStatus;
  createdAt: number;
  verifiedAt?: number;
  verifiedByUserId?: string;
};

export type OrderLine = {
  id: string;
  orderListId: string;
  itemId: string;
  suggestedQty: number;
  /** Manager's override. Falls back to suggestedQty until edited. */
  finalQty: number;
  /** Plain-language explanation shown next to the suggestion. */
  reason: string;
};
