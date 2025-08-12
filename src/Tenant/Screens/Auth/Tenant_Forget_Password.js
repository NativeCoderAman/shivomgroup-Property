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
import Loader from '../../../Utils/Loader';
import {tenantforgetStudentPasswordThunkAPI} from '../../../Service/api/thunks';
import {showMessage} from 'react-native-flash-message';
import CopyRigthMessage from '../../../Components/common/CopyRigthMessage';

const validationSchemaEmail = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
});

const validationSchemaMobile = Yup.object().shape({
  mobile: Yup.string().required('Mobile number is required'),
});

const Tenant_Forget_Password = ({navigation}) => {
  const INITIAL_DATA = {
    email: '',
    mobile: '',
  };
  const dispatch = useDispatch();
  const inputRef1 = useRef(null);
  const [selectedMethod, setSelectedMethod] = useState(true); // true for Email, false for Mobile

  const {error, loading} = useSelector(
    state => state?.root?.clientAuth?.tenantforgetStudentPasswordResponse,
  );

  const handleSubmit = values => {
    const payload = selectedMethod ? { email: values.email } : { mobile: values.mobile };
    dispatch(tenantforgetStudentPasswordThunkAPI(payload))
      .then(res => {
        if (res?.payload?.status === true) {
          showMessage({
            message: "Success",
            description: res?.payload?.message,
            type: "success",
            backgroundColor: "#28a745", // Custom background color
            color: "#fff", // Custom text color
            icon: 'success',
            duration: 3000, // 3 seconds
            floating: true,
            position: "top",
          });
          navigation.navigate('Verify_OTP_Screen', {contact: selectedMethod ? values?.email : values?.mobile});
        } else {
          showMessage({
            message: "Forget password fail",
            description: "The given contact information is not valid.",
            type: "danger",
            backgroundColor: "#dc3545", // Custom background color
            color: "#fff", // Custom text color
            icon: 'danger',
            duration: 3000, // 3 seconds
            floating: true,
            position: "top",
          });
        }
      })
      .catch(err => {
        showMessage({
          message: "Error",
          description: "Something went wrong!",
          type: "danger",
          backgroundColor: "#dc3545", // Custom background color
          color: "#fff", // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: "top",
        });
      });
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

        <View
          style={{
            flexDirection: 'row',
            gap: horizontalScale(12),
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => setSelectedMethod(true)}
            style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <View
              style={[
                styles.circle,
                { backgroundColor: selectedMethod ? colors.AppDefaultColor : colors.white },
              ]}>
              <Icon
                name={selectedMethod === true ? 'circle-check' : 'circle'}
                size={20}
                color={selectedMethod ? colors.white : colors.black}
              />
            </View>
            <Text style={styles.textstyle}>Email </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedMethod(false)}
            style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <View
              style={[
                styles.circle,
                { backgroundColor: !selectedMethod ? colors.AppDefaultColor : colors.white },
              ]}>
              <Icon
                name={selectedMethod === false ? 'circle-check' : 'circle'}
                size={20}
                color={!selectedMethod ? colors.white : colors.black}
              />
            </View>
            <Text style={styles.textstyle}>Mobile </Text>
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={INITIAL_DATA}
          validationSchema={selectedMethod ? validationSchemaEmail : validationSchemaMobile}
          onSubmit={values => handleSubmit(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
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
                <Text style={styles.inptitle}>{selectedMethod ? 'Email' : 'Mobile'}</Text>
                <View style={styles.bax}>
                  <TextInput
                    ref={inputRef1}
                    name={selectedMethod ? 'email' : 'mobile'}
                    value={selectedMethod ? values.email : values.mobile}
                    placeholder={`Enter your ${selectedMethod ? 'email' : 'mobile number'}`}
                    placeholderTextColor={colors.grey}
                    onChangeText={handleChange(selectedMethod ? 'email' : 'mobile')}
                    onBlur={handleBlur(selectedMethod ? 'email' : 'mobile')}
                    keyboardType={selectedMethod ? 'email-address' : 'phone-pad'}
                    returnKeyType="done"
                    style={styles.inputStyle}
                  />
                </View>
                {selectedMethod && errors.email && touched.email ? (
                  <Text style={styles.error}>{errors.email}</Text>
                ) : !selectedMethod && errors.mobile && touched.mobile ? (
                  <Text style={styles.error}>{errors.mobile}</Text>
                ) : null}
              </View>

              <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                <Text style={styles.textstyle}>{'Send OTP'}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={'arrow-left'} size={15} color={colors.black} />
          <Text
            onPress={() => navigation.navigate('TenantLogin')}
            style={styles.loginText}>
            Go Back
          </Text>
        </View>
      </View>
      <CopyRigthMessage />

    </SafeAreaView>
  );
};

export default Tenant_Forget_Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
  circle: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
  },
});