import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  FlatList,
  ScrollView,
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
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {colors} from '../../Utils/Colors';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';

import {useDispatch, useSelector} from 'react-redux';
import {
  getSelectMonthWeekNumberThunkAPI,
  menuByweekThunkAPI,
  repeatMenuThunkAPI,
  updateMenuThunkAPI,
} from '../../Service/api/thunks';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  copyWeekMonth: Yup.date().required('Month is required'),
  selectWeekNumber: Yup.string().required('Week Fast is required'),
  selectedMonth: Yup.string().required('Month is required'),
  addOnWeek: Yup.string().required('Week is required'),
});
const Repeat_Menu_modal = ({bottomSheetRef, snapPoints, data, onRefresh}) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [weeksLength, setWeeksLength] = useState(0);
  const INITIAL_DATA = {
    copyWeekMonth: null,
    selectWeekNumber: null,
    selectedMonth: null,
    addOnWeek: null,
  };
  const {
    getSelectMonthWeekNumberResponse,
    getCreatedMenuMonthDateResponse,
    repeatMenuResponse,
  } = useSelector(state => state.root.foodData);
  const dispatch = useDispatch();
  const items = [];
  for (let i = 0; i < weeksLength; i++) {
    items.push(`${i + 1}`);
  }

  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleSubmit = async values => {
    try {
      setLoading(repeatMenuResponse?.loading);
      const response = await dispatch(repeatMenuThunkAPI({data: values}));
      console.log('res new:',response?.payload);
      if (response?.payload?.status === true) {
        alertMessage(response?.payload?.message);
      } else {
        alertMessage(response?.payload?.message || 'Something went wrong!');
      }
    } catch (error) {
      alertMessage(error?.message || 'Something went wrong!');
    } finally {
      bottomSheetRef.current?.close();
      setLoading(repeatMenuResponse?.loading);
      await onRefresh();
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onDismiss={() => {
      }}>
      <BottomSheetScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Repeat Menu</Text>
        <View style={styles.content}>
          <Formik
            initialValues={INITIAL_DATA}
            validationSchema={validationSchema}
            enableReinitialize
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
                  <Text style={styles.inputTitle}>{'Select Menu'}</Text>
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={{
                        color: colors.grey,
                        fontSize: moderateScale(10),
                        marginVertical: verticalScale(-5),
                      }}
                      selectedValue={values?.copyWeekMonth}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({
                          ...values,
                          copyWeekMonth: itemValue,
                        });
                        const params = `?selectedDate=${itemValue}`;
                        dispatch(getSelectMonthWeekNumberThunkAPI(params))
                          .then(res =>
                            setWeeksLength(res?.payload?.data?.totalWeeks),
                          )
                          .catch();
                      }}>
                      <Picker.Item
                        style={styles.text}
                        label={'Select Month'}
                        value=""
                      />
                      {getCreatedMenuMonthDateResponse?.response &&
                        Object.keys(
                          getCreatedMenuMonthDateResponse?.response || {},
                        )?.map((item, i) => (
                          <Picker.Item
                            key={i}
                            style={styles.text}
                            value={
                              getCreatedMenuMonthDateResponse?.response[item]
                            }
                            label={item}
                          />
                        ))}
                    </Picker>
                  </View>
                  {errors.copyWeekMonth && touched.copyWeekMonth ? (
                    <Text style={styles.error}>{errors.copyWeekMonth}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Select Week'}</Text>
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={{
                        color: colors.grey,
                        fontSize: moderateScale(10),
                        marginVertical: verticalScale(-5),
                      }}
                      selectedValue={values?.selectWeekNumber}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({...values, selectWeekNumber: itemValue});
                      }}>
                      <Picker.Item
                        style={styles.text}
                        label={`Select Week`}
                        value=""
                      />
                      {items?.map((item, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            style={styles.text}
                            value={item}
                            label={`Week ${item}`}
                          />
                        );
                      })}
                      <Picker.Item
                        style={styles.text}
                        label={'All'}
                        value={'all'}
                      />
                    </Picker>
                  </View>
                  {errors.selectWeekNumber && touched.selectWeekNumber ? (
                    <Text style={styles.error}>{errors.selectWeekNumber}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Choose Menu'}</Text>
                 
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      selectedValue={values.selectedMonth}
                      onValueChange={(itemValue, itemIndex) =>
                        setValues({
                          ...values,
                          selectedMonth: itemValue,
                        })
                      }
                      dropdownIconColor={colors.grey}
                      style={{
                        color: colors.grey,
                        fontSize: moderateScale(10),
                        marginVertical: verticalScale(-5),
                      }}>
                      <Picker.Item
                        style={styles.text}
                        label="Select a Month"
                        value={null}
                      />
                      <Picker.Item
                        style={styles.text}
                        label="January"
                        value="2025-01"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="February"
                        value="2025-02"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="March"
                        value="2025-03"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="April"
                        value="2025-04"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="May"
                        value="2025-05"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="June"
                        value="2025-06"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="July"
                        value="2025-07"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="August"
                        value="2025-08"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="September"
                        value="2025-09"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="October"
                        value="2025-10"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="November"
                        value="2025-11"
                      />
                      <Picker.Item
                        style={styles.text}
                        label="December"
                        value="2025-12"
                      />
                    </Picker>
                  </View>
                  {errors.selectedMonth && touched.selectedMonth ? (
                    <Text style={styles.error}>{errors.selectedMonth}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Choose Week'}</Text>
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={{
                        color: colors.grey,
                        fontSize: moderateScale(10),
                        marginVertical: verticalScale(-5),
                      }}
                      selectedValue={values?.addOnWeek}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({...values, addOnWeek: itemValue});
                      }}>
                      <Picker.Item
                        style={styles.text}
                        label={'Select Week'}
                        value=""
                      />
                      {items?.map((item, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            style={styles.text}
                            value={item}
                            label={`Week ${item}`}
                          />
                        );
                      })}
                      <Picker.Item
                        style={styles.text}
                        label={'All'}
                        value={'all'}
                      />
                    </Picker>
                  </View>
                  {errors.addOnWeek && touched.addOnWeek ? (
                    <Text style={styles.error}>{errors.addOnWeek}</Text>
                  ) : null}
                </View>

                <Pressable onPress={handleSubmit} style={[styles.button]}>
                  <Text style={[styles.text, {color: colors.white}]}>
                    Submit
                  </Text>
                </Pressable>
              </>
            )}
          </Formik>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

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
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(100),
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
  },
  content: {
    paddingTop: verticalScale(20),
    gap: verticalScale(6),
  },
  permissionsSection: {
    width: '100%',
    // backgroundColor: colors.red,
    // height: verticalScale(200),
    flexDirection: 'row',
    gap: horizontalScale(12),
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
  itemChip: {
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    height: verticalScale(30),
    padding: horizontalScale(6),
    borderColor: colors.lightygrey,
    backgroundColor: colors.AppDefaultColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
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
  textLabel: {
    color: colors.black,
    fontSize: moderateScale(10),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
});

export default Repeat_Menu_modal;
