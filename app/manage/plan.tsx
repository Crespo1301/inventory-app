import { useMemo } from 'react';
import { Alert, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/design';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import {
  PLANS,
  PLAN_ORDER,
  formatLimit,
  planFor,
  planRank,
  recommendedPlan,
  usageMeters,
  type Plan,
} from '@/src/domain/billing';
import { useApp } from '@/src/store/app-store';

/** Horizontal usage bar — green inside the limit, red once it is reached. */
function Meter({ ratio, over }: { ratio: number; over: boolean }) {
  return (
    <View
      style={{
        height: 8,
        borderRadius: radius.pill,
        backgroundColor: colors.surfaceSunken,
        overflow: 'hidden',
      }}>
      <View
        style={{
          height: 8,
          width: `${Math.max(ratio, 0.02) * 100}%`,
          borderRadius: radius.pill,
          backgroundColor: over ? colors.urgentHigh : colors.primary,
        }}
      />
    </View>
  );
}

export default function ManagePlanScreen() {
  const app = useApp();

  const currentPlan = planFor(app.company);
  const usage = useMemo(
    () => ({ locations: app.locations.length, teamMembers: app.users.length }),
    [app.locations.length, app.users.length],
  );
  const meters = useMemo(() => usageMeters(currentPlan, usage), [currentPlan, usage]);
  const overCapacity = meters.some((m) => !m.withinLimit);
  const suggested = useMemo(() => recommendedPlan(usage), [usage]);

  const onSelectPlan = (plan: Plan) => {
    if (plan.id === currentPlan.id) return;
    const direction = planRank(plan.id) > planRank(currentPlan.id) ? 'Upgrade' : 'Change';
    Alert.alert(
      `${direction} to ${plan.name}?`,
      'Billing is not turned on yet. Plan changes go live with the first paid release — your team keeps full access in the meantime.',
      [{ text: 'OK' }],
    );
  };

  return (
    <Screen topSafeArea={false}>
      <View style={{ gap: spacing.xl }}>
        {/* Current plan */}
        <Card style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <AppText variant="heading">{currentPlan.name}</AppText>
            <Badge tone="low" label="Current plan" />
          </View>
          <AppText variant="caption" tone="subtle">
            {currentPlan.tagline}
          </AppText>
          <AppText variant="display">
            {currentPlan.priceMonthly === 0 ? 'Free' : `$${currentPlan.priceMonthly}`}
            {currentPlan.priceMonthly > 0 ? (
              <AppText variant="body" tone="subtle">
                {'  / month'}
              </AppText>
            ) : null}
          </AppText>
        </Card>

        {/* Usage against the current plan */}
        <View style={{ gap: spacing.sm }}>
          <AppText variant="caption" tone="muted" style={{ marginLeft: spacing.md }}>
            USAGE THIS PLAN
          </AppText>
          <Card style={{ gap: spacing.lg }}>
            {meters.map((m) => (
              <View key={m.key} style={{ gap: spacing.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText variant="bodyStrong">{m.label}</AppText>
                  <AppText variant="label" tone={m.withinLimit ? 'muted' : 'danger'}>
                    {m.used} / {formatLimit(m.limit)}
                  </AppText>
                </View>
                <Meter ratio={m.ratio} over={!m.withinLimit} />
              </View>
            ))}
          </Card>
          {overCapacity ? (
            <View
              style={{
                flexDirection: 'row',
                gap: spacing.sm,
                backgroundColor: colors.urgentHighSoft,
                borderRadius: radius.md,
                padding: spacing.md,
              }}>
              <Icon name="alert-circle" size={18} color={colors.urgentHigh} />
              <AppText variant="caption" tone="danger" style={{ flex: 1 }}>
                Your team has outgrown {currentPlan.name}. Move to {suggested.name} to stay within
                plan limits when billing turns on.
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Plan comparison */}
        <View style={{ gap: spacing.sm }}>
          <AppText variant="caption" tone="muted" style={{ marginLeft: spacing.md }}>
            ALL PLANS
          </AppText>
          <View style={{ gap: spacing.md }}>
            {PLAN_ORDER.map((id) => {
              const plan = PLANS[id];
              const isCurrent = plan.id === currentPlan.id;
              const isSuggested = plan.id === suggested.id && overCapacity;
              return (
                <Card
                  key={id}
                  style={{
                    gap: spacing.md,
                    borderColor: isCurrent ? colors.primary : colors.border,
                    borderWidth: isCurrent ? 2 : 1,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, gap: spacing.xs }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <AppText variant="heading">{plan.name}</AppText>
                        {isCurrent ? <Badge tone="low" label="Current" /> : null}
                        {isSuggested ? <Badge tone="info" label="Recommended" /> : null}
                      </View>
                      <AppText variant="caption" tone="subtle">
                        {plan.tagline}
                      </AppText>
                    </View>
                    <AppText variant="title">
                      {plan.priceMonthly === 0 ? 'Free' : `$${plan.priceMonthly}`}
                    </AppText>
                  </View>

                  <View style={{ gap: spacing.sm }}>
                    {plan.highlights.map((line) => (
                      <View key={line} style={{ flexDirection: 'row', gap: spacing.sm }}>
                        <Icon name="checkmark-circle" size={18} color={colors.primary} />
                        <AppText variant="body" tone="muted" style={{ flex: 1 }}>
                          {line}
                        </AppText>
                      </View>
                    ))}
                  </View>

                  {isCurrent ? (
                    <Button label="Your current plan" variant="secondary" disabled onPress={() => {}} />
                  ) : (
                    <Button
                      label={
                        planRank(plan.id) > planRank(currentPlan.id)
                          ? `Upgrade to ${plan.name}`
                          : `Switch to ${plan.name}`
                      }
                      variant={planRank(plan.id) > planRank(currentPlan.id) ? 'primary' : 'secondary'}
                      onPress={() => onSelectPlan(plan)}
                    />
                  )}
                </Card>
              );
            })}
          </View>
        </View>

        <AppText variant="caption" tone="subtle" style={{ textAlign: 'center' }}>
          Billing turns on with the first paid release. Until then every company runs with full
          access — no plan limits are enforced.
        </AppText>
      </View>
    </Screen>
  );
}
