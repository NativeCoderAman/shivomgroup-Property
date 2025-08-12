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
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Card from '../cards/Card';
import {Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {
  addSubscriptionPlanThunkAPI,
  subscriptionFeaturesDetailsByFilterThunkAPI,
} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';

const validationSchema = Yup.object().shape({
  totalSeats: Yup.string().required('Total seats is required'),
  planPrice: Yup.string().required('Plan price is required'),
  planDiscount: Yup.string().required('Discount is required'),
  totalAmount: Yup.string().required('Total Amount is required'),
  gstAmount: Yup.string().required('Total Amount included GST is required'),
  priviousRemainingAmount: Yup.string().nullable(),
  totalPayableAmount: Yup.string().required('Payable Amount is required'),
});
const PayNow_Modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  data,
}) => {
  const dispatch = useDispatch();
  const incGstPrice = String(
    data?.totalSeats * data?.subs_price +
      ((data?.totalSeats * data?.subs_price) / 100) * 18,
  );
  const prevRemainingAmount =
    data?.calculationData?.length !== 0
      ? data?.calculationData?.remaningUpgradedAmount
      : '0';
  const INITIAL_DATA = {
    totalSeats: String(data?.totalSeats),
    packageCode: data?.packagecode,
    planPrice: data?.subscription_price,
    planDiscount: data?.subs_price,
    totalAmount: String(data?.totalSeats * data?.subs_price),
    gstAmount: incGstPrice,
    priviousRemainingAmount: String(prevRemainingAmount),
    totalPayableAmount: String(Math.ceil(incGstPrice - prevRemainingAmount)),
  };
  const handleSubmit = values => {
    const ids = {
      totalSeats: values?.totalSeats,
      packageCode: values?.packageCode,
      packageName: data?.PlanName,
      planDuration: data?.PlanDuration,
      planPrice: data?.subs_price,
      totalPaybleAmount: values?.totalPayableAmount,
    };
    dispatch(addSubscriptionPlanThunkAPI(ids))
      .then(res => {
        if (res?.payload?.status == true) {
          dispatch(
            subscriptionFeaturesDetailsByFilterThunkAPI(
              `?duration=${data?.PlanDuration}&planType=${data?.PlanType}`,
            ),
          );
          bottomSheetRef.current?.close();
          alertMessage(res?.payload?.message);
        }
      })
      .catch();
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
          <Text style={styles.title}>Estimate</Text>
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
                    <Text style={styles.inputTitle}>{'Total Seats'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('totalSeats')}
                        value={values?.totalSeats}
                        placeholder="Total Seats"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Icon name={'bed'} size={15} color={colors.black} />
                      </View>
                    </View>
                    {errors?.totalSeats && touched?.totalSeats ? (
                      <Text style={styles.error}>{errors.totalSeats}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {`${data?.PlanName}(${data?.PlanDuration}) (${data?.PlanType})`}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('planPrice')}
                        value={values?.planPrice}
                        placeholder="S-mart Basic(1 Year) (Mobile)"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Text styles={styles.inputTitle}>
                          <Icon
                            name={'indian-rupee-sign'}
                            size={15}
                            color={colors.black}
                          />
                          {'/'}
                          <Icon name={'bed'} size={15} color={colors.black} />
                        </Text>
                      </View>
                    </View>
                    {errors?.planPrice && touched?.planPrice ? (
                      <Text style={styles.error}>{errors.planPrice}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {`After Discount On Plan(${data?.sub_discount}%)`}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('planDiscount')}
                        value={values?.planDiscount}
                        placeholder="After Discount On Plan"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Text styles={styles.inputTitle}>
                          <Icon
                            name={'indian-rupee-sign'}
                            size={15}
                            color={colors.black}
                          />
                          {'/'}
                          <Icon name={'bed'} size={15} color={colors.black} />
                        </Text>
                      </View>
                    </View>
                    {errors?.planDiscount && touched?.planDiscount ? (
                      <Text style={styles.error}>{errors.planDiscount}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Total Amount'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('totalAmount')}
                        value={values?.totalAmount}
                        placeholder="Total Amount"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Icon
                          name={'indian-rupee-sign'}
                          size={15}
                          color={colors.black}
                        />
                      </View>
                    </View>
                    {errors?.totalAmount && touched?.totalAmount ? (
                      <Text style={styles.error}>{errors.totalAmount}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {`Total Amount(Included (${data?.tax_rate}%)GST)`}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('gstAmount')}
                        value={values?.gstAmount}
                        placeholder="Total Amount(Included GST)"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Icon
                          name={'indian-rupee-sign'}
                          size={15}
                          color={colors.black}
                        />
                      </View>
                    </View>
                    {errors?.gstAmount && touched?.gstAmount ? (
                      <Text style={styles.error}>{errors.gstAmount}</Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {'Privious Plan Remaning'}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('priviousRemainingAmount')}
                        value={values?.priviousRemainingAmount}
                        placeholder="Privious Plan Remaning"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Icon
                          name={'indian-rupee-sign'}
                          size={15}
                          color={colors.black}
                        />
                      </View>
                    </View>
                    {errors?.priviousRemainingAmount &&
                    touched?.priviousRemainingAmount ? (
                      <Text style={styles.error}>
                        {errors.priviousRemainingAmount}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>
                      {'Total Payble Amount'}
                    </Text>
                    <View style={styles.inputView}>
                      <TextInput
                        onChangeText={handleChange('totalPayableAmount')}
                        value={values?.totalPayableAmount}
                        placeholder="Total Payble Amount"
                        placeholderTextColor={colors.grey}
                        style={styles.inputText}
                      />
                      <View style={styles.rightView}>
                        <Icon
                          name={'indian-rupee-sign'}
                          size={15}
                          color={colors.black}
                        />
                      </View>
                    </View>
                    {errors?.totalPayableAmount &&
                    touched?.totalPayableAmount ? (
                      <Text style={styles.error}>
                        {errors.totalPayableAmount}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}>
                    <Text style={styles.text}>Pay Now</Text>
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

export default PayNow_Modal;

const styles = StyleSheet.create({
  Container: {
    // flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: horizontalScale(20),
    backgroundColor: '#000000aa',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    // height: verticalScale(300),
    width: '95%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    padding: horizontalScale(12),
  },
  detailsContainer: {
    padding: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(5),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignSelf: 'center',
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
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
  inputView: {
    width: '100%',
    flexDirection: 'row',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
  },
  rightView: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: colors.lightygrey,
  },
  inputText: {
    paddingHorizontal: horizontalScale(12),
    color: colors.black,
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Regular',
    width: '80%',
  },
  text: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
