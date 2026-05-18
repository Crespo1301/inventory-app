import { Stack } from 'expo-router';

import { colors, typography } from '@/constants/design';

export default function ManageLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: typography.heading,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}>
      <Stack.Screen name="items" options={{ title: 'Items' }} />
      <Stack.Screen
        name="item-form"
        options={{ title: 'Item', presentation: 'modal', sheetGrabberVisible: true }}
      />
      <Stack.Screen name="locations" options={{ title: 'Locations' }} />
      <Stack.Screen name="people" options={{ title: 'Team' }} />
      <Stack.Screen
        name="invite-form"
        options={{ title: 'Invite Team Member', presentation: 'modal', sheetGrabberVisible: true }}
      />
    </Stack>
  );
}
