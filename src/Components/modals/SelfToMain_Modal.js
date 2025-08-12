import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { moderateScale, verticalScale, horizontalScale } from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../Utils/Colors';
import moment from 'moment';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetFormNo,
  GetRoomsListApi,
  GetSeatsListApi,
  getSelfRegisterStudentsThunkAPI,  
} from '../../Service/slices/RegisterSlice';
import { getStudentReviewsThunkAPI, selfStudentToMainRegisterThunkAPI } from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
GetSeatsListApi
getSelfRegisterStudentsThunkAPI
const validationSchema = Yup.object().shape({
  formNumber: Yup.string().required('Form Number is required'),
  roomNumber: Yup.string().required('Room Number is required'),
  seatNumber: Yup.string().required('Seat Number is required'),
  registrationDate: Yup.date().required('Registration Date is required'),
  adminNote: Yup.string(), // New field for admin notes
});

const SelfToMain_Modal = ({ isVisible, onClose, studentID, adharNumber, verifidModalRef, dataReferVerifiedData }) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStudentReviewData, setIsStudentReviewData] = useState(false);
  const dispatch = useDispatch();


  console.log('studentID',studentID?.aadharNumber);

  const { loading } = useSelector(state => state.root.registerData.switchRoomMainRegisterResponse);
  const { formNumberResponse, seatsListResponse, roomsListResponse } = useSelector(state => state.root.registerData);

  const INITIAL_DATA = {
    adharNumber: String(studentID?.aadharNumber),
    formNumber: String(formNumberResponse?.response?.formno),
    roomNumber: '',
    seatNumber: '',
    registrationDate: '',
    selfStudentId: studentID,
    adminNote: '', // Initialize admin note
  };


  const [studentData, setStudentData] = useState(INITIAL_DATA);
  useEffect(()=>{
    setStudentData(INITIAL_DATA);
  },[studentID]);
  
  useEffect(() => {
    dispatch(GetFormNo());
    dispatch(GetRoomsListApi());
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsStudentReviewData(false);
    }
  }, [isVisible]);
  

  useEffect(() => {
    setStudentData(prev => ({
      ...prev,
      formNumber: formNumberResponse?.response?.formno,
      selfStudentId: studentID,
    }));
  }, [formNumberResponse?.response?.formno]);

  const handleSubmit = async values => {
    try {
      const response = await dispatch(selfStudentToMainRegisterThunkAPI({ ...values, selfStudentId: studentID }));
      const status = response?.payload?.status;
  
      ToastAndroid.show(
        status ? response.payload.message : 'Seat is not Available!',
        5000
      );
  
      if (status) dispatch(getSelfRegisterStudentsThunkAPI());
      onClose();
    } catch (err) {
      ToastAndroid.show('Network Error! ' + err, 5000);
      console.log(err);
    }
  };
  
  const handleStudentVerify = async (data) => {
    console.log('aadhar review run:', data);
  
    try {
      const res = await dispatch(getStudentReviewsThunkAPI(data));
      console.log('aadhar review api response:', res.payload);
  
      if (res?.payload?.status === true) {
        dataReferVerifiedData({ isStudentReview: true, data: res?.payload?.data });
        setIsStudentReviewData(res?.payload?.data?.length !== 0);
        alertMessage('Successfully get review data');
      } else {
        alertMessage('Something went wrong!');
      }
    } catch (err) {
      console.log('aadhar review api error:', err);
      alertMessage('Something went wrong!');
    }
  };
  

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal} // Updated style for bottom sheet behavior
    >
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.title}>Registration Request</Text>
          <View style={styles.content}>
            <Formik
              initialValues={studentData}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}>
              {({ handleChange, handleBlur, handleSubmit, values, setValues, errors, touched }) => (
                <>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Adhar Card'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        value={values?.adharNumber}
                        placeholder="Aadhar Card"
                        placeholderTextColor={colors.grey}
                        editable={false}
                        style={styles.inputText}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ borderColor: isStudentReviewData ? colors.green : colors.AppDefaultColor }}
                      onPress={() => isStudentReviewData ? verifidModalRef() : handleStudentVerify(values?.adharNumber)}>
                      <Text style={{ color: isStudentReviewData ? colors.green : colors.AppDefaultColor }}>
                        Check Reviews
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Form Number'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        value={String(values?.formNumber)}
                        placeholder="Form Number"
                        placeholderTextColor={colors.grey}
                        editable={false}
                        style={styles.inputText}
                      />
                    </View>
                    {errors?.formNumber && touched?.formNumber && <Text style={styles.error}>{errors.formNumber}</Text>}
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Registration Date'}</Text>
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)} style={styles.dateButton}>
                      <Text style={styles.text}>
                        {values?.registrationDate ? values.registrationDate : 'Registration Date'}
                      </Text>
                      <Icon name="calendar" color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors?.registrationDate && touched?.registrationDate && (
                      <Text style={styles.error}>{errors.registrationDate}</Text>
                    )}
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        setValues({ ...values, registrationDate: moment(date).format('YYYY-MM-DD') });
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Room Number'}</Text>
                    <View style={[styles.inputView, { paddingHorizontal: 0 }]}>
                      <Picker
                        dropdownIconColor={colors.grey}
                        style={styles.picker}
                        selectedValue={values?.roomNumber}
                        onValueChange={itemValue => {
                          setValues({ ...values, roomNumber: itemValue });
                          dispatch(GetSeatsListApi({ roomNo: itemValue }));
                        }}>
                        <Picker.Item label="Select Room" value="" />
                        {roomsListResponse?.response?.rooms?.map((item, i) => (
                          <Picker.Item key={i} label={item} value={item} />
                        ))}
                      </Picker>
                    </View>
                    {errors?.roomNumber && touched?.roomNumber && <Text style={styles.error}>{errors.roomNumber}</Text>}
                  </View>

                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Seat Number'}</Text>
                    <View style={[styles.inputView, { paddingHorizontal: 0 }]}>
                      <Picker
                        dropdownIconColor={colors.grey}
                        style={styles.picker}
                        selectedValue={values?.seatNumber}
                        onValueChange={itemValue => setValues({ ...values, seatNumber: itemValue })}>
                        <Picker.Item label="Select seat" value="" />
                        {seatsListResponse?.response?.data ? (
                          seatsListResponse?.response?.data?.map((item, i) => (
                            <Picker.Item key={i} label={item} value={item} />
                          ))
                        ) : (
                          <Picker.Item label="Seats Not available" value="" />
                        )}
                      </Picker>
                    </View>
                    {errors?.seatNumber && touched?.seatNumber && <Text style={styles.error}>{errors.seatNumber}</Text>}
                  </View>

                  {/* New Admin Note Field */}
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Admin Note'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('adminNote')}
                        value={values.adminNote}
                        placeholder="Enter Admin Note"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                    </View>
                  </View>

                  <TouchableOpacity style={styles.button} disabled={loading} onPress={handleSubmit}>
                    <Text style={[styles.text, { color: colors.white }]}>{loading ? 'Loading...' : 'Submit'}</Text>
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

export default memo(SelfToMain_Modal);

const styles = StyleSheet.create({
  modal: {
    margin: 0, // Remove default margin
    justifyContent: 'flex-end', // Align modal to the bottom
  },
  modalContainer: {
    width: '100%',
    borderTopLeftRadius: horizontalScale(20), // Rounded top corners
    borderTopRightRadius: horizontalScale(20),
    backgroundColor: colors.white,
    padding: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    paddingTop: verticalScale(20),
    gap: verticalScale(12),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  inputText: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
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
  picker: {
    borderWidth: 1,
    borderColor: colors.grey,
    color: colors.grey,
    fontSize: moderateScale(10),
    marginTop: verticalScale(-5),
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});