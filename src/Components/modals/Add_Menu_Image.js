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
  Image,
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
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';
import {PickImage} from '../../Hooks/useImagePicker';
import {
  addMenuImageThunkAPI,
  getItemCodeThunkAPI,
  getMenuImagesDataThunkAPI,
} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
import {useDispatch, useSelector} from 'react-redux';
import { showMessage } from 'react-native-flash-message';

const validationSchema = Yup.object().shape({
  mealTypeName: Yup.string().required('Meal Type is required'),
  mealTypeCode: Yup.string().required('Item Code is required'),
  menuImages: Yup.string().required('Item name is required'),
});
const Add_Menu_Image = ({bottomSheetRef, snapPoints}) => {
  const INITIAL_DATA = {
    mealTypeCode: null,
    mealTypeName: null,
    menuImages: null,
  };
  const {getMealTypesResponse, getItemCodeResponse} = useSelector(
    state => state.root.foodData,
  );

  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    const formdata = new FormData();
    formdata.append('mealTypeCode', values.mealTypeCode);
    formdata.append('mealTypeName', values.mealTypeName);
  
    formdata.append('menuImages', {
      uri: values.menuImages,
      type: 'image/jpeg',
      name: 'menuImages.jpg',
    });
  
    dispatch(addMenuImageThunkAPI(formdata))
      .then((res) => {
        
        if (res?.payload?.status === true) {
          Alert.alert('Success', res.payload.message);
          dispatch(getMenuImagesDataThunkAPI());
          bottomSheetRef.current?.close();
        } else {
          Alert.alert('Failed', res.payload.message);
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Something went wrong!');
      });
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
    <BottomSheetModal ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
      <BottomSheetScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Menu Image</Text>
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
                  <Text style={styles.inputTitle}>{'Meal Type'}</Text>
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={[
                        styles.text,
                        {
                          marginVertical: verticalScale(-5),
                        },
                      ]}
                      selectedValue={values.mealTypeName}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({
                          ...values,
                          mealTypeName: itemValue?.category_name,
                        });
                        dispatch(getItemCodeThunkAPI(itemValue?.id));
                      }}>
                      {!values.mealTypeName && (
                        <Picker.Item
                          style={styles.text}
                          label={'Select Meal Type'}
                          value=""
                        />
                      )}
                      {getMealTypesResponse?.response?.map((item, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            style={{fontSize: 12}}
                            label={item?.category_name}
                            value={item}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  {errors.mealTypeName && touched.mealTypeName ? (
                    <Text style={styles.error}>{errors.mealTypeName}</Text>
                  ) : null}
                </View>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Item Code'}</Text>
                  {/* <View style={styles.inputView}>
                    <TextInput
                      style={styles.text}
                      onChangeText={handleChange('mealTypeCode')}
                      value={values.mealTypeCode}
                      placeholder="Item Code"
                      placeholderTextColor={colors.grey}
                    />
                  </View> */}
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={[
                        styles.text,
                        {
                          marginVertical: verticalScale(-5),
                        },
                      ]}
                      selectedValue={values.mealTypeCode}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({...values, mealTypeCode: itemValue});
                      }}>
                      {!values.mealTypeCode && (
                        <Picker.Item
                          style={styles.text}
                          label={'Select Meal Code'}
                          value=""
                        />
                      )}
                      {getItemCodeResponse?.response?.map((item, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            style={{fontSize: 12}}
                            label={item?.menuitemcode}
                            value={item?.menuitemcode}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  {errors.mealTypeCode && touched.mealTypeCode ? (
                    <Text style={styles.error}>{errors.mealTypeCode}</Text>
                  ) : null}
                </View>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>Upload Image</Text>
                  <RenderUploadButton
                    setImageUrl={document =>
                      setValues({...values, menuImages: document})
                    }
                  />
                  {errors.menuImages && touched.menuImages ? (
                    <Text style={styles.error}>{errors.menuImages}</Text>
                  ) : null}
                </View>
                {values.menuImages && (
                  <View style={styles.documentBox}>
                    <Image
                      source={{uri: values?.menuImages}}
                      style={styles.document}
                    />
                    <TouchableOpacity
                      // disabled={!editable}
                      onPress={() => setValues({...values, menuImages: ''})}
                      style={styles.closeButton}>
                      <Icon name={'xmark'} size={15} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}

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

export default Add_Menu_Image;

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
  text: {
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
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
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
});
