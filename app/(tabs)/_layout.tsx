import { Tabs } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/constants/design';
import { Icon } from '@/components/ui/icon';
import { SkeletonTabScreen } from '@/components/ui/skeleton';
import { can } from '@/src/domain/permissions';
import { useApp } from '@/src/store/app-store';
import { SyncBanner } from '@/components/ui/sync-banner';

/** Tab button that fires a light haptic on press — kitchen-friendly feedback. */
function HapticTabButton(props: any) {
  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        Haptics.selectionAsync();
        props.onPressIn?.(e);
      }}
    />
  );
}

export default function TabLayout() {
  const { currentRole, loading } = useApp();
  const insets = useSafeAreaInsets();
  const showOrders = can(currentRole, 'viewOrders');
  const showAnalytics = currentRole !== 'member';

  if (loading) {
    return <SkeletonTabScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Offline / unsynced indicator — sits above the tab screens. */}
      <SyncBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTabButton,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSubtle,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 58 + insets.bottom,
            paddingTop: spacing.xs + 2,
            paddingBottom: Math.max(insets.bottom, spacing.sm),
          },
          tabBarLabelStyle: { ...typography.caption, fontWeight: '700' },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stock"
          options={{
            title: 'Stock',
            tabBarIcon: ({ color, size }) => <Icon name="cube" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            href: showOrders ? undefined : null,
            tabBarIcon: ({ color, size }) => <Icon name="clipboard" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            href: showOrders ? undefined : null,
            tabBarIcon: ({ color, size }) => <Icon name="time" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            href: showAnalytics ? undefined : null,
            tabBarIcon: ({ color, size }) => <Icon name="stats-chart" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => <Icon name="person-circle" size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
