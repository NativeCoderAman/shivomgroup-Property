import { Platform, PermissionsAndroid } from 'react-native';
import { messagingInstance } from './firebase';

export const requestNotificationPermissions = async () => {

  let authorized = false;

  try {
    // 🔹 Check Android 13+ Notification Permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          return false; // ⚠️ Exiting early here
        }
      }
    }

    // 🔹 Request Firebase Messaging Permission
    const authStatus = await messagingInstance.requestPermission();

    authorized =
      authStatus === 1 ||  // AUTHORIZED
      authStatus === 2;   // PROVISIONAL


    if (!authorized) {
      return false; // ⚠️ Exiting early here
    }

    return true;

  } catch (error) {
    console.error('❌ Error in requestNotificationPermissions:', error);
    return false;
  }
};
