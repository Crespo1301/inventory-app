import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow, ListSection } from '@/components/ui/list';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { AppText } from '@/components/ui/text';
import type { ServiceArea } from '@/src/domain';
import { useApp } from '@/src/store/app-store';

export default function ManageItemsScreen() {
  const router = useRouter();
  const app = useApp();
  const [area, setArea] = useState<ServiceArea>('boh');

  const items = useMemo(() => app.items.filter((i) => i.area === area), [app.items, area]);

  return (
    <Screen
      topSafeArea={false}
      footer={
        <Button
          label="Add Item"
          icon="add"
          size="lg"
          onPress={() => router.push({ pathname: '/manage/item-form', params: { area } })}
        />
      }>
      <View style={{ gap: spacing.lg }}>
        <AppText tone="muted">
          Build your real inventory list — every item your team can flag and you can order.
        </AppText>

        <Segmented<ServiceArea>
          value={area}
          onChange={setArea}
          options={[
            { value: 'boh', label: 'Back of House', color: colors.boh },
            { value: 'foh', label: 'Front of House', color: colors.foh },
          ]}
        />

        {items.length === 0 ? (
          <EmptyState
            icon="pricetags-outline"
            title="No items yet"
            message="Add the ingredients and supplies this area uses, with par levels and pack sizes."
          />
        ) : (
          <ListSection footer={`${items.length} item${items.length === 1 ? '' : 's'} in this area.`}>
            {items.map((item) => (
              <ListRow
                key={item.id}
                label={item.name}
                sublabel={`${item.category} · par ${item.parLevel} ${item.unit} · pack of ${item.packSize}`}
                onPress={() => router.push({ pathname: '/manage/item-form', params: { itemId: item.id } })}
              />
            ))}
          </ListSection>
        )}
      </View>
    </Screen>
  );
}
