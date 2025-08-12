import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  useWindowDimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
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
import Header from '../headers/Header';
import {useDispatch, useSelector} from 'react-redux';
import {
  getElectricityBillRecordsForStudentThunkAPI,
  getSalesItemDetailsThunkAPI,
  getSalesItemsThunkAPI,
} from '../../Service/api/thunks';
import {Picker} from '@react-native-picker/picker';
import {setSalesItems} from '../../Service/slices/saleSlice';
import alertMessage from '../../Utils/alert';
import Loader from '../../Utils/Loader';

const validationSchema = Yup.object().shape({
  itemName: Yup.string().required('Item Name is required'),
  itemRate: Yup.number().required('Item Rate is required'),
  itemQuantity: Yup.number().min(1).required('Item Quantity is required'),
  itemDiscount: Yup.number().max(100),
});

const Sale_Items = ({navigation, route}) => {
  const {roomNumber, studentId} = route.params;
  const INITIAL_DATA = {
    itemId: null,
    electricityId: null,
    itemName: null,
    itemRate: null,
    itemQuantity: '1',
    itemTax: null,
    itemDiscount: '0',
    itemAmount: null,
  };
  const [electricityMonth, setElectricityMonth] = useState(null);
  const dispatch = useDispatch();
  const {
    getSalesItemsResponse,
    getElectricityBillRecordsForStudentResponse,
    salesItems,
  } = useSelector(state => state.root.salesData);
  useEffect(() => {
    dispatch(getSalesItemsThunkAPI());
  }, []);

  const handleSubmit = values => {

    if (!salesItems?.response?.some(item => item.itemId === values?.itemId)) {
      dispatch(setSalesItems(values)),
        ToastAndroid.show('Item added successfully!', 50),
        navigation.goBack();
    }
    alertMessage('Cann`t add multiple Electricity item in sale');
  };

  return (
    <View style={[styles.contentContainer,{paddingTop:verticalScale(53)}]}>
      {/* <Header title={'Add Sales Item'} /> */}
      <Loader
        loading={
          getElectricityBillRecordsForStudentResponse?.loading ||
          getSalesItemsResponse?.loading
        }
      />
      <View>
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
            <View style={styles.content}>
              <View style={{gap: 5}}>
                <Text style={styles.inputTitle}>{'Item Name'}</Text>
                <View
                  style={[
                    styles.inputView,
                    {paddingHorizontal: horizontalScale(0)},
                  ]}>
                  <Picker
                    dropdownIconColor={colors.grey}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.grey,
                      color: colors.grey,
                      fontSize: moderateScale(10),
                      marginTop: verticalScale(-5),
                      paddingHorizontal: horizontalScale(-12),
                    }}
                    selectedValue={values?.itemName}
                    onValueChange={(itemValue, itemIndex) => {
                      const data = {
                        roomNumber: roomNumber,
                        itemId: itemValue?.itemId,
                        studentId: null,
                        ElectricityDate: null,
                        itemCode: itemValue?.itemCode,
                      };
                      itemValue?.itemCode === 'e01'
                        ? dispatch(
                            getElectricityBillRecordsForStudentThunkAPI(
                              studentId,
                            ),
                          )
                            .then(res => {
                              const resp = res?.payload?.data;
                              if (resp?.length !== 0) {
                                alertMessage(res?.payload?.message);
                              } else {
                                alertMessage('Electricity bill not available');
                              }
                              setValues({
                                itemName: itemValue?.itemName,
                                itemId: itemValue?.itemId,
                              });
                            })
                            .catch(err => {
                            })
                        : dispatch(getSalesItemDetailsThunkAPI(data))
                            .then(res => {
                              const data = res?.payload?.data;
                              setValues({
                                ...values,
                                itemName: itemValue?.itemName,
                                itemId: itemValue?.itemId,
                                itemRate: String(data?.rate),
                                itemAmount: String(data?.amount),
                                itemTax: String(data?.tax),
                              });
                            })
                            .catch(err => {
                            });
                    }}>
                    {values?.itemName ? (
                      <Picker.Item
                        label={values?.itemName}
                        value={values?.itemName}
                      />
                    ) : (
                      <Picker.Item label={'Item Name'} value={''} />
                    )}
                    {getSalesItemsResponse?.response?.map((item, i) => {
                      return item?.itemName !== values?.itemName ? (
                        <Picker.Item
                          key={i}
                          label={item?.itemName}
                          value={item}
                        />
                      ) : null;
                    })}
                  </Picker>
                </View>
                {errors?.itemName && touched?.itemName ? (
                  <Text style={styles.error}>{errors.itemName}</Text>
                ) : null}
              </View>
              {getElectricityBillRecordsForStudentResponse?.response?.length !==
                0 && values?.itemId === 'e01' ? (
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'Select Month'}</Text>
                  <View
                    style={[
                      styles.inputView,
                      {paddingHorizontal: horizontalScale(0)},
                    ]}>
                    <Picker
                      dropdownIconColor={colors.grey}
                      style={styles.pikerStyle}
                      selectedValue={electricityMonth}
                      onValueChange={(itemValue, itemIndex) => {
                        setValues({
                          ...values,
                          electricityId: itemValue?.elctricityId,
                          itemRate: String(itemValue?.Amount),
                          itemAmount: String(itemValue?.Amount),
                          itemTax: String(0),
                        });
                        setElectricityMonth(itemValue?.billDate);
                      }}>
                      {electricityMonth ? (
                        <Picker.Item
                          label={electricityMonth}
                          value={electricityMonth}
                        />
                      ) : (
                        <Picker.Item label={'Select Month'} value={''} />
                      )}
                      {getElectricityBillRecordsForStudentResponse?.response?.map(
                        (item, i) => {
                          return (
                            <Picker.Item
                              key={i}
                              label={item?.billDate}
                              value={item}
                            />
                          );
                        },
                      )}
                    </Picker>
                  </View>
                </View>
              ) : null}
              <View style={{width: '100%', flexDirection: 'row', gap: 10}}>
                <View style={{gap: 5, width: '48%'}}>
                  <Text style={styles.inputTitle}>{'Quantity'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Quantity"
                      placeholderTextColor={colors.grey}
                      value={values.itemQuantity}
                      keyboardType="numeric"
                      onChangeText={text => {
                        const tax =
                          ((values?.itemRate * text) / 100) * values?.itemTax;
                        setValues({
                          ...values,
                          itemQuantity: text,
                          itemAmount: String(
                            Number(values?.itemRate) * Number(text) +
                              Number(tax),
                          ),
                        });
                      }}
                      style={styles.text}
                    />
                  </View>
                  {errors?.itemQuantity && touched?.itemQuantity ? (
                    <Text style={styles.error}>{errors.itemQuantity}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5, width: '48%'}}>
                  <Text style={styles.inputTitle}>{'Item Rate'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Item Rate"
                      placeholderTextColor={colors.grey}
                      value={values.itemRate}
                      onChangeText={handleChange('itemRate')}
                      editable={false}
                      style={styles.text}
                    />
                  </View>
                  {errors?.itemRate && touched?.itemRate ? (
                    <Text style={styles.error}>{errors.itemRate}</Text>
                  ) : null}
                </View>
              </View>
              <View style={{width: '100%', flexDirection: 'row', gap: 10}}>
                <View style={{gap: 5, width: '48%'}}>
                  <Text style={styles.inputTitle}>{'Tax (%)'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Tax"
                      placeholderTextColor={colors.grey}
                      value={values.itemTax}
                      onChangeText={handleChange('itemTax')}
                      editable={false}
                      style={styles.text}
                    />
                  </View>
                  {errors?.itemTax && touched?.itemTax ? (
                    <Text style={styles.error}>{errors.itemTax}</Text>
                  ) : null}
                </View>

                <View style={{gap: 5, width: '48%'}}>
                  <Text style={styles.inputTitle}>{'Discount  (%)'}</Text>
                  <View style={styles.inputView}>
                    <TextInput
                      placeholder="Discount"
                      placeholderTextColor={colors.grey}
                      style={styles.text}
                      value={values.itemDiscount}
                      keyboardType="numeric"
                      onChangeText={text => {
                        const tax =
                          ((values?.itemRate * values?.itemQuantity) / 100) *
                          values?.itemTax;
                        const amount =
                          values?.itemRate * values?.itemQuantity + tax;

                        const disc =
                          ((Number(values?.itemRate) *
                            Number(values?.itemQuantity)) /
                            100) *
                          text;
                        setValues({
                          ...values,
                          itemDiscount: text,
                          itemAmount: String(amount - disc),
                        });
                      }}
                      onBlur={text => {}}
                    />
                  </View>
                  {errors?.itemDiscount && touched?.itemDiscount ? (
                    <Text style={styles.error}>{errors.itemDiscount}</Text>
                  ) : null}
                </View>
              </View>
              <View style={{gap: 5}}>
                <Text style={styles.inputTitle}>{'Amount'}</Text>
                <View style={styles.inputView}>
                  <TextInput
                    placeholder="Amount"
                    style={styles.text}
                    placeholderTextColor={colors.grey}
                    value={values.itemAmount}
                    onChangeText={handleChange('itemAmount')}
                    editable={false}
                  />
                </View>
                {errors?.itemAmount && touched?.itemAmount ? (
                  <Text style={styles.error}>{errors.itemAmount}</Text>
                ) : null}
              </View>

              <TouchableOpacity style={[styles.button]} onPress={handleSubmit}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: colors.white,
                      fontSize: moderateScale(16),
                    },
                  ]}>
                  Submit  
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default memo(Sale_Items);

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
    paddingBottom: verticalScale(80),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    padding: verticalScale(12),
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
  pikerStyle: {
    borderWidth: 1,
    borderColor: colors.grey,
    color: colors.grey,
    fontSize: moderateScale(10),
    marginTop: verticalScale(-5),
    paddingHorizontal: horizontalScale(-12),
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  buttonTab: {
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: 4,
  },
  btnText: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
  text: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
  },
  error: {
    color: colors.red,
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
  },
});
