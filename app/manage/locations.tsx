import { useState } from 'react';
import { View } from 'react-native';

import { colors, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow, ListSection } from '@/components/ui/list';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import type { Location } from '@/src/domain';
import { useApp } from '@/src/store/app-store';

const ICON_INSET = spacing.lg + 30 + spacing.md;

export default function ManageLocationsScreen() {
  const app = useApp();
  /** Location being edited, or null when the form is in "add" mode. */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  const isEditing = editingId !== null;

  const startEdit = (loc: Location) => {
    setEditingId(loc.id);
    setName(loc.name);
    setAddress(loc.address ?? '');
  };

  const reset = () => {
    setEditingId(null);
    setName('');
    setAddress('');
  };

  const save = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      if (editingId) {
        await app.editLocation(editingId, name.trim(), address.trim() || undefined);
      } else {
        await app.addLocation(name.trim(), address.trim() || undefined);
      }
      reset();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen topSafeArea={false}>
      <View style={{ gap: spacing.xl }}>
        <ListSection
          title="LOCATIONS"
          footer="Tap a location to edit its name or address. Each location keeps its own stock flags and order lists."
          separatorInset={ICON_INSET}>
          {app.locations.map((loc) => {
            const active = loc.id === editingId;
            return (
              <ListRow
                key={loc.id}
                icon="storefront"
                iconBg={active ? colors.primary : colors.primarySoft}
                iconColor={active ? colors.textOnColor : colors.primary}
                label={loc.name}
                sublabel={loc.address ?? 'No address — tap to add'}
                onPress={() => startEdit(loc)}
              />
            );
          })}
        </ListSection>

        <Card style={{ gap: spacing.md }}>
          <AppText variant="heading">{isEditing ? 'Edit location' : 'Add a location'}</AppText>
          <TextField label="Name" placeholder="e.g. Eastside" value={name} onChangeText={setName} />
          <TextField
            label="Address (optional)"
            placeholder="Street address"
            value={address}
            onChangeText={setAddress}
          />
          <Button
            label={isEditing ? 'Save Changes' : 'Add Location'}
            icon={isEditing ? 'checkmark-circle' : 'add'}
            loading={busy}
            onPress={save}
          />
          {isEditing ? <Button label="Cancel" variant="secondary" onPress={reset} /> : null}
        </Card>
      </View>
    </Screen>
  );
}
