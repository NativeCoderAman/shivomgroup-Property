import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../../Utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import Modal from 'react-native-modal';
import Divider from './Divider';
import {useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import BASE_URL from '../../../Utils/config';

const SectionCard = ({
  children,
  icon,
  title,
  setMenuData,
  setIsMenuDataAvailable,
}) => {
  const [week, setWeek] = useState(null);
  const [day, setDay] = useState(null);
  const [isWeekModalVisible, setIsWeekModalVisible] = useState(false);
  const [isDayModalVisible, setIsDayModalVisible] = useState(false);

  const {token} = useSelector(
    state => state.root?.clientAuth?.clientSessionData,
  );

  const weeks = [
    {key: 'Previous Week', value: 'prev'},
    {key: 'Current Week', value: 'current'},
    {key: 'Next Week', value: 'next'},
  ];

  const days = {
    'Previous Week': [
      {key: 'Monday', value: 'monday'},
      {key: 'Tuesday', value: 'tuesday'},
      {key: 'Wednesday', value: 'wednesday'},
      {key: 'Thursday', value: 'thursday'},
      {key: 'Friday', value: 'friday'},
      {key: 'Saturday', value: 'saturday'},
      {key: 'Sunday', value: 'sunday'},
    ],
    'Current Week': [
      {key: 'Monday', value: 'monday'},
      {key: 'Tuesday', value: 'tuesday'},
      {key: 'Wednesday', value: 'wednesday'},
      {key: 'Thursday', value: 'thursday'},
      {key: 'Friday', value: 'friday'},
      {key: 'Saturday', value: 'saturday'},
      {key: 'Sunday', value: 'sunday'},
    ],
    'Next Week': [
      {key: 'Monday', value: 'monday'},
      {key: 'Tuesday', value: 'tuesday'},
      {key: 'Wednesday', value: 'wednesday'},
      {key: 'Thursday', value: 'thursday'},
      {key: 'Friday', value: 'friday'},
      {key: 'Saturday', value: 'saturday'},
      {key: 'Sunday', value: 'sunday'},
    ],
  };

  const handleWeekSelect = selectedWeek => {
    setWeek(selectedWeek.key);
    setIsWeekModalVisible(false);
    setIsDayModalVisible(true);
  };

  const handleDaySelect = async selectedDay => {
    setDay(selectedDay);
    setIsDayModalVisible(false);

    const selectedWeekObject = weeks.find(weekObj => weekObj.key === week); // Find the selected week object
    const selectedWeek = selectedWeekObject ? selectedWeekObject.value : null; // Extract the value from the selected week object

    if (!selectedWeek) {
      throw new Error('Selected week is not found');
    }

    if (!token) {
      throw new Error('User token not found');
    }
    try {
      const response = await axios.get(`${BASE_URL}getMenus`, {
        params: {weekType: selectedWeek, dayName: selectedDay},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const currentDate = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('menuData', JSON.stringify(response.data));
      await AsyncStorage.setItem('menuDate', currentDate);

      if (response.data.status === true && response.data.statusCode === 200) {
        showMessage({
          message: 'Success',
          description: 'Menu item filtered successfully.',
          type: 'success',
          icon: 'success',
          floating: true,
          position: 'top',
          duration: 3000,
        });
        setMenuData(response.data);
        setIsMenuDataAvailable(true);
      }
    } catch (error) {
      if (
        error.response.data.statusCode === 404 ||
        error.response.data.statusCode === 400
      ) {
        showMessage({
          message: 'No Data Found',
          description: 'Menu not found for the selected day.',
          type: 'danger',
          icon: 'danger',
          floating: true,
          position: 'top',
          duration: 3000,
        });
        // await fetchMenuData();
      } else {
        showMessage({
          message: 'Failed',
          description: 'Something went wrong.',
          type: 'danger',
          icon: 'danger',
          floating: true,
          position: 'top',
          duration: 3000,
        });
      }
    }
  };

  const renderItem = ({item}) => (
    <>
      <Divider />
      <TouchableOpacity
        // style={{backgroundColor:'#f2f2f2'}}
        onPress={() =>
          isDayModalVisible
            ? handleDaySelect(item.value)
            : handleWeekSelect(item)
        }>
        <Text style={styles.itemText}>{item.key}</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.section}>
      <View style={styles.flexRowGap}>
        <View style={{flexDirection: 'row', gap: horizontalScale(6)}}>
          {title === 'Search PG & Hostel' ? (
            <MaterialCommunityIcons
              name={icon}
              color={colors.black}
              size={25}
            />
          ) : (
            <Icon name={icon} color={colors.black} size={20} />
          )}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {title === "Today's Menu" && (
          <TouchableOpacity
            onPress={() => setIsWeekModalVisible(true)}
            style={styles.filterButton}>
            <Icon
              name={'sliders'}
              size={20}
              color={colors.white}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionBody}>{children}</View>

      {/* Week Modal */}
      <Modal
        isVisible={isWeekModalVisible}
        onBackdropPress={() => setIsWeekModalVisible(false)}
        backdropColor="rgba(0, 0, 0, 0.5)"
        style={styles.bottomModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Week</Text>
          <FlatList
            data={weeks}
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        </View>
      </Modal>

      {/* Day Modal */}
      <Modal
        isVisible={isDayModalVisible}
        onBackdropPress={() => setIsDayModalVisible(false)}
        backdropColor="rgba(0, 0, 0, 0.5)"
        style={styles.bottomModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Day</Text>
          <FlatList
            data={days[week]}
            renderItem={renderItem}
            keyExtractor={item => item.key}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SectionCard;

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    // textTransform: 'capitalize',
  },
  sectionBody: {
    width: '100%',
    backgroundColor: colors.white,
  },
  flexRowGap: {
    paddingHorizontal: horizontalScale(12),
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: colors.orange,
    borderRadius: 50,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  filterButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginBottom: 10,
    color: colors.white,
    textAlign: 'center',
  },
  itemText: {
    fontSize: moderateScale(15),
    paddingVertical: verticalScale(10),
    color: colors.white,
    textAlign: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    marginBottom: '15%',
  },
  modalContent: {
    backgroundColor: colors.darkgrey,
    flexDirection: 'column',
    borderRadius: 10,
    paddingTop: 10,
    overflow: 'hidden',
    maxHeight:'70%'
  },
  filterIcon: {
    margin: 5,
  },
});
