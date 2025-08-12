import {
     Alert,
     Image,
     Pressable,
     RefreshControl,
     SafeAreaView,
     ScrollView,
     StatusBar,
     StyleSheet,
     Text,
     TouchableOpacity,
     View,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
import TenantHeader from '../../Components/headers/TenantHeader';
import { colors } from '../../../Utils/Colors';
import {
     horizontalScale,
     moderateScale,
     verticalScale,
} from '../../../Utils/Metrics';
import SectionCard from '../../Components/cards/SectionCard';
import Quicky_Card from '../../Components/cards/Quicky_Card';
import Food_Card from '../../Components/cards/Food_Card';
import Complaint_Card from '../../Components/cards/Complaint_Card';
import { useDispatch, useSelector } from 'react-redux';
import {
     getMenusThunkAPI,
     profileStatusCheckApi,
     studentSalesAccountDetailsThunkAPI,
} from '../../../Service/api/thunks';
import Loader from '../../../Utils/Loader';
import {
     BILL_IC,
     DUE_IC,
     ELECTRICITY_IC,
     LATE_IC,
     LEAVE_IC,
     NIGHTOUT_IC,
     PROBLEM_IC,
     REFER_IC,
     ROOM_RENT_IC,
     TOTAL_DUE_IC,
     NOTICE_IC,
} from '../../../Utils/Icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import PaySheet from '../../Components/Modals/PaySheet';
import { showMessage } from 'react-native-flash-message';
import BASE_URL from '../../../Utils/config';
import { HOSTEL_IMG } from '../../../Utils/Icons';
import { setTenantToken } from '../../../Service/slices/tenant/clientAuthSlice';
import NotificationCard from '../../../Components/cards/NotificationCard';
import ComingSoonCard from '../../../Components/cards/ComingSoonCard ';
import { loginClient } from '../../../Hooks/useAuth';
import RegisteredModal from '../../Components/Modals/RegisteredModal';

const Tenant_Dashboard = ({ navigation }) => {
     const [refreshing, setRefreshing] = useState(false);
     const [menuData, setMenuData] = useState({});
     const { version, current } = useSelector(state => state.version);

     const [isMenuDataAvailable, setIsMenuDataAvailable] = useState(false);

     const [paymentDetails, setPaymentDetails] = useState({});
     const [isPaySheetVisible, setPaySheetVisible] = useState(false);

     const openPaySheet = useCallback(details => {
          setPaymentDetails(details);
          setPaySheetVisible(true);
     }, []);

     const closePaySheet = () => {
          setPaySheetVisible(false);
     };

     const MyAccSectionCard = ({
          title,
          icon,
          amount,
          isPaid,
          handlePress,
          isFirstBillItem,
          invoiceNo,
     }) => {
          const amountColor = isFirstBillItem
               ? isPaid
                    ? colors.green
                    : colors.orange
               : amount > 0
                    ? colors.orange
                    : colors.black;

          isPaid == true;

          const handleCardPress = () => {
               if (!isPaid) {
                    openPaySheet({ title, icon, amount, invoiceNo });
               }
          };

          return (
               <View style={[styles.accCard, styles.shadow]}>
                    <View style={[styles.accDetails, styles.flexRowGap]}>
                         <View>
                              <Text
                                   style={[
                                        styles.simpleText,
                                        {
                                             fontSize: moderateScale(16),
                                             color: colors.black,
                                        },
                                   ]}>
                                   {title}
                              </Text>

                              <Text
                                   style={[
                                        styles.simpleText,
                                        {
                                             fontSize: moderateScale(15),
                                             color: amountColor,
                                             fontWeight: '700',
                                        },
                                   ]}>
                                   {amount ? `₹${Number(amount).toFixed(2)}` : `₹00.00`}
                              </Text>
                         </View>

                         <View
                              style={{
                                   position: 'absolute',
                                   bottom: verticalScale(6),
                                   right: verticalScale(6),
                              }}>
                              {icon && (
                                   <Image
                                        source={icon}
                                        style={{
                                             height: verticalScale(40),
                                             width: verticalScale(40),
                                             resizeMode: 'cover',
                                        }}
                                   />
                              )}
                         </View>
                    </View>
                    <TouchableOpacity
                         onPress={handleCardPress} // Disable press if isPaid is true
                         style={[styles.accButton, { backgroundColor: colors.darkgrey }]}>
                         <Text
                              style={[
                                   styles.simpleText,
                                   {
                                        color: isPaid ? colors.white : colors.white,
                                        fontSize: 14,
                                        fontWeight: '600',
                                   },
                              ]}>
                              {isPaid ? 'Paid' : 'Pay Now'}
                         </Text>
                    </TouchableOpacity>
               </View>
          );
     };

     const dispatch = useDispatch();

     const { studentSalesAccountDetailsResponse } = useSelector(
          state => state?.root?.clientComplaintData,
     );

     const { hostelStatus, token, studentId, id, mobileNumber } = useSelector(
          state => state.root?.clientAuth?.clientSessionData,
     );

     // console.log(hostelStatus)

     // Function to get the current day and week value
     const getCurrentDayAndWeek = weekType => {
          const today = new Date();

          const weekdays = [
               'sunday',
               'monday',
               'tuesday',
               'wednesday',
               'thursday',
               'friday',
               'saturday',
          ];

          const day = weekdays[today.getDay()]; // Get the name of the day

          let week = 'current';
          if (weekType === 'prev') {
               week = 'prev';
          } else if (weekType === 'next') {
               week = 'next';
          }

          return { day, week };
     };

     const fetchMenuData = async (weekType = 'current') => {
          try {
               const { day, week } = getCurrentDayAndWeek(weekType);
               const response = await axios.get(`${BASE_URL}getMenus`, {
                    params: { weekType: week, dayName: day }, // Ensure the parameter names match what the API expects
                    headers: {
                         Authorization: `Bearer ${token}`, // Use Bearer prefix if required
                    },
               });

               // Store the fetched menu data and the current date
               const currentDate = new Date().toISOString().split('T')[0];
               await AsyncStorage.setItem('menuData', JSON.stringify(response.data));
               await AsyncStorage.setItem('menuDate', currentDate);

               setMenuData(response.data);
               setIsMenuDataAvailable(true);
          } catch (error) {
               if (error.response && error.response.status === 404) {
                    // console.error('Server Error:', error.response.data);
                    setMenuData(null);
                    setIsMenuDataAvailable(false);
               } else if (error.request) {
                    // console.error('Network Error:', error.request);
               } else {
                    console.error('Error:', error.message);
               }
          }
     };

     const loadMenuData = async () => {
          try {
               const storedDate = await AsyncStorage.getItem('menuDate');
               const storedMenuData = await AsyncStorage.getItem('menuData');
               const currentDate = new Date().toISOString().split('T')[0];

               if (storedDate === currentDate && storedMenuData) {
                    setMenuData(JSON.parse(storedMenuData));
                    setIsMenuDataAvailable(true);
               } else {
                    fetchMenuData();
               }
          } catch (error) {
               console.error('Error loading menu data:', error);
          }
     };

     const getData = () => {
          try {
               setRefreshing(false);
          } catch (error) {
               setRefreshing(false);
          }
     };

     useEffect(() => {
          if (hostelStatus !== 0) {
               dispatch(studentSalesAccountDetailsThunkAPI());
               getData();
               fetchMenuData();
               loadMenuData();
          }
     }, [hostelStatus]);

     const onRefresh = useCallback(() => {
          if (hostelStatus !== 0) {
               setRefreshing(true);
               dispatch(studentSalesAccountDetailsThunkAPI());
               fetchMenuData();
               setRefreshing(false);
          }
     }, [hostelStatus]);

     const [loading, setLoading] = useState(false);

     const handleProfileStatus = async () => {
          try {
               setLoading(true);
               const response = await dispatch(profileStatusCheckApi({ mobileNumber, token }));
               console.log('homw screen respone', response?.payload);
               if (response?.payload?.status === true && hostelStatus !== 3) {
                    const data = JSON.stringify({
                         token: token,
                         studentID: response?.payload?.studentData?.student_id,
                         userType: response?.payload?.userType,
                         id: response?.payload?.studentData?.id,
                         hostelStatus: response?.payload?.hostelStatus,
                         mobileNumber: response?.payload?.studentData?.mobile_no,
                    });
                    dispatch(loginClient(data));
                    Alert.alert('Message', `Profile status updated successfully.`);
               }
          } catch (error) {

          } finally {
               setLoading(false);
          }
     };

     return (
          <BottomSheetModalProvider>
               <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <SafeAreaView style={styles.container}>
                    <TenantHeader title={'Home'} />
                    <Loader loading={studentSalesAccountDetailsResponse?.loading || loading} />

                    {hostelStatus === 3 && (
                         <View style={[styles.btn]}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                   <Icon name={'circle-exclamation'} size={20} color={colors.white} />
                                   <Text
                                        style={[
                                             styles.simpleText,
                                             { fontSize: moderateScale(14), marginLeft: 10 },
                                        ]}>
                                        Your Profile is under review
                                   </Text>
                              </View>
                              <TouchableOpacity style={{ backgroundColor: `#c73a62`, padding: 5, borderRadius: 20 }} onPress={handleProfileStatus}>
                                   <MaterialIcons name={'refresh'} size={25} color={colors.white} />
                              </TouchableOpacity>
                         </View>
                    )}
                    <ScrollView
                         bouncesZoom={true}
                         scrollsToTop={true}
                         refreshControl={
                              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                         }
                         contentContainerStyle={styles.wrapper}>
                         {current !== version && (
                              <NotificationCard currentVersion={current} newVersion={version} />
                         )}

                         {/* my  account section */}
                         {hostelStatus !== 3 && (
                              <SectionCard icon={'coins'} title={'My Account'}>
                                   <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.sectionBody}>
                                        {Object.keys(studentSalesAccountDetailsResponse?.response)
                                             .length !== 0 ? (
                                             <>
                                                  {studentSalesAccountDetailsResponse?.response?.billDetails?.map(
                                                       (item, i) => {
                                                            // Check if invoiceNo is an array
                                                            const invoiceNos = Array.isArray(item?.invoiceNo)
                                                                 ? item?.invoiceNo
                                                                 : [item?.invoiceNo];

                                                            // Log each invoice number individually
                                                            return (
                                                                 <MyAccSectionCard
                                                                      key={i}
                                                                      title={item?.name}
                                                                      icon={
                                                                           item?.name !== 'Total Due' ? DUE_IC : TOTAL_DUE_IC
                                                                      }
                                                                      amount={item?.amount}
                                                                      isPaid={item?.amount <= 0} // Show "Pay Now" if amount is greater than 0, "Paid" otherwise
                                                                      handlePress={openPaySheet}
                                                                      isFirstBillItem={false} // Indicate this is not a first bill item
                                                                      invoiceNo={invoiceNos.join(', ')}
                                                                 />
                                                            );
                                                       },
                                                  )}

                                                  {studentSalesAccountDetailsResponse?.response?.firstBillItem?.map(
                                                       (item, i) => {
                                                            return (
                                                                 <MyAccSectionCard
                                                                      key={i}
                                                                      title={item?.itemName}
                                                                      icon={
                                                                           item?.itemName === 'Room Rent'
                                                                                ? ROOM_RENT_IC
                                                                                : BILL_IC
                                                                      }
                                                                      amount={item?.itemAmount}
                                                                      isPaid={
                                                                           studentSalesAccountDetailsResponse?.response
                                                                                ?.ispaid
                                                                      } // Show "Paid" if isPaid is true, otherwise "Pay Now"
                                                                      handlePress={openPaySheet}
                                                                      isFirstBillItem={true} // Indicate this is a first bill item
                                                                 />
                                                            );
                                                       },
                                                  )}
                                             </>
                                        ) : (
                                             <>
                                                  <MyAccSectionCard
                                                       title={'Current Dues'}
                                                       buttonColor={colors.purple}
                                                       icon={DUE_IC}
                                                  />
                                                  <MyAccSectionCard
                                                       title={'Total Dues'}
                                                       buttonColor={`${colors.red}aa`}
                                                       icon={TOTAL_DUE_IC}
                                                  />
                                                  <MyAccSectionCard
                                                       title={'Security'}
                                                       buttonColor={`${colors.navy}aa`}
                                                       icon={BILL_IC}
                                                  />
                                                  <MyAccSectionCard
                                                       title={'Rent'}
                                                       buttonColor={`${colors.green}90`}
                                                       icon={ROOM_RENT_IC}
                                                  />
                                             </>
                                        )}
                                   </ScrollView>
                              </SectionCard>
                         )}

                         {hostelStatus === 0 && (
                              <SectionCard icon={'magnify'} title={'Search PG & Hostel'}>
                                   <View style={{ width: '100%', height: 220 }}>
                                        <View
                                             style={{
                                                  width: '90%',
                                                  height: '84%',
                                                  marginHorizontal: '5%',
                                                  marginVertical: '7%',
                                                  backgroundColor: '#f1f1f1',
                                                  borderRadius: 5,
                                                  paddingHorizontal: '5%',
                                                  paddingVertical: '5%',
                                                  elevation: 2,
                                                  position: 'relative', // Ensure that the child elements can use absolute positioning
                                             }}>
                                             <Text
                                                  style={{
                                                       color: colors.black,
                                                       fontSize: 15,
                                                       fontWeight: '500',
                                                  }}>
                                                  PG & Hostel
                                             </Text>
                                             <View
                                                  style={{
                                                       width: '100%',
                                                       height: '90%',
                                                       flexDirection: 'row',
                                                       justifyContent: 'flex-end',
                                                  }}>
                                                  <Text
                                                       style={{
                                                            color: colors.black,
                                                            width: '60%',
                                                            height: '100%',
                                                            marginTop: 10,
                                                       }}>
                                                       Find best PG and Hostel near you
                                                  </Text>
                                                  <Image
                                                       source={HOSTEL_IMG}
                                                       style={{ width: '40%', height: '100%' }}
                                                  />
                                             </View>

                                             <TouchableOpacity
                                                  onPress={() => {
                                                       navigation.navigate('Search_PG');
                                                  }}
                                                  style={{
                                                       backgroundColor: colors.white,
                                                       height: 40,
                                                       width: 100,
                                                       flexDirection: 'row',
                                                       justifyContent: 'center',
                                                       alignItems: 'center',
                                                       borderRadius: 5,
                                                       elevation: 5,
                                                       position: 'absolute',
                                                       left: '10%',
                                                       bottom: '20%',
                                                  }}>
                                                  <Text
                                                       style={{
                                                            color: colors.orange,
                                                            fontSize: 16,
                                                            fontWeight: '600',
                                                       }}>
                                                       Search
                                                  </Text>
                                             </TouchableOpacity>
                                        </View>
                                   </View>
                              </SectionCard>
                         )}

                         {/* action key section */}
                         <SectionCard icon={'star'} title={'Action Key'}>
                              <ScrollView
                                   horizontal={true}
                                   showsHorizontalScrollIndicator={false}
                                   contentContainerStyle={styles.sectionBody}>
                                   <Quicky_Card
                                        title={'Night out/Going home'}
                                        desc={'Inform your nightout plan to Hostel warden.'}
                                        colorCard={colors.purple}
                                        icon={NIGHTOUT_IC}
                                        type={'nightOut/goingHome'}
                                   />
                                   <Quicky_Card
                                        title={'Leaving Property?'}
                                        desc={'Notify your warden that you are leaving property.'}
                                        colorCard={colors.orange}
                                        icon={LEAVE_IC}
                                        type={'Leaving Property'}
                                   />
                                   <Quicky_Card
                                        title={'Facing Issue'}
                                        desc={'Register your complaint in one click'}
                                        icon={PROBLEM_IC}
                                        colorCard={colors.brown}
                                        type={'facingIssue'}
                                   />
                                   <Quicky_Card
                                        title={'Refer & Earn'}
                                        desc={'Refer to your friend and get discount on Rent.'}
                                        colorCard={colors.green}
                                        icon={REFER_IC}
                                        type={'referEarn'}
                                   />
                                   <Quicky_Card
                                        title={'Check-In Late'}
                                        desc={`Notify your warden you'll be coming late.`}
                                        colorCard={colors.navy}
                                        icon={LATE_IC}
                                        type={'Checkin Late'}
                                   />
                                   <Quicky_Card
                                        title={'Electricity Bill'}
                                        desc={`Save energy, save tomorrow, save life`}
                                        colorCard={colors.red}
                                        icon={ELECTRICITY_IC}
                                        type={'electricityBill'}
                                   />

                                   <Quicky_Card
                                        title={'Notices'}
                                        desc={`Notices from admin regarding you.`}
                                        colorCard={colors.grey}
                                        icon={NOTICE_IC}
                                        type={'OwnerNotice'}
                                   />
                              </ScrollView>
                         </SectionCard>

                         {/* Offers Section */}
                         <View style={styles.offersec}>
                              <View style={styles.offerTop}>
                                   <Text
                                        style={[
                                             styles.sectionTitle,
                                             { fontSize: moderateScale(18), color: colors.white },
                                        ]}>
                                        Now Get Exiting Offers 🎉🎊
                                   </Text>
                              </View>
                              <ScrollView
                                   contentContainerStyle={{
                                        gap: horizontalScale(12),
                                        padding: horizontalScale(12),
                                   }}
                                   horizontal={true}
                                   showsHorizontalScrollIndicator={false}>
                                   {[1, 2, 3, 5].map((item, i) => (
                                        // <Pressable
                                        //   key={i}
                                        //   onPress={() => Alert.alert('Alert', 'Coming Soon')}
                                        //   style={[
                                        //     styles.card,
                                        //     {
                                        //       backgroundColor:
                                        //         item == 1
                                        //           ? colors.sky
                                        //           : item == 2
                                        //           ? colors.green
                                        //           : item == 3
                                        //           ? colors.navy
                                        //           : colors.red,
                                        //     },
                                        //   ]}>
                                        //   <View style={{width: '60%', gap: verticalScale(12)}}>
                                        //     <View style={[styles.imgview]}>
                                        //       <Image
                                        //         source={
                                        //           item == 1
                                        //             ? require(`../../../Assets/Icons/hmlogo.png`)
                                        //             : item == 2
                                        //             ? require('../../../Assets/Icons/zomato.jpeg')
                                        //             : require('../../../Assets/Icons/rapido.png')
                                        //         }
                                        //         style={{
                                        //           height: '100%',
                                        //           width: '100%',
                                        //           objectFit: 'contain',
                                        //           borderRadius: 8,
                                        //         }}
                                        //       />
                                        //     </View>
                                        //     <View style={{width: '100%'}}>
                                        //       <Text
                                        //         style={[styles.sectionTitle, {color: colors.black}]}>
                                        //         Offer
                                        //       </Text>
                                        //       <Text style={[styles.simpleText, {color: colors.black}]}>
                                        //         Get 50% off on h&m store.
                                        //       </Text>
                                        //     </View>
                                        //   </View>
                                        //   <View style={{width: '40%', alignItems: 'center'}}>
                                        //     <View
                                        //       style={{
                                        //         height: verticalScale(150),
                                        //         width: horizontalScale(65),
                                        //       }}>
                                        //       <Image
                                        //         source={require('../../../Assets/Icons/mockup.png')}
                                        //         style={{
                                        //           height: '100%',
                                        //           width: '100%',
                                        //           resizeMode: 'contain',
                                        //           borderRadius: 8,
                                        //         }}
                                        //       />
                                        //     </View>
                                        //   </View>
                                        // </Pressable>
                                        <ComingSoonCard key={i} />
                                   ))}
                              </ScrollView>
                         </View>

                         {/* Today's menu section   */}
                         <SectionCard
                              icon={'bowl-food'}
                              title={`Today's Menu`}
                              setMenuData={setMenuData}
                              setIsMenuDataAvailable={setIsMenuDataAvailable}>
                              <ScrollView
                                   horizontal={true}
                                   showsHorizontalScrollIndicator={false}
                                   contentContainerStyle={styles.sectionBody}>
                                   <Food_Card
                                        title={'Breakfast'}
                                        timing={`${menuData?.data?.Breakfast?.startTime
                                             ? menuData?.data?.Breakfast?.startTime
                                             : '00:00:00'
                                             } to ${menuData?.data?.Breakfast?.endTime
                                                  ? menuData?.data?.Breakfast?.endTime
                                                  : '00:00:00'
                                             }`}
                                        menuItem={menuData?.data?.Breakfast?.menuItems} // Correcting the prop name to menuItems
                                        menuMessage={menuData?.data?.Breakfast?.menuMessage}
                                        icon={menuData?.data?.Breakfast?.menuImage}
                                        colorCard={colors.AppDefaultColor}
                                        titleColor={colors.darkorange}
                                        textColor={colors.lightorange}
                                   />

                                   <Food_Card
                                        title={'Lunch'}
                                        timing={`${menuData?.data?.Lunch?.startTime
                                             ? menuData?.data?.Lunch?.startTime
                                             : '00:00:00'
                                             } to ${menuData?.data?.Lunch?.endTime
                                                  ? menuData?.data?.Lunch?.endTime
                                                  : '00:00:00'
                                             }`}
                                        menuItem={menuData?.data?.Lunch?.menuItems} // Corrected from Breakfast to Lunch
                                        menuMessage={menuData?.data?.Lunch?.menuMessage} // Corrected from Breakfast to Lunch
                                        icon={menuData?.data?.Lunch?.menuImage}
                                        colorCard={colors.purple}
                                        titleColor={colors.darkpurple}
                                        textColor={colors.lightpurple}
                                   />

                                   <Food_Card
                                        title={'Brunch'}
                                        timing={`${menuData?.data?.Brunch?.startTime
                                             ? menuData?.data?.Brunch?.startTime
                                             : '00:00:00'
                                             } to ${menuData?.data?.Brunch?.endTime
                                                  ? menuData?.data?.Brunch?.endTime
                                                  : '00:00:00'
                                             }`}
                                        menuItem={menuData?.data?.Brunch?.menuItems} // Corrected from Breakfast to Brunch
                                        menuMessage={menuData?.data?.Brunch?.menuMessage} // Corrected from Breakfast to Brunch
                                        icon={menuData?.data?.Brunch?.menuImage}
                                        colorCard={colors.darkgrey}
                                        titleColor={colors.darkgrey}
                                        textColor={colors.lightgray}
                                   />

                                   <Food_Card
                                        title={'Dinner'}
                                        timing={`${menuData?.data?.Dinner?.startTime
                                             ? menuData?.data?.Dinner?.startTime
                                             : '00:00:00'
                                             } to ${menuData?.data?.Dinner?.endTime
                                                  ? menuData?.data?.Dinner?.endTime
                                                  : '00:00:00'
                                             }`}
                                        menuItem={menuData?.data?.Dinner?.menuItems} // Corrected from Breakfast to Dinner
                                        menuMessage={menuData?.data?.Dinner?.menuMessage} // Corrected from Breakfast to Dinner
                                        icon={menuData?.data?.Dinner?.menuImage}
                                        colorCard={colors.red}
                                        titleColor={colors.darkred}
                                        textColor={colors.lightred}
                                   />
                              </ScrollView>
                         </SectionCard>

                         {/* Complaints Section */}
                         <SectionCard icon={'circle-exclamation'} title={`Add a complaint`}>
                              <ScrollView
                                   horizontal={true}
                                   showsHorizontalScrollIndicator={false}
                                   contentContainerStyle={styles.sectionBody}>
                                   <Complaint_Card
                                        colorCard={colors.sky}
                                        icon={require(`../../../Assets/Icons/bed.png`)}
                                        title={'Bedroom'}
                                        hostelStatus={hostelStatus}
                                        index={0}
                                   />
                                   <Complaint_Card
                                        colorCard={colors.orange}
                                        icon={require(`../../../Assets/Icons/lunch.png`)}
                                        title={'Food'}
                                        hostelStatus={hostelStatus}
                                        index={1}
                                   />
                                   <Complaint_Card
                                        colorCard={colors.lightygrey}
                                        icon={require(`../../../Assets/Icons/shield.png`)}
                                        title={'Security'}
                                        hostelStatus={hostelStatus}
                                        index={2}
                                   />
                                   <Complaint_Card
                                        colorCard={colors.red}
                                        icon={require(`../../../Assets/Icons/facilities.png`)}
                                        title={'Facilties'}
                                        hostelStatus={hostelStatus}
                                        index={3}
                                   />
                                   <Complaint_Card
                                        colorCard={colors.brown}
                                        icon={require(`../../../Assets/Icons/account.png`)}
                                        title={'Account'}
                                        hostelStatus={hostelStatus}
                                        index={4}
                                   />
                                   <Complaint_Card
                                        colorCard={colors.green}
                                        icon={require(`../../../Assets/Icons/suggestion.png`)}
                                        title={'Suggestion'}
                                        hostelStatus={hostelStatus}
                                        index={5}
                                   />

                              </ScrollView>
                         </SectionCard>

                    </ScrollView>
               </SafeAreaView>
               <PaySheet
                    visible={isPaySheetVisible}
                    onClose={closePaySheet}
                    paymentDetails={paymentDetails}
               />
               {hostelStatus === 4 && <RegisteredModal navigation={navigation} /> }
               

          </BottomSheetModalProvider>
     );
};

