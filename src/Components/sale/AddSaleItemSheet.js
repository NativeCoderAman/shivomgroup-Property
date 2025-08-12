import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import { colors } from '../../Utils/Colors';
import {
  getElectricityBillRecordsForStudentThunkAPI,
  getSalesItemDetailsThunkAPI,
  getSalesItemsThunkAPI,
} from '../../Service/api/thunks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';
import moment from 'moment';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Item Name is required'),
  rate: Yup.number().required('Item Rate is required'),
  quantity: Yup.number().min(1).required('Item Quantity is required'),
  discount: Yup.number().max(100).required('Item Rate is required'),
  amount: Yup.number().min(0).required('Item amount is required'),
  tax: Yup.number().min(0).required('Item tax is required'),
});

const AddSaleItemSheet = ({
  bottomSheetRef,
  snapPoints,
  candidateId,
  roomNo,
  salesItems,
  onAddData,
  title,
}) => {
  let INITIAL_DATA;
  if (title === 'Estimation') {
    INITIAL_DATA = {
      id: '0',
      name: '',
      rate: '',
      quantity: '1',
      tax: '',
      discount: '0',
      discountedAmount: '100',
      amount: '',
    };
  } else {
    INITIAL_DATA = {
      id: '0',
      name: '',
      rate: '',
      quantity: '1',
      tax: '',
      discount: '0',
      amount: '',
    };
  }

  const [electricityMonth, setElectricityMonth] = useState(null);
  const [itemLoading, setItemLoading] = useState(true);
  const dispatch = useDispatch();
  const { getSalesItemsResponse, getElectricityBillRecordsForStudentResponse } =
    useSelector(state => state.root.salesData);
  const { roomsListResponse } = useSelector(state => state.root.registerData);

  const getActualRoom = roomsListResponse?.response?.rooms?.some(item =>
    item.includes(roomNo)
  );

  useEffect(() => {
    dispatch(getSalesItemsThunkAPI());
  }, []);

  const handleSubmit = values => {
    if (!salesItems.some(item => item.id === values?.id)) {
      onAddData(values);
      ToastAndroid.show('Item added successfully.', 50);
      bottomSheetRef.current.close();
    } else {
      ToastAndroid.show('Item already exists in the list', 50);
    }
  };

  return (
    <BottomSheetModal ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
      <BottomSheetScrollView>
        <View style={[styles.contentContainer]}>
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
                handleSubmit,
                values,
                setValues,
                errors,
                touched,
              }) => (
                <View style={styles.content}>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Item Name'}</Text>
                    <View
                      style={[
                        styles.inputView,
                        { paddingHorizontal: horizontalScale(0) },
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
                        selectedValue={values?.name}
                        onValueChange={(itemValue, itemIndex) => {
                          const data = {
                            itemCode: itemValue?.itemCode,
                            roomNumber: roomNo,
                            itemId: itemValue?.itemId,
                            studentId: null,
                            ElectricityDate: null,
                          };
                          setItemLoading(false);

                          if (itemValue?.itemCode === 'e01') {
                            dispatch(getElectricityBillRecordsForStudentThunkAPI(candidateId))
                              .then(res => {
                                const resp = res?.payload?.data;

                                if (resp?.length !== 0) {
                                  alertMessage(res?.payload?.message);
                                } else {
                                  alertMessage('Electricity bill not available for the tenant.');
                                }

                                setValues(prev => ({
                                  ...prev,
                                  name: itemValue?.itemName,
                                  id: itemValue?.itemId,
                                }));
                              })
                              .catch(err => {
                                console.error(err);
                              })
                              .finally(() => {
                                setItemLoading(false);
                              });
                          } else {
                            dispatch(getSalesItemDetailsThunkAPI(data))
                              .then(res => {
                                const data = res?.payload?.data;
                                setValues(prev => ({
                                  ...prev,
                                  name: itemValue?.itemName,
                                  id: itemValue?.itemId,
                                  rate: String(data?.rate),
                                  amount: String(data?.amount),
                                  tax: String(data?.tax),
                                }));
                              })
                              .catch(err => {
                                console.error(err);
                              })
                              .finally(() => {
                              });
                          }
                        }}

                      >
                        {values?.name ? (
                          <Picker.Item
                            label={values?.name?.toUpperCase()}
                            value={values?.id}
                          />
                        ) : (
                          <Picker.Item label={'Select Item'} value={''} />
                        )}
                        {getSalesItemsResponse?.response?.map((item, i) => {
                          const disabledExactItems = ['room rent', 'electricity bill'];
                          const itemNameLower = item.itemName?.toLowerCase().trim();
                          const shouldDisable =
                            disabledExactItems.includes(itemNameLower) && !getActualRoom;
                          return item?.itemName !== values?.name ? (
                            <Picker.Item
                              key={i}
                              enabled={!shouldDisable}
                              label={item?.itemName?.toUpperCase() || ''}
                              value={item}
                              style={{ textTransform: 'capitalize' }}
                            />
                          ) : null;
                        })}
                      </Picker>
                    </View>
                    {errors?.name && touched?.name ? (
                      <Text style={styles.error}>{errors.name}</Text>
                    ) : null}
                  </View>
                  {getElectricityBillRecordsForStudentResponse?.response
                    ?.length !== 0 && values?.id === 'e01' ? (
                    <View style={{ gap: 5 }}>
                      <Text style={styles.inputTitle}>{'Select Month'}</Text>
                      <View
                        style={[
                          styles.inputView,
                          { paddingHorizontal: horizontalScale(0) },
                        ]}>
                        <Picker
                          dropdownIconColor={colors.grey}
                          style={styles.pikerStyle}
                          selectedValue={electricityMonth}
                          onValueChange={(itemValue, itemIndex) => {
                            setValues({
                              ...values,
                              electricityId: itemValue?.elctricityId,
                              rate: String(itemValue?.Amount),
                              amount: String(itemValue?.Amount),
                              tax: String(0),
                            });

                            setElectricityMonth(itemValue?.billDate);
                          }}>
                          {electricityMonth ? (
                            <Picker.Item
                              label={moment(electricityMonth).format('DD-MMM-YYYY')}
                              value={electricityMonth}
                            />
                          ) : (
                            <Picker.Item label={'Select Month'} value={''} />
                          )}
                          {getElectricityBillRecordsForStudentResponse?.response
                            ?.filter(
                              item => item?.billDate !== electricityMonth,
                            )
                            ?.map((item, i) => (
                              <Picker.Item
                                key={i}
                                label={moment(item?.billDate).format('DD-MMM-YYYY')}
                                value={item}
                              />
                            ))}
                        </Picker>
                      </View>
                    </View>
                  ) : null}
                  <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
                    <View style={{ gap: 5, width: '48%' }}>
                      <Text style={styles.inputTitle}>{'Quantity'}</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Quantity"
                          placeholderTextColor={colors.grey}
                          value={values.quantity}
                          keyboardType="numeric"
                          onChangeText={text => {
                            const tax =
                              ((values?.rate * text) / 100) * values?.tax;
                            const disc =
                              ((values?.rate * text + tax) / 100) *
                              values?.discount;
                            setValues({
                              ...values,
                              quantity: text,
                              amount: String(
                                Number(values?.rate) * Number(text) +
                                Number(tax) -
                                Number(disc),
                              ),
                            });
                          }}
                          style={styles.text}
                        />
                      </View>
                      {errors?.quantity && touched?.quantity ? (
                        <Text style={styles.error}>{errors.quantity}</Text>
                      ) : null}
                    </View>

                    <View style={{ gap: 5, width: '48%' }}>
                      <Text style={styles.inputTitle}>{'Item Rate'}</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Item Rate"
                          placeholderTextColor={colors.grey}
                          value={values.rate}
                          onChangeText={handleChange('rate')}
                          editable={false}
                          style={styles.text}
                        />
                      </View>
                      {errors?.rate && touched?.rate ? (
                        <Text style={styles.error}>{errors.rate}</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
                    <View style={{ gap: 5, width: '48%' }}>
                      <Text style={styles.inputTitle}>{'Tax (%)'}</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Tax"
                          placeholderTextColor={colors.grey}
                          value={values.tax}
                          onChangeText={handleChange('tax')}
                          editable={false}
                          style={styles.text}
                        />
                      </View>
                      {errors?.tax && touched?.tax ? (
                        <Text style={styles.error}>{errors.tax}</Text>
                      ) : null}
                    </View>

                    <View style={{ gap: 5, width: '48%' }}>
                      <Text style={styles.inputTitle}>{'Discount  (%)'}</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Discount"
                          placeholderTextColor={colors.grey}
                          style={styles.text}
                          value={values.discount}
                          keyboardType="numeric"
                          onChangeText={text => {
                            const tax =
                              ((values?.rate * values?.quantity) / 100) *
                              values?.tax;
                            const amount =
                              values?.rate * values?.quantity + tax;

                            const disc =
                              ((Number(values?.rate) *
                                Number(values?.quantity)) /
                                100) *
                              text;
                            setValues({
                              ...values,
                              discount: text,
                              amount: String(amount - disc),
                            });
                          }}
                          onBlur={text => { }}
                          maxLength={3}
                        />
                      </View>
                      {errors?.discount && touched?.discount ? (
                        <Text style={styles.error}>{errors.discount}</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Amount'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Amount"
                        style={styles.text}
                        placeholderTextColor={colors.grey}
                        value={values.amount}
                        onChangeText={handleChange('amount')}
                        editable={false}
                      />
                    </View>
                    {errors?.amount && touched?.amount ? (
                      <Text style={styles.error}>{errors.amount}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    disabled={itemLoading}
                    style={[styles.button,{backgroundColor: !itemLoading?colors.AppDefaultColor:"gray",}]}
                    onPress={handleSubmit}>
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
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default AddSaleItemSheet;

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
