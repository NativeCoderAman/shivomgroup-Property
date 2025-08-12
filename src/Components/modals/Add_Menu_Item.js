import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {colors} from '../../Utils/Colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  createMenuItemsThunkAPI,
  menuItemsViewThunkAPI,
} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
import { showMessage } from 'react-native-flash-message';

const validationSchema = Yup.object().shape({
  mealTypes: Yup.array()
    .min(1, 'Meal Type is required') // Ensure at least one meal type is selected
    .required('Meal Type is required'),
  itemCode: Yup.string().required('Item Code is required'),
  itemName: Yup.string().required('Item name is required'),
});

const Add_Menu_Item = ({bottomSheetRef, snapPoints}) => {
  const INITIAL_DATA = {
    mealTypes: [],
    itemCode: null,
    itemName: null,
  };
  const [mealTypesName, setMealTypesName] = useState([]);

  const {getMealTypesResponse} = useSelector(state => state.root.foodData);

  const handleSelectMeal = (meal, setValues) => {
    setMealTypesName(prev => [...prev, meal]);
  };
  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    dispatch(createMenuItemsThunkAPI(values))
      .then((res) => {
        if (res?.payload?.status === true) {
          Alert.alert('Success', res.payload.message);
          dispatch(menuItemsViewThunkAPI());
          bottomSheetRef.current?.close();
        } else {
          Alert.alert('Failed', 'Something went wrong!');
        }
      })
      .catch((err) => {
        Alert.alert('Error', 'Something went wrong!');
      });
  };
  
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onDismiss={() => {
        setMealTypesName([]);
      }}
    >
      <BottomSheetScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Menu Item</Text>
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
                  {mealTypesName.length !== 0 && (
                    <View
                      style={[
                        styles.inputView,
                        {alignItems: 'center', flexDirection: 'row', gap: 6},
                      ]}>
                      <BottomSheetScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{gap: 6, alignItems: 'center'}}>
                        {mealTypesName?.map((item, i) => (
                          <View key={i} style={styles.itemChip}>
                            <Text style={styles.text}>
                              {item?.category_name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setMealTypesName(
                                  mealTypesName.filter(
                                    meal =>
                                      meal?.category_name !==
                                      item?.category_name,
                                  ),
                                );
                                setValues({
                                  ...values,
                                  mealTypes: values.mealTypes?.filter(
                                    v => v !== item?.id,
                                  ),
                                });
                              }}>
                              <Icon
                                name={'xmark'}
                                size={15}
                                color={colors.grey}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </BottomSheetScrollView>
                    </View>
                  )}
                  <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={{
                        color: colors.grey,
                        fontSize: moderateScale(10),
                        marginVertical: verticalScale(-5),
                      }}
                      itemStyle={{
                        fontSize: moderateScale(10),
                      }}
                      selectedValue={mealTypesName}
                      onValueChange={(itemValue, itemIndex) => {
                        if (
                          itemValue &&
                          !values.mealTypes?.includes(itemValue.id)
                        ) {
                          setValues({
                            ...values,
                            mealTypes: [...values.mealTypes, itemValue.id],
                          });
                          handleSelectMeal(itemValue, setValues);
                        }
                      }}>
                      <Picker.Item
                        style={{fontSize: 12}}
                        label={'Select Meal Type'}
                        value={null}
                      />

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
                  {errors.mealTypes && touched.mealTypes ? (
                    <Text style={styles.error}>{errors.mealTypes}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>Item Code</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.text}
                      onChangeText={handleChange('itemCode')}
                      value={values.itemCode}
                      placeholder="Item Name"
                      placeholderTextColor={colors.grey}
                    />
                  </View>
                  {errors.itemCode && touched.itemCode ? (
                    <Text style={styles.error}>{errors.itemCode}</Text>
                  ) : null}
                </View>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Item Name'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.text}
                      onChangeText={handleChange('itemName')}
                      value={values.itemName}
                      placeholder="Item Name"
                      placeholderTextColor={colors.grey}
                    />
                  </View>
                  {errors.itemName && touched.itemName ? (
                    <Text style={styles.error}>{errors.itemName}</Text>
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

export default Add_Menu_Item;

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
  textLabel: {
    color: colors.black,
    fontSize: moderateScale(10),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
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
