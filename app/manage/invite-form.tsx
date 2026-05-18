import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import { useApp } from '@/src/store/app-store';

type Role = 'manager' | 'member';

export default function InviteFormScreen() {
  const router = useRouter();
  const app = useApp();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [locationIds, setLocationIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const toggleLocation = (id: string) =>
    setLocationIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Enter the person’s email.');
      return;
    }
    if (locationIds.length === 0) {
      setError('Assign at least one location.');
      return;
    }
    setBusy(true);
    try {
      const invite = await app.createInvitation({ email, role, locationIds });
      Alert.alert(
        'Invitation created',
        `Share this code with ${invite.email}:\n\n${invite.code}\n\nThey enter it on the "Join a company" screen when they sign up.`,
        [{ text: 'Done', onPress: () => router.back() }],
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the invitation.');
      setBusy(false);
    }
  };

  return (
    <Screen
      topSafeArea={false}
      footer={<Button label="Create Invitation" size="lg" loading={busy} onPress={save} />}>
      <View style={{ gap: spacing.xl }}>
        <AppText tone="muted">
          Invitations create a code. The person signs up with that code and joins this company with the role and
          locations you set here.
        </AppText>

        <TextField
          label="Their email"
          icon="mail"
          placeholder="they@restaurant.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Field label="Role">
          <Segmented
            value={role}
            onChange={setRole}
            options={[
              { value: 'member', label: 'Team Member' },
              { value: 'manager', label: 'Manager' },
            ]}
          />
          <AppText variant="caption" tone="muted">
            {role === 'manager'
              ? 'Builds and verifies orders for assigned locations. Cannot change company settings.'
              : 'Flags items low or out. The simplest role.'}
          </AppText>
        </Field>

        <Field label="Location access">
          <View style={{ gap: spacing.sm }}>
            {app.locations.map((loc) => {
              const checked = locationIds.includes(loc.id);
              return (
                <PressableScale
                  key={loc.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  onPress={() => toggleLocation(loc.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.lg,
                    borderRadius: radius.md,
                    borderWidth: 2,
                    borderColor: checked ? colors.primary : colors.border,
                    backgroundColor: colors.surface,
                  }}>
                  <Ionicons
                    name={checked ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={checked ? colors.primary : colors.textSubtle}
                  />
                  <AppText variant="bodyStrong" style={{ flex: 1 }}>
                    {loc.name}
                  </AppText>
                </PressableScale>
              );
            })}
          </View>
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
