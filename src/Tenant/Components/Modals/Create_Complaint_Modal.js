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
  getComplaintOfStudentThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';
import Loader from '../../../Utils/Loader';

const validationSchema = Yup.object().shape({
  complaint_type: Yup.string().required('Category Name is required'),
  complaint_msg: Yup.string().required('Message is required'),
});
const Create_Complaint_Modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
}) => {
  const INITIAL_DATA = {
    complaint_date: moment(moment.now()).format('YYYY-MM-DD'),
    complaint_type: null,
    complaint_msg: null,
    document: null,
  };
  const dispatch = useDispatch();

  const handleSubmit = async values => {
    var formdata = new FormData();
    formdata.append('complaint_date', values.complaint_date);
    formdata.append('complaint_type', values.complaint_type);
    formdata.append('complaint_msg', values.complaint_msg);
    if(values.document !== null)
    {
      formdata.append('document', {
        uri: values.document,
        type: 'document/jpeg',
        name: 'documentBill.jpg',
      });
    }
    try {
      const res = await dispatch(createComplaintThunkAPI(formdata));
      console.log('res',res.payload);
      if (res?.payload?.status === true) {
        alertMessage(res?.payload?.message);
        dispatch(getComplaintOfStudentThunkAPI());
        bottomSheetRef?.current?.dismiss();
      }else{
        alertMessage(res?.payload?.message);
      }
    } catch (error) {
      alertMessage('something went wrong');
    }
  };

  const RenderUploadButton = ({setImageUrl}) => {
    return (
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => PickImage(setImageUrl)}>
        <Icon
          name="cloud-arrow-up"
          size={24}
          color={`${colors.AppDefaultColor}80`}
        />
        <Text style={styles.uploadButtonText}>{'Upload File'}</Text>
      </TouchableOpacity>
    );
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
          <Text style={styles.title}>Create Complaint</Text>
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
                    <Text style={styles.inputTitle}>
                      {'Complaint Category'}
                    </Text>
                    <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                      <Picker
                        dropdownIconColor={colors.grey}
                        itemStyle={{
                          color: colors.grey,
                          fontSize: moderateScale(12),
                        }}
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(10),
                          marginTop: verticalScale(-5),
                        }}
                        selectedValue={values.complaint_type}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, complaint_type: itemValue});
                        }}>
                        {/* {values.complaint_type && (
                          <Picker.Item
                            label={values.complaint_type}
                            value={values.complaint_type}
                          />
                        )} */}
                        <Picker.Item label={'Select'} value="" />
                        <Picker.Item label={'Food'} value="food" />
                        <Picker.Item label={'Facilities'} value="facilities" />
                        <Picker.Item label={'Security'} value="security" />
                        <Picker.Item label={'Bedroom'} value="bedroom" />
                        <Picker.Item label={'Account'} value="account" />
                        <Picker.Item label={'Suggestion'} value="suggestion" />
                      </Picker>
                    </View>
                    {errors.complaint_type && touched.complaint_type ? (
                      <Text style={styles.error}>{errors.complaint_type}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Message'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.text}
                        onChangeText={handleChange('complaint_msg')}
                        value={values.itemname}
                        placeholder="Message"
                        placeholderTextColor={colors.grey}
                      />
                    </View>
                    {errors.complaint_msg && touched.complaint_msg ? (
                      <Text style={styles.error}>{errors.complaint_msg}</Text>
                    ) : null}
                  </View>

                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>Upload Image</Text>
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
                  )}

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

export default Create_Complaint_Modal;

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
    fontFamily: 'Roboto-Reular',
  },
  text: {
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
