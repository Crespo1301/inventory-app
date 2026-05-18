import { View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/constants/design';
import { AppText } from '@/components/ui/text';

export type BadgeTone = 'neutral' | 'high' | 'medium' | 'low' | 'info' | 'foh' | 'boh';

const toneMap: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceSunken, fg: colors.textMuted },
  high: { bg: colors.urgentHighSoft, fg: colors.urgentHighPressed },
  medium: { bg: colors.urgentMediumSoft, fg: '#9A6308' },
  low: { bg: colors.urgentLowSoft, fg: colors.primaryPressed },
  info: { bg: colors.infoSoft, fg: colors.infoPressed },
  foh: { bg: colors.fohSoft, fg: colors.foh },
  boh: { bg: colors.bohSoft, fg: colors.boh },
};

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Filled dot before the label — good for status at a glance. */
  dot?: boolean;
  style?: ViewStyle;
};

export function Badge({ label, tone = 'neutral', icon, dot = false, style }: BadgeProps) {
  const t = toneMap[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs + 2,
          alignSelf: 'flex-start',
          backgroundColor: t.bg,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
        },
        style,
      ]}>
      {dot ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.fg }} /> : null}
      {icon ? <Ionicons name={icon} size={13} color={t.fg} /> : null}
      <AppText style={[typography.caption, { color: t.fg, fontWeight: '700' }]}>{label}</AppText>
    </View>
  );
}
