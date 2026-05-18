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
        options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="locations" options={{ title: 'Locations' }} />
      <Stack.Screen name="people" options={{ title: 'Team' }} />
      <Stack.Screen
        name="invite-form"
        options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
      />
    </Stack>
  );
}
