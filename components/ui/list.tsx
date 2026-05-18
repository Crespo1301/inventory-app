import { Children, Fragment, type ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';

import { colors, radius, spacing, touchTarget } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';

/**
 * iOS-style inset grouped list. `ListSection` is the rounded card with an
 * optional header/footer; `ListRow` is a single row. Separators between rows
 * are inset, matching the Settings app.
 */

export type ListSectionProps = {
  /** Quiet header above the card. */
  title?: string;
  /** Quiet caption below the card. */
  footer?: string;
  /** Leading inset for the row separators. Use a larger value for icon rows. */
  separatorInset?: number;
  children: ReactNode;
  style?: ViewStyle;
};

export function ListSection({ title, footer, separatorInset = spacing.lg, children, style }: ListSectionProps) {
  const rows = Children.toArray(children).filter(Boolean);

  return (
    <View style={style}>
      {title ? (
        <AppText variant="caption" tone="muted" style={{ marginLeft: spacing.md, marginBottom: spacing.sm }}>
          {title}
        </AppText>
      ) : null}

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={{ height: 1, marginLeft: separatorInset, backgroundColor: colors.border }} /> : null}
            {row}
          </Fragment>
        ))}
      </View>

      {footer ? (
        <AppText variant="caption" tone="subtle" style={{ marginLeft: spacing.md, marginTop: spacing.sm }}>
          {footer}
        </AppText>
      ) : null}
    </View>
  );
}

export type ListRowProps = {
  icon?: IconName;
  /** Background of the leading icon tile. */
  iconBg?: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  /** Trailing muted value text. */
  value?: string;
  /** Custom trailing content — overrides `value`. */
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

export function ListRow({
  icon,
  iconBg = colors.surfaceSunken,
  iconColor = colors.textMuted,
  label,
  sublabel,
  value,
  right,
  onPress,
  destructive = false,
}: ListRowProps) {
  const labelColor = destructive ? colors.urgentHigh : colors.text;

  return (
    <PressableScale
      activeScale={onPress ? 0.99 : 1}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: touchTarget.min,
        backgroundColor: colors.surface,
      }}>
      {icon ? (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.sm,
            backgroundColor: destructive ? colors.urgentHighSoft : iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={18} color={destructive ? colors.urgentHigh : iconColor} />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <AppText variant="body" style={{ color: labelColor }} numberOfLines={1}>
          {label}
        </AppText>
        {sublabel ? (
          <AppText variant="caption" tone="subtle" numberOfLines={1}>
            {sublabel}
          </AppText>
        ) : null}
      </View>

      {right ?? (value ? (
        <AppText variant="label" tone="muted">
          {value}
        </AppText>
      ) : null)}

      {onPress ? <Icon name="chevron-forward" size={18} color={colors.textSubtle} /> : null}
    </PressableScale>
  );
}
