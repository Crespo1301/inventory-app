import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { colors, radius, spacing } from '@/constants/design';

const highlights = [
  { icon: 'flash', label: 'Flag low or out in one tap' },
  { icon: 'receipt', label: 'Build and verify orders fast' },
  { icon: 'people', label: 'Keep every shift in sync' },
] as const;

export default function AuthHomeScreen() {
  const router = useRouter();

  return (
    <Screen contentStyle={{ paddingTop: spacing.xxxl, gap: spacing.xxl, justifyContent: 'space-between' }}>
      <View style={{ gap: spacing.xxl }}>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: radius.xl,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="cube" size={38} color={colors.textOnColor} />
          </View>
          <View style={{ gap: spacing.sm, alignItems: 'center' }}>
            <AppText variant="display">Inventory App</AppText>
            <AppText tone="muted" style={{ textAlign: 'center', maxWidth: 320 }}>
              Fast stock capture and explainable ordering for real kitchens, shifts, and locations.
            </AppText>
          </View>
        </View>

        <View
          style={{
            gap: spacing.md,
            padding: spacing.xl,
            borderRadius: radius.xl,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          {highlights.map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  backgroundColor: colors.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
              </View>
              <AppText style={{ flex: 1 }}>{item.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: spacing.lg }}>
        <Button label="Log In" size="lg" icon="log-in-outline" onPress={() => router.push('/login')} />
        <Button
          label="I Have an Invite"
          size="lg"
          variant="secondary"
          icon="mail-open-outline"
          onPress={() => router.push('/join')}
        />
        <Button
          label="Create a New Company"
          size="lg"
          variant="ghost"
          icon="add-circle-outline"
          onPress={() => router.push('/signup')}
        />

        <View
          style={{
            gap: spacing.xs,
            paddingHorizontal: spacing.sm,
          }}>
          <AppText variant="label" tone="muted" style={{ textAlign: 'center' }}>
            Invited managers and team members should use their invite code.
          </AppText>
          <AppText variant="caption" tone="subtle" style={{ textAlign: 'center' }}>
            Only admins creating a brand-new company should choose Create a New Company.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}
