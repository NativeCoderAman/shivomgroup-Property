import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import { horizontalScale, verticalScale } from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../Utils/Colors';

const DownloadReport = ({ onPress, loading, bottom }) => {
  const styles = getStyle(bottom); // Correct function call
  
  return (
    <Pressable onPress={onPress} disabled={loading} style={styles.container}>
      {loading ? (
        <ActivityIndicator size={20} color={colors.white} />
      ) : (
        <Icon name={'download'} color={colors.white} size={20} />
      )}
    </Pressable>
  );
};

// ✅ Corrected getStyle function
const getStyle = (bottomValue) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.red,
      position: 'absolute',
      bottom: bottomValue ?? verticalScale(70), // Use '??' for default value
      left: horizontalScale(12),
      borderRadius: 40,
      width: verticalScale(50),
      height: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default DownloadReport;
