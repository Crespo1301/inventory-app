import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { colors, spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { Segmented } from '@/components/ui/segmented';
import { AppText } from '@/components/ui/text';
import {
  buildAnalyticsSnapshot,
  formatAnalyticsDateRange,
  getPeriodLabel,
  getPreviousPeriodLabel,
  type AnalyticsComparisonRow,
  type AnalyticsPeriod,
} from '@/src/domain/analytics';
import { useApp } from '@/src/store/app-store';

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export default function AnalyticsScreen() {
  const app = useApp();
  const [period, setPeriod] = useState<AnalyticsPeriod>('month');
  const location = app.locations.find((entry) => entry.id === app.currentLocationId);

  const snapshot = useMemo(
    () =>
      buildAnalyticsSnapshot({
        period,
        locationId: app.currentLocationId,
        items: app.items,
        orderLists: app.orderLists,
        orderLines: app.orderLines,
      }),
    [app.currentLocationId, app.items, app.orderLines, app.orderLists, period],
  );

  const totalCurrentUnits = snapshot.currentAreaMix.boh + snapshot.currentAreaMix.foh;
  const hasHistory = snapshot.currentMetrics.verifiedOrders > 0 || snapshot.previousMetrics.verifiedOrders > 0;

  return (
    <LargeTitleScreen
      title="Analytics"
      subtitle={`${location?.name ?? 'Location'} · compare ${getPeriodLabel(period).toLowerCase()} against ${getPreviousPeriodLabel(period)}`}>
      <View style={{ gap: spacing.xl }}>
        <Segmented<AnalyticsPeriod>
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS.map((option) => ({ ...option, color: colors.primary }))}
        />

        <Card elevated style={{ gap: spacing.md }}>
          <View style={{ gap: spacing.xs }}>
            <AppText variant="heading">Period narrative</AppText>
            <AppText tone="muted">
              {getPeriodLabel(period)} covers{' '}
              {formatAnalyticsDateRange(snapshot.currentRange.start, snapshot.currentRange.end)}. The comparison window is{' '}
              {getPreviousPeriodLabel(period)}.
            </AppText>
          </View>
          <Badge
            tone={snapshot.currentMetrics.totalUnits >= snapshot.previousMetrics.totalUnits ? 'low' : 'medium'}
            label={buildNarrativeLabel(snapshot.comparisonRows[1], getPreviousPeriodLabel(period))}
          />
        </Card>

        {!hasHistory ? (
          <EmptyState
            icon="stats-chart-outline"
            title="No verified history yet"
            message="Once managers verify orders, analytics will compare periods, surface top movers, and watch for seasonal pressure."
          />
        ) : (
          <>
            <View style={{ gap: spacing.sm }}>
              {snapshot.comparisonRows.map((row) => (
                <MetricComparisonCard key={row.key} row={row} />
              ))}
            </View>

            <Card style={{ gap: spacing.md }}>
              <AppText variant="heading">Area mix</AppText>
              <AreaMixRow
                label="Back of House"
                color={colors.boh}
                units={snapshot.currentAreaMix.boh}
                total={totalCurrentUnits}
              />
              <AreaMixRow
                label="Front of House"
                color={colors.foh}
                units={snapshot.currentAreaMix.foh}
                total={totalCurrentUnits}
              />
            </Card>

            <View style={{ gap: spacing.md }}>
              <AppText variant="heading">Top movers this {period}</AppText>
              {snapshot.topItems.length === 0 ? (
                <Card>
                  <AppText variant="caption" tone="muted">
                    No item-level movement yet for this period.
                  </AppText>
                </Card>
              ) : (
                snapshot.topItems.map((item) => (
                  <Card key={item.itemId} style={{ gap: spacing.xs }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AppText variant="bodyStrong">{item.name}</AppText>
                      <Badge tone="info" label={`${item.units} units`} />
                    </View>
                    <AppText variant="caption" tone="muted">
                      {item.orderCount} order touch{item.orderCount === 1 ? '' : 'es'} · par {item.parLevel}
                    </AppText>
                  </Card>
                ))
              )}
            </View>

            <View style={{ gap: spacing.md }}>
              <AppText variant="heading">Seasonal pressure</AppText>
              {snapshot.priorYearsAvailable === 0 ? (
                <Card>
                  <AppText variant="caption" tone="muted">
                    Once you have verified orders from this same month in a prior year, this section will highlight items that regularly spike above par.
                  </AppText>
                </Card>
              ) : snapshot.seasonalWatch.length === 0 ? (
                <Card>
                  <AppText variant="caption" tone="muted">
                    We checked the same month from {snapshot.priorYearsAvailable} prior year{snapshot.priorYearsAvailable === 1 ? '' : 's'} and nothing is consistently pushing above par yet.
                  </AppText>
                </Card>
              ) : (
                snapshot.seasonalWatch.map((item) => (
                  <Card key={item.itemId} style={{ gap: spacing.xs }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AppText variant="bodyStrong">{item.name}</AppText>
                      <Badge tone="medium" label={`avg ${item.averageUnits.toFixed(1)}`} />
                    </View>
                    <AppText variant="caption" tone="muted">
                      Peak in this month: {item.peakUnits} units · current par {item.parLevel}. If a recurring event is approaching, this item deserves a pre-buy check.
                    </AppText>
                  </Card>
                ))
              )}
            </View>
          </>
        )}
      </View>
    </LargeTitleScreen>
  );
}

function MetricComparisonCard({ row }: { row: AnalyticsComparisonRow }) {
  const positive = row.delta >= 0;
  const badgeTone = positive ? 'low' : 'medium';
  const currentValue =
    row.key === 'avgUnitsPerOrder' ? row.current.toFixed(1) : Math.round(row.current).toString();
  const previousValue =
    row.key === 'avgUnitsPerOrder' ? row.previous.toFixed(1) : Math.round(row.previous).toString();

  return (
    <Card style={{ gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="bodyStrong">{row.label}</AppText>
        <Badge tone={badgeTone} label={formatDelta(row)} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg }}>
        <MetricColumn label="Current" value={currentValue} />
        <MetricColumn label="Previous" value={previousValue} />
      </View>
    </Card>
  );
}

function MetricColumn({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: spacing.xs }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="title">{value}</AppText>
    </View>
  );
}

function AreaMixRow({
  label,
  color,
  units,
  total,
}: {
  label: string;
  color: string;
  units: number;
  total: number;
}) {
  const width = `${total > 0 ? Math.max((units / total) * 100, 8) : 8}%` as `${number}%`;

  return (
    <View style={{ gap: spacing.xs }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="label">{label}</AppText>
        <AppText variant="caption" tone="muted">
          {units} units
        </AppText>
      </View>
      <View
        style={{
          height: 10,
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: colors.surfaceSunken,
        }}>
        <View style={{ width, height: '100%', backgroundColor: color, borderRadius: 999 }} />
      </View>
    </View>
  );
}

function formatDelta(row: AnalyticsComparisonRow): string {
  const sign = row.delta > 0 ? '+' : row.delta < 0 ? '−' : '';
  if (row.deltaPct === null) return `${sign}${Math.abs(row.delta).toFixed(row.key === 'avgUnitsPerOrder' ? 1 : 0)}`;
  return `${sign}${Math.abs(row.deltaPct * 100).toFixed(0)}%`;
}

function buildNarrativeLabel(row: AnalyticsComparisonRow, previousLabel: string): string {
  if (row.previous === 0 && row.current === 0) return `No units in ${previousLabel}`;
  if (row.previous === 0) return `${Math.round(row.current)} units, first tracked period`;
  if (row.delta === 0) return `Flat versus ${previousLabel}`;
  const pct = Math.abs((row.deltaPct ?? 0) * 100);
  return `${row.delta > 0 ? 'Up' : 'Down'} ${pct.toFixed(0)}% versus ${previousLabel}`;
}
