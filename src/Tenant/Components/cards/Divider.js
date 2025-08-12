// Divider.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({ color = '#e0e0e0', thickness = 1, marginVertical = 8 }) => {
  return (
    <View
      style={[
        styles.divider,
        { borderBottomColor: 'white', borderBottomWidth: 1, marginVertical: marginVertical }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
