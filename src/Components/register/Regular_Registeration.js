import {
  Alert,
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {colors} from '../../Utils/Colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Card from '../cards/Card';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  handleBasicRegisterDetails,
  handleRegistrationListAPI,
} from '../../Service/slices/RegisterSlice';
import {deleteStudentBookingThunkAPI} from '../../Service/api/thunks';
import DeleteMainStudentModal from '../modals/DeleteMainStudentModal';
import ChangeRoomModal from '../modals/ChangeRoomModal';
import Loader from '../../Utils/Loader';
import {IconButton} from 'react-native-paper';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import RegMultiDate from '../modals/RegMultiDate';
import Footer from '../footer/Footer';

const Regular_Registeration = ({scrollY}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {registerListResponse, deleteStudentBookingResponse} = useSelector(
    state => state.root.registerData,
  );

  /// check permission for specific screen features
  useFocusEffect(
    useCallback(() => {
      if (
        registerListResponse?.error ===
        'Access denile: You do not have permission for this resourse.'
      ) {
        Alert.alert('Message', registerListResponse.error, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('dashboard'),
          },
        ]);
      }
    }, [registerListResponse.error]),
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [isSwitchModalVisible, setSwitchModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [switchDetails, setSwitchDetails] = useState([]);
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [regmultiDateRef, setRegMultiDateRef] = useState(false);
  const [multiDate, setMultiDate] = useState([]);
  const toggleModal = useCallback(
    id => {
      setModalVisible(!isModalVisible);
      setDeleteId(id);
    },
    [isModalVisible],
  );
  const toggleSwitchModal = useCallback(() => {
    setSwitchModalVisible(!isSwitchModalVisible);
  }, [isSwitchModalVisible]);

  //Refresh control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(handleRegistrationListAPI()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const scrollViewRef = useRef();

  const handleDeleteBooking = id => {
    Alert.alert('Delete', 'Do you want to Delete Student Booking ?', [
      {
        text: 'Cancel',

        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          dispatch(deleteStudentBookingThunkAPI(id))
            .then(res => {
              if (res?.payload?.status === true) {
                setIsBookingVisible(false);
                dispatch(handleBasicRegisterDetails());
                dispatch(handleRegistrationListAPI());
                Alert.alert('Success', res.payload.message);
              } else {
                Alert.alert('Error', 'Something Went wrong!');
              }
            })
            .catch(err => {}),
      },
    ]);
  };

  const closeMultiDate = () => {
    setRegMultiDateRef(false);
  };

  const getAllRooms = (registerListResponse?.response || []).map(
    item => item?.roomNo,
  );

  const RenderItem = useCallback(
    ({items, isBookingVisible, setIsBookingVisible}) => {
      return (
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            pagingEnabled={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}>
            {items?.studentData?.map((val, i) => {
              return (
                <View
                  key={i}
                  style={{
                    width: width,
                    paddingHorizontal: horizontalScale(12),
                    paddingVertical: verticalScale(5),
                  }}>
                  <RenderCard
                    index={i}
                    item={items}
                    val={val}
                    isBookingVisible={isBookingVisible}
                    setIsBookingVisible={setIsBookingVisible}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      );
    },
    [],
  );

  const handleBottomSheet = dates => {
    setMultiDate(dates);
    setRegMultiDateRef(true);
  };
  const RenderCard = useCallback(
    ({item, val, index, isBookingVisible, setIsBookingVisible}) => {
      return (
        <Card>
          {/* {Object.keys(item).length === 0 ? ( */}
          <View style={{}}>
            <View
              style={[
                styles.flexRowWithGap,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{width: '65%'}}>
                <Text numberOfLines={2} style={styles.room_num}>
                  {!isBookingVisible && val?.reg.length !== 0
                    ? val.reg.name
                    : val?.book.length !== 0
                    ? val.book.name
                    : 'No Candidate'}
                </Text>
                <Text style={{color: colors.grey, fontSize: moderateScale(12)}}>
                  {!isBookingVisible && val?.reg.length !== 0
                    ? val?.reg?.mobileNumber
                    : val?.book.length !== 0
                    ? val.book.mobileNumber
                    : null}
                </Text>
              </View>
              <View style={{width: '35%', alignItems: 'center'}}>
                <Text
                  style={[styles.room_num, {color: colors.AppDefaultColor}]}>
                  {item?.roomNo}
                </Text>
                <Text
                  style={[{color: colors.grey, fontSize: moderateScale(12)}]}>
                  {item?.roomType}
                </Text>
                <View style={[styles.flexRowWithGap, {gap: 5}]}>
                  <Text style={{fontSize: moderateScale(12), color: 'grey'}}>
                    Rent:
                  </Text>
                  <Text style={{fontSize: moderateScale(12), color: 'grey'}}>
                    <Icon
                      name={'indian-rupee-sign'}
                      size={10}
                      color={colors.grey}
                    />{' '}
                    {item?.rent}
                  </Text>
                </View>
              </View>
            </View>
            {/* <View> */}
            <View
              style={[
                styles.flexRowWithGap,
                {borderWidth: 0, alignItems: 'flex-end'},
              ]}>
              <Text style={{fontSize: moderateScale(12), color: 'grey'}}>
                {!isBookingVisible && val?.reg.length !== 0
                  ? 'Reg Date:'
                  : val?.book.length !== 0
                  ? 'Booking Date:'
                  : 'Reg Date:'}
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  color: 'grey',
                }}>
                {!isBookingVisible && val?.reg.length !== 0
                  ? val?.reg?.registrationsDate[val?.reg?.registrationsDate?.length -1 ].date
                  : val?.book.length !== 0
                  ? val.book.bookingDate
                  : '-/-'}
              </Text>
              {val?.reg?.registrationsDate &&
                val?.reg?.registrationsDate.length > 1 && (
                  <IconButton
                    size={16}
                    style={{
                      marginTop: verticalScale(10),
                      marginLeft: horizontalScale(-10),
                      height: 16,
                      position: 'absolute',
                      left: 130,
                    }}
                    onPress={() =>
                      handleBottomSheet(val?.reg?.registrationsDate)
                    }
                    icon={'information'}
                    iconColor={colors.orange}
                  />
                )}
            </View>
            <View style={styles.flexRowWithGap}>
              <Text style={{fontSize: moderateScale(12), color: 'grey'}}>
                {!isBookingVisible && val?.reg.length !== 0
                  ? 'Reg No'
                  : val?.book.length !== 0
                  ? 'Reg Date'
                  : 'Reg No'}
                :{'   '}
                {!isBookingVisible && val?.reg.length !== 0
                  ? val?.reg?.registrationNumber
                  : val?.book.length !== 0
                  ? val.book.registrationDate
                  : '-/-'}
              </Text>
            </View>
            <View
              style={[
                styles.flexRowWithGap,
                {width: '100%', justifyContent: 'space-between'},
              ]}>
              <Text style={{fontSize: moderateScale(12), color: 'grey'}}>
                {!isBookingVisible && val?.reg.length !== 0
                  ? 'Seat No'
                  : val?.book.length !== 0
                  ? 'Seat No'
                  : 'Seat No'}
                :{'   '}
                {!isBookingVisible && val?.reg.length !== 0
                  ? val?.reg?.seatNumber
                  : val?.book.length !== 0
                  ? val.book.seatNumber
                  : '-/-'}
              </Text>
              {/* <View style={styles.flexRowWithGap}> */}
              <Text style={{fontSize: moderateScale(12), color: colors.green}}>
                {!isBookingVisible && val?.reg.length !== 0
                  ? 'Due'
                  : val?.book.length !== 0
                  ? 'Booking Amount'
                  : 'Due'}
                :{'   '}
                <Icon
                  name={'indian-rupee-sign'}
                  size={12}
                  color={colors.green}
                />{' '}
                {!isBookingVisible && val?.reg.length !== 0
                  ? val?.reg?.remainingAmount
                  : val?.book.length !== 0
                  ? val.book.BookingAmount
                  : '0.00'}
              </Text>
            </View>

            <View
              style={[
                styles.flexRowWithGap,
                {
                  justifyContent: 'space-between',
                  borderTopWidth: 1,
                  // gap: horizontalScale(15),
                  borderTopColor: colors.lightygrey,
                  paddingTop: verticalScale(12),
                },
              ]}>
              <View
                style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <Icon name={'bed'} size={14} color={colors.black} />
                <Text style={styles.tagText}>{`${index + 1}/${
                  item?.totalSeats
                }`}</Text>
              </View>
              <View
                style={[
                  styles.flexRowWithGap,
                  {
                    justifyContent: 'flex-end',
                    // borderTopWidth: 1,
                    gap: horizontalScale(15),
                  },
                ]}>
                {val?.book.length !== 0 && val?.reg.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() => setIsBookingVisible(!isBookingVisible)}>
                    <Icon name={'user-lock'} color={colors.black} size={15} />
                  </TouchableOpacity>
                ) : null}
                {val?.book.length !== 0 && val?.reg.length === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Add_Registration', {
                        studentData: {
                          roomNumber: item?.roomNo,
                          roomType: item?.roomType,
                          rent: item?.rent,
                          ...val.book,
                        },
                      });
                    }}>
                    <Icon name={'user-plus'} color={colors.black} size={15} />
                  </TouchableOpacity>
                ) : null}
                {!isBookingVisible && val?.reg.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      toggleModal(val.reg.id, setIsBookingVisible)
                    }>
                    <Icon name={'trash-can'} color={colors.red} size={15} />
                  </TouchableOpacity>
                ) : val?.book.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      handleDeleteBooking(val?.book.id, setIsBookingVisible);
                    }}>
                    <Icon name={'trash-can'} color={colors.red} size={15} />
                  </TouchableOpacity>
                ) : null}
                {/* {val?.book.length !== 0 || val?.reg.length !== 0 ? (
              <TouchableOpacity onPress={()=>{}} >
                <Icon name={'trash-can'} color={colors.red} size={15} />
              </TouchableOpacity>
            ) : null} */}
                {!isBookingVisible && val?.reg.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Registarion_View', {
                        studentData: {
                          roomNumber: item?.roomNo,
                          roomType: item?.roomType,
                          rent: item?.rent,
                          ...val.reg,
                        },
                      })
                    }>
                    <Icon name={'file-pdf'} color={colors.green} size={15} />
                  </TouchableOpacity>
                ) : null}
                {!isBookingVisible && val?.reg.length !== 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      toggleSwitchModal();
                      setSwitchDetails({
                        id: val.reg.id,
                        seatNumber: val.reg.seatNumber,
                        roomNumber: item?.roomNo,
                      });
                    }}>
                    <Icon name={'rotate'} color={colors.black} size={15} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.icon} />
                )}
              </View>
            </View>
          </View>
        </Card>
      );
    },
    [],
  );

  const reorderRooms = rooms => {
    return rooms.map(room => {
      // Create a new array for studentData, sorting entries with filled 'reg' objects first
      const sortedStudentData = [...room.studentData].sort((a, b) => {
        if (Array.isArray(a.reg) && a.reg.length === 0) return 1; // 'a' has empty 'reg', so it should go to the end
        if (Array.isArray(b.reg) && b.reg.length === 0) return -1; // 'b' has empty 'reg', so it should go to the end
        return 0; // Both 'a' and 'b' are either filled or empty, so keep original order
      });
      // Return a new room object with the sorted studentData array
      return {
        ...room,
        studentData: sortedStudentData,
      };
    });
  };

  // Call the function to reorder the rooms
  const reorderedRooms = reorderRooms(registerListResponse?.response);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader
          loading={
            registerListResponse?.loading ||
            deleteStudentBookingResponse?.loading
          }
        />
        {registerListResponse?.response.length !== 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={reorderedRooms}
            onScroll={e => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
            initialNumToRender={8} // Adjust based on your needs
            maxToRenderPerBatch={8}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item, i) => i}
            renderItem={({item}) => {
              return (
                <RenderItem
                  items={item}
                  isBookingVisible={isBookingVisible}
                  setIsBookingVisible={setIsBookingVisible}
                />
              );
            }}
            ListFooterComponent={() => {
              return <Footer message={'no more registration data'} />;
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.tagText, {fontSize: moderateScale(16)}]}>
              {registerListResponse?.loading ? null : ' No Records Available'}
            </Text>
          </View>
        )}
        <DeleteMainStudentModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          id={deleteId}
          isBookingVisible={isBookingVisible}
          setIsBookingVisible={setIsBookingVisible}
        />
        <ChangeRoomModal
          isVisible={isSwitchModalVisible}
          onClose={toggleSwitchModal}
          details={switchDetails}
          allRooms={getAllRooms}
        />

        <RegMultiDate
          isVisible={regmultiDateRef}
          multiDate={multiDate}
          onClose={closeMultiDate}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

export default memo(Regular_Registeration);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-start',
    gap: 10,
    // borderWidth:1
  },
  room_num: {
    fontSize: moderateScale(16),
    color: colors.grey,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Medium',
  },
  scrollBtn: {
    position: 'absolute',
    verticalAlign: 'middle',
  },
  icon: {
    height: horizontalScale(20),
    width: horizontalScale(20),
  },
  tagText: {
    fontSize: moderateScale(12),
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
});
