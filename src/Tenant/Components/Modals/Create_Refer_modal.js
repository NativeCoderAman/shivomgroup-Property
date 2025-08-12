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
  LayoutAnimation,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import {
  createComplaintThunkAPI,
  createNoticeRequestThunkAPI,
  getAppRefersThunkAPI,
  getHostelRefersThunkAPI,
  getNoticesOfStudentThunkAPI,
  referAppThunkAPI,
  referhostelThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';

const validationSchema = Yup.object().shape({
  refer_name: Yup.string().required('Name is required'),
  refer_mobile: Yup.string().required('Mobile Number is required'),
});
const Create_Refer_modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  appReferSetup,
  hostelReferSetup,
}) => {
  const INITIAL_DATA = {
    referType: 'referMobile',
    refer_name: null,
    refer_mobile: null,
  };

  console.log(hostelReferSetup);

  const dispatch = useDispatch();
  // const {referEarnSetupResponse} = useSelector(
  //   state => state.root.clientReferData,
  // );
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  // const [referEarnSetup, setReferEarnSetup] = useState([]);
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    LayoutAnimation.easeInEaseOut();
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
  }, []);


  const handleSubmit = async values => {
    var formdata = new FormData();
    formdata.append('refer_name', values.refer_name);
    formdata.append('refer_mobile', values.refer_mobile);

    if (values.referType === 'referHostelPg') {
      if (hostelReferSetup[0]?.is_active === 1) {
        try {
          const res = await dispatch(referhostelThunkAPI(formdata));
          if (res?.payload?.status === true) {
            alertMessage(res?.payload?.message);
            dispatch(getHostelRefersThunkAPI());
            bottomSheetRef?.current?.dismiss();
          } else {
            const message = res?.payload?.message;
            alertMessage('Refer Failed: ', message);
            bottomSheetRef?.current?.dismiss();
          }
        } catch (error) {
          alertMessage('Something went wrong');
        }
      } else {
        alertMessage('No offer available by you hostel management');
      }
    } else {
      if (appReferSetup[0]?.is_active === true) {
        try {
          const res = await dispatch(referAppThunkAPI(formdata));

          if (res?.payload?.status === true) {
            alertMessage(res?.payload?.message);
            dispatch(getAppRefersThunkAPI());
            bottomSheetRef?.current?.dismiss();
          } else {
            const message = res?.payload?.message;
            alertMessage(message);
            bottomSheetRef?.current?.dismiss();
          }
        } catch (error) {
          alertMessage('Something went wrong');
        }
      } else {
        alertMessage('Refer Failed');
      }
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
          <View style={styles.content}>
            <Formik
              initialValues={INITIAL_DATA}
              validationSchema={validationSchema}
              onSubmit={values => handleSubmit(values)}>
              {({
                handleChange,
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
                          setValues({...values, referType: 'referMobile'});
                        }}>
                        <Icon
                          name={
                            values.referType === 'referMobile'
                              ? 'circle-check'
                              : 'circle'
                          }
                          size={20}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                      <Text style={styles.inputTitle}>Refer App</Text>
                    </View>
                    <View style={styles.flexRowWithGap}>
                      <TouchableOpacity
                        style={styles.circle}
                        onPress={() => {
                          setValues({...values, referType: 'referHostelPg'});
                        }}>
                        <Icon
                          name={
                            values.referType === 'referHostelPg'
                              ? 'circle-check'
                              : 'circle'
                          }
                          size={20}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                      <Text style={styles.inputTitle}>Refer Hostel/PG</Text>
                    </View>
                  </View>
                  {/* <Text style={styles.title}>Nightout/Going Home</Text> */}

                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Name'}</Text>
                    <View style={[styles.inputView]}>
                      <TextInput
                        style={styles.text}
                        onChangeText={handleChange('refer_name')}
                        value={values.refer_name}
                        placeholder="Enter Name"
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.refer_name && touched.refer_name ? (
                      <Text style={styles.error}>{errors.refer_name}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Number'}</Text>
                    <View style={[styles.inputView]}>
                      <TextInput
                        style={styles.text}
                        onChangeText={handleChange('refer_mobile')}
                        value={values.refer_mobile}
                        placeholder="Enter Mobile Number"
                        keyboardType="numeric"
                        maxLength={10}
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.refer_mobile && touched.refer_mobile ? (
                      <Text style={styles.error}>{errors.refer_mobile}</Text>
                    ) : null}
                  </View>
                  <View style={[styles.termsview]}>
                    {values.referType == 'referMobile' ? (
                      <Text
                        onTextLayout={onTextLayout}
                        numberOfLines={textShown ? undefined : 4}
                        style={styles.inputText}>
                        {appReferSetup[0]?.message?.responseMessage
                          ?.replace(/\s+/g, ' ')
                          .trim() + '\n\n'}
                        {appReferSetup[0]?.message?.termsAndConditions?.map(
                          item => '⦿  ' + item + '\n',
                        )}
                      </Text>
                    ) : (hostelReferSetup?.length !== 0 && hostelReferSetup[0]?.is_active) ? (
                      <Text
                        onTextLayout={onTextLayout}
                        numberOfLines={textShown ? undefined : 4}
                        style={styles.inputText}>
                        {String(hostelReferSetup[0]?.message?.responseMessage)
                          .replace(/\s+/g, ' ')
                          .trim() + '\n'}
                        {hostelReferSetup[0]?.message?.termsAndConditions?.map(
                          item => '⦿  ' + item + '\n',
                        )}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.inputText,
                          {color: colors.red, fontSize: 14, fontWeight: '500'},
                        ]}>
                        Offers are currently not available.
                      </Text>
                    )}

                    {hostelReferSetup.length === 0 &&
                    values.referType === 'referHostelPg'
                      ? null // Do not show for 'referHostelPg' with non-zero length
                      : lengthMore && (
                          <Text
                            onPress={toggleNumberOfLines}
                            style={[
                              styles.text,
                              {
                                fontSize: moderateScale(12),
                                color: colors.AppDefaultColor,
                              },
                            ]}>
                            {textShown ? '(Read less T&C)' : '(Read more T&C)'}
                          </Text>
                        )}
                  </View>

                  <TouchableOpacity
                    // disabled={hostelReferSetup.length == 0 }
                    onPress={
                      hostelReferSetup.length === 0 &&
                      values.referType === 'referHostelPg'
                        ? null
                        : handleSubmit
                    }
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

export default Create_Refer_modal;

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
  termsview: {
    width: '100%',
    padding: horizontalScale(12),
    borderWidth: 1,
    borderColor: colors.AppDefaultColor,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
