/**
 * App data store.
 *
 * Loads the signed-in user's company data from Supabase, keeps it in memory for
 * fast rendering, mirrors every mutation back, and subscribes to realtime
 * changes so other devices in the same company stay in sync.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { useAuth } from '@/src/auth/auth-store';
import type {
  Company,
  Item,
  Location,
  LowStockNote,
  Membership,
  OrderLine,
  OrderList,
  ServiceArea,
  StockStatus,
  Urgency,
  UserRole,
} from '@/src/domain';
import { suggestOrderQuantity } from '@/src/domain/suggestions';
import * as repo from '@/src/data/repo';
import type { AccountUser, Invitation } from '@/src/data/repo';
import { supabase } from '@/src/supabase/client';

function inferOnHand(item: Item, notes: LowStockNote[]): number {
  const latest = notes
    .filter((n) => n.itemId === item.id && !n.resolvedAt)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  if (!latest) return item.parLevel;
  if (typeof latest.quantityOnHand === 'number') return latest.quantityOnHand;
  if (latest.status === 'out') return 0;
  return Math.floor(item.parLevel / 2);
}

export type FlagInput = {
  itemId: string;
  status: StockStatus;
  urgency: Urgency;
  quantityOnHand?: number;
  note?: string;
};

export type ItemInput = Omit<Item, 'id' | 'companyId'>;

export type InviteInput = {
  email: string;
  role: Exclude<UserRole, 'admin'>;
  locationIds: string[];
};

export type AppValue = {
  loading: boolean;
  error: string | null;
  company: Company | null;
  locations: Location[];
  users: AccountUser[];
  items: Item[];
  notes: LowStockNote[];
  orderLists: OrderList[];
  orderLines: OrderLine[];
  memberships: Membership[];
  invitations: Invitation[];

  currentUserId: string;
  currentRole: UserRole;
  currentLocationId: string;
  currentArea: ServiceArea;
  showSpanish: boolean;

  setLocation: (locationId: string) => void;
  setArea: (area: ServiceArea) => void;
  toggleSpanish: () => void;
  displayName: (item: Item) => string;
  inferOnHand: (item: Item) => number;
  openNotesForArea: (locationId: string, area: ServiceArea) => LowStockNote[];

  flagItem: (input: FlagInput) => Promise<void>;
  resolveNote: (noteId: string) => Promise<void>;
  generateOrderList: (locationId: string, area: ServiceArea) => Promise<void>;
  updateOrderLineQty: (lineId: string, finalQty: number) => void;
  verifyOrder: (orderListId: string) => Promise<void>;

  addItem: (input: ItemInput) => Promise<void>;
  editItem: (item: Item) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;

  addLocation: (name: string, address?: string) => Promise<void>;
  editLocation: (id: string, name: string, address?: string) => Promise<void>;

  createInvitation: (input: InviteInput) => Promise<Invitation>;
  cancelInvitation: (id: string) => Promise<void>;
  removeTeamMember: (userId: string) => Promise<void>;
};

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [notes, setNotes] = useState<LowStockNote[]>([]);
  const [orderLists, setOrderLists] = useState<OrderList[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [currentLocationId, setCurrentLocationId] = useState('');
  const [currentArea, setCurrentArea] = useState<ServiceArea>('boh');
  const [showSpanish, setShowSpanish] = useState(false);

  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySnapshot = useCallback((snap: repo.CompanySnapshot) => {
    setCompany(snap.company);
    setLocations(snap.locations);
    setUsers(snap.users);
    setItems(snap.items);
    setNotes(snap.notes);
    setOrderLists(snap.orderLists);
    setOrderLines(snap.orderLines);
    setInvitations(snap.invitations);
    setMemberships(
      snap.users.map((u) => ({
        userId: u.id,
        companyId: snap.company.id,
        role: u.role,
        locationIds:
          u.role === 'admin'
            ? []
            : snap.userLocations.filter((x) => x.userId === u.id).map((x) => x.locationId),
      })),
    );
    setCurrentLocationId((prev) => prev || (snap.locations[0]?.id ?? ''));
  }, []);

  const reload = useCallback(async () => {
    try {
      applySnapshot(await repo.loadCompanySnapshot());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load data.');
    }
  }, [applySnapshot]);

  // Initial load + realtime sync whenever the signed-in user changes.
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      await reload();
      if (active) setLoading(false);
    })();

    const scheduleReload = () => {
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
      reloadTimer.current = setTimeout(() => void reload(), 400);
    };
    const channel = supabase
      .channel(`company-${user.companyId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, scheduleReload)
      .subscribe();

    return () => {
      active = false;
      if (reloadTimer.current) clearTimeout(reloadTimer.current);
      void supabase.removeChannel(channel);
    };
  }, [user, reload]);

  const currentUserId = user?.id ?? '';
  const currentRole: UserRole = user?.role ?? 'member';

  const openNotesForArea = useCallback(
    (locationId: string, area: ServiceArea) =>
      notes.filter((n) => n.locationId === locationId && n.area === area && !n.resolvedAt),
    [notes],
  );

  const flagItem = useCallback(
    async (input: FlagInput) => {
      const item = items.find((i) => i.id === input.itemId);
      const note = await repo.insertNote({
        itemId: input.itemId,
        locationId: currentLocationId,
        area: item?.area ?? currentArea,
        status: input.status,
        urgency: input.urgency,
        quantityOnHand: input.quantityOnHand,
        note: input.note,
        createdBy: currentUserId,
      });
      setNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
    },
    [items, currentArea, currentLocationId, currentUserId],
  );

  const resolveNote = useCallback(async (noteId: string) => {
    const at = Date.now();
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, resolvedAt: at } : n)));
    await repo.resolveNote(noteId);
  }, []);

  const generateOrderList = useCallback(
    async (locationId: string, area: ServiceArea) => {
      const open = notes.filter((n) => n.locationId === locationId && n.area === area && !n.resolvedAt);
      const flaggedItemIds = Array.from(new Set(open.map((n) => n.itemId)));

      const lines = flaggedItemIds.flatMap((itemId) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return [];
        const itemNotes = open.filter((n) => n.itemId === itemId);
        const { suggestedQty, reason } = suggestOrderQuantity(item, inferOnHand(item, notes), itemNotes);
        return [{ itemId, suggestedQty, reason }];
      });

      const created = await repo.createOrderList({ locationId, area, lines });
      setOrderLists((prev) => [created.list, ...prev]);
      setOrderLines((prev) => [...created.lines, ...prev]);
    },
    [items, notes],
  );

  const updateOrderLineQty = useCallback((lineId: string, finalQty: number) => {
    const next = Math.max(0, finalQty);
    setOrderLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, finalQty: next } : l)));
    void repo.updateOrderLineFinalQty(lineId, next);
  }, []);

  const verifyOrder = useCallback(
    async (orderListId: string) => {
      const at = Date.now();
      const list = orderLists.find((l) => l.id === orderListId);
      const itemIds = orderLines.filter((l) => l.orderListId === orderListId).map((l) => l.itemId);

      setOrderLists((prev) =>
        prev.map((l) =>
          l.id === orderListId
            ? { ...l, status: 'verified', verifiedAt: at, verifiedByUserId: currentUserId }
            : l,
        ),
      );
      setNotes((prev) =>
        prev.map((n) =>
          itemIds.includes(n.itemId) && n.locationId === list?.locationId && !n.resolvedAt
            ? { ...n, resolvedAt: at }
            : n,
        ),
      );

      await repo.verifyOrderList(orderListId, currentUserId);
      if (list) await repo.resolveNotesForItems(itemIds, list.locationId);
    },
    [orderLines, orderLists, currentUserId],
  );

  const addItem = useCallback(
    async (input: ItemInput) => {
      if (!company) return;
      const item = await repo.insertItem({ ...input, companyId: company.id });
      setItems((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
    },
    [company],
  );

  const editItem = useCallback(async (item: Item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? item : i)).sort((a, b) => a.name.localeCompare(b.name)),
    );
    await repo.updateItem(item);
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await repo.deleteItem(itemId);
  }, []);

  const addLocation = useCallback(
    async (name: string, address?: string) => {
      if (!company) return;
      const loc = await repo.insertLocation(company.id, name, address);
      setLocations((prev) => [...prev, loc]);
    },
    [company],
  );

  const editLocation = useCallback(async (id: string, name: string, address?: string) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, name, address } : l)));
    await repo.updateLocation(id, name, address);
  }, []);

  const createInvitation = useCallback(
    async (input: InviteInput) => {
      if (!company) throw new Error('No company loaded.');
      const invite = await repo.createInvitation({
        companyId: company.id,
        email: input.email,
        role: input.role,
        locationIds: input.locationIds,
        invitedBy: currentUserId,
      });
      setInvitations((prev) => [invite, ...prev]);
      return invite;
    },
    [company, currentUserId],
  );

  const cancelInvitation = useCallback(async (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    await repo.deleteInvitation(id);
  }, []);

  const removeTeamMember = useCallback(async (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    await repo.deleteProfile(userId);
  }, []);

  const value = useMemo<AppValue>(
    () => ({
      loading,
      error,
      company,
      locations,
      users,
      items,
      notes,
      orderLists,
      orderLines,
      memberships,
      invitations,
      currentUserId,
      currentRole,
      currentLocationId,
      currentArea,
      showSpanish,
      setLocation: setCurrentLocationId,
      setArea: setCurrentArea,
      toggleSpanish: () => setShowSpanish((v) => !v),
      displayName: (item) => (showSpanish && item.nameEs ? item.nameEs : item.name),
      inferOnHand: (item) => inferOnHand(item, notes),
      openNotesForArea,
      flagItem,
      resolveNote,
      generateOrderList,
      updateOrderLineQty,
      verifyOrder,
      addItem,
      editItem,
      removeItem,
      addLocation,
      editLocation,
      createInvitation,
      cancelInvitation,
      removeTeamMember,
    }),
    [
      loading,
      error,
      company,
      locations,
      users,
      items,
      notes,
      orderLists,
      orderLines,
      memberships,
      invitations,
      currentUserId,
      currentRole,
      currentLocationId,
      currentArea,
      showSpanish,
      openNotesForArea,
      flagItem,
      resolveNote,
      generateOrderList,
      updateOrderLineQty,
      verifyOrder,
      addItem,
      editItem,
      removeItem,
      addLocation,
      editLocation,
      createInvitation,
      cancelInvitation,
      removeTeamMember,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
