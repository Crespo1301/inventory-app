import { View } from 'react-native';

import { colors, radius, spacing } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';

export type SheetHeaderProps = {
  title: string;
  onClose: () => void;
  /** Left button label — iOS convention is "Cancel". */
  closeLabel?: string;
};

/**
 * Header for modal sheets: a grabber handle plus a centered title with a
 * top-left dismiss button, matching iOS sheet conventions.
 */
export function SheetHeader({ title, onClose, closeLabel = 'Cancel' }: SheetHeaderProps) {
  return (
    <View style={{ backgroundColor: colors.canvas }}>
      <View style={{ alignItems: 'center', paddingTop: spacing.sm }}>
        <View style={{ width: 36, height: 5, borderRadius: radius.pill, backgroundColor: colors.borderStrong }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 44,
          paddingHorizontal: spacing.lg,
        }}>
        <View style={{ width: 72, alignItems: 'flex-start' }}>
          <PressableScale accessibilityRole="button" onPress={onClose} hitSlop={8}>
            <AppText variant="body" tone="primary">
              {closeLabel}
            </AppText>
          </PressableScale>
        </View>
        <AppText variant="heading" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>
          {title}
        </AppText>
        <View style={{ width: 72 }} />
      </View>
    </View>
  );
}
