import { ActivityIndicator, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, touchTarget, typography } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'md' | 'lg';

const variantStyle: Record<Variant, { bg: string; pressedBg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, pressedBg: colors.primaryPressed, fg: colors.textOnColor },
  secondary: { bg: colors.surface, pressedBg: colors.surfaceSunken, fg: colors.text, border: colors.borderStrong },
  danger: { bg: colors.urgentHigh, pressedBg: colors.urgentHighPressed, fg: colors.textOnColor },
  ghost: { bg: 'transparent', pressedBg: colors.surfaceSunken, fg: colors.primary },
};

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

/** Primary action control. Always meets the kitchen touch-target minimum. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const v = variantStyle[variant];
  const isOff = disabled || loading;
  const height = size === 'lg' ? touchTarget.large : touchTarget.comfortable;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isOff, busy: loading }}
      disabled={isOff}
      onPress={onPress}
      style={[
        styles.base,
        {
          height,
          backgroundColor: v.bg,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? StyleSheet.hairlineWidth + 1 : 0,
          opacity: isOff ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.lg : spacing.xxl,
        },
        style,
      ]}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={v.fg} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={size === 'lg' ? 22 : 20} color={v.fg} /> : null}
            <AppText style={[typography.bodyStrong, { color: v.fg, fontSize: size === 'lg' ? 18 : 16 }]}>
              {label}
            </AppText>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
