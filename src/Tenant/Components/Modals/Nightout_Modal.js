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
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';

import Icon from 'react-native-vector-icons/FontAwesome6';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Picker} from '@react-native-picker/picker';
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
  createComplaintThunkAPI,
  createNoticeRequestThunkAPI,
  getNoticesOfStudentThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';

const validationSchema1 = Yup.object().shape({
  startDate: Yup.date().required('Date is required'),
  NoticeMsg: Yup.string().required('Message is required'),
});
const validationSchema2 = Yup.object().shape({
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
  NoticeMsg: Yup.string().required('Message is required'),
});

const Nightout_Modal = ({bottomSheetRef, snapPoints, handleSheetChanges}) => {
  const INITIAL_DATA1 = {
    noticeDate: moment(moment.now()).format('YYYY-MM-DD'),
    noticeType: 'nightOut',
    NoticeMsg: `Subject: Permission Request for Absence from Hostel Today

    Dear [Warden's Name],
    
    I hope this email finds you well. I am writing to request permission to be absent from the hostel today, [Date]. Due to [briefly mention the reason for your absence, e.g., personal commitments, family emergency, etc.], I will not be able to stay at the hostel overnight.
    
    I understand the importance of informing the hostel authorities in advance about any planned absence, and I assure you that I will adhere to all hostel rules and regulations during my absence.
    
    I will ensure that my room is securely locked and that my belongings are properly stored before leaving the hostel premises.
    
    I kindly request your approval for this temporary absence. Your understanding and cooperation in this matter are greatly appreciated.
    
    Thank you for considering my request. Please let me know if there are any further formalities or procedures I need to follow in this regard.
    
    Looking forward to your response.
    
    Sincerely,
    [Your Name]
    [Your Room/Hostel Block Number]
    [Your Contact Information]
    
    `,
    startDate: moment(moment.now()).format('YYYY-MM-DD'),
  };
  
  const INITIAL_DATA2 = {
    noticeDate: moment(moment.now()).format('YYYY-MM-DD'),
    noticeType: 'nightOut',
    NoticeMsg: null,
    startDate: moment(moment.now()).format('YYYY-MM-DD'),
    endDate: moment(moment.now()).format('YYYY-MM-DD'),
  };

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isStartVisible, setIsStartVisible] = useState(false);
  const [isEndVisible, setIsEndVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('nightOut');

  const dispatch = useDispatch();

  const handleSubmit = async values => {
    try {
      const res = await dispatch(createNoticeRequestThunkAPI(values));

      if (res?.payload?.status === true) {
        alertMessage(res?.payload?.message);
        dispatch(getNoticesOfStudentThunkAPI());
        bottomSheetRef?.current?.dismiss();
      }else{
        alertMessage(res?.payload?.message);
      }
    } catch (error) {
      alertMessage(error);
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
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalContainer}>
            <View style={styles.content}>
              <Formik
                initialValues={
                  selectedType === 'nightOut' ? INITIAL_DATA1 : INITIAL_DATA2
                }
                validationSchema={
                  selectedType === 'nightOut'
                    ? validationSchema1
                    : validationSchema2
                }
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.circle}
                          onPress={() => {
                            setValues({...values, noticeType: 'nightOut'}),
                              setSelectedType('nightOut');
                          }}>
                          <Icon
                            name={
                              values.noticeType === 'nightOut'
                                ? 'circle-check'
                                : 'circle'
                            }
                            size={20}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                        <Text style={styles.inputTitle}>Nightout</Text>
                      </View>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.circle}
                          onPress={() => {
                            setValues({...values, noticeType: 'goingHome'}),
                              setSelectedType('goingHome');
                          }}>
                          <Icon
                            name={
                              values.noticeType === 'goingHome'
                                ? 'circle-check'
                                : 'circle'
                            }
                            size={20}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                        <Text style={styles.inputTitle}>Going Home</Text>
                      </View>
                    </View>
                    {/* <Text style={styles.title}>Nightout/Going Home</Text> */}
                    {selectedType === 'nightOut' ? (
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
                          <Icon
                            name={'calendar'}
                            color={colors.black}
                            size={20}
                          />
                        </TouchableOpacity>
                        {errors.startDate && touched.startDate ? (
                          <Text style={styles.error}>{errors.startDate}</Text>
                        ) : null}
                        <DateTimePicker
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={date => {
                            const formatDate =
                              moment(date).format('YYYY-MM-DD');
                            setValues({...values, startDate: formatDate});
                            setIsDatePickerVisible(false);
                          }}
                          onCancel={() => setIsDatePickerVisible(false)}
                        />
                      </View>
                    ) : (
                      <>
                        <View style={{gap: 5}}>
                          <Text style={styles.inputTitle}>{'From'}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setIsStartVisible(true);
                            }}
                            style={styles.dateButton}>
                            <Text style={[styles.text, {color: colors.grey}]}>
                              {moment(values.startDate).format('DD-MMM-YYYY')}
                            </Text>
                            <Icon
                              name={'calendar'}
                              color={colors.black}
                              size={20}
                            />
                          </TouchableOpacity>
                          {errors.startDate && touched.startDate ? (
                            <Text style={styles.error}>{errors.startDate}</Text>
                          ) : null}
                          <DateTimePicker
                            isVisible={isStartVisible}
                            mode="date"
                            onConfirm={date => {
                              const formatDate =
                                moment(date).format('YYYY-MM-DD');
                              setValues({...values, startDate: formatDate});
                              setIsStartVisible(false);
                            }}
                            onCancel={() => setIsStartVisible(false)}
                          />
                        </View>
                        <View style={{gap: 5}}>
                          <Text style={styles.inputTitle}>{'To'}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setIsEndVisible(true);
                            }}
                            style={styles.dateButton}>
                            <Text style={[styles.text, {color: colors.grey}]}>
                              {moment(values.endDate).format('DD-MMM-YYYY')}
                            </Text>
                            <Icon
                              name={'calendar'}
                              color={colors.black}
                              size={20}
                            />
                          </TouchableOpacity>
                          {errors.endDate && touched.endDate ? (
                            <Text style={styles.error}>{errors.endDate}</Text>
                          ) : null}
                          <DateTimePicker
                            isVisible={isEndVisible}
                            mode="date"
                            onConfirm={date => {
                              const formatDate =
                                moment(date).format('YYYY-MM-DD');
                              setValues({...values, endDate: formatDate});
                              setIsEndVisible(false);
                            }}
                            onCancel={() => setIsEndVisible(false)}
                          />
                        </View>
                      </>
                    )}
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

                    {/* <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>Upload Bill Image</Text>
                    <RenderUploadButton
                      setImageUrl={document =>
                        setValues({...values, document: document})
                      }
                    />
                    {errors.document && touched.document ? (
                      <Text style={styles.error}>{errors.document}</Text>
                    ) : null}
                  </View>
                  {values.document && (
                    <View style={styles.documentBox}>
                      <Image
                        source={{uri: values?.document}}
                        style={styles.document}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() => setValues({...values, document: ''})}
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )} */}

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
        </KeyboardAvoidingView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default Nightout_Modal;

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
    fontFamily: 'Roboto-Medium',
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
