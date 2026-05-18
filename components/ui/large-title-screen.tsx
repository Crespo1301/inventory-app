import { type ReactNode, useRef } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/constants/design';
import { AppText } from '@/components/ui/text';

/** Height of the fixed nav bar below the status bar. Matches iOS. */
const NAV_BAR_HEIGHT = 44;
/** Scroll distance over which the large title hands off to the inline title. */
const COLLAPSE_DISTANCE = 52;

export type LargeTitleScreenProps = {
  title: string;
  /** One short line under the large title. Scrolls away with it. */
  subtitle?: string;
  /** Persistent control on the right of the nav bar (e.g. a toggle). */
  headerRight?: ReactNode;
  /** Pinned bottom bar, e.g. a primary action. */
  footer?: ReactNode;
  children: ReactNode;
  contentStyle?: ViewStyle;
};

/**
 * iOS-style screen frame: a large title that collapses into a standard inline
 * nav title as the user scrolls, with a hairline that appears under the bar on
 * collapse. Flat — no blur or translucency.
 */
export function LargeTitleScreen({
  title,
  subtitle,
  headerRight,
  footer,
  children,
  contentStyle,
}: LargeTitleScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const inlineTitleOpacity = scrollY.interpolate({
    inputRange: [COLLAPSE_DISTANCE * 0.5, COLLAPSE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const largeTitleOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      {/* Fixed nav bar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: insets.top,
          height: insets.top + NAV_BAR_HEIGHT,
          backgroundColor: colors.canvas,
        }}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: NAV_BAR_HEIGHT,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            opacity: inlineTitleOpacity,
          }}
        />
        <View
          style={{
            height: NAV_BAR_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: spacing.lg,
          }}>
          <Animated.Text
            numberOfLines={1}
            style={[typography.heading, { color: colors.text, opacity: inlineTitleOpacity }]}>
            {title}
          </Animated.Text>
          {headerRight ? (
            <View style={{ position: 'absolute', right: spacing.lg }}>{headerRight}</View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={[
          {
            paddingTop: insets.top + NAV_BAR_HEIGHT + spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingBottom: insets.bottom + spacing.xxxl + spacing.xl,
          },
          contentStyle,
        ]}>
        <Animated.View style={{ opacity: largeTitleOpacity, marginBottom: spacing.lg }}>
          <AppText variant="display">{title}</AppText>
          {subtitle ? (
            <AppText tone="muted" style={{ marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </Animated.View>

        {children}
      </Animated.ScrollView>

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
