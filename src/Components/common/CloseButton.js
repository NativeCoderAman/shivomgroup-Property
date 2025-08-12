import {StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {horizontalScale, verticalScale} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../Utils/Colors';

const CloseButton = ({onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon name={'close-thick'} color={colors.white} size={20} />
    </Pressable>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkgrey,
    position: 'absolute',
    bottom: verticalScale(70),
    left: horizontalScale(12),
    borderRadius: 40,
    width: verticalScale(50),
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
