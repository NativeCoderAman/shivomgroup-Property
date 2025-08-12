import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Main_Header from '../../Components/headers/Main_Header';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  generateUniqueEmpFormNoThunkAPI,
  getEmployesThunkAPI,
} from '../../Service/api/thunks';
import moment from 'moment';
import DeleteEmployee_Modal from '../../Components/modals/DeleteEmployee_Modal';
import Loader from '../../Utils/Loader';

const Employee_List_Screen = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    getEmployesResponse,
    generateUniqueEmpFormNoResponse,
    deleteEmployesResponse,
  } = useSelector(state => state?.root?.employeeData);

  const [employeeData, setEmployeeData] = useState({
    getEmployesData: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      setEmployeeData(prevState => ({...prevState, loading: true}));
      const responses = await Promise.all([
        // dispatch(getAllPermissionThunkAPI()),
        dispatch(getEmployesThunkAPI()),
        dispatch(generateUniqueEmpFormNoThunkAPI()),
      ]);
      // Update state with all the responses
      setEmployeeData({
        getEmployesData: responses[0]?.payload?.data,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      setEmployeeData(prevState => ({...prevState, loading: false}));
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [dispatch]);
  const attandanceForCurrentMonth = data => {
    const currentSalary = data?.current_salary;
    const totaldays = data?.attendanceForCurrentMonth?.totalDayInMonth;
    const totalPresent = data?.attendanceForCurrentMonth?.totalPresent;
    const totalLeave = data?.attendanceForCurrentMonth?.totalLeave;

    return Math.ceil(
      (Number(currentSalary) / Number(totaldays)) * Number(totalPresent),
    ).toFixed(2);
  };

  const Render_Add_btn = ({handleNavigation}) => {
    return (
      <TouchableOpacity
        onPress={handleNavigation}
        style={[styles.addbtn, styles.shadow]}>
        <Icon name={'plus'} size={25} color={colors.white} />
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Main_Header
          title={'Employee'}
          openDrawer={() => navigation.openDrawer()}
        />
        <Loader
          loading={
            getEmployesResponse?.loading || deleteEmployesResponse?.loading
          }
        />
        <View style={styles.wrapper}>
          <View style={{}}>
            <FlatList
              contentContainerStyle={{
                paddingTop: verticalScale(60),
                padding: horizontalScale(12),
                gap: verticalScale(12),
                paddingBottom: verticalScale(120),
              }}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[
                    styles.chip,
                    {
                      flexDirection: 'row',
                      height: 'auto',
                      backgroundColor: `${colors.red}20`,
                    },
                  ]}>
                  <View style={[{flexDirection: 'row', gap: 12}]}>
                    <Text style={[styles.title, {fontSize: moderateScale(14)}]}>
                      Total Employee :
                    </Text>
                    <Text style={[styles.label, {color: colors.red}]}>
                      {employeeData?.getEmployesData?.length}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Attendance_List_Screen');
                    }}
                    style={[
                      styles.button,
                      {
                        backgroundColor: `${colors.AppDefaultColor}90`,
                        paddingHorizontal: 4,
                        borderRadius: 40,
                        width: verticalScale(40),
                        height: verticalScale(40),
                      },
                    ]}>
                    <Icon
                      name={'calendar-days'}
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={employeeData?.getEmployesData}
              renderItem={({item}) => {
                return (
                  <View style={[styles.chip, styles.shadow]}>
                    <View style={styles.left}>
                      <View style={styles.flexRowWithSpace}>
                        <Text style={styles.title}>
                          {`${item?.candidate_name}`}
                        </Text>
                        <Text style={[styles.label]}>{`${item?.mobile}`}</Text>
                      </View>
                      <View style={styles.flexRowWithSpace}>
                        <Text style={styles.title}>{`${item?.email}`}</Text>
                        <Text
                          style={[
                            styles.label,
                          ]}>{`${item?.current_designation}`}</Text>
                      </View>
                      <View style={styles.flexRowWithSpace}>
                        <Text style={styles.title}>{`Payment(${moment().format(
                          'MMM',
                        )}) : ₹${attandanceForCurrentMonth(item)}`}</Text>
                        <Text
                          style={[styles.label]}>{`Attandance(${moment().format(
                          'MMM',
                        )}) : ${
                          item?.attendanceForCurrentMonth?.totalPresent
                        }`}</Text>
                      </View>
                    </View>
                    <View style={styles.right}>
                      <TouchableOpacity onPress={() => {}}>
                        <Icon
                          name={'money-bill-wave'}
                          color={colors.green}
                          size={15}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setDeleteId(item?.id), setShowDeleteModal(true);
                        }}>
                        <Icon name={'trash-can'} color={colors.red} size={15} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('UpdateEmpReg_Screen', item)
                        }>
                        <Icon
                          name={'eye'}
                          color={colors.AppDefaultColor}
                          size={15}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AttendanceView_Screen', item);
                        }}>
                        <Icon
                          name={'calendar-days'}
                          color={colors.black}
                          size={15}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Icon name={'user'} color={colors.black} size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    height: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {getEmployesResponse?.loading ? (
                    <Text style={styles.text}>Loading</Text>
                  ) : (
                    <Text style={styles.title}>No Records Available</Text>
                  )}
                </View>
              }
              keyExtractor={(item, i) => i.toString()}
            />
          </View>
        </View>
        <Render_Add_btn
          handleNavigation={() => {
            navigation.navigate('EmployeeReg_Screen');
          }}
        />
      </View>
      <DeleteEmployee_Modal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        id={deleteId}
      />
    </BottomSheetModalProvider>
  );
};

export default Employee_List_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    height: verticalScale(795),
  },
  chip: {
    maxHeight: verticalScale(140),
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    padding: horizontalScale(12),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  title: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  text: {
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    height: '75%',
    width: '100%',
    gap: verticalScale(6),
  },
  right: {
    height: '25%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: horizontalScale(6),
  },
  addbtn: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: horizontalScale(50),
    backgroundColor: colors.AppDefaultColor,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: verticalScale(70),
    right: horizontalScale(12),
  },
  picker: {
    height: verticalScale(40),
    // width: horizontalScale(120),
    borderRadius: horizontalScale(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: horizontalScale(10),
  },
  button: {
    height: verticalScale(40),
    paddingHorizontal: horizontalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(4),
    backgroundColor: colors.AppDefaultColor,
  },
});
