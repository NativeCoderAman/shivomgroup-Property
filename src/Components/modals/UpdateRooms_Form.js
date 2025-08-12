import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  handleRoomsListAPI,
  updateRoomThunkAPI,
} from '../../Service/slices/GetRoomsSlice';
import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  roomNo: Yup.number('Room Number must be a number')
    .required('Room Number is required')
    .positive('Room Number should be positive')
    .integer('Room Number should be Number'),
  roomType: Yup.string().required('Room Type is required'),
  seatNo: Yup.string().required('Seat Number is required'),
  rent: Yup.number().required('Rent is required'),
});

const UpdateRooms_Form = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  data,
}) => {

  const INITIAL_DATA = {
    roomNo: data?.roomNumber,
    roomType: data?.roomtype,
    seatNo: String(data?.seats),
    noOfCandidate: data?.nocandidate,
    rent: data?.rent,
  };
  const inputRef1 = useRef(null);
  const dispatch = useDispatch();
  const {loading} = useSelector(
    state => state?.root?.roomData?.updateRoomResponse,
  );

  const handleSubmit = values => {
    dispatch(updateRoomThunkAPI(values))
      .then(res => {
        if (res?.payload?.status === true) {
          dispatch(handleRoomsListAPI());
          ToastAndroid.show(res?.payload?.message, 5000, 50);
          bottomSheetRef?.current?.dismiss();
        } else {
          ToastAndroid.show('Something went wrong!', 5000);
          inputRef1.current.focus();
        }
      })
      .catch(err => {
        ToastAndroid.show('Something went wrong!' + err, 5000);
      });
  };
  return (
    <BottomSheetModal ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Update Room</Text>
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
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Room Number'}</Text>

                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Room Number"
                        editable={false}
                        ref={inputRef1}
                        placeholderTextColor={colors.grey}
                        value={values.roomNo}
                        onChangeText={handleChange('roomNo')}
                        style={styles.input}
                      />
                    </View>
                    {errors.roomNo && touched.roomNo ? (
                      <Text style={styles.error}>{errors.roomNo}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Room Type'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Room Type"
                        placeholderTextColor={colors.grey}
                        value={values.roomType}
                        onChangeText={handleChange('roomType')}
                        style={styles.input}
                      />
                    </View>
                    {errors.roomType && touched.roomType ? (
                      <Text style={styles.error}>{errors.roomType}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Number Of Seats'}</Text>
                    <View style={styles.inputView}>
                      <Picker
                        dropdownIconColor={colors.grey}
                        style={{
                          color: colors.grey,
                          fontSize: moderateScale(10),
                          marginTop: verticalScale(-8),
                          marginLeft: horizontalScale(-5),
                        }}
                        placeholder="Number Of Seats"
                        selectedValue={values.seatNo}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, seatNo: itemValue});
                        }}>
                        <Picker.Item label={'Number of Seats'} value={''} />
                        {['1', '2', '3', '4', '5', '6', '7']?.map((item, i) => {
                          return (
                            <Picker.Item key={i} label={item} value={item} />
                          );
                        })}
                      </Picker>
                    </View>
                    {errors.seatNo && touched.seatNo ? (
                      <Text style={styles.error}>{errors.seatNo}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {'Number Of Candidate'}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Number Of Candidate"
                        placeholderTextColor={colors.grey}
                        value={values.noOfCandidate}
                        onChangeText={handleChange('noOfCandidate')}
                        editable={false}
                        style={styles.input}
                      />
                    </View>
                    {errors.noOfCandidate && touched.noOfCandidate ? (
                      <Text style={styles.error}>{errors.noOfCandidate}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Rent'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Rent"
                        placeholderTextColor={colors.grey}
                        keyboardType="numeric"
                        inputMode="numeric"
                        value={values.rent}
                        onChangeText={handleChange('rent')}
                        style={styles.input}
                      />
                    </View>
                    {errors.rent && touched.rent ? (
                      <Text style={styles.error}>{errors.rent}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    disabled={loading}
                    style={[styles.button]}
                    onPress={handleSubmit}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: moderateScale(14),
                      }}>
                      {loading ? 'Loading...' : 'Update Room'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default UpdateRooms_Form;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    paddingTop: verticalScale(20),
    gap: verticalScale(20),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(10),
    elevation:2
  },
  buttonClose: {
    position: 'absolute',
    top: verticalScale(12),
    right: horizontalScale(12),
    height: verticalScale(30),
    width: verticalScale(30),
    borderRadius: horizontalScale(20),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },

  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(2),
    paddingHorizontal: horizontalScale(12),
  },
  error: {
    color: colors.red,
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
  },
});

