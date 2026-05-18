import { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { colors, spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { ListRow, ListSection } from '@/components/ui/list';
import { AppText } from '@/components/ui/text';
import { can, roleLabel } from '@/src/domain/permissions';
import { useApp } from '@/src/store/app-store';

const ICON_INSET = spacing.lg + 30 + spacing.md;

export default function HomeScreen() {
  const router = useRouter();
  const app = useApp();
  const stockHref = '/stock' as Href;
  const analyticsHref = '/analytics' as Href;

  const location = app.locations.find((entry) => entry.id === app.currentLocationId);
  const openNotes = app.openNotesForArea(app.currentLocationId, app.currentArea);
  const openOrder = app.orderLists.find(
    (list) => list.locationId === app.currentLocationId && list.area === app.currentArea && list.status === 'open',
  );
  const pendingInvites = app.invitations.filter((invitation) => invitation.status === 'pending');
  const recentVerified = useMemo(
    () =>
      app.orderLists
        .filter((list) => list.status === 'verified' && list.locationId === app.currentLocationId)
        .sort((a, b) => (b.verifiedAt ?? 0) - (a.verifiedAt ?? 0))
        .slice(0, 3),
    [app.currentLocationId, app.orderLists],
  );

  const canReviewOrders = can(app.currentRole, 'viewOrders');
  const canManagePeople = can(app.currentRole, 'managePeople');
  const canManageLocations = can(app.currentRole, 'manageLocations');
  const canManageItems = can(app.currentRole, 'manageItems');

  return (
    <LargeTitleScreen title="Home" subtitle={`${location?.name ?? 'Location'} · ${roleLabel[app.currentRole]}`}>
      <View style={{ gap: spacing.xl }}>
        <Card elevated style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <AppText variant="heading">Operational pulse</AppText>
              <AppText tone="muted">
                {canReviewOrders
                  ? 'Keep flags moving, compare demand, and step into orders before prep gets squeezed.'
                  : 'Start in Stock, flag what is low or out, and your manager picks it up from there.'}
              </AppText>
            </View>
            <Badge tone={app.currentArea === 'foh' ? 'foh' : 'boh'} label={app.currentArea.toUpperCase()} />
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <PulseMetric
              label="Open flags"
              value={openNotes.length}
              tone={openNotes.length > 0 ? 'high' : 'low'}
              helper={openNotes.length > 0 ? 'Needs review' : 'Clear right now'}
            />
            <PulseMetric
              label="Order status"
              value={openOrder ? 'Open' : 'Ready'}
              tone={openOrder ? 'info' : 'medium'}
              helper={openOrder ? 'Draft in progress' : 'Build when ready'}
            />
          </View>
        </Card>

        <ListSection title="QUICK ACTIONS" separatorInset={ICON_INSET}>
          <ListRow
            icon="cube"
            iconBg={colors.primarySoft}
            iconColor={colors.primary}
            label="Open stock board"
            sublabel="Flag items and move through the current service area"
            onPress={() => router.push(stockHref)}
          />
          {canReviewOrders ? (
            <ListRow
              icon="clipboard"
              iconBg={colors.infoSoft}
              iconColor={colors.info}
              label="Review order planner"
              sublabel={openOrder ? 'Continue the current draft order' : 'Build the next order from active flags'}
              onPress={() => router.push('/orders')}
            />
          ) : null}
          {canReviewOrders ? (
            <ListRow
              icon="stats-chart"
              iconBg={colors.surfaceSunken}
              iconColor={colors.text}
              label="View analytics"
              sublabel="Compare this period with prior demand and watch seasonal pressure"
              onPress={() => router.push(analyticsHref)}
            />
          ) : null}
        </ListSection>

        {(canManageItems || canManagePeople || canManageLocations) ? (
          <ListSection title="MANAGEMENT" separatorInset={ICON_INSET}>
            {canManageItems ? (
              <ListRow
                icon="pricetags"
                iconBg={colors.primarySoft}
                iconColor={colors.primary}
                label="Items & par levels"
                sublabel="Keep your catalog current and pars realistic"
                onPress={() => router.push('/manage/items')}
              />
            ) : null}
            {canManagePeople ? (
              <ListRow
                icon="people"
                iconBg={colors.infoSoft}
                iconColor={colors.info}
                label="Team & invitations"
                sublabel={
                  pendingInvites.length > 0
                    ? `${pendingInvites.length} invite${pendingInvites.length === 1 ? '' : 's'} still pending`
                    : 'Invite managers and team members, then track pending access'
                }
                onPress={() => router.push('/manage/people')}
              />
            ) : null}
            {canManageLocations ? (
              <ListRow
                icon="storefront"
                iconBg={colors.bohSoft}
                iconColor={colors.boh}
                label="Locations"
                sublabel="Add sites and keep addresses organized"
                onPress={() => router.push('/manage/locations')}
              />
            ) : null}
          </ListSection>
        ) : null}

        <View style={{ gap: spacing.md }}>
          <AppText variant="heading">Recent activity</AppText>
          {recentVerified.length === 0 ? (
            <EmptyState
              icon="time-outline"
              title="No verified orders yet"
              message="As soon as a manager verifies an order, it shows up here and in History."
            />
          ) : (
            <View style={{ gap: spacing.sm }}>
              {recentVerified.map((list) => {
                const lineCount = app.orderLines.filter((line) => line.orderListId === list.id).length;
                return (
                  <Card key={list.id} style={{ gap: spacing.xs }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AppText variant="bodyStrong">
                        {new Date(list.verifiedAt ?? list.createdAt).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </AppText>
                      <Badge tone={list.area === 'foh' ? 'foh' : 'boh'} label={list.area.toUpperCase()} />
                    </View>
                    <AppText variant="caption" tone="muted">
                      {lineCount} line{lineCount === 1 ? '' : 's'} verified for {location?.name ?? 'this location'}
                    </AppText>
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        {!canReviewOrders ? (
          <Button label="Go To Stock" icon="cube" onPress={() => router.push(stockHref)} />
        ) : null}
      </View>
    </LargeTitleScreen>
  );
}

function PulseMetric({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: number | string;
  helper: string;
  tone: 'high' | 'medium' | 'low' | 'info';
}) {
  const bg =
    tone === 'high'
      ? colors.urgentHighSoft
      : tone === 'medium'
        ? colors.urgentMediumSoft
        : tone === 'info'
          ? colors.infoSoft
          : colors.primarySoft;

  return (
    <View
      style={{
        flex: 1,
        minHeight: 108,
        borderRadius: 16,
        backgroundColor: bg,
        padding: spacing.lg,
        justifyContent: 'space-between',
      }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="title">{String(value)}</AppText>
      <AppText variant="caption" tone="muted">
        {helper}
      </AppText>
    </View>
  );
}
