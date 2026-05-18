import { Stack } from 'expo-router';

import { colors } from '@/constants/design';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="join" />
    </Stack>
  );
}
