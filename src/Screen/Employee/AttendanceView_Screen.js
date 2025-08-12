import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../../Components/headers/Header';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Card from '../../Components/cards/Card';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome6';
import alertMessage from '../../Utils/alert';
import {Calendar} from 'react-native-calendars';

import PaymentSetup_Emp_Modal from '../../Components/modals/PaymentSetup_Emp_Modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  SalarySetupRecordThunkAPI,
  deleteAttendanceThunkAPI,
  getEmpAttendaceThunkAPI,
  getEmpTotalAttendaceThunkAPI,
} from '../../Service/api/thunks';
import UpdateAttendance_Modal from '../../Components/modals/UpdateAttendance_Modal';
import Loader from '../../Utils/Loader';
import {featureData} from '../../Utils/constants';

const AttendanceView_Screen = ({navigation, route}) => {
  const empData = route?.params;
  const paymentSetupID = empData?.id;
  const events = [
    {
      title: 'Meeting',
      // start: moment().format(),
      start: new Date(2024, 4, 5, 13, 40),
      end: new Date(2024, 4, 5, 13, 40),
    },
    {
      title: 'Coffee break',
      start: new Date(2024, 1, 11, 15, 45),
      end: new Date(2024, 1, 11, 16, 30),
    },
  ];
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpdateAtModal, setShowUpdateAtModal] = useState(false);
  const [atndceId, setAtndceId] = useState(null);
  const dispatch = useDispatch();
  const {
    SalarySetupRecordResponse,
    updateEmpAttendaceResponse,
    addAttendanceResponse,
    getEmpAttendaceResponse,
    getEmpTotalAttendaceResponse,
    deleteAttendanceResponse,
  } = useSelector(state => state?.root?.employeeData);

  const [refreshing, setRefreshing] = useState(false);
  const fetchData = () => {
    dispatch(getEmpTotalAttendaceThunkAPI(empData?.id));
    dispatch(getEmpAttendaceThunkAPI(empData?.id));
    setRefreshing(false);
  };
  useEffect(() => {
    dispatch(SalarySetupRecordThunkAPI(empData?.id));
    fetchData();
  }, []);

  //Refresh control
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [dispatch]);

  const attendanceStats = getEmpTotalAttendaceResponse?.response;
  const empAttendance = getEmpAttendaceResponse?.response;

  const getAttendanceStatus = date => {
    const dayAttendance = empAttendance.find(item => item.date === date);

    return dayAttendance ? dayAttendance : '';
  };

  const handleAttendanceDelete = id => {
    Alert.alert('Are you sure?', `You won't be able to revert this!`, [
      {
        text: 'Cancel',
        
        style: 'cancel',
      },
      {
        text: 'Yes, Delete it!',
        onPress: () =>
          dispatch(deleteAttendanceThunkAPI(id))
            .then(res => {
              // 
              if (res?.payload?.status === true) {
                fetchData();
                alertMessage(res.payload.message);
              } else {
                alertMessage('Something Went wrong!');
              }
            })
            .catch(err => {
              
            }),
      },
    ]);
  };

  // Function to render a custom day component
  const renderDay = date => {
    const attandance = getAttendanceStatus(date?.date?.dateString);

    let color;
    switch (attandance?.status) {
      case 'P':
        color = colors.green;
        break;
      case 'A':
        color = colors.red;
        break;
      case 'L':
        color = colors.AppDefaultColor;
        break;
      case 'H':
        color = colors.AppDefaultColor;
        break;
      default:
        color = colors.white;
    }
    return (
      <Pressable
        disabled={date?.date?.dateString > moment().format('YYYY-MM-DD')}
        onPress={() => {
          setAtndceId({
            id: attandance?.id,
            status: attandance?.status,
            emp_id: empData?.id,
            date: date?.date?.dateString,
          }),
            setShowUpdateAtModal(true);
        }}
        onLongPress={() => {
          if (attandance?.id) {
            handleAttendanceDelete(attandance?.id);
          }
        }}
        style={[
          styles.dayContainer,
          {
            backgroundColor:
              date?.date?.dateString == moment().format('YYYY-MM-DD')
                ? `${colors.AppDefaultColor}50`
                : color,
          },
        ]}>
        {date?.date?.dateString <= moment().format('YYYY-MM-DD') && (
          <>
            <Text
              style={[
                styles.text,
                {
                  color: colors.black,
                  position: 'absolute',
                  top: horizontalScale(2),
                  right: horizontalScale(2),
                },
              ]}>
              {date?.date?.day}
            </Text>
            <Text style={[styles.lebel, {color: colors.white}]}>
              {attandance?.status?.toUpperCase()}
            </Text>
          </>
        )}
        {attandance?.status?.toUpperCase() == 'H' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              bottom: 0,
              zIndex: -1,
            }}>
            <View
              style={{
                width: '100%',
                height: '50%',
                backgroundColor: colors.green,
              }}
            />
            <View
              style={{
                width: '100%',
                height: '50%',
                backgroundColor: colors.orange,
              }}
            />
          </View>
        )}
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      {/* <Header title={'Attendance'} /> */}
      <Loader
        loading={
          SalarySetupRecordResponse?.loading ||
          updateEmpAttendaceResponse?.loading ||
          addAttendanceResponse?.loading ||
          getEmpAttendaceResponse?.loading ||
          getEmpTotalAttendaceResponse?.loading ||
          deleteAttendanceResponse?.loading
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.wrapper}>
        <View style={styles.flexRowWithSpace}>
          <View style={styles.topCard}>
            <Text style={styles.lebel}>Present</Text>
            <Text style={styles.text}>
              {attendanceStats?.totalPresent ? attendanceStats.totalPresent : 0}
            </Text>
            <View
              style={[styles.symbolView, {backgroundColor: colors.green}]}
            />
          </View>
          <View style={styles.topCard}>
            <Text style={styles.lebel}>Absent</Text>
            <Text style={styles.text}>
              {attendanceStats?.totalAbsent ? attendanceStats.totalAbsent : 0}
            </Text>
            <View
              style={[styles.symbolView, {backgroundColor: colors.orange}]}
            />
          </View>
          <View style={styles.topCard}>
            <Text style={styles.lebel}>Leave</Text>
            <Text style={styles.text}>
              {attendanceStats?.totalLeave ? attendanceStats.totalLeave : 0}
            </Text>
            <View style={[styles.symbolView, {backgroundColor: colors.red}]} />
          </View>
          <View style={styles.topCard}>
            <Text style={styles.lebel}>Half Days</Text>
            <Text style={styles.text}>
              {attendanceStats?.totalHalf ? attendanceStats.totalHalf : 0}
            </Text>
            <View style={[styles.symbolView, {overflow: 'hidden'}]}>
              <View style={{}}>
                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    backgroundColor: colors.green,
                    // transform: [{rotate: '45deg'}],
                  }}></View>
                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    backgroundColor: colors.orange,
                    // transform: [{rotate: '45deg'}],
                  }}></View>
              </View>
            </View>
          </View>
        </View>
        <Card>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              gap: verticalScale(12),
            }}>
            <Text style={styles.lebel}>Employee Details</Text>
            <View style={styles.imgView}>
              <Image
                source={
                  empData?.candidate_photo
                    ? {uri: empData?.candidate_photo}
                    : require('../../Assets/Icons/user.png')
                }
                style={{height: '100%', width: '100%', resizeMode: 'contain'}}
              />
            </View>
            <View style={{width: '100%', gap: verticalScale(12)}}>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(true)}
                style={[styles.button, {alignSelf: 'flex-end'}]}>
                <Text style={[styles.text, {color: colors.white}]}>
                  Payment Setup
                </Text>
              </TouchableOpacity>
              <View style={styles.detailsBox}>
                <View style={styles.flexRowWithSpace}>
                  <Text style={styles.text}>{`Id #${empData?.form_no}`}</Text>
                  <Text style={styles.text}>
                    Registration Date:{' '}
                    {moment(empData?.registration_date).format('DD-MMM-YYYY')}
                  </Text>
                </View>
                <Text style={styles.lebel}>
                  <Icon
                    name={'user'}
                    size={15}
                    color={colors.AppDefaultColor}
                  />
                  {'     '}
                  {empData?.candidate_name}
                </Text>
                <Text style={styles.lebel}>
                  <Icon
                    name={'envelope'}
                    size={15}
                    color={colors.AppDefaultColor}
                  />
                  {'     '}
                  {empData?.email}
                </Text>
                <Text style={styles.lebel}>
                  <Icon
                    name={'phone'}
                    size={15}
                    color={colors.AppDefaultColor}
                  />
                  {'     '}
                  {empData?.mobile}
                </Text>
                <Text
                  onPress={() => {
                    navigation.navigate('UpdateEmpReg_Screen', empData);
                  }}
                  style={[
                    styles.text,
                    {color: colors.AppDefaultColor, alignSelf: 'flex-end'},
                  ]}>
                  View more
                </Text>
              </View>
            </View>
          </View>
        </Card>
        <Card>
          <Calendar
            style={styles.calendar}
            dayComponent={renderDay}
          />
        </Card>
      </ScrollView>
      <PaymentSetup_Emp_Modal
        isVisible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        emp_id={paymentSetupID}
      />
      <UpdateAttendance_Modal
        isVisible={showUpdateAtModal}
        onClose={() => setShowUpdateAtModal(false)}
        data={atndceId}
      />
    </View>
  );
};

export default AttendanceView_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:45
  },
  wrapper: {
    width: '100%',
    padding: horizontalScale(12),
    gap: verticalScale(12),
    paddingBottom: verticalScale(100),
  },
  flexRowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCard: {
    height: verticalScale(80),
    width: '22%',
    borderRadius: 4,
    backgroundColor: colors.white,
    padding: horizontalScale(6),
    gap: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolView: {
    height: horizontalScale(15),
    width: horizontalScale(15),
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.white,
  },

  lebel: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  text: {
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
  },
  imgView: {
    height: horizontalScale(80),
    width: horizontalScale(80),
    borderRadius: horizontalScale(100),
    overflow: 'hidden',
  },
  detailsBox: {
    borderRadius: 4,
    padding: horizontalScale(12),
    borderWidth: 1,
    gap: verticalScale(6),
    borderColor: colors.black,
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  dayContainer: {
    flex: 1,
    width: horizontalScale(40),
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.lightygrey,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
