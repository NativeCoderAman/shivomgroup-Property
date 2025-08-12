import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
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
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {useDispatch} from 'react-redux';
import StarRatigs from '../cards/StarRatigs';
import {deleteEmployesThunkAPI} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  payment_terms_rating: Yup.number()
    .required('Payment Rating is required')
    .max(5, 'Pyment Rating should be maximum 5'),
  tenant_behavior_rating: Yup.number()
    .required('Behaviour Rating is required')
    .max(5, 'Behaviour Rating should be maximum 5'),
  responsibilities_rating: Yup.number()
    .required('Responsible Rating is required')
    .max(5, 'Responsible Rating should be maximum 5'),
});
const DeleteEmployee_Modal = ({isVisible, onClose, id}) => {
  const INITIAL_DATA = {
    payment_terms_rating: null,
    tenant_behavior_rating: null,
    responsibilities_rating: null,
    additional_comments: null,
  };
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = values => {
    // Handle form submission here
    dispatch(deleteEmployesThunkAPI({id: id, data: values}))
      .then(res => {
        if (res?.payload?.status === true) {
          alertMessage(res?.payload?.message);
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
          <Text style={styles.title}>Delete Employee</Text>
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
                  {/* <View>
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
                  </View> */}
                  <View styles={{gap: verticalScale(10)}}>
                    <Text style={styles.inputTitle}>Payment Rating</Text>
                    <StarRatigs
                      rating={values?.payment_terms_rating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          payment_terms_rating: selectedRating,
                        });
                      }}
                    />

                    {errors.payment_terms_rating &&
                    touched.payment_terms_rating ? (
                      <Text style={styles.error}>
                        {errors.payment_terms_rating}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>Behaviour Rating</Text>
                    <StarRatigs
                      rating={values?.tenant_behavior_rating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          tenant_behavior_rating: selectedRating,
                        });
                      }}
                    />

                    {errors.tenant_behavior_rating &&
                    touched.tenant_behavior_rating ? (
                      <Text style={styles.error}>
                        {errors.tenant_behavior_rating}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>
                      Responsible Their Duty Rating
                    </Text>
                    <StarRatigs
                      rating={values?.responsibilities_rating}
                      onStarPress={selectedRating => {
                        setValues({
                          ...values,
                          responsibilities_rating: selectedRating,
                        });
                      }}
                    />
                    {errors.responsibilities_rating &&
                    touched.responsibilities_rating ? (
                      <Text style={styles.error}>
                        {errors.responsibilities_rating}
                      </Text>
                    ) : null}
                  </View>

                  <TextInput
                    placeholder="Additional Comment"
                    value={values.additional_comments}
                    onChangeText={handleChange('additional_comments')}
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

export default DeleteEmployee_Modal;

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
