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

export default function JoinScreen() {
  const { joinCompany } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !code.trim()) {
      setError('Fill in every field, including your invite code.');
      return;
    }
    if (password.length < 6) {
      setError('Use a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await joinCompany({ name, email, password, code });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join the company.');
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
          <Ionicons name="people" size={32} color={colors.textOnColor} />
        </View>
        <AppText variant="display">Join a company</AppText>
        <AppText tone="muted" style={{ textAlign: 'center' }}>
          Use the invite code an admin or manager gave you. It must match the email they invited.
        </AppText>
      </View>

      <View style={{ gap: spacing.lg }}>
        <TextField label="Your name" icon="person" placeholder="First and last" value={name} onChangeText={setName} />
        <TextField
          label="Email"
          icon="mail"
          placeholder="The email you were invited with"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Invite code"
          icon="key"
          placeholder="6-character code"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
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

        <Button label="Join Company" size="lg" loading={busy} onPress={submit} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
        <AppText tone="muted">Starting your own company?</AppText>
        <Link href="/signup" replace>
          <AppText tone="primary" style={{ fontWeight: '700' }}>
            Sign up
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}
