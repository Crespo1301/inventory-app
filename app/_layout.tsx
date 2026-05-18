import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { colors } from '@/constants/design';
import { navigationTheme } from '@/constants/theme';
import { SkeletonAuthScreen } from '@/components/ui/skeleton';
import { AuthProvider, useAuth } from '@/src/auth/auth-store';
import { AppProvider } from '@/src/store/app-store';
import { SyncProvider } from '@/src/store/sync-store';

function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <SkeletonAuthScreen />;
  }

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.canvas } }}>
      <Stack.Protected guard={status === 'authed'}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="flag"
          options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="manage" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={status === 'guest'}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          {/* SyncProvider must wrap AppProvider — app-store calls useSync(). */}
          <SyncProvider>
            <AppProvider>
              <RootNavigator />
              <StatusBar style="dark" />
            </AppProvider>
          </SyncProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
