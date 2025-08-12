import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import {colors} from '../../../Utils/Colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import moment from 'moment';
import Card from '../../../Components/cards/Card';
import TenantHeader from '../../Components/headers/TenantHeader';
import {
  tenantCreatePaymentInInvoiceThunkAPI,
  tenantGenrateSaleInvoiceThunkAPI,
  tenantStudentSalesDetailsThunkAPI,
} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../Utils/Loader';
import {useNavigation} from '@react-navigation/native';
import PaySheet from '../../Components/Modals/PaySheet';
import {ROOM_RENT_IC, TOTAL_DUE_IC} from '../../../Utils/Icons';
import BASE_URL from '../../../Utils/config';

const Account_Screen = ({navigation}) => {
  const [salesDetails, setSalesDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [review, setReview] = useState(null);

  const [paymentDetails, setPaymentDetails] = useState({});
  const [isPaySheetVisible, setPaySheetVisible] = useState(false);

  const openPaySheet = useCallback(details => {
    setPaymentDetails(details);
    setPaySheetVisible(true);
  }, []);

  const closePaySheet = () => {
    setPaySheetVisible(false);
  };

  const {tenantStudentSalesDetailsResponse} = useSelector(
    state => state.root?.clientProfileData,
  );

  const {token, hostelStatus, studentID} = useSelector(
    state => state.root?.clientAuth?.clientSessionData,
  );

  const dispatch = useDispatch();

  const fetchDetails = async () => {
    try {
      const res = await dispatch(tenantStudentSalesDetailsThunkAPI());
    } catch (error) {
      alertMessage('Something went wrong');
    }
  };

  useEffect(() => {
    if (hostelStatus === 3) {
      setReview(true);
    } else if (hostelStatus === 1) {
      navigation.navigate('Tenant_Details');
    } else if (hostelStatus !== 0) {
      fetchDetails();
    }
  }, [hostelStatus]);

  const onRefresh = useCallback(() => {
    if (hostelStatus !== 0) {
      setRefreshing(true);
      fetchDetails();
      setRefreshing(false);
    }
  }, [hostelStatus]);

  if (review) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <View style={styles.card}>
          <Text
            style={[
              styles.label,
              {fontSize: moderateScale(16), alignSelf: 'center'},
            ]}>
            Your Profile is under review
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('home')}
            style={styles.btn}>
            <Text style={[styles.label, {color: colors.white}]}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // funciton that is used for reminder
  const handleReminder = async () => {
    try {
    } catch (error) {}
  };

  const handleStatementClick = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}saleStatement/${studentID}?saleType=regSale`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.statusCode === 200) {
        // navigation.navigate('Pdf_Screen', {
        //   PDF_URL: response.data.data.download_link,
        //   title: 'Bill Pdf',
        // });
      } else {
        alertMessage('No data found!');
      }
    } catch (error) {
      alertMessage('Something went wrong');
    }
  };

  // this function run when user click on dues icon or button
  const handleTotalDuePress = () => {
    const title = 'Total Due';
    const icon = TOTAL_DUE_IC;
    const amount =
      tenantStudentSalesDetailsResponse?.response?.totalRemainingAmount;
    const salesDetails =
      tenantStudentSalesDetailsResponse?.response?.salesDetails;

    const invoicesWithRemainingAmount = salesDetails
      ?.filter(item => item.pendingAmount > 0)
      ?.map(item => item.invoiceNo)
      ?.join(', ');

    if (invoicesWithRemainingAmount?.length > 0) {
      openPaySheet({
        title,
        icon,
        amount,
        invoiceNo: invoicesWithRemainingAmount,
      });
    }
  };

  const ShowSaleCard = ({
    items,
    saleColor = colors.AppDefaultColor,
    sales,
    studentDetails,
    setIsLoading,
  }) => {
    const [isVisibleName, setIsVisibleName] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleSalesBillInvoice = async id => {
      try {
        const res = await dispatch(tenantGenrateSaleInvoiceThunkAPI(id));
        if (res?.payload?.status) {
          navigation.navigate('Pdf_Screen', {
            PDF_URL: res?.payload?.data?.download_link,
            title: 'Bill Pdf',
          });
          // Linking.openURL(res?.payload?.data?.download_link);
        } else {
          alertMessage('something went wrong');
        }
      } catch (error) {
        alertMessage('something went wrong');
      }
    };

    const handleSalesDuePress = () => {
      const title = items?.items?.map(item => item?.itemName).join(',');
      const icon = ROOM_RENT_IC;
      const amount = items?.pendingAmount;
      const invoiceNo = items?.invoiceNo;

      if (amount) {
        openPaySheet({title, icon, amount, invoiceNo});
      }
    };

    return (
      <Card>
        <View style={{gap: 8}}>
          {/* title with data nad invoice number view  */}
          <View style={[styles.flexRowSpace]}>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.easeInEaseOut(),
                  setIsVisibleName(prev => !prev);
              }}
              style={[
                styles.flexRowWithGap,
                {width: isVisibleName ? '100%' : '80%'},
              ]}>
              <Text
                style={[
                  styles.labelText,
                  {
                    fontSize: moderateScale(14),
                    width: isVisibleName ? '100%' : 'auto',
                    maxWidth: isVisibleName ? '100%' : '70%',
                  },
                ]}
                numberOfLines={1}>
                {items?.items?.map(item => item?.itemName).join(',')}
              </Text>
              {!isVisibleName && (
                <Text
                  style={[styles.labelText, {color: `${colors.darkgrey}70`}]}>
                  {`(${moment(
                    items?.saleDate ? items?.saleDate : moment.now(),
                  ).format('DD-MMM-YYYY')})`}
                </Text>
              )}
            </TouchableOpacity>
            {!isVisibleName && (
              <Text style={[styles.labelText, {color: `${colors.darkgrey}70`}]}>
                Invoice: {`#${items?.invoiceNo ? items?.invoiceNo : '00'} `}
              </Text>
            )}
          </View>

          <View style={[styles.flexRowSpace, {alignItems: 'center'}]}>
            <View style={{width: '20%', gap: verticalScale(2)}}>
              <Image
                source={require('../../../Assets/Icons/bed.png')}
                style={{
                  height: horizontalScale(40),
                  width: horizontalScale(40),
                  resizeMode: 'contain',
                }}
              />
            </View>

            <View style={{width: '20%', gap: verticalScale(2)}}>
              <Text style={[styles.labelText]}>Total</Text>
              <Text style={[styles.labelText, {fontSize: moderateScale(10)}]}>
                <Icon name={'indian-rupee-sign'} size={10} color={saleColor} />{' '}
                {Math.ceil(items?.total).toFixed(2)}
              </Text>
            </View>
            <View style={{width: '20%', gap: verticalScale(2)}}>
              <Text style={[styles.labelText]}>Paid</Text>
              <Text style={[styles.labelText, {fontSize: moderateScale(10)}]}>
                {' '}
                <Icon
                  name={'indian-rupee-sign'}
                  size={10}
                  color={saleColor}
                />{' '}
                {Math.ceil(items?.receiveAmount).toFixed(2)}
              </Text>
            </View>
            <View style={{width: '20%', gap: verticalScale(2)}}>
              <Text style={[styles.labelText]}>Pending</Text>
              <Text style={[styles.labelText, {fontSize: moderateScale(10)}]}>
                <Icon name={'indian-rupee-sign'} size={10} color={saleColor} />
                {items?.pendingAmount
                  ? Math.ceil(items?.pendingAmount).toFixed(2)
                  : Math.ceil(items?.unused).toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                width: '20%',
                alignItems: 'flex-end',
              }}>
              <View
                style={[
                  {
                    gap: verticalScale(5),
                    alignItems: 'center',
                  },
                ]}>
                {/* invoice buttton or icon  */}
                <TouchableOpacity
                  onPress={() => {
                    handleSalesBillInvoice(items?.invoiceNo);
                  }}
                  style={styles.iconButton}>
                  <Icon name={'print'} size={18} color={saleColor} />
                </TouchableOpacity>

                {/* Pay now or paid button  */}
                <TouchableOpacity
                  onPress={handleSalesDuePress}
                  style={[
                    {
                      padding: 4,
                      width: horizontalScale(60),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4,
                      backgroundColor: !items?.pendingAmount
                        ? colors.green
                        : colors.AppDefaultColor,
                    },
                  ]}>
                  <Text style={[styles.labelText, {color: colors.white}]}>
                    {items?.pendingAmount ? 'Pay now' : 'Paid'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  const ShowPaymentCard = ({
    item,
    saleColor = colors.green,
    studentDetails,
    roomNumber,
  }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handlePaymentInvoice = async id => {
      try {
        const res = await dispatch(tenantCreatePaymentInInvoiceThunkAPI(id));
        if (res?.payload?.status) {
          // Linking.openURL(res?.payload?.data?.download_link);
          navigation.navigate('Pdf_Screen', {
            PDF_URL: res?.payload?.data?.download_link,
            title: 'Bill Pdf',
          });
        } else {
          alertMessage('something went wrong');
        }
      } catch (error) {
        alertMessage('something went wrong');
      }
    };
    return (
      <Card>
        <View style={{gap: 8}}>
          <View style={[styles.flexRowSpace]}>
            <View style={[styles.flexRowWithGap]}>
              <Text
                style={[
                  styles.labelText,
                  {color: saleColor, fontSize: moderateScale(14)},
                ]}>
                Payment Done
              </Text>
              <Text style={[styles.labelText, {color: `${colors.darkgrey}70`}]}>
                {`(${moment(
                  item?.receiveDate ? item?.receiveDate : moment.now(),
                ).format('DD-MMM-YYYY')})`}
              </Text>
            </View>
            <Text style={[styles.labelText, {color: `${colors.darkgrey}70`}]}>
              Invoice: {`#${item?.invoiceNo ? item?.invoiceNo : '00'} `}
            </Text>
          </View>
          <View style={[styles.flexRowSpace, {alignItems: 'center'}]}>
            <View style={{width: '20%', gap: verticalScale(2)}}>
              <Image
                source={require('../../../Assets/Icons/payment.png')}
                style={{
                  height: horizontalScale(40),
                  width: horizontalScale(40),
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View style={{width: '25%', gap: verticalScale(2)}}>
              <Text style={[styles.labelText, {color: saleColor}]}>
                Received
              </Text>
              <Text
                style={[
                  styles.labelText,
                  {color: saleColor, fontSize: moderateScale(10)},
                ]}>
                {' '}
                <Icon
                  name={'indian-rupee-sign'}
                  size={10}
                  color={saleColor}
                />{' '}
                {Math.ceil(
                  item?.receiveAmount ? item?.receiveAmount : '00',
                ).toFixed(2)}
              </Text>
            </View>
            <View style={{width: '25%', gap: verticalScale(2)}}>
              <Text style={[styles.labelText, {color: saleColor}]}>Unused</Text>
              <Text
                style={[
                  styles.labelText,
                  {color: saleColor, fontSize: moderateScale(10)},
                ]}>
                <Icon name={'indian-rupee-sign'} size={10} color={saleColor} />{' '}
                {Math.ceil(
                  item?.unusedAmount ? item?.unusedAmount : '00',
                ).toFixed(2)}
              </Text>
            </View>
            <View style={{width: '30%', alignItems: 'flex-end'}}>
              <View
                style={[
                  {
                    width: horizontalScale(60),
                    alignItems: 'center',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => handlePaymentInvoice(item?.id)}
                  style={styles.iconButton}>
                  <Icon name={'print'} size={18} color={saleColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TenantHeader title={'Account'} />
      <Loader loading={tenantStudentSalesDetailsResponse?.loading} />

      {/* reminder , statement and due button view  */}
      <View
        style={[
          styles.flexRowSpace,
          {
            justifyContent: 'space-around',
            paddingHorizontal: horizontalScale(12),
          },
        ]}>
        {/* Reminder icon and button */}
        <TouchableOpacity
          style={[styles.flexRowWithGap]}
          onPress={handleReminder}>
          <Icon name={'bell'} size={14} color={colors.AppDefaultColor} />
          <Text style={[styles.labelText, {color: colors.black}]}>
            Reminder
          </Text>
        </TouchableOpacity>

        {/* statement button to see statement  */}
        <TouchableOpacity
          style={[styles.flexRowWithGap]}
          onPress={handleStatementClick}>
          <Icon
            name={'calendar-days'}
            size={12}
            color={colors.AppDefaultColor}
          />
          <Text style={[styles.labelText, {color: colors.black}]}>
            Statement
          </Text>
        </TouchableOpacity>

        {/* Total due amount button */}
        <TouchableOpacity
          onPress={handleTotalDuePress}
          style={[styles.button, styles.flexRowWithGap]}>
          <Text style={[styles.labelText, {color: colors.white}]}>
            Dues:{' '}
            <Icon name={'indian-rupee-sign'} size={10} color={colors.white} />
            {tenantStudentSalesDetailsResponse?.response?.totalRemainingAmount}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.scene]}>
        <FlatList
          data={tenantStudentSalesDetailsResponse?.response?.salesDetails}
          contentContainerStyle={{
            gap: verticalScale(12),
            padding: horizontalScale(12),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <View style={{gap: verticalScale(12)}}>
                <ShowSaleCard
                  items={item}
                  saleColor={colors.AppDefaultColor}
                  studentDetails={salesDetails?.studentDetails}
                />
                {Object.keys(item?.receiveAmounts).length !== 0
                  ? item?.receiveAmounts.map((val, i) => (
                      <ShowPaymentCard
                        key={i}
                        item={val}
                        saleColor={colors.green}
                        studentDetails={salesDetails?.studentDetails}
                        roomNumber={item?.studentRoomNumber}
                      />
                    ))
                  : null}
              </View>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: verticalScale(350),
              }}>
              {hostelStatus !== 0 ? (
                <Text style={[styles.label, {fontSize: moderateScale(16)}]}>
                  {tenantStudentSalesDetailsResponse?.loading
                    ? 'Loading'
                    : 'No Records Availble'}
                </Text>
              ) : (
                <Text style={[styles.label, {fontSize: moderateScale(16)}]}>
                  No data available now
                </Text>
              )}
            </View>
          }
        />
      </View>

      <PaySheet
        visible={isPaySheetVisible}
        onClose={closePaySheet}
        paymentDetails={paymentDetails}
      />
    </SafeAreaView>
  );
};

export default Account_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scene: {
    flex: 1,
    // padding: horizontalScale(12),
    // gap: horizontalScale(12),
  },
  tabBar: {
    backgroundColor: colors.white,
    elevation: 0,
    margin: verticalScale(12),
    padding: verticalScale(6),
    borderWidth: 2,
    borderColor: colors.AppDefaultColor,
    borderRadius: 10,
  },
  label: {
    color: colors.black,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
  },
  indicator: {
    backgroundColor: colors.AppDefaultColor,
    height: 4,
    width: '40%',
  },
  badge: {
    padding: horizontalScale(2),
    backgroundColor: `${colors.lightygrey}70`,
    borderRadius: horizontalScale(4),
    width: horizontalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    // position:'absolute'
  },
  card: {
    verticalAlign: 'middle',
    backgroundColor: colors.white,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    gap: 15,
    paddingVertical: 20,
    elevation: 2,
  },
  btn: {
    height: verticalScale(50),
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btn,
    borderRadius: 4,
    alignSelf: 'center',
  },
  simbleText: {
    fontSize: moderateScale(8),
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
  flexRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    gap: horizontalScale(5),
    alignItems: 'center',
  },
  labelText: {
    fontSize: moderateScale(12),
    color: colors.AppDefaultColor,
    // fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
  button: {
    // height: verticalScale(50),
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
    borderRadius: 4,
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
  },
  iconButton: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    borderRadius: horizontalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
