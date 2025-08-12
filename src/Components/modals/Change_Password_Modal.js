import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {changeUserPasswordThunkAPI} from '../../Service/api/thunks';
import {useDispatch, useSelector} from 'react-redux';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  old_password: Yup.string().required('Old Password is required'),
  password: Yup.string()
    .required('New Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
    ),
  password_confirmation: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Change_Password_Modal = ({isVisible, onClose}) => {
  const INITIAL_DATA = {
    userType: 'admin',
    old_password: null,
    password: null,
    password_confirmation: null,
  };
  const {userId} = useSelector(state => state.root.auth.userData);
  const dispatch = useDispatch();
  const handleSubmit = values => {
     // Handle form submission here
    dispatch(changeUserPasswordThunkAPI({id: userId, data: values}))
      .then(res => {
        
        if (res?.payload?.status === true) {
          alertMessage(res?.payload?.message);
          // dispatch(menuItemsViewThunkAPI());
          onClose();
        } else {
          alertMessage('Something went wrong!');
        }
      })
      .catch(err => {
        alertMessage('Something went wrong!');
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
        <View style={{padding: 20}}>
          <Text style={styles.title}>Change Password</Text>
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
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('old_password')}
                        value={values.old_password}
                        placeholder="Old Password"
                        placeholderTextColor={colors.grey}
                        editable={true}
                      />
                    </View>
                    {errors.old_password && touched.old_password ? (
                      <Text style={styles.error}>{errors.old_password}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('password')}
                        value={values.password}
                        placeholder="New Password"
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.password && touched.password ? (
                      <Text style={styles.error}>{errors.password}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('password_confirmation')}
                        value={values.password_confirmation}
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.password_confirmation &&
                    touched.password_confirmation ? (
                      <Text style={styles.error}>
                        {errors.password_confirmation}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    // disabled={loading}
                    onPress={handleSubmit}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      {'Submit'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(Change_Password_Modal);

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
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
