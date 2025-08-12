import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {PickImage} from '../../../Hooks/useImagePicker';
import {colors} from '../../../Utils/Colors';
import {
  createNoticeRequestThunkAPI,
  getNoticesOfStudentThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';

const validationSchema = Yup.object().shape({
  startDate: Yup.string().required('Start Date is required'),
  NoticeMsg: Yup.string().required('Message is required'),
});

const Checkin_Modal = ({bottomSheetRef, snapPoints, handleSheetChanges}) => {
  const INITIAL_DATA = {
    noticeDate: moment(moment.now()).format('YYYY-MM-DD'),
    noticeType: 'Checkin Late',
    NoticeMsg: null,
    startDate: moment(moment.now()).format('YYYY-MM-DD'),
    time: moment().format('H:mm'),
  };
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const dispatch = useDispatch();
  const handleSubmit = async values => {
    var formdata = new FormData();
    formdata.append('noticeDate', values.noticeDate);
    formdata.append('noticeType', values.noticeType);
    formdata.append('NoticeMsg', values.NoticeMsg);
    formdata.append('startDate', values.startDate);
    formdata.append('time', values.time);
    try {
      const res = await dispatch(createNoticeRequestThunkAPI(formdata));
      if (res?.payload?.status === true) {
        alertMessage(res?.payload?.message);
        dispatch(getNoticesOfStudentThunkAPI());
        bottomSheetRef?.current?.dismiss();
      } else {
        alertMessage('Something went wrong');
      }
    } catch (error) {
      alertMessage('Something went wrong');
    }
  };
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Checkin checkinLate</Text>
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
                    <Text style={styles.inputTitle}>{'Date'}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={styles.dateButton}>
                      <Text style={[styles.text, {color: colors.grey}]}>
                        {moment(values.startDate).format('DD-MMM-YYYY')}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors.startDate && touched.startDate ? (
                      <Text style={styles.error}>{errors.startDate}</Text>
                    ) : null}
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, startDate: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Time'}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsTimePickerVisible(true);
                      }}
                      style={styles.dateButton}>
                      <Text style={[styles.text, {color: colors.grey}]}>
                        {values.time}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {errors.time && touched.time ? (
                      <Text style={styles.error}>{errors.time}</Text>
                    ) : null}
                    <DateTimePicker
                      isVisible={isTimePickerVisible}
                      is24Hour={true}
                      mode="time"
                      accentColor={colors.AppDefaultColor}
                      onConfirm={time => {
                        const formatDate = moment(time).format('H:mm');
                        setValues({...values, time: formatDate});
                        setIsTimePickerVisible(false);
                      }}
                      onCancel={() => setIsTimePickerVisible(false)}
                    />
                  </View>

                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Message'}</Text>
                    <View
                      style={[
                        styles.inputView,
                        {minHeight: verticalScale(100)},
                      ]}>
                      <TextInput
                        style={styles.text}
                        onChangeText={handleChange('NoticeMsg')}
                        value={values.itemname}
                        placeholder="Message"
                        multiline={true}
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.NoticeMsg && touched.NoticeMsg ? (
                      <Text style={styles.error}>{errors.NoticeMsg}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button]}>
                    <Text style={[styles.text, {color: colors.white}]}>
                      Submit
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

export default Checkin_Modal;

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
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: verticalScale(50),
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
  text: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(50),
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.grey,
    marginBottom: 20,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Regular',
  },
  circle: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
  },

  documentBox: {
    height: verticalScale(250),
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightygrey,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  document: {
    width: horizontalScale(250),
    height: horizontalScale(200),
    resizeMode: 'contain',
  },

  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(6),
    top: verticalScale(6),
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
