import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';
import moment from 'moment';
import {Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {fontSize} from '../../Utils/Size';
import Header from '../../Components/headers/Header';
import alertMessage from '../../Utils/alert';
import {
  loginUserThunkAPI,
  logoutUserSessionThunkAPI,
} from '../../Service/api/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserData} from '../../Service/slices/authSlice';
import { showMessage } from 'react-native-flash-message';
import { ActivityIndicator } from 'react-native-paper';

const validationSchema = Yup.object().shape({
  userType: Yup.string().required('User Type is required'),
  businessName: Yup.string().required('Bussiness Name is required'),
  username: Yup.string().required('User Name is required'),
  password: Yup.string().required('Password is required'),
});

const BussinessLogin = ({navigation, route}) => {
  const user = route.params;
  const INITIAL_DATA = {
    userType: user?.userType,
    businessName: user?.businessName,
    username: user?.username,
    password: null,
  };
  const dispatch = useDispatch();
  const status = useSelector(state => state.root);
  const loading = useSelector(state => state?.root.auth.loading);
  const error = useSelector(state => state?.root.auth.error);
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmit = async values => {
    try {
      let res = await dispatch(loginUserThunkAPI(values));
      if (res.payload.status === true) {
        await AsyncStorage.clear();
        const jsonValue = JSON.stringify(res.payload.data);
        dispatch(logoutUserSessionThunkAPI(user?.userId));
        await AsyncStorage.setItem(
          'userToken',
          JSON.stringify(res.payload.data),
        );
        dispatch(setUserData(res.payload.data));
        alertMessage('Login Successfull');
        navigation.replace('Drawer');
      }
      else{
        showMessage({
          message: 'Failed',
          description: res.payload.message,
          type: 'danger',
          icon: 'danger',
          duration: 3000,
          floating: true,
          position: 'top',
        })
      }
    } catch (error) {
    }finally{}
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: verticalScale(12),
              backgroundColor: colors.grey,
              borderRadius: 4,
            }}>
            <Text style={[styles.textstyle, {color: colors.white}]}>
              {user?.businessName}
            </Text>
          </View>
          <View style={styles.card}>
            {error && (
              <Text style={[styles.error, {alignSelf: 'center'}]}>{error}</Text>
            )}
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
                        }}>
                        <Picker.Item label={'Select Users'} value={''} />
                        {['Admin', 'Manager', 'Warden']?.map((item, i) => {
                          return (
                            <Picker.Item key={i} label={item} value={item} />
                          );
                        })}
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
                        onChangeText={text => {
                          // getHostels(text);
                          setValues({...values, username: text});
                        }}
                        // onChange={getHostels}
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
                        {flexDirection: 'row', alignItems: 'center'},
                      ]}>
                      <TextInput
                        name={'password'}
                        placeholder="Password"
                        secureTextEntry={showPassword}
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

                  <TouchableOpacity
                    disabled={loading}
                    onPress={handleSubmit}
                    style={styles.btn}>
                    <Text style={styles.textstyle}>
                      {loading ? <ActivityIndicator size={20} color={colors.white} /> : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BussinessLogin;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '87%',
  },
  modalContainer: {
    width: '90%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    padding: horizontalScale(20),
    gap: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },

  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    // marginTop: verticalScale(20),
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  text: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.grey,
  },

  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(5),
    top: verticalScale(5),
  },
  card: {
    verticalAlign: 'middle',
    backgroundColor: '#808080aa',
    width: '100%',
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
    // width: '100%',
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
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
