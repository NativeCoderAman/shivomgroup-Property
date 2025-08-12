import { StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { horizontalScale, verticalScale } from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../../Utils/Colors';

const CreateButton = ({ onPress, icon, bottom }) => {
  const styles = getStyle(bottom); // ✅ Pass dynamic bottom value

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon name={icon ? icon : 'plus'} color={colors.white} size={20} />
    </Pressable>
  );
};

export default CreateButton;

// ✅ Dynamic getStyle function
const getStyle = (bottomValue) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.AppDefaultColor,
      position: 'absolute',
      bottom: bottomValue ?? verticalScale(70), // Use default if undefined
      right: horizontalScale(12),
      borderRadius: 40,
      width: verticalScale(50),
      height: verticalScale(50),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
