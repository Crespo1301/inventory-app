import { View } from 'react-native';

import { spacing } from '@/constants/design';
import { AppText } from '@/components/ui/text';

export type SectionHeaderProps = {
  title: string;
  caption?: string;
  /** Optional trailing control, e.g. a count or a small action. */
  trailing?: React.ReactNode;
};

export function SectionHeader({ title, caption, trailing }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        marginBottom: spacing.md,
      }}>
      <View style={{ flex: 1 }}>
        <AppText variant="heading">{title}</AppText>
        {caption ? (
          <AppText variant="caption" tone="muted" style={{ marginTop: 2 }}>
            {caption}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </View>
  );
}
