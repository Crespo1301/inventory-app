import { Share, View } from 'react-native';

import { spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { AppText } from '@/components/ui/text';
import { formatOrderForShare } from '@/src/domain/export';
import { useApp } from '@/src/store/app-store';

export default function HistoryScreen() {
  const app = useApp();
  const verified = app.orderLists
    .filter((l) => l.status === 'verified')
    .sort((a, b) => (b.verifiedAt ?? 0) - (a.verifiedAt ?? 0));

  return (
    <LargeTitleScreen title="History" subtitle="Past verified orders across your locations">
      <View style={{ gap: spacing.lg }}>
        {verified.length === 0 ? (
          <EmptyState
            icon="time-outline"
            title="No orders yet"
            message="Verified order lists show up here so you can compare week to week."
          />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {verified.map((list) => {
              const lines = app.orderLines.filter((l) => l.orderListId === list.id);
              const location = app.locations.find((l) => l.id === list.locationId);
              const total = lines.reduce((s, l) => s + l.finalQty, 0);
              return (
                <Card key={list.id} style={{ gap: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppText variant="bodyStrong">{location?.name ?? 'Location'}</AppText>
                    <Badge tone={list.area === 'foh' ? 'foh' : 'boh'} label={list.area.toUpperCase()} />
                  </View>
                  <AppText variant="caption" tone="muted">
                    {new Date(list.verifiedAt ?? list.createdAt).toLocaleString()} · {lines.length} items ·{' '}
                    {total} units
                  </AppText>
                  <Button
                    label="Re-share This Order"
                    variant="secondary"
                    icon="share-outline"
                    onPress={() =>
                      Share.share({
                        message: formatOrderForShare({
                          list,
                          lines,
                          items: app.items,
                          locationName: location?.name ?? 'Location',
                        }),
                      })
                    }
                  />
                </Card>
              );
            })}
          </View>
        )}
      </View>
    </LargeTitleScreen>
  );
}
