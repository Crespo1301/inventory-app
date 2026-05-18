import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '@/constants/design';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { AppText } from '@/components/ui/text';
import type { UserRole } from '@/src/domain';
import { roleLabel } from '@/src/domain/permissions';
import { useApp } from '@/src/store/app-store';

const roleTone: Record<UserRole, BadgeTone> = { admin: 'info', manager: 'low', member: 'medium' };

export default function ManagePeopleScreen() {
  const router = useRouter();
  const app = useApp();
  const pending = app.invitations.filter((i) => i.status === 'pending');

  const removeMember = (userId: string, name: string) => {
    Alert.alert('Remove team member?', `${name} will lose access to this company.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => app.removeTeamMember(userId) },
    ]);
  };

  const cancelInvite = (id: string, email: string) => {
    Alert.alert('Cancel invitation?', `The code for ${email} will stop working.`, [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel Invite', style: 'destructive', onPress: () => app.cancelInvitation(id) },
    ]);
  };

  return (
    <Screen
      topSafeArea={false}
      footer={
        <Button label="Invite Team Member" icon="person-add" size="lg" onPress={() => router.push('/manage/invite-form')} />
      }>
      <View style={{ gap: spacing.xxl }}>
        <View>
          <SectionHeader title="Members" caption="People with an active account in this company" />
          <View style={{ gap: spacing.sm }}>
            {app.users.map((u) => {
              const membership = app.memberships.find((m) => m.userId === u.id);
              const isSelf = u.id === app.currentUserId;
              const locNames =
                u.role === 'admin'
                  ? 'All locations'
                  : (membership?.locationIds ?? [])
                      .map((id) => app.locations.find((l) => l.id === id)?.name)
                      .filter(Boolean)
                      .join(', ') || 'No locations assigned';
              return (
                <Card key={u.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <Avatar icon="person" />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyStrong">
                        {u.name}
                        {isSelf ? ' (you)' : ''}
                      </AppText>
                      <AppText variant="caption" tone="subtle">
                        {u.email}
                      </AppText>
                      <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
                        {locNames}
                      </AppText>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
                      <Badge tone={roleTone[u.role]} label={roleLabel[u.role]} />
                      {!isSelf ? (
                        <PressableScale
                          accessibilityLabel={`Remove ${u.name}`}
                          onPress={() => removeMember(u.id, u.name)}
                          style={{ padding: 4 }}>
                          <Ionicons name="trash-outline" size={18} color={colors.urgentHigh} />
                        </PressableScale>
                      ) : null}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        {pending.length > 0 ? (
          <View>
            <SectionHeader title="Pending invitations" caption="Share the code — it works until used or cancelled" />
            <View style={{ gap: spacing.sm }}>
              {pending.map((inv) => (
                <Card key={inv.id}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <Avatar icon="mail" />
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyStrong">{inv.email}</AppText>
                      <AppText variant="caption" tone="muted">
                        {roleLabel[inv.role]} · code{' '}
                        <AppText variant="caption" tone="primary" style={{ fontWeight: '800' }}>
                          {inv.code}
                        </AppText>
                      </AppText>
                    </View>
                    <PressableScale
                      accessibilityLabel={`Cancel invitation for ${inv.email}`}
                      onPress={() => cancelInvite(inv.id, inv.email)}
                      style={{ padding: 4 }}>
                      <Ionicons name="close-circle-outline" size={20} color={colors.urgentHigh} />
                    </PressableScale>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

function Avatar({ icon }: { icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: radius.pill,
        backgroundColor: colors.surfaceSunken,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
    </View>
  );
}
