import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useRef, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import { colors } from '../../../Utils/Colors';
import { fontSize } from '../../../Utils/Size';
import {
  checkStudentPasswordIsCreatedOrNotThunkAPI,
  studentLoginThunkAPI,
} from '../../../Service/api/thunks';
import { loginClient } from '../../../Hooks/useAuth';
import Loader from '../../../Utils/Loader';
import CopyRigthMessage from '../../../Components/common/CopyRigthMessage';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('User Name is required'),
  password: Yup.string().required('Password is required'),
});
const Tenant_Login_Screen = ({ navigation }) => {
  const INITIAL_DATA = {
    username: null,
    password: null,
  };
  const dispatch = useDispatch();
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const [showPassword, setShowPassword] = useState(true);
  const { error, loading } = useSelector(
    state => state?.root?.clientAuth?.studentLoginResponse,
  );

  const handleSubmit = async values => {
    try {
      const res = await dispatch(studentLoginThunkAPI(values));
      console.log('tenant login response:',res.payload);
      if (res?.payload?.status === true) {
        const user = res?.payload;
        const data = JSON.stringify({
          token: res?.payload?.token,
          studentID: res?.payload?.studentRegister,
          userType: res?.payload?.userType,
          id: res?.payload?.studentData?.id,
          hostelStatus: res?.payload?.hostelStatus,
          mobileNumber: res?.payload?.studentData?.mobile_no,
        });
        dispatch(loginClient(data))
          .then(res => {
            if (user?.hostelStatus === 0) {
              navigation.replace('TenantBottomNavigation');
            } else if (user?.hostelStatus === 1) {

              navigation.replace('Tenant_Auth', {
                screen: 'Tenant_Details',
                params: {
                  id: user?.studentData?.id,
                  mobileNumber: user?.studentData?.mobile_no,
                },
              });
            } else if (user?.hostelStatus === 2) {
              navigation.replace('TenantBottomNavigation');
            } else {
              navigation.replace('TenantBottomNavigation');
            }
          })
          .catch(err => {
            navigation.goBack();
          });
      } else {
        showMessage({
          message: 'Login Failed',
          description: res?.payload?.message,
          type: 'danger',
          icon: 'danger',
          duration: 3000,
          floating: true,
          position: 'top',
        });
      }
    } catch (error) {
      showMessage({
        message: 'Login Failed',
        description: 'Something went wrong, try again',
        type: 'info',
        icon: 'info',
        duration: 3000,
        floating: true,
        position: 'top',
      });
    }
  };

  const checkIsPasswordCreated = username => {
    // Remove any spaces from input
    const trimmedusername = username.replace(/\s/g, '');

    dispatch(checkStudentPasswordIsCreatedOrNotThunkAPI(trimmedusername))
      .then(res => {
        const { status, wantToCreatePassword, studentId } = res?.payload || {};
        if (status && wantToCreatePassword) {
          Alert.alert(
            'Password',
            'You have not created your password yet, please create your password',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Create',
                onPress: () =>
                  navigation.navigate('Tenant_Create_Password', {
                    id: studentId,
                  }),
              },
            ],
          );
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <View style={styles.card}>
          <View style={styles.imgbxstyle}>
            <Image
              source={require('../../../Assets/Photos/logo.png')}
              style={styles.img}
            />
          </View>

          <Formik
            initialValues={INITIAL_DATA}
            validationSchema={validationSchema}
            onSubmit={values => handleSubmit(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setValues,
              touched,
              errors,
            }) => (
              <>
                {error && (
                  <Text style={[styles.error, { alignSelf: 'center' }]}>
                    {error}
                  </Text>
                )}
                <View style={styles.inputcard}>
                  <Text style={styles.inptitle}>USER NAME</Text>
                  <View style={styles.bax}>
                    <TextInput
                      ref={inputRef1}
                      name={'userName'}
                      value={values.username}
                      placeholder="Enter your Email or Mobile number"
                      placeholderTextColor={colors.grey}
                      onChangeText={text => {
                        setValues({ ...values, username: text });
                        if (text.length == 10) {
                          checkIsPasswordCreated(text);
                        }
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        inputRef2.current.focus();
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={styles.inputStyle}
                    />
                  </View>
                  {errors.username && touched.username ? (
                    <Text style={styles.error}>{errors.username}</Text>
                  ) : null}
                </View>

                <View style={styles.inputcard}>
                  <Text style={styles.inptitle}>PASSWORD</Text>
                  <View
                    style={[
                      styles.bax,
                      { flexDirection: 'row', alignItems: 'center' },
                    ]}>
                    <TextInput
                      ref={inputRef2}
                      name={'password'}
                      placeholder="Password"
                      secureTextEntry={showPassword}
                      placeholderTextColor={colors.grey}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      style={[styles.inputStyle, { width: '90%' }]}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{
                        height: verticalScale(30),
                        width: verticalScale(30),
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={15}
                        color={colors.black}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password ? (
                    <Text style={styles.error}>{errors.password}</Text>
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textstyle}>GUEST LOGIN </Text>
                  <Text
                    onPress={() => {
                      navigation.navigate('Tenant_Forget_Password');
                    }}
                    style={styles.textstyle}>
                    FORGOT PASSWORD ?
                  </Text>
                </View>

                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <Text style={styles.textstyle}>Login</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.altext}>Don't have an account?</Text>
            <Text
              onPress={() => {
                navigation.navigate('TenantRegister');
              }}
              style={styles.loginText}>
              SignUp
            </Text>
          </View>
        </View>
        <CopyRigthMessage />

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default Tenant_Login_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    verticalAlign: 'middle',
    backgroundColor: colors.white,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    gap: 15,
    paddingVertical: 20,
    elevation: 2,
  },
  imgbxstyle: {
    height: verticalScale(100),
    width: horizontalScale(160),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  inputcard: {
    gap: 5,
  },
  inptitle: {
    fontSize: fontSize.lable,
    color: colors.black,
    fontFamily: 'Roboto-Regular',
  },
  bax: {
    width: '100%',
    height: verticalScale(50),
    elevation: 2,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.white,
  },
  inputStyle: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
  },

  btn: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btn,
    borderRadius: 4,
  },
  textstyle: {
    fontSize: fontSize.lable,
    color: colors.black,
    fontFamily: 'Roboto-Regular',
  },
  altext: {
    color: '#000',
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Regular',
    marginVertical: verticalScale(5),
  },
  loginText: {
    color: '#000',
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
    marginHorizontal: horizontalScale(6),

  },
  error: {
    fontSize: moderateScale(14),
    color: colors.red,
    fontFamily: 'Roboto-Regular',
  },
});
