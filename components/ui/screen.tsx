import { type ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/design';

export type ScreenProps = {
  children: ReactNode;
  /** Scrollable body (default) vs. fixed layout for full-height screens. */
  scroll?: boolean;
  /** Fixed content above the scroll area — e.g. a sheet header. */
  header?: ReactNode;
  /** Content pinned to the bottom safe area — e.g. a primary action bar. */
  footer?: ReactNode;
  /** Pad for the status bar. Turn off when a native header already covers it. */
  topSafeArea?: boolean;
  contentStyle?: ViewStyle;
};

/** Standard screen frame: canvas background, safe-area aware, consistent padding. */
export function Screen({
  children,
  scroll = true,
  header,
  footer,
  topSafeArea = true,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas, paddingTop: topSafeArea ? insets.top : 0 }}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[padding, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
      )}

      {footer ? (
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
