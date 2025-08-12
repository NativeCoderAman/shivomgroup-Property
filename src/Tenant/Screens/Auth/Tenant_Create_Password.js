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
} from 'react-native';
import React, {useState} from 'react';

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
import {createStudentPasswordThunkAPI} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';
import Loader from '../../../Utils/Loader';
import CopyRigthMessage from '../../../Components/common/CopyRigthMessage';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirm_password: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Tenant_Create_Password = ({navigation, route}) => {
  const studentID = route?.params?.id;
  const INITIAL_DATA = {
    password: null,
    confirm_password: null,
  };
  const dispatch = useDispatch();
  const {error, loading} = useSelector(
    state => state?.root?.clientAuth?.createStudentPasswordResponse,
  );
  const passwordValidation = {
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false,
  };

  const [password, setPassword] = useState(passwordValidation);
  const [showPassword, setShowPassword] = useState(true);

  const validatePassword = passwordInput => {
    const newPasswordStatus = {...passwordValidation};

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(passwordInput);
    const hasLowerCase = /[a-z]/.test(passwordInput);
    const hasNumber = /[0-9]/.test(passwordInput);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordInput);

    newPasswordStatus.uppercase = hasUpperCase;
    newPasswordStatus.lowercase = hasLowerCase;
    newPasswordStatus.number = hasNumber;
    newPasswordStatus.specialChar = hasSpecialChar;
    newPasswordStatus.length = passwordInput.length >= minLength;
    passwordToggle(newPasswordStatus);
  };

  const passwordToggle = newPasswordStatus => {
    setPassword(newPasswordStatus);
  };

  // Move validatePassword outside of PasswordSchema

  const handleSubmit = async values => {
    if (Object.values(password).every(value => value === true)) {
      try {
        const res = await dispatch(
          createStudentPasswordThunkAPI({id: studentID, data: values}),
        );
        if (res?.payload?.status === true) {

          alertMessage('Password Created Successfully');
          navigation.navigate('TenantLogin');
        }else if(res?.payload?.status === false && res?.payload?.statusCode === 404)
        {
          alertMessage('Student login not found.');

        }else{
          alertMessage('Something went wrong.');
        }
      } catch (error) {
        alertMessage('Something went wrong.');

      }
    } else {
      Alert.alert('Failed', 'Should not follow all password rules.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
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
            Create Password
          </Text>
        </View>
        <Formik
          initialValues={INITIAL_DATA}
          validationSchema={validationSchema}
          onSubmit={values => handleSubmit(values)}>
          {({
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
                    placeholder="Password"
                    placeholderTextColor={colors.txtgrey}
                    onChangeText={text => {
                      setValues({...values, password: text});
                      validatePassword(text);
                    }}
                    returnKeyType="next"
                    style={styles.inputStyle}
                    maxLength={15}
                  />
                </View>
                {errors.password && touched.password ? (
                  <Text style={styles.error}>{errors.password}</Text>
                ) : null}
              </View>
              <View style={styles.inputcard}>
                <Text style={styles.inptitle}>Confirm Password</Text>
                <View
                  style={[
                    styles.bax,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <TextInput
                    name={'confirm_password'}
                    value={values.confirm_password}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.txtgrey}
                    onChangeText={text => {
                      setValues({...values, confirm_password: text});
                    }}
                    returnKeyType="done"
                    style={[styles.inputStyle,{flex:1}]}
                    maxLength={15}
                    secureTextEntry={showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{
                      height: verticalScale(40),
                      width: verticalScale(40),
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
                {errors.confirm_password && touched.confirm_password ? (
                  <Text style={styles.error}>{errors.confirm_password}</Text>
                ) : null}
              </View>

              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    Example: Pass@123.
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    size={12}
                    color={password.uppercase ? colors.green : colors.black}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    At least use one Uppercase letter.
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    size={12}
                    color={password.lowercase ? colors.green : colors.black}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    At least use lowercase letter.
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    size={12}
                    color={password.number ? colors.green : colors.black}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    At least use one digit.
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    size={12}
                    color={password.specialChar ? colors.green : colors.black}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    At least use one special character.
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    size={12}
                    color={password.length ? colors.green : colors.black}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 12,
                      marginLeft: 5,
                    }}>
                    Password minimum length should be 8.
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                <Text style={styles.textstyle}>{'Submit'}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

      </View>
      <CopyRigthMessage />
    </SafeAreaView>
  );
};

export default Tenant_Create_Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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
