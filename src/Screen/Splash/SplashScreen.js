import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, Image} from 'react-native';
import {colors} from '../../Utils/Colors';
import {styles} from './SplashStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../Service/slices/authSlice';
import {horizontalScale, verticalScale} from '../../Utils/Metrics';
import {getSessionToken} from '../../Hooks/useAuth';
import {setTenantToken} from '../../Service/slices/tenant/clientAuthSlice';
import { fetchVersionDetails } from '../../Service/slices/versionSlice';

function SplashScreen(props) {
  const dispatch = useDispatch();

  const move = async () => {
    const value = await AsyncStorage.getItem('userToken');
    const client = await getSessionToken();
    const parseValue = JSON.parse(value);
    console.log('parseValue: ',parseValue);
 const userId = parseValue?.userId;
 console.log('userId:', userId); 


    setTimeout(() => {
      if (parseValue !== null) {
        // Dispatch user data and navigate based on userType
        dispatch(setUserData(parseValue));
        if (parseValue.userType === 'Admin') {
          props.navigation.replace('Drawer')
        }  else {
          // Fallback or additional role-based navigation
          props.navigation.replace('SwitchRole');
        }
      } else if (client !== null) {
        // For tenant login
        dispatch(setTenantToken(client));
      } else {
        props.navigation.replace('SwitchRole');
      }
    }, 3000);
  };

  useEffect(() => {
    move();
    dispatch(fetchVersionDetails());
  }, []);

  return (
    <SafeAreaView style={styles.Container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <Image
        source={require('../../Assets/Photos/logo.png')}
        style={{
          height: verticalScale(120),
          width: horizontalScale(200),
        }}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

export default SplashScreen;
