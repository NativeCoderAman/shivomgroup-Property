import React, {memo, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {colors} from '../../Utils/Colors';

const Subpermission9 = memo(({subPermissions, updateSubPermission}) => {


  // Initialize state directly with subPermissions
  const [state, setState] = useState({
    leadReminderMobile:
      subPermissions?.automatedLeadReaminder?.primaryNumber || '',
    leadReminderSecondMobile:
      subPermissions?.automatedLeadReaminder?.secondaryNumber || '',
    tenantReminderMobile:
      subPermissions?.onboardingTenantReaminder?.primaryNumber || '',
    tenantReminderSecondMobile:
      subPermissions?.onboardingTenantReaminder?.secondaryNumber || '',
    leavingTenantMobile:
      subPermissions?.onleavingTenantReaminder?.primaryNumber || '',
    leavingTenantSecondMobile:
      subPermissions?.onleavingTenantReaminder?.secondaryNumber || '',
    billingReminderMobile:
      subPermissions?.billingPaymentDueReaminder?.primaryNumber || '',
    billingReminderSecondMobile:
      subPermissions?.billingPaymentDueReaminder?.secondaryNumber || '',
    offersMobile: subPermissions?.offersAndUpdate?.primaryNumber || '',
    offersSecondMobile: subPermissions?.offersAndUpdate?.secondaryNumber || '',
  });

  const handleChange = (key, value) => {
    const updatedState = {...state, [key]: value};
    setState(updatedState);

    // Update subPermissions based on the key
    const keyMapping = {
      leadReminderMobile: 'automatedLeadReaminder',
      leadReminderSecondMobile: 'automatedLeadReaminder',
      tenantReminderMobile: 'onboardingTenantReaminder',
      tenantReminderSecondMobile: 'onboardingTenantReaminder',
      leavingTenantMobile: 'onleavingTenantReaminder',
      leavingTenantSecondMobile: 'onleavingTenantReaminder',
      billingReminderMobile: 'billingPaymentDueReaminder',
      billingReminderSecondMobile: 'billingPaymentDueReaminder',
      offersMobile: 'offersAndUpdate',
      offersSecondMobile: 'offersAndUpdate',
    };

    const permissionKey = keyMapping[key];
    const numberType = key.includes('Second')
      ? 'secondaryNumber'
      : 'primaryNumber';

    const updatedSubPermissions = {...subPermissions};
    if (updatedSubPermissions[permissionKey]) {
      updatedSubPermissions[permissionKey][numberType] = value;
    }

    updateSubPermission(updatedSubPermissions);
  };

  const reminders = [
    {
      title: 'Automated lead reminder',
      text: 'Visitors or enquiry person received greeting message',
      primaryKey: 'leadReminderMobile',
      secondaryKey: 'leadReminderSecondMobile',
    },
    {
      title: 'Onboarding tenant reminder',
      text: 'Welcome message will be shared to new student',
      primaryKey: 'tenantReminderMobile',
      secondaryKey: 'tenantReminderSecondMobile',
    },
    {
      title: 'On leaving tenant reminder',
      text: 'Leave wishes message will be shared to student',
      primaryKey: 'leavingTenantMobile',
      secondaryKey: 'leavingTenantSecondMobile',
    },
    {
      title: 'Billing, payment & dues reminder',
      text: 'Tenant receive update on',
      primaryKey: 'billingReminderMobile',
      secondaryKey: 'billingReminderSecondMobile',
    },
    {
      title: 'Offers and updates',
      text: 'Tenant receive offers and activities',
      primaryKey: 'offersMobile',
      secondaryKey: 'offersSecondMobile',
    },
  ];

  return (
    <View style={styles.container}>
      {reminders.map((reminder, index) => (
        <SubContainer
          key={index}
          title={reminder.title}
          text={reminder.text}
          primaryValue={state[reminder.primaryKey]}
          secondaryValue={state[reminder.secondaryKey]}
          onPrimaryChange={value => handleChange(reminder.primaryKey, value)}
          onSecondaryChange={value =>
            handleChange(reminder.secondaryKey, value)
          }
        />
      ))}
    </View>
  );
}, []);

const SubContainer = ({
  title,
  text,
  primaryValue,
  secondaryValue,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  return (
    <View style={styles.subContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      <TextInput
        style={styles.input}
        onChangeText={onPrimaryChange}
        value={primaryValue}
        placeholder="Mobile Number"
        placeholderTextColor="black"
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        onChangeText={onSecondaryChange}
        value={secondaryValue}
        placeholder="Second Mobile Number"
        placeholderTextColor="black"
        keyboardType="numeric"
        maxLength={10}
      />
    </View>
  );
};

export default Subpermission9;

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
