import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import {fontSize} from '../../../Utils/Size';
import {checkStudentPasswordIsCreatedOrNotThunkAPI, studentSingUpThunkAPI} from '../../../Service/api/thunks';
import Loader from '../../../Utils/Loader';
import {showMessage} from 'react-native-flash-message';
import CopyRigthMessage from '../../../Components/common/CopyRigthMessage';

const validationSchema1 = Yup.object().shape({
  hostelId: Yup.string().required('Hostel is required'),
  studentMobile: Yup.string()
    .required('Mobile Number is required')
    .length(10, 'Mobile Number must be exactly 10 digits') // Validate length
    .matches(/^\d{10}$/, 'Mobile Number must be a valid 10-digit number'),
});
const validationSchema2 = Yup.object().shape({
  first_name: Yup.string().required('First Name  is required'),
  last_name: Yup.string().required('Last Name is required'),
  studentMobile: Yup.number().required('Mobile Number is required'),
});

const Tenant_Register_Screen = ({navigation}) => {
  const INITIAL_DATA1 = {
    hostelId: null,
    studentMobile: null,
  };
  const INITIAL_DATA2 = {
    first_name: null,
    last_name: null,
    studentMobile: null,
  };
  const dispatch = useDispatch();
  const [isHostelMember, setIsHostelMember] = useState(true);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const [showPassword, setShowPassword] = useState(true);

  const {error, loading} = useSelector(
    state => state?.root?.clientAuth?.studentSingUpResponse,
  );

  const checkIsPasswordCreated = username => {
    const trimmedusername = username.replace(/\s/g, '');

    dispatch(checkStudentPasswordIsCreatedOrNotThunkAPI(trimmedusername))
      .then(res => {
        const {status, wantToCreatePassword, studentId} = res?.payload || {};
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

  const handleSubmit = async values => {
    const data = {};
    if (isHostelMember === false) {
      data['first_name'] = values.first_name;
      data['last_name'] = values.last_name;
      data['studentMobile'] = values.studentMobile;
    } else {
      data['hostelId'] = values.hostelId;
      data['studentMobile'] = values.studentMobile;
    }
    if (isHostelMember === false) {
      const res = await dispatch(studentSingUpThunkAPI(data));
      if (res?.payload?.status === true) {
        navigation.navigate('Tenant_Create_Password', {
          id: res?.payload?.student_login_id,
        });
        showMessage({
          message: 'Password',
          description: 'Create new password for login.',
          type: 'success',
          icon: 'success',
          duration: 3000,
          floating: true,
          position: 'top',
        });
      } else {
        showMessage({
          message: 'Registration failed!',
          description: 'The given mobile is already registered.',
          type: 'danger',
          icon: 'danger',
          duration: 3000,
          floating: true,
          position: 'top',
        });
      }
      return false;
    }
    try {
      const res = await dispatch(studentSingUpThunkAPI(data));
      if (res?.payload?.status === true) {
        showMessage({
          message: 'Password',
          description: 'Create new password for login.',
          type: 'success',
          icon: 'success',
          duration: 3000,
          floating: true,
          position: 'top',
        });

        navigation.navigate('Tenant_Create_Password', {
          id: res?.payload?.student_login_id,
        });
      } else {
        showMessage({
          message: 'Registration failed!',
          description: 'The given mobile is already registered.',
          type: 'danger',
          icon: 'danger',
          duration: 3000,
          floating: true,
          position: 'top',
        });
        // alertMessage('aman');
      }
    } catch (error) {
      showMessage({
        message: 'Registration failed!',
        description: 'Something went wrong!',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
        floating: true,
        position: 'top',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{flex: 1, justifyContent: 'center'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <View style={styles.card}>
          <View style={styles.imgbxstyle}>
            <Image
              source={require('../../../Assets/Photos/logo.png')}
              style={styles.img}
            />
          </View>
          <View>
            <Text style={[styles.altext, {alignSelf: 'center'}]}>
              Are you any hostel member?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: horizontalScale(12),
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsHostelMember(true);
                }}>
                <View
                  style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: isHostelMember
                          ? colors.AppDefaultColor
                          : colors.white,
                      },
                    ]}>
                    <Icon
                      name={isHostelMember === true ? 'circle-check' : 'circle'}
                      size={20}
                      color={isHostelMember ? colors.white : colors.black}
                    />
                  </View>
                  <Text style={styles.textstyle}>Yes </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsHostelMember(false);
                }}>
                <View
                  style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                  <View
                    style={[
                      styles.circle,
                      {
                        backgroundColor: !isHostelMember
                          ? colors.AppDefaultColor
                          : colors.white,
                      },
                    ]}>
                    <Icon
                      name={
                        isHostelMember === false ? 'circle-check' : 'circle'
                      }
                      size={20}
                      color={!isHostelMember ? colors.white : colors.black}
                    />
                  </View>
                  <Text style={styles.textstyle}>No </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
          <Formik
            initialValues={isHostelMember ? INITIAL_DATA1 : INITIAL_DATA2}
            validationSchema={
              isHostelMember ? validationSchema1 : validationSchema2
            }
            onSubmit={values => handleSubmit(values)}>
            {({handleSubmit, values, setValues, touched, errors}) => (
              <>
                {isHostelMember ? (
                  <>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>Hostel ID</Text>
                      <View style={[styles.bax]}>
                        <TextInput
                          name={'hostelId'}
                          value={values.hostelId}
                          placeholder="Hostel ID"
                          placeholderTextColor={colors.txtgrey}
                          onChangeText={text => {
                            setValues({...values, hostelId: text});
                          }}
                          // onChange={getHostels}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.hostelId && touched.hostelId ? (
                        <Text style={styles.error}>{errors.hostelId}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>Mobile Number</Text>
                      <View style={styles.bax}>
                        <TextInput
                          ref={inputRef1}
                          name={'studentMobile'}
                          value={values.studentMobile}
                          placeholder="Mobile Number"
                          placeholderTextColor={colors.txtgrey}
                          onChangeText={text => {
                            setValues({...values, studentMobile: text});
                            if (text.length == 10) {
                              checkIsPasswordCreated(text);
                            }
                          }}
                          // onChange={getHostels}
                          keyboardType="numeric"
                          returnKeyType="done"
                          maxLength={10}
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.studentMobile && touched.studentMobile ? (
                        <Text style={styles.error}>{errors.studentMobile}</Text>
                      ) : null}
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>First Name</Text>
                      <View style={styles.bax}>
                        <TextInput
                          ref={inputRef1}
                          name={'first_name'}
                          value={values.first_name}
                          placeholder="First Name"
                          placeholderTextColor={colors.txtgrey}
                          onChangeText={text => {
                            setValues({...values, first_name: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.first_name && touched.first_name ? (
                        <Text style={styles.error}>{errors.first_name}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>Last Name</Text>
                      <View style={styles.bax}>
                        <TextInput
                          ref={inputRef1}
                          name={'last_name'}
                          value={values.last_name}
                          placeholder="Last Name"
                          placeholderTextColor={colors.txtgrey}
                          onChangeText={text => {
                            setValues({...values, last_name: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.last_name && touched.last_name ? (
                        <Text style={styles.error}>{errors.last_name}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>Mobile Number</Text>
                      <View style={styles.bax}>
                        <TextInput
                          ref={inputRef1}
                          name={'studentMobile'}
                          value={values.studentMobile}
                          placeholder="Mobile Number"
                          placeholderTextColor={colors.txtgrey}
                          onChangeText={text => {
                            setValues({...values, studentMobile: text});
                          }}
                          // onChange={getHostels}
                          keyboardType="numeric"
                          returnKeyType="done"
                          maxLength={10}
                          style={styles.inputStyle}
                        />
                      </View>
                      {errors.studentMobile && touched.studentMobile ? (
                        <Text style={styles.error}>{errors.studentMobile}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputcard}>
                      <Text style={styles.inptitle}>Have a Refral Code ?</Text>
                      <View style={styles.bax}>
                        <TextInput
                          // name={'studentMobile'}
                          // value={values.studentMobile}
                          placeholder="Enter Refral Code"
                          placeholderTextColor={colors.txtgrey}
                          // onChangeText={text => {
                          //   setValues({...values, studentMobile: text});
                          // }}
                          returnKeyType="done"
                          style={styles.inputStyle}
                        />
                      </View>
                      {/* {errors.studentMobile && touched.studentMobile ? (
                      <Text style={styles.error}>{errors.studentMobile}</Text>
                    ) : null} */}
                    </View>
                  </>
                )}

                <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                  <Text style={styles.textstyle}>{'Submit'}</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.altext}>Already have an account?</Text>
            <Text
              onPress={() => {
                navigation.navigate('TenantLogin');
              }}
              style={styles.loginText}>
              Login
            </Text>
          </View>
        </View>
        <CopyRigthMessage />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Tenant_Register_Screen;

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
    borderWidth: 1,
    borderColor: colors.grey,
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
    fontFamily: 'Roboto-Medium',
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
  circle: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
  },
  error: {
    fontSize: moderateScale(14),
    color: colors.red,
    fontFamily: 'Roboto-Regular',
  },
});
