import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Screen } from '@/components/ui/screen';
import { SheetHeader } from '@/components/ui/sheet-header';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import type { StockStatus, Urgency } from '@/src/domain';
import { useApp } from '@/src/store/app-store';

/** Detail capture for a single item. Reached by tapping an item on Stock. */
export default function FlagScreen() {
  const router = useRouter();
  const app = useApp();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const item = app.items.find((i) => i.id === itemId);
  const existing = useMemo(
    () => app.openNotesForArea(app.currentLocationId, app.currentArea).find((n) => n.itemId === itemId),
    [app, itemId],
  );

  const [status, setStatus] = useState<Exclude<StockStatus, 'ok'>>(
    (existing?.status as 'low' | 'out') ?? 'low',
  );
  const [urgency, setUrgency] = useState<Urgency>(existing?.urgency ?? 'medium');
  const [hasCount, setHasCount] = useState(typeof existing?.quantityOnHand === 'number');
  const [count, setCount] = useState(existing?.quantityOnHand ?? 0);
  const [note, setNote] = useState(existing?.note ?? '');

  if (!item) {
    return (
      <Screen>
        <AppText variant="title">Item not found</AppText>
        <Button label="Close" variant="secondary" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </Screen>
    );
  }

  const save = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (existing) await app.resolveNote(existing.id); // replace prior open note
    await app.flagItem({
      itemId: item.id,
      status,
      urgency,
      quantityOnHand: hasCount ? count : undefined,
      note: note.trim() || undefined,
    });
    router.back();
  };

  const removeFlag = async () => {
    if (existing) {
      Haptics.selectionAsync();
      await app.resolveNote(existing.id);
    }
    router.back();
  };

  return (
    <Screen
      topSafeArea={false}
      header={<SheetHeader title={existing ? 'Update Flag' : 'Flag Item'} onClose={() => router.back()} />}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label={existing ? 'Update Flag' : 'Flag This Item'} icon="flag" size="lg" onPress={save} />
          {existing ? (
            <Button label="Remove Flag — Item Is Fine" variant="ghost" onPress={removeFlag} />
          ) : null}
        </View>
      }>
      <View style={{ gap: spacing.xl }}>
        <View>
          <AppText variant="display">{app.displayName(item)}</AppText>
          {app.showSpanish && item.nameEs ? <AppText tone="subtle">{item.name}</AppText> : null}
          <AppText tone="muted" style={{ marginTop: 4 }}>
            {item.category} · par level {item.parLevel} {item.unit}
          </AppText>
        </View>

        <Field label="How low is it?">
          <Segmented
            value={status}
            onChange={setStatus}
            options={[
              { value: 'low', label: 'Running Low', color: colors.urgentMedium },
              { value: 'out', label: 'Out', color: colors.urgentHigh },
            ]}
          />
        </Field>

        <Field label="How urgent?">
          <Segmented
            value={urgency}
            onChange={setUrgency}
            options={[
              { value: 'low', label: 'Whenever' },
              { value: 'medium', label: 'This Week' },
              { value: 'high', label: 'ASAP' },
            ]}
          />
        </Field>

        <Field label="Rough count on hand (optional)">
          {hasCount ? (
            <View style={{ gap: spacing.sm }}>
              <QuantityStepper value={count} onChange={setCount} unit={item.unit} />
              <Button label="Skip the count" variant="ghost" onPress={() => setHasCount(false)} />
            </View>
          ) : (
            <Button
              label="Add a count"
              variant="secondary"
              icon="calculator"
              onPress={() => setHasCount(true)}
            />
          )}
        </Field>

        <Field label="Note for the manager (optional)">
          <TextField
            placeholder="Where it's low, brand, prep impact…"
            value={note}
            onChangeText={setNote}
            multiline
            style={{ minHeight: 72 }}
          />
        </Field>
      </View>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="label">{label}</AppText>
      {children}
    </View>
  );
}
