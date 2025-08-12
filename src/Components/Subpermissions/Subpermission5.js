import {View, Text, StyleSheet, Switch} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../Utils/Colors';

const Subpermission5 = ({subPermissions, updateSubPermission}) => {

  const [switchStates, setSwitchStates] = useState([
    subPermissions?.automatedLeadRemainder,
    subPermissions?.onboardingTenantReminder,
    subPermissions?.onLeavingTenanatRemainder,
    subPermissions?.billingPaymentDueReminder,
    subPermissions?.offersAndUpdate,
  ]);

  const toggleSwitch = index => {
    setSwitchStates(previousStates =>
      previousStates.map((state, i) => (i === index ? !state : state)),
    );
  };

  const subPermissionsTitle = [
    'Automated lead reminder',
    'On bording tenant reminder',
    'On leaving tenant reminder',
    'Billing, payment & dues reminder',
    'Offers and updated',
  ];

  const subPermissionsText = [
    'visitors or enquiry person received greeting message',
    'welcome message will be shared to new student',
    'leave wishes message will be shared to student',
    'tenant receive update on',
    'tenant receive offer and activities',
  ];

  return (
    <View
      style={{
        backgroundColor: '#f2f2f2',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
      }}>
      {subPermissionsTitle.map((title, index) => (
        <View key={index} style={styles.container}>
          <View style={styles.permissionText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{subPermissionsText[index]}</Text>
          </View>
          <Switch
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={switchStates[index] ? colors.orange : colors.white}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch(index)}
            value={switchStates[index]}
            style={styles.switch}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
  },
  permissionText: {
    width: '80%',
  },
  title: {
    color: colors.black,
    fontSize: 14,
  },
  text: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
  },
  switch: {
    backgroundColor: '#f2f2f2',
    paddingLeft: 5,
  },
});

export default Subpermission5;
