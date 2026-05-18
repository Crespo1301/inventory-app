import { useState } from 'react';
import { View } from 'react-native';

import { colors, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListRow, ListSection } from '@/components/ui/list';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import { useApp } from '@/src/store/app-store';

const ICON_INSET = spacing.lg + 30 + spacing.md;

export default function ManageLocationsScreen() {
  const app = useApp();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    await app.addLocation(name.trim(), address.trim() || undefined);
    setName('');
    setAddress('');
    setBusy(false);
  };

  return (
    <Screen topSafeArea={false}>
      <View style={{ gap: spacing.xl }}>
        <ListSection
          title="LOCATIONS"
          footer="Each location keeps its own stock flags and order lists."
          separatorInset={ICON_INSET}>
          {app.locations.map((loc) => (
            <ListRow
              key={loc.id}
              icon="storefront"
              iconBg={colors.primarySoft}
              iconColor={colors.primary}
              label={loc.name}
              sublabel={loc.address ?? 'No address'}
            />
          ))}
        </ListSection>

        <Card style={{ gap: spacing.md }}>
          <AppText variant="heading">Add a location</AppText>
          <TextField label="Name" placeholder="e.g. Eastside" value={name} onChangeText={setName} />
          <TextField
            label="Address (optional)"
            placeholder="Street address"
            value={address}
            onChangeText={setAddress}
          />
          <Button label="Add Location" icon="add" loading={busy} onPress={add} />
        </Card>
      </View>
    </Screen>
  );
}
