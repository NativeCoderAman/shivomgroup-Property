import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
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
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {colors} from '../../Utils/Colors';
import moment from 'moment';
import PickerCard from '../cards/PickerCard';
import {Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {deleteMainRegisterThunkAPI} from '../../Service/api/thunks';
import {useDispatch} from 'react-redux';
import {handleBasicRegisterDetails, handleRegistrationListAPI} from '../../Service/slices/RegisterSlice';
import StarRatigs from '../cards/StarRatigs';

const validationSchema = Yup.object().shape({
  leavingDate: Yup.date().required('Leaving Date is required'),
  paymentRating: Yup.number()
    .required('Payment Rating is required')
    .max(5, 'Pyment Rating should be maximum 5'),
  behaviourRating: Yup.number()
    .required('Behaviour Rating is required')
    .max(5, 'Behaviour Rating should be maximum 5'),
  responsibleRating: Yup.number()
    .required('Responsible Rating is required')
    .max(5, 'Responsible Rating should be maximum 5'),
});

const DeleteMainStudentModal = ({
  isVisible,
  onClose,
  id,
  isBookingVisible,
  setIsBookingVisible,
}) => {
  const INITIAL_DATA = {
    leavingDate: null,
    paymentRating: null,
    behaviourRating: null,
    responsibleRating: null,
    AdditionCommant: null,
  };
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = values => {
    // Handle form submission here
    dispatch(deleteMainRegisterThunkAPI({id, values}))
      .then(res => {
        if (res?.payload?.status === true) {
          dispatch(handleBasicRegisterDetails());
          dispatch(handleRegistrationListAPI());
          ToastAndroid.show(res?.payload?.message, 5000, 50);
          onClose();
        } else {
          onClose();
          ToastAndroid.showWithGravityAndOffset(
            'Something went wrong!',
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
        <View style={{padding: 20}}>
          <Text style={styles.title}>Feedback Form</Text>
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
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={styles.dateButton}>
                      <Text style={styles.text}>
                        {values.leavingDate
                          ? values.leavingDate
                          : 'Leaving Date'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors.leavingDate && touched.leavingDate ? (
                      <Text style={styles.error}>{errors.leavingDate}</Text>
                    ) : null}
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, leavingDate: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                  </View>
                  <View styles={{gap: verticalScale(10)}}>
                    <Text style={styles.inputTitle}>Payment Rating</Text>
                    <StarRatigs
                      rating={values?.paymentRating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          paymentRating: selectedRating,
                        });
                      }}
                    />

                    {errors.paymentRating && touched.paymentRating ? (
                      <Text style={styles.error}>{errors.paymentRating}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>Behaviour Rating</Text>
                    <StarRatigs
                      rating={values?.behaviourRating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          behaviourRating: selectedRating,
                        });
                      }}
                    />

                    {errors.behaviourRating && touched.behaviourRating ? (
                      <Text style={styles.error}>{errors.behaviourRating}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>Responsible Rating</Text>
                    <StarRatigs
                      rating={values?.responsibleRating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          responsibleRating: selectedRating,
                        });
                      }}
                    />
                    {errors.responsibleRating && touched.responsibleRating ? (
                      <Text style={styles.error}>
                        {errors.responsibleRating}
                      </Text>
                    ) : null}
                  </View>

                  <TextInput
                    placeholder="Additional Comment"
                    value={values.AdditionCommant}
                    onChangeText={handleChange('additionalComment')}
                    placeholderTextColor={colors.grey}
                    multiline
                    numberOfLines={4}
                    style={[
                      styles.inputView,
                      {
                        verticalAlign: 'top',
                        height: verticalScale(100),
                        borderColor: 'gray',
                        borderWidth: 1,
                      },
                    ]}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      Submit
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

export default DeleteMainStudentModal;

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
  inputTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
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
