import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {colors} from '../../Utils/Colors';
import {fontSize} from '../../Utils/Size';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../../Service/slices/authSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleUserHostelAPI} from '../../Service/slices/GetUserHostelSlice';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Loader from '../../Utils/Loader';
import {loginUserThunkAPI} from '../../Service/api/thunks';
import {showMessage} from 'react-native-flash-message';
import CopyRigthMessage from '../../Components/common/CopyRigthMessage';

const validationSchema = Yup.object().shape({
  userType: Yup.string().required('User Type is required'),
  businessName: Yup.string().required('Bussiness Name is required'),
  username: Yup.string().required('User Name is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
    ),
});

const LoginScreen = props => {
  const INITIAL_DATA = {
    userType: 'Admin',
    businessName: null,
    username: null,
    password: null,
  };
  const dispatch = useDispatch();
  const status = useSelector(state => state.root);

  const loading = useSelector(state => state?.root.auth.loading);
  const error = useSelector(state => state?.root.auth.error);
  const LoginResult = useSelector(state => state?.root.auth.loginResponse);
  // const hostelNames = useSelector(state => state?.root.hostelNames.data);
  const [hostelNames, setHostelNames] = useState([]);
  const [userBussiness, setUserBussiness] = useState(null);
  const [userData, setUserdata] = useState(INITIAL_DATA);
  const [showPassword, setShowPassword] = useState(true);

  const handleChange = useCallback(field => {
    setUserdata(prev => {
      return {...prev, ...field};
    });
  });
  const handleSubmit = async values => {
    try {
      let res = await dispatch(loginUserThunkAPI(values));
      if (res?.payload?.status === true) {
        console.log('login response data:',res.payload.data);
        await AsyncStorage.setItem(
          'userToken',
          JSON.stringify(res.payload.data),
        );
        dispatch(setUserData(res.payload.data));
        if (res.payload.data.userType === 'Admin') {
          props.navigation.replace('Drawer');
        } else {
          console.log('else')
        }
      } else if (
        res?.payload?.status === false &&
        res.payload.statusCode === 401
      ) {
        showMessage({
          message: 'Failed',
          description: res.payload.message,
          type: 'danger',
          icon: 'danger',
          floating: true,
          position: 'top',
          duration: 3000,
        });
      } else if (res?.error?.message === 'Network Error') {
        showMessage({
          message: 'Failed',
          description: 'Network Error ,Check your network',
          type: 'danger',
          icon: 'danger',
          floating: true,
          position: 'top',
          duration: 3000,
        });
      } else {
        showMessage({
          message: 'Failed',
          description: res.payload.message,
          type: 'danger',
          icon: 'danger',
          floating: true,
          position: 'top',
          duration: 5000,
        });
      }
    } catch (error) {}
  };

  const getHostels = async (text, userType) => {
    if (text.length === 0 && userType.length === 0) {
      return;
    }
    const isNumeric = /^\d+$/;
    if (isNumeric.test(text)) {
      if (text.length === 10) {
        try {
          const res = await dispatch(
            handleUserHostelAPI({phoneNumber: text, userType}),
          );
          // Check for status 200
          if (res?.payload.status === true && res?.payload.statusCode === 200) {
            setHostelNames(res?.payload?.data?.businessList || []);
          } else {
            showMessage({
              message: 'Failed',
              description: 'No hostel found for this number',
              type: 'danger',
              icon: 'danger',
              floating: true,
              position: 'top',
              duration: 3000,
            });
            setHostelNames([]); // Clear hostel names in case of failure
          }
        } catch (error) {
          // Handle network error
          if (!error.response) {
            showMessage({
              message: 'Network Error',
              description: 'Please check your internet connection.',
              type: 'danger',
              icon: 'danger',
              floating: true,
              position: 'top',
              duration: 3000,
            });
          } else {
          }
        }
      }
    } else {
      if (text.length >= 11) {
        try {
          const res = await dispatch(handleUserHostelAPI(text));
          setHostelNames(res?.payload?.data?.businessList || []);
        } catch (error) {
          if (!error.response) {
            showMessage({
              message: 'Network Error',
              description: 'Please check your internet connection.',
              type: 'danger',
              icon: 'danger',
              floating: true,
              position: 'top',
              duration: 3000,
            });
          } else {
          }
        }
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Loader loading={loading} />
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <KeyboardAvoidingView
          style={{
            backgroundColor: colors.white,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          {/* <ScrollView style={{height: 'auto'}}> */}
          <View style={styles.card}>
            <View style={styles.imgbxstyle}>
              <Image
                source={require('../../Assets/Photos/logo.png')}
                style={styles.img}
              />
            </View>
            {/* {error && (
              <Text style={[styles.error, { alignSelf: 'center' }]}>{error}</Text>
            )} */}
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
                setFieldValue,
              }) => {
                useEffect(() => {
                  if (hostelNames.length > 0) {
                    setFieldValue('businessName', hostelNames[0]); // Set first value as default
                  }
                }, [hostelNames]);
                return (
                  <>
                    <View style={styles.inputcard}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.textstyle}>USER TYPE</Text>
                      </View>
                      <View style={[styles.bax, {paddingHorizontal: 0}]}>
                        <Picker
                          dropdownIconColor={colors.grey}
                          style={{
                            color: colors.txtgrey,
                            fontSize: moderateScale(10),
                            marginTop: verticalScale(-5),
                          }}
                          selectedValue={values.userType}
                          onValueChange={(itemValue, itemIndex) => {
                            setValues({...values, userType: itemValue});
                            getHostels(values.username, itemValue);
                          }}>
                          {['Admin', 'Manager', 'Warden', 'KitchenMaster']?.map(
                            (item, i) => {
                              return (
                                <Picker.Item
                                  key={i}
                                  label={item}
                                  value={item}
                                />
                              );
                            },
                          )}
                        </Picker>
                      </View>
                      {errors.userType && touched.userType ? (
                        <Text style={styles.error}>{errors.userType}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>USER NAME</Text>
                      <View style={styles.bax}>
                        <TextInput
                          name={'userName'}
                          value={values.username}
                          placeholder="User Name"
                          placeholderTextColor={colors.grey}
                          onChangeText={text => {
                            getHostels(text, values.userType);
                            setValues({...values, username: text});
                          }}
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.username && touched.username ? (
                        <Text style={styles.error}>{errors.username}</Text>
                      ) : null}
                    </View>
                    {hostelNames.length > 0 && hostelNames !== null && (
                      <View style={styles.inputcard}>
                        <Text style={styles.inptitle}>Select Hostels</Text>
                        <View style={[styles.bax, {paddingHorizontal: 0}]}>
                          <Picker
                            dropdownIconColor={colors.grey}
                            style={{
                              color: colors.txtgrey,
                              fontSize: moderateScale(10),
                              marginTop: verticalScale(-5),
                            }}
                            selectedValue={values.businessName}
                            onValueChange={(itemValue, itemIndex) => {
                              setValues({...values, businessName: itemValue});
                            }}>
                            {hostelNames.length > 0 &&
                              hostelNames?.map((item, i) => {
                                return (
                                  <Picker.Item
                                    key={i}
                                    label={item}
                                    value={item}
                                  />
                                );
                              })}
                          </Picker>
                        </View>
                        {errors.businessName && touched.businessName ? (
                          <Text style={styles.error}>
                            {errors.businessName}
                          </Text>
                        ) : null}
                      </View>
                    )}
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>PASSWORD</Text>
                      <View
                        style={[
                          styles.bax,
                          {flexDirection: 'row', alignItems: 'center'},
                        ]}>
                        <TextInput
                          name={'password'}
                          placeholder="Password"
                          secureTextEntry={showPassword}
                          placeholderTextColor={colors.grey}
                          value={values.password}
                          onChangeText={handleChange('password')}
                          style={[styles.inputStyle, {width: '90%'}]}
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
                      <Text style={styles.textstyle}>FORGOT PASSWORD ?</Text>
                    </View>

                    <TouchableOpacity
                      disabled={status.loading}
                      onPress={handleSubmit}
                      style={styles.btn}>
                      <Text style={styles.textstyle}>
                        {status.loading ? 'Loading...' : 'Login'}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }}
            </Formik>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.altext}>Don't have an account?</Text>
              <Text
                onPress={() => {
                  props.navigation.navigate('RegisterScreen');
                }}
                style={styles.loginText}>
                Register
              </Text>
            </View>
          </View>
          {/* </ScrollView> */}
          <CopyRigthMessage />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    // marginTop: '10%',
    // height:'75%',
    verticalAlign: 'middle',
    backgroundColor: '#808080aa',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    gap: 15,
    paddingVertical: 20,
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
    // height: verticalScale(75),
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
    // borderWidth: 1,
    // borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.white,
  },
  inputStyle: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
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
    fontSize: moderateScale(18),
    fontFamily: 'Roboto-Regular',
    marginHorizontal: horizontalScale(10),
  },
  error: {
    fontSize: moderateScale(14),
    color: colors.red,
    fontFamily: 'Roboto-Regular',
    // alignSelf: 'center',
  },
});
