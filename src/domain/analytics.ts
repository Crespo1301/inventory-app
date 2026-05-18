import type { Item, OrderLine, OrderList, ServiceArea } from '@/src/domain';

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year';

export type AnalyticsMetricKey =
  | 'verifiedOrders'
  | 'totalUnits'
  | 'distinctItems'
  | 'avgUnitsPerOrder';

export type AnalyticsMetrics = Record<AnalyticsMetricKey, number>;

export type AnalyticsComparisonRow = {
  key: AnalyticsMetricKey;
  label: string;
  current: number;
  previous: number;
  delta: number;
  deltaPct: number | null;
};

export type AnalyticsTopItem = {
  itemId: string;
  name: string;
  units: number;
  orderCount: number;
  parLevel: number;
};

export type SeasonalWatchItem = {
  itemId: string;
  name: string;
  averageUnits: number;
  peakUnits: number;
  parLevel: number;
};

export type AnalyticsSnapshot = {
  period: AnalyticsPeriod;
  currentRange: { start: number; end: number };
  previousRange: { start: number; end: number };
  comparisonRows: AnalyticsComparisonRow[];
  currentMetrics: AnalyticsMetrics;
  previousMetrics: AnalyticsMetrics;
  currentAreaMix: Record<ServiceArea, number>;
  previousAreaMix: Record<ServiceArea, number>;
  topItems: AnalyticsTopItem[];
  seasonalWatch: SeasonalWatchItem[];
  priorYearsAvailable: number;
};

type AnalyticsInput = {
  period: AnalyticsPeriod;
  anchorTime?: number;
  locationId?: string;
  items: Item[];
  orderLists: OrderList[];
  orderLines: OrderLine[];
};

type ResolvedLine = {
  list: OrderList;
  line: OrderLine;
  item: Item;
};

export function buildAnalyticsSnapshot({
  period,
  anchorTime = Date.now(),
  locationId,
  items,
  orderLists,
  orderLines,
}: AnalyticsInput): AnalyticsSnapshot {
  const verifiedLists = orderLists.filter(
    (list) => list.status === 'verified' && (!locationId || list.locationId === locationId),
  );
  const lineByListId = new Map<string, OrderLine[]>();
  for (const line of orderLines) {
    const existing = lineByListId.get(line.orderListId) ?? [];
    existing.push(line);
    lineByListId.set(line.orderListId, existing);
  }

  const currentRange = getRange(anchorTime, period);
  const previousRange = getRange(shiftBack(anchorTime, period, 1), period);
  const currentLists = filterListsInRange(verifiedLists, currentRange);
  const previousLists = filterListsInRange(verifiedLists, previousRange);
  const currentLines = resolveLines(currentLists, lineByListId, items);
  const previousLines = resolveLines(previousLists, lineByListId, items);

  const currentMetrics = buildMetrics(currentLists, currentLines);
  const previousMetrics = buildMetrics(previousLists, previousLines);

  return {
    period,
    currentRange,
    previousRange,
    comparisonRows: buildComparisonRows(currentMetrics, previousMetrics),
    currentMetrics,
    previousMetrics,
    currentAreaMix: buildAreaMix(currentLines),
    previousAreaMix: buildAreaMix(previousLines),
    topItems: buildTopItems(currentLines),
    ...buildSeasonalWatch({
      anchorTime,
      items,
      verifiedLists,
      lineByListId,
      locationId,
    }),
  };
}

export function getPeriodLabel(period: AnalyticsPeriod): string {
  switch (period) {
    case 'day':
      return 'Today';
    case 'week':
      return 'This week';
    case 'month':
      return 'This month';
    case 'year':
      return 'This year';
  }
}

export function getPreviousPeriodLabel(period: AnalyticsPeriod): string {
  switch (period) {
    case 'day':
      return 'yesterday';
    case 'week':
      return 'last week';
    case 'month':
      return 'last month';
    case 'year':
      return 'last year';
  }
}

