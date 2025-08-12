import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useSelector, useDispatch } from 'react-redux';
import { checkNextDayMenuThunkApi,addNextDayMenuThunkApi } from '../../Service/api/thunks';
import { Alert } from 'react-native';

const MenuReminder_Modal = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.root.auth.userData);
  const { userData } = useSelector((state) => state.root.auth);
  const { nextDayMenuResponse } = useSelector((state) => state.root.foodData);

  useEffect(() => {
    if (userData.userType === 'Admin') {
      dispatch(checkNextDayMenuThunkApi());
    }
  }, [token, dispatch, userData.userType]);

  const [reminderVisible, setReminderVisible] = useState(false);

  useEffect(() => {
    if (nextDayMenuResponse && nextDayMenuResponse?.response?.menu_is_added === false) {
      const interval = setInterval(() => {
        setReminderVisible(true);
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setReminderVisible(false); // Hide the reminder if menu is added
    }
  }, [nextDayMenuResponse]);

  const handleClose = () => {
    setReminderVisible(false);
  };

  const handleAddLater = async() => {
    // Handle "Add Later" logic
    try {
      const response = await dispatch(addNextDayMenuThunkApi());
      if(response.is_created === true && response.status === true)
      {
        Alert.alert('Success ',response?.message);
      }
      else{
        Alert.alert('Failed ',response?.message);
      }
    } catch (error) {
      Alert.alert('Error  ',error);
    }
    setReminderVisible(false);
  };

  return (
    <>
      {reminderVisible && (
        <View style={styles.reminderView}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon
              name="xmark"
              color={'black'}
              size={20}
              style={styles.closeButtonIcon}
            />
          </TouchableOpacity>
          <Text style={styles.reminderText}>Menu Reminder</Text>
          <Text style={styles.reminderMessage}>You haven't added a menu yet!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Food_Menu_Screen'); setReminderVisible(false); }}>
              <Text style={styles.buttonText}>Add Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddLater}>
              <Text style={styles.buttonText}>Add Auto</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  reminderView: {
    position: 'absolute',
    zIndex: 1000,
    width: '94%',
    marginLeft: '3%',
    top: 50,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  reminderText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: colors.black,
  },
  reminderMessage: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: colors.orange,
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '45%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonIcon: {
    padding: 5,
  },
});

export default MenuReminder_Modal;
