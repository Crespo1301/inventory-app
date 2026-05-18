import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import { useAuth } from '@/src/auth/auth-store';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !companyName.trim() || !locationName.trim() || !email.trim()) {
      setError('Fill in every field to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Use a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await signUp({
        name,
        email,
        password,
        companyName,
        firstLocationName: locationName,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the account.');
      setBusy(false);
    }
  };

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxl, gap: spacing.xl }}>
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.lg,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="cube" size={34} color={colors.textOnColor} />
        </View>
        <AppText variant="display">Create your company</AppText>
        <AppText tone="muted" style={{ textAlign: 'center' }}>
          You&apos;ll be the company admin. Add locations, items, and your team once you&apos;re in.
        </AppText>
      </View>

      <View style={{ gap: spacing.lg }}>
        <TextField label="Your name" icon="person" placeholder="First and last" value={name} onChangeText={setName} />
        <TextField
          label="Company name"
          icon="business"
          placeholder="Your restaurant or group"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextField
          label="First location"
          icon="storefront"
          placeholder="e.g. Downtown, Main St"
          value={locationName}
          onChangeText={setLocationName}
        />
        <TextField
          label="Email"
          icon="mail"
          placeholder="you@restaurant.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextField
          label="Password"
          icon="lock-closed"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? (
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        ) : null}

        <Button label="Create Account" size="lg" loading={busy} onPress={submit} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Ionicons name="key" size={16} color={colors.infoPressed} />
          <AppText variant="caption" tone="muted">
            Have an invite code?
          </AppText>
          <Link href="/join" replace>
            <AppText variant="caption" tone="primary" style={{ fontWeight: '800' }}>
              Join an existing company
            </AppText>
          </Link>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
        <AppText tone="muted">Already have an account?</AppText>
        <Link href="/login" replace>
          <AppText tone="primary" style={{ fontWeight: '700' }}>
            Log in
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}