export function formatAnalyticsDateRange(start: number, end: number): string {
  const startDate = new Date(start);
  const endDate = new Date(end - 1);

  if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}–${endDate.toLocaleDateString(undefined, {
      day: 'numeric',
      year: 'numeric',
    })}`;
  }

  return `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}–${endDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

function resolveLines(
  lists: OrderList[],
  lineByListId: Map<string, OrderLine[]>,
  items: Item[],
): ResolvedLine[] {
  const itemById = new Map(items.map((item) => [item.id, item]));
  return lists.flatMap((list) =>
    (lineByListId.get(list.id) ?? [])
      .map((line) => {
        const item = itemById.get(line.itemId);
        if (!item) return null;
        return { list, line, item };
      })
      .filter((value): value is ResolvedLine => value !== null),
  );
}

function buildMetrics(lists: OrderList[], lines: ResolvedLine[]): AnalyticsMetrics {
  const totalUnits = lines.reduce((sum, entry) => sum + entry.line.finalQty, 0);
  return {
    verifiedOrders: lists.length,
    totalUnits,
    distinctItems: new Set(lines.map((entry) => entry.item.id)).size,
    avgUnitsPerOrder: lists.length > 0 ? totalUnits / lists.length : 0,
  };
}

function buildComparisonRows(current: AnalyticsMetrics, previous: AnalyticsMetrics): AnalyticsComparisonRow[] {
  const rows: [AnalyticsMetricKey, string][] = [
    ['verifiedOrders', 'Verified orders'],
    ['totalUnits', 'Units ordered'],
    ['distinctItems', 'Distinct items'],
    ['avgUnitsPerOrder', 'Avg units / order'],
  ];

  return rows.map(([key, label]) => {
    const currentValue = current[key];
    const previousValue = previous[key];
    const delta = currentValue - previousValue;
    const deltaPct = previousValue === 0 ? null : delta / previousValue;
    return { key, label, current: currentValue, previous: previousValue, delta, deltaPct };
  });
}

function buildAreaMix(lines: ResolvedLine[]): Record<ServiceArea, number> {
  return lines.reduce<Record<ServiceArea, number>>(
    (acc, entry) => {
      acc[entry.list.area] += entry.line.finalQty;
      return acc;
    },
    { boh: 0, foh: 0 },
  );
}

function buildTopItems(lines: ResolvedLine[]): AnalyticsTopItem[] {
  const totals = new Map<string, AnalyticsTopItem>();
  for (const entry of lines) {
    const existing = totals.get(entry.item.id) ?? {
      itemId: entry.item.id,
      name: entry.item.name,
      units: 0,
      orderCount: 0,
      parLevel: entry.item.parLevel,
    };
    existing.units += entry.line.finalQty;
    existing.orderCount += 1;
    totals.set(entry.item.id, existing);
  }

  return Array.from(totals.values())
    .sort((a, b) => b.units - a.units || a.name.localeCompare(b.name))
    .slice(0, 5);
}

function buildSeasonalWatch({
  anchorTime,
  items,
  verifiedLists,
  lineByListId,
  locationId: _locationId,
}: {
  anchorTime: number;
  items: Item[];
  verifiedLists: OrderList[];
  lineByListId: Map<string, OrderLine[]>;
  locationId?: string;
}): { seasonalWatch: SeasonalWatchItem[]; priorYearsAvailable: number } {
  const anchor = new Date(anchorTime);
  const month = anchor.getMonth();
  const currentYear = anchor.getFullYear();
  const monthLists = verifiedLists.filter((list) => {
    const when = new Date(list.verifiedAt ?? list.createdAt);
    return when.getMonth() === month;
  });

  const priorYearLists = monthLists.filter((list) => new Date(list.verifiedAt ?? list.createdAt).getFullYear() < currentYear);
  const priorYears = new Set(
    priorYearLists.map((list) => new Date(list.verifiedAt ?? list.createdAt).getFullYear()),
  );
  if (priorYearLists.length === 0) {
    return { seasonalWatch: [], priorYearsAvailable: 0 };
  }

  const itemById = new Map(items.map((item) => [item.id, item]));
  const history = new Map<string, { yearlyTotals: number[]; peakUnits: number }>();
  const bucketByYearAndItem = new Map<string, number>();

  for (const list of priorYearLists) {
    const year = new Date(list.verifiedAt ?? list.createdAt).getFullYear();
    for (const line of lineByListId.get(list.id) ?? []) {
      const key = `${year}:${line.itemId}`;
      bucketByYearAndItem.set(key, (bucketByYearAndItem.get(key) ?? 0) + line.finalQty);
    }
  }

  for (const [key, units] of bucketByYearAndItem) {
    const [, itemId] = key.split(':');
    const existing = history.get(itemId) ?? { yearlyTotals: [], peakUnits: 0 };
    existing.yearlyTotals.push(units);
    existing.peakUnits = Math.max(existing.peakUnits, units);
    history.set(itemId, existing);
  }

  const seasonalWatch = Array.from(history.entries())
    .map(([itemId, totals]) => {
      const item = itemById.get(itemId);
      if (!item) return null;
      const averageUnits =
        totals.yearlyTotals.reduce((sum, units) => sum + units, 0) / Math.max(1, totals.yearlyTotals.length);
      return {
        itemId,
        name: item.name,
        averageUnits,
        peakUnits: totals.peakUnits,
        parLevel: item.parLevel,
      };
    })
    .filter((value): value is SeasonalWatchItem => value !== null)
    .filter((item) => item.averageUnits >= item.parLevel * 0.9 || item.peakUnits >= item.parLevel * 1.1)
    .sort((a, b) => b.averageUnits - a.averageUnits)
    .slice(0, 4);

  return { seasonalWatch, priorYearsAvailable: priorYears.size };
}

function filterListsInRange(lists: OrderList[], range: { start: number; end: number }): OrderList[] {
  return lists.filter((list) => {
    const time = list.verifiedAt ?? list.createdAt;
    return time >= range.start && time < range.end;
  });
}

function getRange(anchorTime: number, period: AnalyticsPeriod): { start: number; end: number } {
  const start = startOfPeriod(anchorTime, period);
  const end = shiftForward(start, period, 1);
  return { start, end };
}

function startOfPeriod(anchorTime: number, period: AnalyticsPeriod): number {
  const date = new Date(anchorTime);
  switch (period) {
    case 'day':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    case 'week': {
      const day = date.getDay();
      const diff = (day + 6) % 7;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff).getTime();
    }
    case 'month':
      return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    case 'year':
      return new Date(date.getFullYear(), 0, 1).getTime();
  }
}

function shiftBack(anchorTime: number, period: AnalyticsPeriod, amount: number): number {
  return shiftForward(anchorTime, period, -amount);
}

function shiftForward(anchorTime: number, period: AnalyticsPeriod, amount: number): number {
  const date = new Date(anchorTime);
  switch (period) {
    case 'day':
      date.setDate(date.getDate() + amount);
      break;
    case 'week':
      date.setDate(date.getDate() + amount * 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() + amount);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() + amount);
      break;
  }
  return date.getTime();
}
