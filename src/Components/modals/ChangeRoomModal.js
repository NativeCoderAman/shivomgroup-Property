import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
} from 'react-native';
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
import {Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {switchRoomMainRegisterThunkAPI} from '../../Service/api/thunks';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetSeatsListApi,
  handleRegistrationListAPI,
} from '../../Service/slices/RegisterSlice';

const validationSchema = Yup.object().shape({
  oldRoomNumber: Yup.number().required('Old Room Number is required'),
  OldSeatNumber: Yup.number().required('Old Seat Number is required'),
  newRoomNumber: Yup.number().required('New Room Number is required'),
  newSeatNumber: Yup.number().required('New Seat Number is required'),
  switchDate: Yup.date().required('Switch Date is required'),
});

const ChangeRoomModal = ({
  isVisible,
  onClose,
  details,
  allRooms,
}) => {
  const INITIAL_DATA = {
    oldRoomNumber: details.roomNumber,
    OldSeatNumber: details.seatNumber,
    newRoomNumber: null,
    newSeatNumber: null,
    switchDate: null,
  };
  const {id} = details;
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();
  const {seatsListResponse} = useSelector(state => state.root.registerData);
  const {loading} = useSelector(
    state => state.root.registerData.switchRoomMainRegisterResponse,
  );
  const handleSubmit = values => {
    dispatch(switchRoomMainRegisterThunkAPI({id, values}))
      .then(res => {
        if (res?.payload?.status === true) {
          ToastAndroid.show(res?.payload?.message, 5000, 50);
          dispatch(handleRegistrationListAPI());
          onClose();
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Something went wrong!',
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
 

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onDismiss={onClose}
      onBackButtonPress={onClose}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.modalContainer}>
        <View style={{padding: 20}}>
          <Text style={styles.title}>Change Room</Text>
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
                        {values.switchDate ? values.switchDate : 'Switch Date'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors.switchDate && touched.switchDate ? (
                      <Text style={styles.error}>{errors.switchDate}</Text>
                    ) : null}
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, switchDate: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                  </View>
                  <View>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('oldRoomNumber')}
                        value={values.oldRoomNumber}
                        placeholder="Old Room Number"
                        placeholderTextColor={'red'}
                        editable={false}
                        style={{color: colors.grey}}
                      />
                    </View>
                    {errors.oldRoomNumber && touched.oldRoomNumber ? (
                      <Text style={styles.error}>{errors.oldRoomNumber}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('OldSeatNumber')}
                        value={values.OldSeatNumber}
                        placeholder="Old Seat Number"
                        placeholderTextColor={'black'}
                        editable={false}
                        style={{color: colors.grey}}
                      />
                    </View>
                    {errors.OldSeatNumber && touched.OldSeatNumber ? (
                      <Text style={styles.error}>{errors.OldSeatNumber}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={[styles.inputView, {paddingHorizontal: 0}]}>
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
                        selectedValue={values.newRoomNumber}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, newRoomNumber: itemValue});
                          dispatch(GetSeatsListApi({roomNo: itemValue}));
                        }}>
                        <Picker.Item label={'Select New Room '} value={''} />
                        {allRooms?.map((item, i) => {
                          return item !== details?.roomNumber ? (
                            <Picker.Item key={i} label={item} value={item} />
                          ) : null;
                        })}
                      </Picker>
                    </View>
                    {errors.newRoomNumber && touched.newRoomNumber ? (
                      <Text style={styles.error}>{errors.newRoomNumber}</Text>
                    ) : null}
                  </View>
                  <View>
                    <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                      <Picker
                        style={{
                          borderWidth: 1,
                          borderColor: colors.grey,
                          color: colors.grey,
                          fontSize: moderateScale(10),
                          // height: 30,
                          marginTop: verticalScale(-5),
                        }}
                        selectedValue={values.newSeatNumber}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, newSeatNumber: itemValue});
                        }}>
                        <Picker.Item label={'Select New seat'} value={''} />
                        {seatsListResponse?.response?.data?.map((item, i) => {
                          return (
                            <Picker.Item key={i} label={item} value={item} />
                          );
                        })}
                      </Picker>
                    </View>
                    {errors.newSeatNumber && touched.newSeatNumber ? (
                      <Text style={styles.error}>{errors.newSeatNumber}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.button}
                    disabled={loading}
                    onPress={handleSubmit}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      {loading ? 'Loading...' : 'Submit'}
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

export default ChangeRoomModal;

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
