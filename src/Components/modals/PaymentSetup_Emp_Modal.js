import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import Share from 'react-native-share';
import DropDownPicker from 'react-native-dropdown-picker';
import {openPicker} from 'react-native-image-crop-picker';
import {createPaymentSetupThunkAPI} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Date selection is required'),
  monthly_payment: Yup.string().required('Mothly Payment is required'),
  leave_allowed: Yup.string().required('Leave Allowed is required'),
});
const PaymentSetup_Emp_Modal = ({isVisible, onClose, emp_id}) => {
  const INITIAL_DATA = {
    date: null,
    monthly_payment: null,
    leave_allowed: null,
  };
  const updateData = {
    date: null,
    monthly_payment: null,
    leave_allowed: null,
  };
  const {SalarySetupRecordResponse} = useSelector(
    state => state?.root?.employeeData,
  );


  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    setSelectedItem({
      value:
        SalarySetupRecordResponse?.response[
          SalarySetupRecordResponse?.response?.length - 1
        ]?.id,
      label:
        SalarySetupRecordResponse?.response[
          SalarySetupRecordResponse?.response?.length - 1
        ]?.date,
      leave_allowed:
        SalarySetupRecordResponse?.response[
          SalarySetupRecordResponse?.response?.length - 1
        ]?.leave_allowed,
      monthly_payment:
        SalarySetupRecordResponse?.response[
          SalarySetupRecordResponse?.response?.length - 1
        ]?.monthly_payment,
    });
  }, [SalarySetupRecordResponse?.response]);
  const [openPicker, setOpenPicker] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = values => {
    dispatch(createPaymentSetupThunkAPI({id: emp_id, data: values}))
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
      onBackdropPress={() => {
        onClose(), setIsUpdate(false);
      }}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Payment Setup</Text>
        <View style={styles.content}>
          <Formik
            enableReinitialize={true}
            initialValues={isUpdate ? updateData : INITIAL_DATA}
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
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Date'}</Text>
                  {isUpdate ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={[styles.inputView, styles.flexRowWithSpace]}>
                      <Text style={styles.text}>
                        {values?.date ? values?.date : 'Select Date'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                  ) : (
                    <DropDownPicker
                      open={openPicker}
                      value={selectedItem?.value}
                      items={SalarySetupRecordResponse?.response?.map(
                        (item, i) => ({
                          value: item?.id,
                          label: item?.date,
                          //   value: item?.date,
                          leave_allowed: item?.leave_allowed,
                          monthly_payment: item?.monthly_payment,
                        }),
                      )}
                      onSelectItem={
                        item => setSelectedItem(item)
                        // setValues({...values, date: item.value})
                      }
                      placeholder="Salary(per month)"
                      textStyle={styles.text}
                      scrollViewProps={{nestedScrollEnabled: true}}
                      autoScroll={true}
                      setOpen={setOpenPicker}
                      // setValue={setValue}
                      style={styles.inputView}
                      // setItems={setItems}
                      itemKey="value"
                      keyExtractor={item => item.value.toString()} // Ensure each item has a unique key
                      containerStyle={{}}
                    />
                  )}
                  {errors.date && touched.date ? (
                    <Text style={styles.error}>{errors.date}</Text>
                  ) : null}
                  <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={date => {
                      const formatDate = moment(date).format('DD-MMM-YYYY');
                      setValues({...values, date: formatDate});
                      setIsDatePickerVisible(false);
                    }}
                    onCancel={() => setIsDatePickerVisible(false)}
                  />
                </View>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Monthly Payment'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder={'Monthly Payment'}
                      placeholderTextColor={colors.grey}
                      value={
                        isUpdate
                          ? values.monthly_payment
                          : String(selectedItem?.monthly_payment)
                      }
                      onChangeText={handleChange('monthly_payment')}
                      style={styles.text}
                    />
                  </View>
                  {errors.monthly_payment && touched.monthly_payment ? (
                    <Text style={styles.error}>{errors.monthly_payment}</Text>
                  ) : null}
                </View>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Leave Allowed'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder={'Leave Allowed'}
                      placeholderTextColor={colors.grey}
                      value={
                        isUpdate
                          ? values.leave_allowed
                          : String(selectedItem?.leave_allowed)
                      }
                      onChangeText={handleChange('leave_allowed')}
                      style={styles.text}
                    />
                  </View>
                  {errors.leave_allowed && touched.leave_allowed ? (
                    <Text style={styles.error}>{errors.leave_allowed}</Text>
                  ) : null}
                </View>

                {isUpdate ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setIsUpdate(true),
                        setValues({
                          date: null,
                          monthly_payment: null,
                          leave_allowed: null,
                        });
                    }}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      Update
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </Formik>
        </View>

        <TouchableOpacity
          onPress={() => {
            onClose(), setIsUpdate(false);
          }}
          style={styles.closeButton}>
          <Icon name={'xmark'} size={15} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default PaymentSetup_Emp_Modal;

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
  flexRowWithSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(6),
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
  inputTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    color: colors.black,
  },
  text: {
    fontSize: moderateScale(12),
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
    right: verticalScale(5),
    top: verticalScale(8),
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
