import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../../Screen/Splash/SplashScreen';
import SwitchRole from '../../Screen/Auth/SwitchRole';
import LoginScreen from '../../Screen/Auth/LoginScreen.js';
import RegisterScreen from '../../Screen/Auth/RegisterScreen';

import DrawerNavigation from '../DrawerNavigation/DrawerNavigation';

import Tenant_Login_Screen from '../../Tenant/Screens/Auth/Tenant_Login_Screen';
import Tenant_Register_Screen from '../../Tenant/Screens/Auth/Tenant_Register_Screen';
import Tenant_Forget_Password from '../../Tenant/Screens/Auth/Tenant_Forget_Password';
import Verify_OTP_Screen from '../../Tenant/Screens/Auth/Verify_OTP_Screen';
import Reset_Password_Screen from '../../Tenant/Screens/Auth/Reset_Password_Screen';
import Tenant_Create_Password from '../../Tenant/Screens/Auth/Tenant_Create_Password';
import Tenant_Details from '../../Tenant/Screens/Auth/Tenant_Details';


const Stack = createNativeStackNavigator();

import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import SettlementsScreen from '../../Screen/payments/SettlementScreen';
import Profile_Screen from '../../Screen/Profile/Profile_Screen';
import NotificationScreen from '../../Screen/Profile/NotificationScreen';
import Permissions_Screen from '../../Screen/Profile/Permissions_Screen';
import RoomViewScreen from '../../Screen/OnlineBusiness/RoomViewScreen';
import EditRoom from '../../Screen/OnlineBusiness/EditRoom';
import BusinessProfile from '../../Screen/OnlineBusiness/BusinessProfile';

function MainNavigation(props) {
  async function requestUserPermission() {
    // Request Firebase Notification Permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // Request Android 13+ Notification Permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);



  


  const Tenant_Auth = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // animation: 'flip',
        }}
        initialRouteName="TenantLogin">
        <Stack.Screen name="TenantLogin" component={Tenant_Login_Screen} />

        <Stack.Screen
          name="TenantRegister"
          component={Tenant_Register_Screen}
        />

        <Stack.Screen
          name="Tenant_Create_Password"
          component={Tenant_Create_Password}
        />
        <Stack.Screen name="Tenant_Details" component={Tenant_Details} />
        <Stack.Screen
          name="Tenant_Forget_Password"
          component={Tenant_Forget_Password}
        />
        <Stack.Screen name="Verify_OTP_Screen" component={Verify_OTP_Screen} />
        <Stack.Screen
          name="Reset_Password_Screen"
          component={Reset_Password_Screen}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Business Profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen name="SwitchRole" component={SwitchRole} />

        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        <Stack.Screen name="Tenant_Auth" component={Tenant_Auth} />

 <Stack.Screen name="Profile_Screen" component={Profile_Screen} />
  
  <Stack.Screen name="Permissions_Screen" component={Permissions_Screen} />



       <Stack.Screen name="NotificationScreen" component={NotificationScreen} />

              <Stack.Screen name="RoomViewScreen" component={RoomViewScreen} />
                 <Stack.Screen name="EditRoom" component={EditRoom} />

                                  <Stack.Screen name="Business Profile" component={BusinessProfile} />







        {/* <Stack.Screen
          name="TenantBottomNavigation"
          component={TenantBottomNavigation}
        />

        <Stack.Screen
          name="KitchenMasNavigaton"
          component={KitchenMasNavigaton}
          options={{headerShown: false}}
        /> */}

        <Stack.Screen
          name="Drawer"
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MainNavigation;
