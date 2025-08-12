import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';

// Create Stack and Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// New Stack Navigator for Expenses
const ExpenseStack = () => {
  return (
    <>

    </>
  );
};

const KitchenMasNavigaton = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'house';
              break;
            case 'Stock':
              iconName = 'truck';
              break;
            case 'Food Complaints':
              iconName = 'bell-concierge';
              break;
            case 'Expenses':
              iconName = 'wallet';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.AppDefaultColor,
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: {
          backgroundColor: colors.darkgrey,
          opacity: 0.8,
        },
      })}
    >

      <Tab.Screen name="Expenses" component={ExpenseStack} /> 

      {/* Hidden Screens */}
    </Tab.Navigator>
  );
};

export default KitchenMasNavigaton;

const styles = StyleSheet.create({});
