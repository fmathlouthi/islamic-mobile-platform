import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '@/context/I18nContext';
import { AuthProvider } from '@/context/AuthContext';
import { QueryContextProvider } from '@/context/QueryContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { StripeProviderWrapper } from '@/components/StripeProviderWrapper';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/hooks/useAuthStore';

function NotificationHandler() {
  const { isAuthenticated } = useAuthStore();
  const { expoPushToken } = useNotifications();

  return null;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  return (
    <GestureHandlerRootView style={styles.container}>
      <StripeProviderWrapper publishableKey={publishableKey}>
        <QueryContextProvider>
          <I18nProvider>
            <AuthProvider>
              <NotificationHandler />
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </AuthProvider>
          </I18nProvider>
        </QueryContextProvider>
      </StripeProviderWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
