import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOldStudentRegisterThunkAPI,
  handleBasicRegisterDetails,
} from '../../Service/slices/RegisterSlice';
import {useNavigation} from '@react-navigation/native';
import Card from '../cards/Card';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Restore_Main_Modal from '../modals/Restore_Main_Modal';
import {colors} from '../../Utils/Colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {Divider} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import {deleteOldStudentRecordsThunkAPI} from '../../Service/api/thunks';
import Footer from '../footer/Footer';

const Old_Registrations = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const [restoreData, setRestoreData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(2);
  const {getOldStudentRegisterResponse, deleteOldStudentRecordsResponse} =
    useSelector(state => state.root.registerData);
  const [loading, setLoading] = useState(false);
  const hasNextPage = getOldStudentRegisterResponse?.hasNextPage || false;

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    dispatch(getOldStudentRegisterThunkAPI());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(getOldStudentRegisterThunkAPI({page: 1, perPage: 10}));
  }, [dispatch]);

  const handleDeleteStudent = useCallback(
    (id, regId) => {
      Alert.alert('Delete', 'Do you want to Delete Student Records ?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            dispatch(deleteOldStudentRecordsThunkAPI({id, regId}))
              .then(res => {
                if (res?.payload?.status === true) {
                  Alert.alert('Success', res.payload.message);
                  dispatch(handleBasicRegisterDetails());
                } else {
                  alertMessage('Error', 'Something Went wrong!');
                }
              })
              .catch();
          },
        },
      ]);
    },
    [dispatch],
  );

  // Memoized RenderCard component to prevent unnecessary re-renders
  const RenderCard = React.memo(({val, index, totalRec}) => {
    return (
      <View style={styles.cardContainer}>
        <Card isChange={val.ChangeRoomStatus > 0}>
          <View style={styles.cardContent}>
            <View
              style={[
                styles.flexRowWithGap,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{width: '60%'}}>
                <Text style={styles.room_num}>{val?.name}</Text>
                <Text style={styles.subText}>{val?.mobileNumber}</Text>
              </View>

              <View style={styles.roomDetails}>
                <Text style={styles.room_num}>{val?.roomNumber}</Text>
                <Text style={styles.subText}>Tenure - {val?.stayDuration}</Text>
                <View style={styles.rentContainer}>
                  <Text style={styles.subText}>Rent:</Text>
                  <Text style={styles.subText}>
                    <Icon
                      name="indian-rupee-sign"
                      size={14}
                      color={colors.grey}
                    />{' '}
                    {val?.roomRent}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.flexRowWithGap}>
              <Text style={styles.subText}>
                Registration Date: {val?.registrationDate}
              </Text>
            </View>
            <View style={styles.flexRowWithGap}>
              <Text style={styles.subText}>Leave Date: {val?.leaveDate}</Text>
            </View>
            <View style={styles.flexRowWithGap}>
              <Text style={styles.subText}>
                Reg No: {val?.registrationNumber}
              </Text>
            </View>
            <View style={[styles.flexRowWithGap,{flexDirection:'row',justifyContent:'space-between'}]}>
              <Text style={styles.subText}>Seat No: {val?.seatNumber}</Text>
              <Text style={[styles.subText,{color: colors.green}]}>
                Pending Fee:{' '}
                <Icon name="indian-rupee-sign" size={14} color={colors.green} />{' '}
                {val?.fees}
              </Text>
            </View>

            <Divider width={0.5} orientation="vertical" />
            <View style={styles.actionsContainer}>
              <View style={styles.flex}>
                <Icon name="bed" size={15} color={colors.black} />
                <Text style={styles.tagText}>{`${index + 1}/${totalRec}`}</Text>
              </View>

              <View style={styles.iconActions}>
                <Icon
                  name="file-pdf"
                  color={colors.green}
                  size={15}
                  onPress={() =>
                    navigation.navigate('Registarion_View', {studentData: val})
                  }
                />
                <Icon
                  name="trash-can"
                  color={colors.red}
                  size={15}
                  onPress={() =>
                    handleDeleteStudent(val?.id, val?.registrationNumber)
                  }
                />
                <Icon
                  name="edit"
                  color={colors.green}
                  size={15}
                  onPress={() => {
                    toggleModal();
                    setRestoreData({
                      roomNumber: val?.roomNumber,
                      seatNumber: val?.seatNumber,
                      oldStudentId: val?.id,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </Card>
      </View>
    );
  });

  const RenderItem = ({item}) => (
    <View>
      {item?.students?.map((val, i) => (
        <RenderCard
          key={val?.id || i}
          val={val}
          index={i}
          totalRec={item?.students?.length}
        />
      ))}
    </View>
  );

  const FooterMessage = ({loading, hasNextPage, page}) => {
    return (
      <View style={styles.footer}>
        {page <= hasNextPage ? (
          <ActivityIndicator size={40} color={colors.orange} />
        ) : (
          <Footer message={'no more registration data'} />
        )}
      </View>
    );
  };

  // Load more data on reaching the end of the list
  const onEndReached = useCallback(async () => {
    if (page <= hasNextPage) {
      setLoading(true);
      try {
        dispatch(getOldStudentRegisterThunkAPI({page, perPage: 10}));
        setPage(prev => prev + 1);
      } catch (error) {
        alertMessage('Something wrong happened');
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch,page,hasNextPage]);

  return (
    <View style={styles.container}>
      {page == 1 && (
      <Loader loading={getOldStudentRegisterResponse?.loading} />
      )}
      <Loader loading={deleteOldStudentRecordsResponse?.loading} />
      {getOldStudentRegisterResponse?.response?.length ? (
        <FlatList
          data={getOldStudentRegisterResponse?.response}
          keyExtractor={(item, index) => index.toString()} // Ensure unique keyExtractor
          renderItem={RenderItem}
          onEndReached={onEndReached} // Call API when user sees 5th item
          onEndReachedThreshold={0.9} // Call when user scrolls close to the end (tweak as needed)
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.room_section}
          initialNumToRender={5} // Render the first 5 items
          maxToRenderPerBatch={5} // Render 5 items in each batch
          windowSize={5} // Keep 5 items in the memory
          removeClippedSubviews={false}
          updateCellsBatchingPeriod={100} // Small delay in updating cells
          ListFooterComponent={
            <FooterMessage
              loading={loading}
              hasNextPage={hasNextPage}
              page={page}
            />
          }
        />
      ) : null}
      <Restore_Main_Modal
        isVisible={isModalVisible}
        onClose={toggleModal}
        details={restoreData}
      />
    </View>
  );
};

export default Old_Registrations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  room_num: {
    fontSize: moderateScale(16),
    color: colors.grey,
    fontWeight: '600',
  },
  subText: {color: colors.grey, fontSize: moderateScale(12)},
  rentContainer: {flexDirection: 'row', gap: 5},
  cardContainer: {
    width: width,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
  },
  cardContent: {flexDirection: 'column'},
  flexRowWithGap: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-start',
    gap: 10,
  },
  tagText: {
    fontWeight: '500',
    color: colors.black,
    marginLeft: 10,
    fontSize: 12,
  },
  noRecordsText: {fontSize: moderateScale(18), color: colors.grey},
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  iconActions: {flexDirection: 'row', gap: 12},
  room_section: {paddingBottom: 10},
  footer: {
    marginBottom:50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateScale(14),
    color: colors.darkgrey,
    fontWeight: '500',
  },
});
