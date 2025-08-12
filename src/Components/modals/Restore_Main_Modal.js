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
import {restoreOldToMainRegisterThunkAPI} from '../../Service/api/thunks';
import {useDispatch, useSelector} from 'react-redux';
import {GetRoomsListApi, GetSeatsListApi, getOldStudentRegisterThunkAPI} from '../../Service/slices/RegisterSlice';

const validationSchema = Yup.object().shape({
  roomNumber: Yup.number().required(' Room Number is required'),
  seatNumber: Yup.number().required(' Seat Number is required'),
  date: Yup.date().required('Date is required'),
  oldStudentId: Yup.number().required('Student ID is required'),
});

const Restore_Main_Modal = ({isVisible, onClose, details}) => {
  const INITIAL_DATA = {
    roomNumber: String(details?.roomNumber),
    seatNumber: String(details?.seatNumber),
    date: null,
    oldStudentId: String(details?.oldStudentId),
  };
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();
  const { seatsListResponse, roomsListResponse} =
    useSelector(state => state.root.registerData);
  const handleSubmit = values => {
    // Handle form submission here
    dispatch(restoreOldToMainRegisterThunkAPI(values))
      .then(res => {
        if (res?.payload?.status === true) {
          ToastAndroid.show(res?.payload?.message, 5000, 50);
          dispatch(getOldStudentRegisterThunkAPI());
          onClose();
        } else {
          ToastAndroid.showWithGravityAndOffset(
            "You can't Restore this Candidate !",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25, // X offset
            50, // Y offset
          );
          onClose();
        }
      })
      .catch(err => {
        ToastAndroid.show('Something went wrong!' + err, 5000);
      });
  };
  useEffect(() => {
    // dispatch(getOldStudentRegisterThunkAPI());
    dispatch(GetRoomsListApi());
  }, []);
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.modalContainer}>
        <View style={{padding: 20}}>
          <Text style={styles.title}>Restore Room</Text>
          <View style={styles.content}>
            <Formik
              initialValues={INITIAL_DATA}
              validationSchema={validationSchema}
              enableReinitialize={true}
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
                        {values.date ? values.date : 'Switch Date'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors.date && touched.date ? (
                      <Text style={styles.error}>{errors.date}</Text>
                    ) : null}
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, date: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                  </View>
                  <View>
                    <View style={styles.inputView}>
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
                        selectedValue={values?.roomNumber}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, roomNumber: itemValue});
                          dispatch(GetSeatsListApi({roomNo: itemValue}));
                        }}>
                        <Picker.Item label={'Select Room'} value={''} />
                        {roomsListResponse?.response?.rooms?.map((item, i) => {
                          return (
                            <Picker.Item key={i} label={item} value={item} />
                          );
                        })}
                      </Picker>
                      {/* <TextInput
                        onChangeText={handleChange('roomNumber')}
                        value={values.roomNumber}
                        placeholder="Room Number"
                        placeholderTextColor={colors.grey}
                        editable={false}
                        style={{color: colors.grey}}
                      /> */}
                    </View>
                    {errors.roomNumber && touched.roomNumber ? (
                      <Text style={styles.error}>{errors.roomNumber}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={styles.inputView}>
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
                        selectedValue={values?.seatNumber}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, seatNumber: itemValue});
                        }}>
                        <Picker.Item label={'Select seat'} value={''} />
                        {seatsListResponse?.response?.data ? (
                          seatsListResponse?.response?.data?.map((item, i) => {
                            return (
                              <Picker.Item key={i} label={item} value={item} />
                            );
                          })
                        ) : (
                          <Picker.Item
                            label={'Seats Not available'}
                            value={''}
                          />
                        )}
                      </Picker>
                      {/* <TextInput
                        onChangeText={handleChange('seatNumber')}
                        value={values.seatNumber}
                        placeholder="Seat Number"
                        placeholderTextColor={colors.grey}
                        editable={false}
                        style={{color: colors.grey}}
                      /> */}
                    </View>
                    {errors.seatNumber && touched.seatNumber ? (
                      <Text style={styles.error}>{errors.seatNumber}</Text>
                    ) : null}
                  </View>

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

export default Restore_Main_Modal;

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