export default Tenant_Dashboard;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: `${colors.white}`,
     },
     wrapper: {
          backgroundColor: `${colors.AppDefaultColor}10`,
     },
     section: {
          width: '100%',
     },
     sectionTitle: {
          fontSize: moderateScale(16),
          color: colors.black,
          fontFamily: 'Roboto-Medium',
          textTransform: 'capitalize',
     },
     sectionBody: {
          padding: horizontalScale(20),
          gap: horizontalScale(20),
          backgroundColor: colors.white,
     },
     flexRowGap: {
          gap: horizontalScale(6),
          padding: horizontalScale(12),
          flexDirection: 'row',
     },
     accCard: {
          width: horizontalScale(150),
          borderRadius: 10,
          backgroundColor: colors.white,
          justifyContent: 'space-between',
     },
     offersec: {
          width: '100%',
          backgroundColor: '#d2d4d2',
          paddingVertical: verticalScale(20),
          gap: verticalScale(12),
     },
     offerTop: {
          paddingHorizontal: verticalScale(12),
     },
     accDetails: { flex: 1, padding: horizontalScale(12) },
     accButton: {
          padding: horizontalScale(6),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.red,
          borderBottomRightRadius: 10,
          bottom: 0,
          borderBottomLeftRadius: 10,
          // position: 'absolute',
          width: '100%',
     },
     btn: {
          backgroundColor: colors.red,
          borderRadius: 4,
          width: '95%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          marginHorizontal: '2.5%',
          paddingHorizontal: '5%',
          paddingVertical: 5,
     },
     simpleText: {
          fontSize: moderateScale(13),
          color: colors.white,
          // fontFamily: 'Roboto-Medium',
          textTransform: 'capitalize',
          fontWeight: '600',
     },
     imgview: {
          height: verticalScale(60),
          width: horizontalScale(100),
          borderRadius: 10,
          backgroundColor: colors.white,
     },
     card: {
          justifyContent: 'space-between',
          flexDirection: 'row',
          // verticalAlign: 'middle',
          backgroundColor: colors.white,
          width: horizontalScale(300),
          height: verticalScale(190),
          alignSelf: 'center',
          borderRadius: 10,
          paddingHorizontal: 20,
          gap: 15,
          paddingVertical: 20,
          elevation: 2,
     },
     shadow: {
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 2,
     },

     //
     backgroundContainer: {
          width: '100%',
          height: 370,
     },
     backgroundImage: {
          ...StyleSheet.absoluteFillObject, // This ensures the image covers the entire screen
     },
     overlay: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          padding: 20, // Add padding if necessary
     },
     title: {
          color: colors.black,
          fontSize: 28,
          fontWeight: '700',
          marginBottom: 10,
          marginTop: 10,
     },
     subtext: {
          color: colors.black,
          fontSize: 15,
          fontWeight: '500',
          marginBottom: 20,
     },
     searchBox: {
          width: '95%',
          height: 80,
          backgroundColor: '#f1f1f1',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          padding: 10,
          borderRadius: 5,
     },
     searchInput: {
          width: '70%',
          height: '100%',
          padding: 10,
          backgroundColor: colors.white,
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
          color: colors.black,
          fontSize: 12,
          fontWeight: '500',
     },
     searchButton: {
          width: '30%',
          height: '100%',
          backgroundColor: colors.orange,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
     },
     searchText: {
          color: colors.white,
          fontSize: 18,
          fontWeight: '500',
     },
});
