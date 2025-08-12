// // useNotifications.js

import { useEffect, useState } from 'react';
import { requestNotificationPermissions } from './notificationPermissions';
import {
  createNotificationChannel,
  setupForegroundHandler,
  checkInitialNotification,
  setupNotificationOpenedHandler,
  getFCMToken,
} from './notificationHandler';

const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    let unsubscribeForeground;
    let unsubscribeOpened;

    const initializeNotifications = async () => {
      const permission = await requestNotificationPermissions();
      setHasPermission(permission);

      if (!permission) return;

      await createNotificationChannel();

      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
      } else {
        console.error('Failed to get FCM token');
      }

      await checkInitialNotification();

      unsubscribeForeground = setupForegroundHandler();
      unsubscribeOpened = setupNotificationOpenedHandler();
    };

    initializeNotifications();

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
      if (unsubscribeOpened) unsubscribeOpened();
    };
  }, []);

  return { fcmToken, hasPermission };
};

export default useNotifications;
