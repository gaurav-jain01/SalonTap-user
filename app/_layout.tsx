import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ToastProvider } from '@/components/toast-provider';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <ToastProvider>
        <Stack initialRouteName="login">
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="verify-otp" options={{ title: 'Verification', headerBackTitle: 'Back' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="wallet" options={{ headerShown: false }} />
          <Stack.Screen name="transactions" options={{ headerShown: false }} />
          <Stack.Screen name="help" options={{ headerShown: false }} />
          <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
          <Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
          <Stack.Screen name="add-address" options={{ headerShown: false }} />
          <Stack.Screen name="sub-categories/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="services/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </ToastProvider>
    </ThemeProvider>
  );
}
