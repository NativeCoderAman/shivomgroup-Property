import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '../../Utils/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import alertMessage from '../../Utils/alert';
import {
  createNewSaleItemsThunkAPI,
  getSalesItemDataThunkAPI,
  updateSalesItemThunkAPI,
} from '../../Service/api/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from 'react-native-elements';

const validationSchema = Yup.object().shape({
  itemcode: Yup.string().required('Item Code is required'),
  itemname: Yup.string().required('Item Name number is required'),
  rate: Yup.number().required('Item Rate is required'),
  tax: Yup.number().required('Item Tax date is required'),
  amount: Yup.number().required('Item Amount is required'),
});

const Add_Item_Model = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  mode,
  item,
}) => {
  const INITIAL_DATA =
    mode === 'create'
      ? {
        itemcode: null,
        itemname: null,
        rate: null,
        tax: null,
        amount: 0,
      }
      : {
        itemcode: item.itemcode,
        itemname: item.itemname,
        rate: String(item.rate),
        tax: String(item.tax),
        amount: String(item.amount),
      };
  const dispatch = useDispatch();
  const { roomsListResponse } = useSelector(state => state.root.registerData);
  const handleResponse = res => {
    if (res?.payload?.status === true) {
      dispatch(getSalesItemDataThunkAPI());
      alertMessage(res?.payload?.message);
      bottomSheetRef?.current?.dismiss();
    } else {
      alertMessage('Something went wrong!');
    }
  };

  const handleError = err => {
    alertMessage('Something went wrong!');
  };

  const handleSubmit = values => {
    if (mode === 'create') {
      dispatch(createNewSaleItemsThunkAPI(values))
        .then(handleResponse)
        .catch(handleError);
    } else {
      dispatch(updateSalesItemThunkAPI({ id: item?.id, data: values }))
        .then(handleResponse)
        .catch(handleError);
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <Text style={styles.title}>
        {mode === 'create' ? 'Add' : 'Update'} Item
      </Text>
      <Divider width={1} orientation='horizontal' />
      <BottomSheetScrollView>
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
              <View style={styles.modalContainer}>
                <View style={styles.content}>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Item Code'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Item Code"
                        placeholderTextColor={colors.grey}
                        value={values.itemcode}
                        onChangeText={handleChange('itemcode')}
                        style={styles.text}
                      />
                    </View>
                    {errors.itemcode && touched.itemcode ? (
                      <Text style={styles.error}>{errors.itemcode}</Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Item Name'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Item Name"
                        placeholderTextColor={colors.grey}
                        value={values.itemname}
                        onChangeText={handleChange('itemname')}
                        style={styles.text}
                      />
                    </View>
                    {errors.itemname && touched.itemname ? (
                      <Text style={styles.error}>{errors.itemname}</Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Rate'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Rate"
                        placeholderTextColor={colors.grey}
                        value={values.rate}
                        onChangeText={text => {
                          let totalTax =
                            (Number(values.tax) / 100) * Number(text);
                          setValues({
                            ...values,
                            rate: text,
                            amount: Number(text) + Number(totalTax),
                          });
                        }}
                        style={styles.text}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.rate && touched.rate ? (
                      <Text style={styles.error}>{errors.rate}</Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Tax'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Tax"
                        value={values.tax}
                        placeholderTextColor={colors.grey}
                        onChangeText={text => {
                          let totalTax =
                            (Number(text) / 100) * Number(values.rate);
                          setValues({
                            ...values,
                            tax: text,
                            amount: Number(values.rate) + Number(totalTax),
                          });
                        }}
                        style={styles.text}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.tax && touched.tax ? (
                      <Text style={styles.error}>{errors.tax}</Text>
                    ) : null}
                  </View>
                  <View style={{ gap: 5 }}>
                    <Text style={styles.inputTitle}>{'Amount'}</Text>
                    <View style={styles.inputView}>
                      <TextInput
                        placeholder="Amount"
                        value={String(values.amount)}
                        placeholderTextColor={colors.grey}
                        onChangeText={text =>
                          setValues({ ...values, amount: text })
                        }
                        editable={false}
                        style={styles.text}
                        keyboardType="numeric"
                      />
                    </View>
                    {errors.amount && touched.amount ? (
                      <Text style={styles.error}>{errors.amount}</Text>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={[styles.button]}>
                  <Text
                    style={{ color: colors.white, fontSize: moderateScale(16), fontWeight: '500', textTransform: 'capitalize' }}>
                    {mode === 'create' ? 'Add' : 'Update'} Item
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default Add_Item_Model;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(80),
  },

  title: {
    fontSize: moderateScale(18),
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
  },
  content: {
    paddingTop: verticalScale(20),
    gap: verticalScale(6),
  },
  button: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(20),
    elevation: 2
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
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(5),
    paddingHorizontal: horizontalScale(12),
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
  text: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',

  },
  error: {
    color: colors.red,
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
  },
});
