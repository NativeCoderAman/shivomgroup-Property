import * as Keychain from 'react-native-keychain';
import {
  clearTenantSession,
  setTenantToken,
} from '../Service/slices/tenant/clientAuthSlice';
import alertMessage from '../Utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logOut} from '../Service/slices/authSlice';
import {navigationRef} from '../Helper/navigationRef';

export const loginClient = token => async dispatch => {
  try {
    await Keychain.setGenericPassword('clientToken', token);
    const data = JSON.parse(token);
    dispatch(setTenantToken(data));
  } catch (error) {}
};

export const logoutClient = () => async dispatch => {
  try {
    // Remove the stored token from react-native-keychain
    await Keychain.resetGenericPassword();
    await AsyncStorage.clear();

    // Clear the session state in Redux
    dispatch(clearTenantSession());
    dispatch(logOut());

    // Use navigationRef to navigate
    navigationRef.current?.navigate('SwitchRole');
  } catch (error) {
    // Handle logout error
    alertMessage(error);
  }
};

// logOutUser just triggers the logoutClient function, passing in the dispatch.
export const logOutUser = dispatch => {
  dispatch(logoutClient());
};

export const getSessionToken = async userType => {
  try {
    const credentials = await Keychain.getGenericPassword();
    const data = JSON.parse(credentials.password);
    if (credentials && credentials.username === 'clientToken') {
      return data; // The token
    }
  } catch (error) {}
  return null;
};
