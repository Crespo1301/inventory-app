/**
 * Sync status banner.
 *
 * A calm, single-line indicator that sits just below the navigation header
 * when the device is offline or when writes are pending replay.
 *
 * Design rules (from constants/design.ts + ios-design-guidelines):
 * - Flat solid fill — no gradients, no translucency.
 * - Amber fill for "offline / unsynced"; green fill for the brief "syncing" flash.
 * - Disappears entirely when online with an empty queue.
 * - Minimum 44pt height for reachability; icon + text are vertically centred.
 */

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, motion, spacing, typography } from '@/constants/design';
import { AppText } from '@/components/ui/text';
import { useSync } from '@/src/store/sync-store';

export function SyncBanner() {
  const { syncStatus, pendingCount } = useSync();

  const visible = syncStatus !== 'online' || pendingCount > 0;

  // Slide the banner down from behind the nav bar.
  const translateY = useRef(new Animated.Value(visible ? 0 : -48)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -48,
      duration: motion.base,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  const isOffline = syncStatus === 'offline';
  const isSyncing = syncStatus === 'syncing';

  const bg = isSyncing ? colors.primary : colors.urgentMedium;

  let label: string;
  if (isSyncing) {
    label = 'Syncing…';
  } else if (isOffline && pendingCount > 0) {
    label = `Offline · ${pendingCount} unsent ${pendingCount === 1 ? 'change' : 'changes'}`;
  } else if (isOffline) {
    label = 'Offline';
  } else {
    label = `${pendingCount} unsynced ${pendingCount === 1 ? 'change' : 'changes'}`;
  }

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: bg, transform: [{ translateY }] }]}
      // Hide from accessibility when not shown.
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.textOnColor }]} />
        <AppText style={styles.label}>{label}</AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    opacity: 0.85,
  },
  label: {
    ...typography.caption,
    color: colors.textOnColor,
    fontWeight: '700',
  },
});
