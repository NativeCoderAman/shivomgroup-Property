import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Components/headers/Header';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {storeEmpAttendanceThunkAPI} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';

const MarkAttandance_Screen = ({navigation, route}) => {
  const empList = route?.params;
  const dispatch = useDispatch();
  const {empAttendacesRecordsResponse} = useSelector(
    state => state?.root?.employeeData,
  );
  const [values, setValues] = useState({
    attendance_date: moment().format('YYYY-MM-DD'),
    data: [...empList?.map(item => ({id: item?.id, status: 'A'}))],
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const updateStatusIndex = (index, newStatus, key, values, setValues) => {
    const updatedStatus = values.data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [key]: newStatus,
        };
      }
      return item;
    });

    setValues({
      ...values,
      data: updatedStatus,
    });
  };

  const handleSubmit = values => {
    // Handle form submission here
    dispatch(storeEmpAttendanceThunkAPI(values))
      .then(res => {
        if (res?.payload?.status === true) {
          alertMessage(res?.payload?.message);
          navigation.goBack();
        } else {
          alertMessage('Something went wrong!');
        }
      })
      .catch(err => {
        alertMessage('Something went wrong!');
      });
  };

  return (
    <View style={styles.container}>
      {/* <Header title={'Mark Attendance'} /> */}
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={{gap: 5}}>
          <TouchableOpacity
            onPress={() => {
              setIsDatePickerVisible(true);
            }}
            style={[styles.inputView, styles.flexRowWithSpace]}>
            <Text style={styles.text}>
              {values?.attendance_date ? values.attendance_date : 'Select Date'}
            </Text>
            <Icon name={'calendar'} color={colors.black} size={20} />
          </TouchableOpacity>
          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            maximumDate={new Date()}
            onConfirm={date => {
              const formatDate = moment(date).format('YYYY-MM-DD');
              setValues({...values, attendance_date: formatDate});
              setIsDatePickerVisible(false);
            }}
            onCancel={() => setIsDatePickerVisible(false)}
          />
          {/* {errors.dob && touched.dob ? (
            <Text style={styles.error}>{errors.dob}</Text>
          ) : null} */}
        </View>

        {empList?.map((item, i) => (
          <View
            key={i}
            style={[
              styles.flexRowWithSpace,
              {
                paddingVertical: verticalScale(12),
                borderBottomWidth: 1,
                borderBottomColor: colors.lightygrey,
              },
            ]}>
            <View style={styles.right}>
              <Text style={styles.title}>{item?.candidate_name}</Text>
            </View>
            <View style={[styles.flexRowWithSpace, styles.left]}>
              <View style={styles.flexRowWithGap}>
                <TouchableOpacity
                  onPress={() => {
                    updateStatusIndex(i, 'P', 'status', values, setValues);
                  }}
                  style={styles.circle}>
                  <Icon
                    name={
                      values.data[i].status === 'P' ? 'circle-check' : 'circle'
                    }
                    size={15}
                    color={colors.black}
                  />
                </TouchableOpacity>
                <Text style={styles.label}>(P)</Text>
              </View>
              <View style={styles.flexRowWithGap}>
                <TouchableOpacity
                  onPress={() => {
                    updateStatusIndex(i, 'A', 'status', values, setValues);
                  }}
                  style={styles.circle}>
                  <Icon
                    name={
                      values.data[i].status === 'A' ? 'circle-check' : 'circle'
                    }
                    size={15}
                    color={colors.black}
                  />
                </TouchableOpacity>
                <Text style={styles.label}>(A)</Text>
              </View>
              <View style={styles.flexRowWithGap}>
                <TouchableOpacity
                  onPress={() => {
                    updateStatusIndex(i, 'L', 'status', values, setValues);
                  }}
                  style={styles.circle}>
                  <Icon
                    name={
                      values.data[i].status === 'L' ? 'circle-check' : 'circle'
                    }
                    size={15}
                    color={colors.black}
                  />
                </TouchableOpacity>
                <Text style={styles.label}>(L)</Text>
              </View>
              <View style={styles.flexRowWithGap}>
                <TouchableOpacity
                  onPress={() => {
                    updateStatusIndex(i, 'H', 'status', values, setValues);
                  }}
                  style={styles.circle}>
                  <Icon
                    name={
                      values.data[i].status === 'H' ? 'circle-check' : 'circle'
                    }
                    size={15}
                    color={colors.black}
                  />
                </TouchableOpacity>
                <Text style={styles.label}>(H)</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => handleSubmit(values)}
        style={styles.button}>
        <Text style={[styles.text, {color: colors.white}]}>
          Submit Attandance
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MarkAttandance_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: '100%',
    height: verticalScale(795),
    padding: horizontalScale(12),
    paddingBottom: verticalScale(140),
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
    fontSize: moderateScale(12),
    color: colors.black,
    fontFamily: 'Roboto-Regular',
  },
  text: {
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  left: {
    // height: '75%',
    width: '75%',
    gap: verticalScale(6),
  },
  right: {
    // height: '25%',
    width: '25%',
    gap: horizontalScale(6),
  },
  circle: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(4),
    position: 'absolute',
    bottom: verticalScale(72),
    alignSelf: 'center',
  },
});
