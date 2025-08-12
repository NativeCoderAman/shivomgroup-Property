import React, {useState, useEffect, memo} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {colors} from '../../Utils/Colors';

const Subpermission8 = memo(({subPermissions, updateSubPermission}) => {
  const [number, setNumber] = useState(subPermissions.gstPercentage || '');

  const handleNumberChange = value => {
    updateSubPermission('gstPercentage', value)
    // setNumber(value);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Select GST percentage (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter GST percentage"
        placeholderTextColor={'gray'}
        value={number}
        onChangeText={handleNumberChange}
        keyboardType="numeric"
        maxLength={2}
        // onBlur={() => updateSubPermission('gstPercentage', number)}
      />
    </KeyboardAvoidingView>
  );
}, []);

export default Subpermission8;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
    color: colors.black,
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
