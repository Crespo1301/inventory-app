import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import type { Item, ServiceArea } from '@/src/domain';
import { can } from '@/src/domain/permissions';
import { useApp } from '@/src/store/app-store';

export default function StockScreen() {
  const router = useRouter();
  const app = useApp();
  const [query, setQuery] = useState('');

  const location = app.locations.find((l) => l.id === app.currentLocationId);
  const openNotes = app.openNotesForArea(app.currentLocationId, app.currentArea);
  const noteByItem = useMemo(() => {
    const map = new Map<string, (typeof openNotes)[number]>();
    for (const n of openNotes) if (!map.has(n.itemId)) map.set(n.itemId, n);
    return map;
  }, [openNotes]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return app.items
      .filter((i) => i.area === app.currentArea)
      .filter((i) => !q || app.displayName(i).toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
      .sort((a, b) => {
        // Flagged items float to the top so the order list builds itself.
        const fa = noteByItem.has(a.id) ? 0 : 1;
        const fb = noteByItem.has(b.id) ? 0 : 1;
        return fa - fb || app.displayName(a).localeCompare(app.displayName(b));
      });
  }, [app, query, noteByItem]);

  const quickFlag = (item: Item, status: 'low' | 'out') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    void app.flagItem({ itemId: item.id, status, urgency: status === 'out' ? 'high' : 'medium' });
  };

  const areaItemCount = app.items.filter((i) => i.area === app.currentArea).length;
  const canManage = can(app.currentRole, 'manageItems');

  return (
    <LargeTitleScreen
      title="Stock"
      subtitle={`${location?.name ?? 'Location'} · tap Low or Out to flag an item`}
      headerRight={<TranslationToggle />}>
      <View style={{ gap: spacing.lg }}>
        <Segmented<ServiceArea>
          value={app.currentArea}
          onChange={app.setArea}
          options={[
            { value: 'boh', label: 'Back of House', color: colors.boh },
            { value: 'foh', label: 'Front of House', color: colors.foh },
          ]}
        />

        <TextField
          icon="search"
          placeholder="Find an item…"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />

        {openNotes.length > 0 ? (
          <Badge
            tone="high"
            icon="flag"
            label={`${openNotes.length} item${openNotes.length > 1 ? 's' : ''} flagged this week`}
          />
        ) : null}

        {items.length === 0 ? (
          areaItemCount === 0 ? (
            <View style={{ gap: spacing.lg }}>
              <EmptyState
                icon="cube-outline"
                title="No items in this area yet"
                message={
                  canManage
                    ? 'Add the items your team uses so they can be flagged and ordered.'
                    : 'Ask a manager to add items for this area.'
                }
              />
              {canManage ? (
                <Button
                  label="Add Items"
                  icon="add"
                  onPress={() => router.push('/manage/items')}
                  fullWidth={false}
                  style={{ alignSelf: 'center' }}
                />
              ) : null}
            </View>
          ) : (
            <EmptyState icon="search" title="No items match" message="Try a different name or switch the area." />
          )
        ) : (
          <View style={{ gap: spacing.sm }}>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                flagged={noteByItem.get(item.id)}
                displayName={app.displayName(item)}
                onQuickFlag={(status) => quickFlag(item, status)}
                onOpen={() => router.push({ pathname: '/flag', params: { itemId: item.id } })}
              />
            ))}
          </View>
        )}
      </View>
    </LargeTitleScreen>
  );
}

function TranslationToggle() {
  const { showSpanish, toggleSpanish } = useApp();
  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityState={{ checked: showSpanish }}
      accessibilityLabel="Toggle Spanish item names"
      onPress={toggleSpanish}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs + 2,
        backgroundColor: showSpanish ? colors.infoSoft : colors.surfaceSunken,
        borderRadius: 999,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      }}>
      <Ionicons name="language" size={16} color={showSpanish ? colors.infoPressed : colors.textMuted} />
      <AppText variant="label" style={{ color: showSpanish ? colors.infoPressed : colors.textMuted }}>
        {showSpanish ? 'ES' : 'EN'}
      </AppText>
    </PressableScale>
  );
}

function ItemRow({
  item,
  flagged,
  displayName,
  onQuickFlag,
  onOpen,
}: {
  item: Item;
  flagged?: { status: string; urgency: string };
  displayName: string;
  onQuickFlag: (status: 'low' | 'out') => void;
  onOpen: () => void;
}) {
  return (
    <Card padded={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <PressableScale
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel={`Add detail for ${displayName}`}
          style={{ flex: 1, padding: spacing.lg, gap: 4 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>
            {displayName}
          </AppText>
          <AppText variant="caption" tone="subtle">
            {item.category} · par {item.parLevel} {item.unit}
          </AppText>
        </PressableScale>

        <View style={{ paddingRight: spacing.md }}>
          {flagged ? (
            <PressableScale onPress={onOpen} accessibilityRole="button" accessibilityLabel="Edit flag">
              <Badge
                tone={flagged.status === 'out' ? 'high' : 'medium'}
                dot
                label={flagged.status === 'out' ? 'Out' : 'Low'}
              />
            </PressableScale>
          ) : (
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <QuickButton label="Low" tone="medium" onPress={() => onQuickFlag('low')} />
              <QuickButton label="Out" tone="high" onPress={() => onQuickFlag('out')} />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

function QuickButton({
  label,
  tone,
  onPress,
}: {
  label: string;
  tone: 'medium' | 'high';
  onPress: () => void;
}) {
  const bg = tone === 'high' ? colors.urgentHigh : colors.urgentMedium;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Mark ${label}`}
      onPress={onPress}
      style={{
        minWidth: 60,
        height: 48,
        borderRadius: 12,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText variant="label" style={{ color: colors.textOnColor }}>
        {label}
      </AppText>
    </PressableScale>
  );
}
