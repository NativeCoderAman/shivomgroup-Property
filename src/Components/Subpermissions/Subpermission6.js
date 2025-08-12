import {View, Text, StyleSheet, Switch} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../Utils/Colors';

const Subpermission6 = ({subPermissions, updateSubPermission}) => {
  const [switchStates, setSwitchStates] = useState([
    subPermissions?.compliantAndNotice,
    subPermissions?.dueDefaultReminder,
    subPermissions?.leadUpdateRemainder,
    subPermissions?.directPaymentReminder,
    subPermissions?.settlementUpdate,
  ]);

  const toggleSwitch = index => {
    setSwitchStates(previousStates =>
      previousStates.map((state, i) => (i === index ? !state : state)),
    );
  };

  const subPermissionsTitle = [
    'Complaint and notice',
    'Due defaulter reminder',
    'Lead update reminder',
    'Direct payments reminder',
    'Settlement update',
  ];

  const subPermissionsText = [
    'receive tenant activities on WhatsApp',
    'receive alert on WhatsApp',
    'receive message for lead activities',
    'admin received update for cash & direct payment reminder',
    'received update on message for app payment settlement',
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

export default Subpermission6;
