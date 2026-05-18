import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, radius, touchTarget } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';

export type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Unit shown beneath the number, e.g. "cases". */
  unit?: string;
};

/** Big plus/minus control for one-handed quantity edits. */
export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unit,
}: QuantityStepperProps) {
  const bump = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    if (next !== value) {
      Haptics.selectionAsync();
      onChange(next);
    }
  };

  const StepButton = ({ icon, delta }: { icon: 'remove' | 'add'; delta: number }) => {
    const disabled = delta < 0 ? value <= min : value >= max;
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={delta < 0 ? 'Decrease quantity' : 'Increase quantity'}
        disabled={disabled}
        onPress={() => bump(delta)}
        style={{
          width: touchTarget.large,
          height: touchTarget.large,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceSunken,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
        }}>
        <Ionicons name={icon} size={28} color={colors.text} />
      </PressableScale>
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <StepButton icon="remove" delta={-step} />
      <View style={{ alignItems: 'center', minWidth: 96 }}>
        <AppText variant="display">{value}</AppText>
        {unit ? (
          <AppText variant="caption" tone="muted">
            {unit}
          </AppText>
        ) : null}
      </View>
      <StepButton icon="add" delta={step} />
    </View>
  );
}
