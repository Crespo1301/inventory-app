import { View, type ViewProps } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/design';
import { PressableScale } from '@/components/ui/pressable-scale';

export type CardProps = ViewProps & {
  /** When set, the whole card becomes a tappable surface. */
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
};

/** Flat white surface with a hairline border — no glass, no gradient. */
export function Card({ onPress, padded = true, elevated = false, style, children, ...rest }: CardProps) {
  const cardStyle = [
    {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: padded ? spacing.lg : 0,
    },
    elevated ? shadow.card : null,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} accessibilityRole="button" style={cardStyle}>
        {children}
      </PressableScale>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}
