import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {colors} from '../../Utils/Colors';

const Subpermission1 = ({subPermissions, updateSubPermission}) => {

  const [switchStates, setSwitchStates] = useState({
    autoBillingOnFirstOfMonth:
      subPermissions.autoBillingOnFirstOfMonth || false,
    autoBillingOnCheckinDate: subPermissions.autoBillingOnCheckinDate || false,
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Caution money', value: '1'},
    {label: 'Registration charge', value: '2'},
    {label: 'Rent delay penalty', value: '3'},
    {label: 'Per day stay (with food)', value: '4'},
    {
      label: 'Per day stay (without food)',
      value: '5',
    },
    {label: 'Penalty', value: '9'},
  ]);
  const [value, setValue] = useState(subPermissions?.penaltyItem);

  const toggleSwitch = key => {
    let updatedSwitchStates = {...switchStates};

    if (key === 'autoBillingOnFirstOfMonth') {
      updatedSwitchStates = {
        autoBillingOnFirstOfMonth: !switchStates.autoBillingOnFirstOfMonth,
        autoBillingOnCheckinDate: false,
      };
    } else if (key === 'autoBillingOnCheckinDate') {
      updatedSwitchStates = {
        autoBillingOnFirstOfMonth: false,
        autoBillingOnCheckinDate: !switchStates.autoBillingOnCheckinDate,
      };
    }

    setSwitchStates(updatedSwitchStates);

    // Update the parent state whenever a switch is toggled
    updateSubPermission(
      'autoBillingOnFirstOfMonth',
      updatedSwitchStates.autoBillingOnFirstOfMonth,
    );
    updateSubPermission(
      'autoBillingOnCheckinDate',
      updatedSwitchStates.autoBillingOnCheckinDate,
    );
  };

  const handleValueChange = newValue => {
    // setValue(newValue);
    updateSubPermission('penaltyItem', newValue);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.permissionContainer, styles.marginB10]}>
        <Text style={styles.title}>Auto billing on 1st of Month</Text>
        <Switch
          trackColor={{false: '#767577', true: '#767577'}}
          thumbColor={
            switchStates.autoBillingOnFirstOfMonth
              ? colors.orange
              : colors.white
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch('autoBillingOnFirstOfMonth')}
          value={switchStates.autoBillingOnFirstOfMonth}
          style={styles.switch}
        />
      </View>

      <View style={styles.permissionContainer}>
        <Text style={styles.title}>Auto billing on check-in date of Month</Text>
        <Switch
          trackColor={{false: '#767577', true: '#767577'}}
          thumbColor={
            switchStates.autoBillingOnCheckinDate ? colors.orange : colors.white
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch('autoBillingOnCheckinDate')}
          value={switchStates.autoBillingOnCheckinDate}
          style={styles.switch}
        />
      </View>

      {(switchStates.autoBillingOnFirstOfMonth ||
        switchStates.autoBillingOnCheckinDate) && (
        <View style={styles.subPermissions}>
          <DropDownPicker
            placeholder="Select Item"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            multiple={true}
            min={0}
            max={3}
            mode="BADGE"
            badgeColors={colors.orange}
            badgeDotColors={colors.white}
            badgeTextStyle={{color: colors.white, fontWeight: '600'}}
            listMode="MODAL"
            onChangeValue={handleValueChange}
          />
        </View>
      )}
    </View>
  );
};

export default Subpermission1;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  permissionContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 2,
    width: '100%',
  },
  title: {
    color: colors.black,
    fontSize: 14,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  subPermissions: {
    backgroundColor: '#f1f1f1',
    marginTop: 10,
    borderRadius: 5,
    height: 'auto',
  },
  subPermissionText: {
    color: colors.black,
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#d9dadb',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  selectedItemText: {
    marginRight: 5,
  },

  marginB10: {
    marginBottom: 10,
  },
});
