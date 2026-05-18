import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typography } from '@/constants/design';

type Variant = keyof typeof typography;
type Tone = 'default' | 'muted' | 'subtle' | 'onColor' | 'primary' | 'danger';

const toneColor: Record<Tone, string> = {
  default: colors.text,
  muted: colors.textMuted,
  subtle: colors.textSubtle,
  onColor: colors.textOnColor,
  primary: colors.primary,
  danger: colors.urgentHigh,
};

export type AppTextProps = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
};

/** Single typography primitive — every label in the app goes through this. */
export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  return <RNText style={[typography[variant], { color: toneColor[tone] }, style]} {...rest} />;
}
