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

export default function LoginScreen() {
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await logIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log in.');
      setBusy(false);
    }
  };

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.xxl }}>
      <View style={{ alignItems: 'center', gap: spacing.md }}>
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
        <AppText variant="display">Welcome back</AppText>
        <AppText tone="muted" style={{ textAlign: 'center' }}>
          Log in to flag stock, plan orders, and keep your kitchen ahead.
        </AppText>
      </View>

      <View style={{ gap: spacing.lg }}>
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
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? (
          <AppText variant="caption" tone="danger">
            {error}
          </AppText>
        ) : null}

        <Button label="Log In" size="lg" loading={busy} onPress={submit} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
        <AppText tone="muted">New here?</AppText>
        <Link href="/signup" replace>
          <AppText tone="primary" style={{ fontWeight: '700' }}>
            Create a company account
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}
