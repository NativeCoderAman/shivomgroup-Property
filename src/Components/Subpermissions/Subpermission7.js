import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../Utils/Colors';

const Subpermission7 = ({subPermissions, updateSubPermission}) => {

  const [state, setState] = useState({
    reminderDays: subPermissions?.autoPaymentPreReminder || '',
    dueReminderDays: subPermissions?.autoDuePaymentReminder || '',
    penaltyDays: subPermissions?.rentDelayPenalty || '',
    yellowZoneDays: subPermissions?.setDayYellowZone || '',
    orangeZoneDays: subPermissions?.setDayOrangeZone || '',
    redZoneDays: subPermissions?.setDayRedZone || '',
  });

  const handleChange = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value,
    }));
    
    updateSubPermission(field, value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Automated payment pre reminder</Text>
        <Text style={styles.text}>Set pre days for reminder</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("autoPaymentPreReminder",text)}
          value={state.reminderDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>Automated due payment reminder</Text>
        <Text style={styles.text}>Set delay days for reminder</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("autoDuePaymentReminder",text)}
          value={state.dueReminderDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>
          Set days for imposing rent delay penalty
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("rentDelayPenalty",text)}

          value={state.penaltyDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>
          Set days after which tenant comes in yellow zone defaulter
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("setDayYellowZone",text)}

          value={state.yellowZoneDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>
          Set days after which tenant comes in orange zone defaulter
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("setDayOrangeZone",text)}

          value={state.orangeZoneDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>
          Set days after which tenant comes in red zone defaulter
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange("setDayRedZone",text)}

          value={state.redZoneDays}
          placeholder="Days"
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  subContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
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
  input: {
    backgroundColor: '#f9f9f9',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    color: colors.black,
  },
});

export default Subpermission7;
