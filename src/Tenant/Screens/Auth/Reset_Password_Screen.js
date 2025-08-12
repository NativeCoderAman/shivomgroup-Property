import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';

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
import {
  createStudentPasswordThunkAPI,
  tenantResetStudentPasswordThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';
import Loader from '../../../Utils/Loader';
import CopyRigthMessage from '../../../Components/common/CopyRigthMessage';

const validationSchema = Yup.object().shape({
  // state: Yup.string().required('State is required'),
  // city: Yup.string().required('City is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
    ),
  confirm_password: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
const Reset_Password_Screen = ({navigation, route}) => {
  const studentID = route?.params?.id;
  const INITIAL_DATA = {
    password: null,
    confirm_password: null,
  };
  const dispatch = useDispatch();
  const {error, loading} = useSelector(
    state => state?.root?.clientAuth?.tenantResetStudentPasswordResponse,
  );

  const handleSubmit = async values => {
    try {
      const res = await dispatch(
        tenantResetStudentPasswordThunkAPI({
          id: studentID,
          data: {password: values?.password},
        }),
      );
      if (res?.payload?.status === true) {
       
        alertMessage('Password Reset Successfully');
        navigation.navigate('TenantLogin');

      } else {
        alertMessage('Something went wrong');
      }
    } catch (error) {
      alertMessage('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      {/* <ScrollView
      contentContainerStyle={{
         justifyContent: 'center',
        alignItems: 'center',
      }}> */}
      <View style={styles.card}>
        <View style={styles.imgbxstyle}>
          <Image
            source={require('../../../Assets/Photos/logo.png')}
            style={styles.img}
          />
        </View>
        <View>
          <Text
            style={[
              styles.altext,
              {
                alignSelf: 'center',
                fontSize: moderateScale(16),
                fontFamily: 'Roboto-Medium',
                textTransform: 'uppercase',
              },
            ]}>
            Reset Password
          </Text>
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
              <View style={styles.inputcard}>
                <Text style={styles.inptitle}>Password</Text>
                <View style={styles.bax}>
                  <TextInput
                    name={'password'}
                    value={values.password}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.txtgrey}
                    onChangeText={text => {
                      setValues({...values, password: text});
                    }}
                    returnKeyType="next"
                    style={styles.inputStyle}
                  />
                </View>
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
              </View>
              <View style={styles.inputcard}>
                <Text style={styles.inptitle}>Confirm Password</Text>
                <View style={styles.bax}>
                  <TextInput
                    name={'confirm_password'}
                    value={values.confirm_password}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.txtgrey}
                    onChangeText={text => {
                      setValues({...values, confirm_password: text});
                    }}
                    returnKeyType="done"
                    style={styles.inputStyle}
                  />
                </View>
                {errors.confirm_password && touched.confirm_password ? (
                  <Text style={styles.error}>{errors.confirm_password}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                <Text style={styles.textstyle}>{'Submit'}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
      {/* </ScrollView> */}
      <CopyRigthMessage />
    </SafeAreaView>
  );
};

export default Reset_Password_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // marginTop: '10%',
    // height:'75%',
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
  error: {
    fontSize: moderateScale(14),
    color: colors.red,
    fontFamily: 'Roboto-Regular',
    // alignSelf: 'center',
  },
});
