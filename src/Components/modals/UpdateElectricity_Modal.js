import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Image,
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
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {colors} from '../../Utils/Colors';
import moment from 'moment';
import PickerCard from '../cards/PickerCard';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  electricityViewThunkAPI,
  updateElectricityRecordsThunkAPI,
} from '../../Service/api/thunks';
import {useDispatch} from 'react-redux';
import { Divider } from 'react-native-elements';

const validationSchema = Yup.object().shape({
  billdate: Yup.date().required('Bill date is required'),
  readingRate: Yup.number('Reading Rate should be a number').required(
    'Reading Rate is required',
  ),
  discountUnits: Yup.string().required('Wave off usits is required'),
  previous_reading: Yup.number().required('Previous Reading is required'),
  present_reading: Yup.string().required('Present Reading is required'),
});

const UpdateElectricity_Modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  data,
}) => {
  const INITIAL_DATA = {
    billdate: data?.billdate,
    readingRate: String(data?.readingRate),
    discountUnits: String(data?.discountUnits),
    previous_reading: String(data?.previous_reading),
    present_reading: String(data?.present_reading),
  };
  console.log("data",data)
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(moment.now());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = values => {
    dispatch(updateElectricityRecordsThunkAPI({id: data.id, data: values}))
      .then(res => {
        
        if (res?.payload?.status === true) {
          ToastAndroid.show(res?.payload?.message, 5000, 50);
          dispatch(electricityViewThunkAPI(''));
          bottomSheetRef?.current?.dismiss();
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Something went wrong',
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
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
          <Text style={styles.title}>Update Electricity</Text>
          <Divider width={1} />
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View style={styles.modalContainer}>
          <View style={styles.content}>
            <Formik
              enableReinitialize
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
                    <Text style={styles.inputTitle}>{'Bill Date'}</Text>
                    <TouchableOpacity
                      disabled={true}
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={styles.dateButton}>
                      <Text style={styles.inputText}>
                        {moment(values?.billdate).format('DD-MMM-YYYY')}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, billdate: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                    {errors.billdate && touched.billdate ? (
                      <Text style={styles.error}>{errors.billdate}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Reading Value'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.inputText}
                        editable={false}
                        onChangeText={handleChange('readingRate')}
                        value={values.readingRate}
                        placeholder="Reading Value"
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.readingRate && touched.readingRate ? (
                      <Text style={styles.error}>{errors.readingRate}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Wave Off Units'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.inputText}
                        onChangeText={handleChange('discountUnits')}
                        value={values.discountUnits}
                        placeholder="Wave Off Units"
                        placeholderTextColor={colors.grey}
                        keyboardType="numeric"
                        onBlur={() => {
                          setValues({
                            ...values,
                            amount: String(values.discountUnits * values.rate),
                          });
                        }}
                      />
                    </View>
                    {errors.discountUnits && touched.discountUnits ? (
                      <Text style={styles.error}>{errors.discountUnits}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Previous Reading'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Previous Reading"
                        editable={false}
                        value={values.previous_reading}
                        onChangeText={handleChange('previous_reading')}
                        placeholderTextColor={colors.grey}
                        keyboardType="numeric"
                        onBlur={() => {
                          setValues({
                            ...values,
                            amount: String(
                              values.quantity * values.previous_reading,
                            ),
                          });
                        }}
                      />
                    </View>
                    {errors.previous_reading && touched.previous_reading ? (
                      <Text style={styles.error}>
                        {errors.previous_reading}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Present Reading'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.inputText}
                        value={values.present_reading}
                        onChangeText={handleChange('present_reading')}
                        placeholder="Present Reading"
                        placeholderTextColor={colors.grey}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.present_reading && touched.present_reading ? (
                      <Text style={styles.error}>{errors.present_reading}</Text>
                    ) : null}
                  </View>

                  <Pressable onPress={handleSubmit} style={[styles.button]}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      Update
                    </Text>
                  </Pressable>
                </>
              )}
            </Formik>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default UpdateElectricity_Modal;

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
    paddingHorizontal: horizontalScale(40),
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(12),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(20),
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
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
  inputText: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
  },
  inputText: {
    fontSize: moderateScale(12),
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
