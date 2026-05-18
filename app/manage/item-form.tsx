import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { colors, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import type { ServiceArea } from '@/src/domain';
import { useApp } from '@/src/store/app-store';

export default function ItemFormScreen() {
  const router = useRouter();
  const app = useApp();
  const params = useLocalSearchParams<{ itemId?: string; area?: ServiceArea }>();
  const existing = app.items.find((i) => i.id === params.itemId);

  const [name, setName] = useState(existing?.name ?? '');
  const [nameEs, setNameEs] = useState(existing?.nameEs ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [unit, setUnit] = useState(existing?.unit ?? '');
  const [area, setArea] = useState<ServiceArea>(existing?.area ?? params.area ?? 'boh');
  const [parLevel, setParLevel] = useState(existing?.parLevel ?? 1);
  const [packSize, setPackSize] = useState(existing?.packSize ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setError(null);
    if (!name.trim() || !category.trim() || !unit.trim()) {
      setError('Name, category, and unit are required.');
      return;
    }
    setBusy(true);
    const payload = {
      name: name.trim(),
      nameEs: nameEs.trim() || undefined,
      category: category.trim(),
      unit: unit.trim(),
      area,
      parLevel,
      packSize,
      vendorId: existing?.vendorId,
    };
    if (existing) {
      await app.editItem({ ...existing, ...payload });
    } else {
      await app.addItem(payload);
    }
    router.back();
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert('Delete item?', `Remove "${existing.name}" from your item list?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await app.removeItem(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen
      topSafeArea={false}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label={existing ? 'Save Changes' : 'Add Item'} size="lg" loading={busy} onPress={save} />
          {existing ? (
            <Button label="Delete Item" variant="ghost" onPress={confirmDelete} />
          ) : null}
        </View>
      }>
      <View style={{ gap: spacing.xl }}>
        <TextField label="Item name" placeholder="What the team calls it" value={name} onChangeText={setName} />
        <TextField
          label="Spanish name (optional)"
          placeholder="For the translation toggle"
          value={nameEs}
          onChangeText={setNameEs}
        />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <TextField label="Category" placeholder="e.g. Produce" value={category} onChangeText={setCategory} />
          </View>
          <View style={{ flex: 1 }}>
            <TextField label="Unit" placeholder="e.g. cases" value={unit} onChangeText={setUnit} />
          </View>
        </View>

        <Field label="Service area">
          <Segmented
            value={area}
            onChange={setArea}
            options={[
              { value: 'boh', label: 'Back of House', color: colors.boh },
              { value: 'foh', label: 'Front of House', color: colors.foh },
            ]}
          />
        </Field>

        <Field label="Par level — target on-hand quantity">
          <QuantityStepper value={parLevel} onChange={setParLevel} unit={unit || 'units'} />
        </Field>

        <Field label="Pack size — vendor sells in multiples of">
          <QuantityStepper value={packSize} onChange={setPackSize} min={1} unit={unit || 'units'} />
        </Field>

        {error ? (
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        ) : null}
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
