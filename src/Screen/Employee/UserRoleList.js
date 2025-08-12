import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect,useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useDispatch} from 'react-redux';
import {
  deleteEmployesThunkAPI,
  generateUniqueEmpFormNoThunkAPI,
  getAllPermissionThunkAPI,
  getEmployesThunkAPI,
} from '../../Service/api/thunks';
import Loader from '../../Utils/Loader';

const UserRoleList = ({navigation}) => {
  const [employeeData, setEmployeeData] = useState();
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);

  const fetchData = async () => {

    try {
      setEmployeeData(prevState => ({...prevState, loading: true}));
      const responses = await Promise.all([
        dispatch(getAllPermissionThunkAPI()),
        dispatch(getEmployesThunkAPI()),
        dispatch(generateUniqueEmpFormNoThunkAPI()),
      ]);
      setEmployeeData({
        getAllPermissionData: responses[0]?.payload?.data,
        getEmployesData: responses[1]?.payload?.data,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      setEmployeeData(prevState => ({...prevState, loading: false}));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleDelete = id => {
    Alert.alert('Delete', 'Do you want to Delete Employee Account ?', [
      {
        text: 'Cancel',

        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          dispatch(deleteEmployesThunkAPI(id))
            .then(res => {
              //
              if (res?.payload?.status === true) {
                fetchData();
                Alert.alert('Success', res.payload.message);
              } else {
                Alert.alert('Error', 'Something Went wrong!');
              }
            })
            .catch(err => {}),
      },
    ]);
  };

  const getTotalusers = () => {
    if (employeeData?.getEmployesData) {
      return Object.keys(employeeData?.getEmployesData)?.length;
    }
    return 0;
  };

  const handlePress = () => {
    navigation.navigate('AddUserRole_Screen');
  };

  const Render_Add_btn = ({handleNavigation}) => {
    return (
      <View style={[styles.addbtn, styles.shadow]}>
        <TouchableOpacity onPress={handleNavigation}>
          <Icon name={'plus'} size={25} color={colors.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.wrapper}>
          <View style={{height: '100%'}}>
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
                      Total Users:
                    </Text>
                    <Text style={[styles.label]}>
                      {getTotalusers() ? getTotalusers() : 0}
                    </Text>
                  </View>
                  <TouchableOpacity
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
                    <Icon name={'users'} size={15} color={colors.white} />
                  </TouchableOpacity>
                </TouchableOpacity>
              }
              data={employeeData?.getEmployesData}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity style={[styles.chip, styles.shadow]}>
                    <View style={styles.left}>
                      <Text style={styles.title}>{item?.candidate_name}</Text>
                      <Text style={[styles.label]}>
                        User Roll: {item?.user_roll}
                      </Text>
                    </View>
                    <View style={styles.left}>
                      <Text style={styles.title}>{item?.mobile}</Text>
                    </View>
                    <View
                      style={[styles.left, {justifyContent: 'space-between'}]}>
                      <Text numberOfLines={1} style={styles.label}>
                        {`Email : ${item?.email}`}
                      </Text>
                    </View>
                    <View style={[styles.left, {justifyContent: 'flex-end'}]}>
                      <View style={styles.right}>
                        <TouchableOpacity
                          onPress={() => handleDelete(item?.id)}>
                          <Icon
                            name={'trash-can'}
                            color={colors.red}
                            size={15}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Icon name={'eye'} color={colors.black} size={15} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Icon
                            name={'calendar-days'}
                            color={colors.black}
                            size={15}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
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
                  {employeeData?.loading === true ? (
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
        <Render_Add_btn handleNavigation={handlePress} />
      </View>
    </BottomSheetModalProvider>
  );
};

export default UserRoleList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    flex: 1,

    // height: verticalScale(795),
  },
  chip: {
    // height: verticalScale(200),
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    padding: horizontalScale(12),
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: verticalScale(6),
  },
  shadow: {
    elevation: 2,
  },
  title: {
    fontSize: moderateScale(16),
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
  left: {
    // height: '50%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    // height: '50%',
    width: '40%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: horizontalScale(12),
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
