import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { apiClient } from '../api/client';
import { useAuthStore } from './useAuthStore';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setExpoPushToken(token);
          registerTokenWithBackend(token);
        }
      });
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated]);

  const registerTokenWithBackend = async (token: string) => {
    try {
      await apiClient.registerFcmToken(token);
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
    }
  };

  const scheduleLocalAdhanNotification = async (prayerName: string, date: Date, prayerId: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: prayerId,
        content: {
          title: "حان وقت الصلاة",
          body: `حان وقت صلاة ${prayerName}`,
          data: { prayerName },
        },
        trigger: date as any,
      });
    } catch (error) {
      console.error('Failed to schedule local notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    expoPushToken,
    notification,
    scheduleLocalAdhanNotification,
    cancelAllNotifications,
  };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    
    // In Expo Go, we use expoPushToken. In bare workflow or EAS build, we might use device token.
    // For simplicity, we'll use expoPushToken as it's easier to handle with Expo.
    try {
      const rawProjectId =
        (Constants as any)?.expoConfig?.extra?.eas?.projectId ??
        (Constants as any)?.easConfig?.projectId;

      const projectId =
        typeof rawProjectId === 'string' && UUID_REGEX.test(rawProjectId)
          ? rawProjectId
          : undefined;

      // If projectId is invalid (common in local templates), fallback without it.
      token = (
        await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        )
      ).data;
    } catch (e) {
      console.warn('Skipping Expo push token registration:', e);
    }
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  return token;
}
