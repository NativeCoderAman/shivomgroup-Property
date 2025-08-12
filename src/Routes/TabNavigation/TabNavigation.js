import React, { useEffect } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../Utils/Colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Toolbar from '../../Components/ToolBar/Toolbar';


//admin payment stack screens
import BankDetailsScreen from '../../Screen/payments/BankDetailsScreen';
import SubscriptionHisScreen from '../../Screen/payments/SubscriptionHisScreen';
import TransactioHisScreen from '../../Screen/payments/TransactioHisScreen';
import SettlementScreen from '../../Screen/payments/SettlementScreen';

import { useSelector } from 'react-redux';
const Tab = createBottomTabNavigator();

const TabBarBackground = () => {
  if (Platform.OS === 'ios') {
    // iOS-only: Use a Modal with UIBlurEffect
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.blurContainer}>
          {/* The view that will have the blur effect */}
          <View style={styles.blurView} />
        </View>
      </Modal>
    );
  }

  // Android and other platforms: Fallback to a semi-transparent view
  return <View style={styles.transparentView} />;
};

const TabNavigation = () => {
  const user = useSelector(state => state.root.auth.userData);

  return (
    <Tab.Navigator
      // backBehavior={"history"}
      backBehavior="history"
      screenOptions={{
        header: props => <Toolbar {...props} />,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.white,
        tabBarStyle: {
          backgroundColor: '#000000aa',
          borderTopWidth: 0,
          position: 'absolute',
          left: 0,
          bottom: verticalScale(0),
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: verticalScale(60),
          paddingBottom: verticalScale(5),
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
          lineHeight: 15,
          fontWeight: '500',
          fontFamily: 'Roboto-Medium',
        },
      }}>


      {/* kitchen master  */}


      <Tab.Screen
        name="Bank Details"
        component={BankDetailsScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Subscription History"
        component={SubscriptionHisScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Transaction History"
        component={TransactioHisScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Settlements"
        component={SettlementScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Adjust the color and opacity for your design
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    // Additional styles to create a blur effect on iOS using UIBlurEffect
  },
  transparentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Adjust the color and opacity for your design
  },
});
