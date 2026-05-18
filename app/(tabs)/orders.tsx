import { useMemo } from 'react';
import { Share, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, radius, spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Segmented } from '@/components/ui/segmented';
import { AppText } from '@/components/ui/text';
import type { OrderLine, ServiceArea } from '@/src/domain';
import { can } from '@/src/domain/permissions';
import { formatOrderForShare } from '@/src/domain/export';
import { useApp } from '@/src/store/app-store';

export default function OrdersScreen() {
  const app = useApp();
  const location = app.locations.find((l) => l.id === app.currentLocationId);

  const openNotes = app.openNotesForArea(app.currentLocationId, app.currentArea);
  const openList = app.orderLists.find(
    (l) => l.locationId === app.currentLocationId && l.area === app.currentArea && l.status === 'open',
  );
  const lines = useMemo(
    () => (openList ? app.orderLines.filter((l) => l.orderListId === openList.id) : []),
    [app.orderLines, openList],
  );

  const canVerify = can(app.currentRole, 'verifyOrder');
  const orderTotal = lines.reduce((sum, l) => sum + l.finalQty, 0);

  const share = async () => {
    if (!openList || !location) return;
    await Share.share({
      message: formatOrderForShare({ list: openList, lines, items: app.items, locationName: location.name }),
    });
  };

  const verify = () => {
    if (!openList) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void app.verifyOrder(openList.id);
  };

  return (
    <LargeTitleScreen
      title="Order Planner"
      subtitle={`${location?.name ?? 'Location'} · review and verify quantities`}
      footer={
        openList && canVerify ? (
          <View style={{ gap: spacing.sm }}>
            <Button label="Verify & Finalize Order" icon="checkmark-circle" size="lg" onPress={verify} />
            <Button label="Export / Share List" variant="secondary" icon="share-outline" onPress={share} />
          </View>
        ) : undefined
      }>
      <View style={{ gap: spacing.lg }}>
        <Segmented<ServiceArea>
          value={app.currentArea}
          onChange={app.setArea}
          options={[
            { value: 'boh', label: 'Back of House', color: colors.boh },
            { value: 'foh', label: 'Front of House', color: colors.foh },
          ]}
        />

        {!openList ? (
          openNotes.length === 0 ? (
            <EmptyState
              icon="clipboard-outline"
              title="Nothing flagged yet"
              message="When the team marks items low or out, build the order list here."
            />
          ) : (
            <Card elevated style={{ gap: spacing.md }}>
              <Badge tone="high" icon="flag" label={`${openNotes.length} items flagged`} />
              <AppText variant="heading">Ready to build the order</AppText>
              <AppText tone="muted">
                We&apos;ll suggest quantities from par levels, vendor pack sizes, and the team&apos;s flags.
              </AppText>
              <Button
                label="Build Order List"
                icon="construct"
                onPress={() => {
                  Haptics.selectionAsync();
                  void app.generateOrderList(app.currentLocationId, app.currentArea);
                }}
              />
            </Card>
          )
        ) : (
          <View style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText variant="heading">{lines.length} items</AppText>
              <AppText tone="muted">{orderTotal} units total</AppText>
            </View>
            {lines.map((line) => (
              <OrderLineCard key={line.id} line={line} canEdit={canVerify} />
            ))}
            {!canVerify ? (
              <Card style={{ backgroundColor: colors.infoSoft, borderColor: colors.infoSoft }}>
                <AppText variant="caption" tone="muted">
                  A manager verifies and finalizes this order.
                </AppText>
              </Card>
            ) : null}
          </View>
        )}
      </View>
    </LargeTitleScreen>
  );
}

function OrderLineCard({ line, canEdit }: { line: OrderLine; canEdit: boolean }) {
  const app = useApp();
  const item = app.items.find((i) => i.id === line.itemId);
  if (!item) return null;

  const overridden = line.finalQty !== line.suggestedQty;

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <AppText variant="bodyStrong">{app.displayName(item)}</AppText>
          <AppText variant="caption" tone="subtle">
            {item.category}
          </AppText>
        </View>
        {overridden ? <Badge tone="info" label="Adjusted" /> : <Badge tone="low" label="Suggested" />}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: spacing.sm,
          backgroundColor: colors.surfaceSunken,
          borderRadius: radius.md,
          padding: spacing.md,
        }}>
        <Ionicons name="information-circle" size={18} color={colors.textMuted} />
        <AppText variant="caption" tone="muted" style={{ flex: 1 }}>
          {line.reason}
        </AppText>
      </View>

      {canEdit ? (
        <QuantityStepper
          value={line.finalQty}
          onChange={(v) => app.updateOrderLineQty(line.id, v)}
          unit={item.unit}
        />
      ) : (
        <AppText variant="title" style={{ textAlign: 'center' }}>
          {line.finalQty} {item.unit}
        </AppText>
      )}
    </Card>
  );
}
