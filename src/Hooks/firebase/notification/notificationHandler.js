// notificationHandler.js

import { Platform } from 'react-native';
import { messagingInstance } from './firebase';
import notifee, { AndroidImportance } from '@notifee/react-native';


// Create notification channel (Android)
export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } catch (error) {
      console.error('❌ Error creating notification channel:', error);
    }
  }
};


// notificationHandler.js

export const setupForegroundHandler = () => {
  return messagingInstance.onMessage(async remoteMessage => {
    try {
      const { notification } = remoteMessage;
      if (!notification) {
        console.warn('⚠️ Received message without notification payload:', remoteMessage);
        return;
      }
      await notifee.displayNotification({
        title: notification.title || 'Notification',
        body: notification.body || 'You have a new message.',
        android: {
          channelId: 'default',
          smallIcon: 'ic_notification', // Ensure this icon exists in your project
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('❌ Error displaying foreground notification:', error);
    }
  });
};


// Background handler
export const setupBackgroundHandler = () => {
  messagingInstance.setBackgroundMessageHandler(async remoteMessage => {
  });
};

// Get FCM Token
export const getFCMToken = async () => {
  try {
    
    const token = await messagingInstance.getToken();
    
    if (!token) {
      console.error('❌ FCM token is null');
      return null;
    }

    return token;
  } catch (error) {
    console.error('❌ Error fetching FCM token:', error);
    return null;
  }
};



// Handle initial notification (app closed)
export const checkInitialNotification = async () => {
  const initialNotification = await messagingInstance.getInitialNotification();
  if (initialNotification) {
    handleNotificationNavigation(initialNotification);
  }
};

// Notification opened handler (app background)
export const setupNotificationOpenedHandler = () => {
  return messagingInstance.onNotificationOpenedApp(handleNotificationNavigation);
};

const handleNotificationNavigation = (remoteMessage) => {
  // Handle navigation based on notification data
};