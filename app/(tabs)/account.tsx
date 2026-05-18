import { Alert, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/constants/design';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LargeTitleScreen } from '@/components/ui/large-title-screen';
import { ListRow, ListSection } from '@/components/ui/list';
import { PressableScale } from '@/components/ui/pressable-scale';
import { AppText } from '@/components/ui/text';
import type { UserRole } from '@/src/domain';
import { can, roleLabel, visibleLocationIds } from '@/src/domain/permissions';
import { useAuth } from '@/src/auth/auth-store';
import { useApp } from '@/src/store/app-store';

const roleTone: Record<UserRole, BadgeTone> = { admin: 'info', manager: 'low', member: 'medium' };

/** Separator inset that clears a 30pt leading icon tile. */
const ICON_INSET = spacing.lg + 30 + spacing.md;

export default function AccountScreen() {
  const router = useRouter();
  const { logOut, deleteAccount } = useAuth();
  const app = useApp();

  const membership = app.memberships.find((m) => m.userId === app.currentUserId);
  const me = app.users.find((u) => u.id === app.currentUserId);
  const visibleLocations = membership
    ? visibleLocationIds(
        membership,
        app.locations.map((l) => l.id),
      )
    : [];

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You can log back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  const isLastMember = app.users.length <= 1;
  const confirmDelete = () => {
    Alert.alert(
      'Delete account?',
      isLastMember
        ? 'This permanently deletes your account, your company, and all of its data. This cannot be undone.'
        : 'This permanently deletes your account. Your company and its data stay for the rest of your team. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (e) {
              Alert.alert('Could not delete account', e instanceof Error ? e.message : 'Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <LargeTitleScreen title="Account" subtitle={app.company?.name ?? 'Your company'}>
      <View style={{ gap: spacing.xl }}>
        {/* Profile */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: colors.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="person" size={26} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyStrong">{me?.name ?? 'You'}</AppText>
            <AppText variant="caption" tone="subtle">
              {me?.email}
            </AppText>
          </View>
          <Badge tone={roleTone[app.currentRole]} label={roleLabel[app.currentRole]} />
        </Card>

        {/* Working location */}
        <ListSection
          title="WORKING LOCATION"
          footer="Used by the Stock and Orders tabs."
          separatorInset={ICON_INSET}>
          {app.locations.map((loc) => {
            const allowed = visibleLocations.includes(loc.id);
            const active = loc.id === app.currentLocationId;
            return (
              <ListRow
                key={loc.id}
                icon={allowed ? 'storefront' : 'lock-closed'}
                iconBg={active ? colors.primarySoft : colors.surfaceSunken}
                iconColor={active ? colors.primary : colors.textMuted}
                label={loc.name}
                sublabel={allowed ? loc.address ?? 'No address' : 'No access — ask an admin'}
                onPress={allowed && !active ? () => app.setLocation(loc.id) : undefined}
                right={
                  active ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : undefined
                }
              />
            );
          })}
        </ListSection>

        {/* Preferences */}
        <ListSection title="PREFERENCES" separatorInset={ICON_INSET}>
          <ListRow
            icon="language"
            label="Spanish item names"
            right={
              <Switch
                value={app.showSpanish}
                onValueChange={app.toggleSpanish}
                trackColor={{ false: colors.surfaceSunken, true: colors.primary }}
              />
            }
          />
        </ListSection>

        {/* Management */}
        {can(app.currentRole, 'manageItems') ? (
          <ListSection
            title="MANAGE"
            footer={app.currentRole === 'admin' ? 'Admin tools.' : 'Manager tools.'}
            separatorInset={ICON_INSET}>
            <ListRow icon="pricetags" label="Items & par levels" onPress={() => router.push('/manage/items')} />
            {can(app.currentRole, 'manageLocations') ? (
              <ListRow icon="storefront" label="Locations" onPress={() => router.push('/manage/locations')} />
            ) : null}
            {can(app.currentRole, 'managePeople') ? (
              <ListRow icon="people" label="Team & roles" onPress={() => router.push('/manage/people')} />
            ) : null}
          </ListSection>
        ) : null}

        <Button label="Log Out" variant="secondary" icon="log-out-outline" onPress={confirmLogout} />

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Delete account"
          onPress={confirmDelete}
          style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <AppText variant="label" tone="danger">
            Delete Account
          </AppText>
        </PressableScale>
      </View>
    </LargeTitleScreen>
  );
}
