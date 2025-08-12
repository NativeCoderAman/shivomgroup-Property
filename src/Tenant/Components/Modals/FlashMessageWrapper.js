import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';

const FlashMessageWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
      <FlashMessage position="top" floating={true} style={styles.flashMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flashMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

export default FlashMessageWrapper;
