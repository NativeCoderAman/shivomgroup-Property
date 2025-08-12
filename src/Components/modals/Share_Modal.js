import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { colors } from '../../Utils/Colors';
import moment from 'moment';
import PickerCard from '../cards/PickerCard';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { shareRegistrationFormThunkAPI } from '../../Service/api/thunks';
import Share from 'react-native-share';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  shareType: Yup.string().required('Share selection is required'),
  shareEmail: Yup.string().email('Email must be a valid email').nullable(),
});

const Share_Modal = ({ isVisible, onClose, studentId }) => {
  const INITIAL_DATA = {
    shareType: null,
    shareEmail: null,
    ShareMobile: null,
  };
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.root.auth.userData);
  const handleSubmit = values => {
    let params;
    if (values.shareType === 'mobile') {
      delete values.shareEmail;
    } else {
      delete values.ShareMobile;
    }
    if (studentId) {
      params = {
        ...values,
        wantTo: 'update',
        studentId: JSON.stringify(studentId),
      };
    } else {
      params = {
        ...values,
        wantTo: 'store',
      };
    }

    dispatch(shareRegistrationFormThunkAPI(params))
      .then(res => {
        if (res?.payload?.status === true) {
          if (values.shareType === 'mobile' && values.ShareMobile) {
            onClose();
            const shareOptions = {
              title: 'Reminder',
              message: `🌟 Welcome to ${user.businessName} - Your Home Away From Home! \n\n 🏡✨ Click below to complete your registration to join our family and start your journey with us. 👇 \n\n  ${res?.payload?.data?.registerFormLink} \n\n 🚀 Excited to have you with us! 🤗🤗🎉 \n\n Best Regards, \n Your ${user.businessName}  Team `,
              social: Share.Social.WHATSAPP,
              whatsAppNumber: `91${values.ShareMobile}`,
            };
            let url = `whatsapp://send?phone=+91${values.ShareMobile
              }&text=${encodeURIComponent(shareOptions.message)}`;
            try {
              Linking.openURL(url).catch(err =>
                alertMessage('An error occurred'),
              );
            } catch (error) {
            }

          } else {
            onClose();
            ToastAndroid.show('Registration Link shared successfully', 5000);
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            res?.payload?.error,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25, // X offset
            50, // Y offset
          );
        }
      })
      .catch(err => {
        ToastAndroid.show('Something went wrong!' + err, 5000);
      });
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.modalContainer}>
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>Share Form</Text>
          <View style={styles.content}>
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
                errors,
                touched,
              }) => (
                <>
                  <View>
                    <View style={[styles.inputView, { paddingHorizontal: 0 }]}>
                      <Picker
                        dropdownIconColor={colors.grey}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.grey,
                          color: colors.grey,
                          fontSize: moderateScale(10),
                          // height: 30,
                          marginTop: verticalScale(-5),
                        }}
                        selectedValue={values?.shareType}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({ ...values, shareType: itemValue });
                        }}>
                        <Picker.Item label='Select Share Type' value='' />
                        <Picker.Item label='Mobile' value='mobile' />
                        <Picker.Item label='Email' value='email' />
                      </Picker>
                    </View>
                    {errors.shareType && touched.shareType ? (
                      <Text style={styles.error}>{errors.shareType}</Text>
                    ) : null}
                  </View>
                  {values.shareType === 'email' ? (
                    <View>
                      <View style={styles.inputView}>
                        <TextInput
                          onChangeText={handleChange('shareEmail')}
                          value={values.shareEmail}
                          placeholder="Email"
                          placeholderTextColor={colors.grey}
                          style={styles.text}
                        />
                      </View>
                      {errors.shareEmail && touched.shareEmail ? (
                        <Text style={styles.error}>{errors.shareEmail}</Text>
                      ) : null}
                    </View>
                  ) : null}
                  {values.shareType === 'mobile' ? (
                    <View>
                      <View style={styles.inputView}>
                        <TextInput
                          onChangeText={handleChange('ShareMobile')}
                          value={values.ShareMobile}
                          placeholder="Enter Mobile Number"
                          placeholderTextColor={colors.grey}
                          keyboardType="numeric"
                          maxLength={10}
                          style={styles.text}
                        />
                      </View>
                      {errors.ShareMobile && touched.ShareMobile ? (
                        <Text style={styles.error}>{errors.ShareMobile}</Text>
                      ) : null}
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={[styles.text, { color: colors.white }]}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name={'xmark'} size={15} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Share_Modal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    top: verticalScale(20),
    padding: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(20),
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
  dateButton: {
    height: verticalScale(50),
    width: '100%',
    borderRadius: horizontalScale(4),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    borderWidth: 1,
    borderColor: colors.grey,
  },
  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(-5),
    top: verticalScale(-8),
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
