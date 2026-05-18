/**
 * Skeleton loading placeholder.
 *
 * A flat, subtly pulsing block — no shimmer gradient, matching the app's
 * no-gradients rule. Uses Reanimated for a smooth opacity pulse.
 *
 * Usage:
 *   // Single block
 *   <Skeleton width={200} height={20} />
 *
 *   // Preset layouts
 *   <SkeletonTabScreen />   — full-screen placeholder while the tab loads
 *   <SkeletonAuthScreen />  — auth-flow loading state
 */

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { View, type ViewStyle } from 'react-native';
import { useEffect } from 'react';

import { colors, radius, spacing } from '@/constants/design';

// ---------------------------------------------------------------------------
// Primitive
// ---------------------------------------------------------------------------

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

/**
 * A single flat skeleton block that pulses between full and 40 % opacity.
 * Respects Reduce Motion — if enabled the block is static at 60 % opacity.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radius.sm,
  style,
}: SkeletonProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 0.6 : 1);

  useEffect(() => {
    if (reduceMotion) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, [opacity, reduceMotion]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surfaceSunken,
        },
        animStyle,
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Row helper — a one-line or two-line list item placeholder
// ---------------------------------------------------------------------------

type SkeletonRowProps = {
  /** Whether to show a leading icon tile. */
  icon?: boolean;
  /** Show a second, narrower sub-label line. */
  twoLine?: boolean;
};

function SkeletonRow({ icon = false, twoLine = false }: SkeletonRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: 48,
        backgroundColor: colors.surface,
      }}>
      {icon ? (
        <Skeleton width={30} height={30} borderRadius={radius.sm} />
      ) : null}
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Skeleton width="60%" height={14} />
        {twoLine ? <Skeleton width="40%" height={12} /> : null}
      </View>
      <Skeleton width={18} height={18} borderRadius={radius.pill} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Card row helper — mirrors the ItemRow on the Stock screen
// ---------------------------------------------------------------------------

function SkeletonCardRow() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
        minHeight: 64,
      }}>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Skeleton width="55%" height={15} />
        <Skeleton width="40%" height={12} />
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Skeleton width={60} height={48} borderRadius={radius.md} />
        <Skeleton width={60} height={48} borderRadius={radius.md} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Full-screen tab skeleton — mirrors the Stock / Orders / History layout
// ---------------------------------------------------------------------------

/**
 * Full-screen skeleton shown while the app-store loads after sign-in.
 * Mimics the Stock tab layout (large title + item cards) which is the first
 * thing users see.
 */
export function SkeletonTabScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.canvas }}>
      {/* Nav bar placeholder */}
      <View
        style={{
          height: 44,
          backgroundColor: colors.canvas,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
        }}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          gap: spacing.lg,
        }}>
        {/* Large title */}
        <Skeleton width={120} height={32} borderRadius={radius.sm} />

        {/* Subtitle */}
        <Skeleton width="70%" height={14} />

        {/* Segmented control placeholder */}
        <Skeleton height={40} borderRadius={radius.lg} />

        {/* Search field placeholder */}
        <Skeleton height={44} borderRadius={radius.lg} />

        {/* Item card rows */}
        <View style={{ gap: spacing.sm }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCardRow key={i} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Auth loading skeleton — centered mark + two field placeholders
// ---------------------------------------------------------------------------

/**
 * Shown while the auth status is being determined on first launch.
 */
export function SkeletonAuthScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.canvas,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xl,
        paddingHorizontal: spacing.lg,
      }}>
      {/* App mark / logo placeholder */}
      <Skeleton width={64} height={64} borderRadius={radius.xl} />

      <View style={{ width: '100%', gap: spacing.md }}>
        {/* Email field */}
        <Skeleton height={52} borderRadius={radius.lg} />
        {/* Password field */}
        <Skeleton height={52} borderRadius={radius.lg} />
        {/* Primary button */}
        <Skeleton height={52} borderRadius={radius.lg} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Manage / settings list skeleton — mirrors ListSection rows
// ---------------------------------------------------------------------------

/**
 * A grouped-list skeleton: section header + N inset rows inside a card.
 */
export function SkeletonListSection({ rows = 3 }: { rows?: number }) {
  return (
    <View style={{ gap: spacing.sm }}>
      {/* Section header */}
      <Skeleton width={100} height={11} style={{ marginLeft: spacing.md }} />

      {/* Section card */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}>
        {Array.from({ length: rows }).map((_, i) => (
          <View key={i}>
            {i > 0 ? (
              <View
                style={{ height: 1, marginLeft: spacing.lg, backgroundColor: colors.border }}
              />
            ) : null}
            <SkeletonRow icon twoLine={i === 0} />
          </View>
        ))}
      </View>
    </View>
  );
}
