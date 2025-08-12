import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {colors} from '../../Utils/Colors';

const Subpermission3 = ({subPermissions, updateSubPermission}) => {

  // Initialize state based on props
  const [switchStates, setSwitchStates] = useState(
    subPermissions.penaltyImposedForDelayInRent.enabled || false,
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    subPermissions.penaltyImposedForDelayInRent.penaltyItem,
  );

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

  // Toggle switch function
  const toggleSwitch = () => {
    const newSwitchState = !switchStates;
    setSwitchStates(newSwitchState);

    // Update the parent component immediately
    updateSubPermission('penaltyImposedForDelayInRent', {
      enabled: newSwitchState,
      penaltyItem: value,
    });

    // Close the dropdown if the switch is turned off
    if (!newSwitchState) {
      setOpen(false);
    }
  };

  // Handle dropdown value changes
  const handleValueChange = newValue => {
    setValue(newValue);
    updateSubPermission('penaltyImposedForDelayInRent', {
      enabled: switchStates,
      penaltyItem: newValue,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.permissionContainer}>
        <Text style={styles.title}>Any penalty imposed for delay in rent</Text>
        <Switch
          trackColor={{false: '#767577', true: '#767577'}}
          thumbColor={switchStates ? colors.orange : colors.white}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={switchStates}
          style={styles.switch}
        />
      </View>

      {switchStates && (
        <View style={styles.subPermissions}>
          <DropDownPicker
            placeholder="Select Item"
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            multiple={true}
            min={1}
            max={1}
            mode="BADGE"
            badgeColors={colors.orange}
            badgeDotColors={colors.white}
            badgeTextStyle={{color: colors.white, fontWeight: '600'}}
            listMode="MODAL"
            onChangeValue={handleValueChange} // Use onChangeValue to handle selection change
          />
        </View>
      )}
    </View>
  );
};

export default Subpermission3;

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
    backgroundColor: '#f2f2f2',
    marginTop: 10,
    borderRadius: 5,
    height: 'auto',
  },
  subPermissionText: {
    color: colors.black,
    fontSize: 14,
    marginBottom: 5,
  },
});
