import { View } from 'react-native';

import { colors, radius, spacing, touchTarget } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  /** Optional accent for the selected state — defaults to brand primary. */
  color?: string;
};

export type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Flat segmented control. Used for FOH/BOH, stock status, urgency. */
export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surfaceSunken,
        borderRadius: radius.md,
        padding: 4,
        gap: 4,
      }}>
      {options.map((opt) => {
        const selected = opt.value === value;
        const accent = opt.color ?? colors.primary;
        return (
          <PressableScale
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              minHeight: touchTarget.min,
              borderRadius: radius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.sm,
              backgroundColor: selected ? accent : 'transparent',
            }}>
            <AppText
              variant="label"
              style={{ color: selected ? colors.textOnColor : colors.textMuted }}
              numberOfLines={1}>
              {opt.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
