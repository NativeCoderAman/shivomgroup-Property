import {StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {horizontalScale, verticalScale} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';

const DownloadReport = ({onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon name={'sliders'} color={colors.white} size={20} />
    </Pressable>
  );
};

export default DownloadReport;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.AppDefaultColor,
    position: 'absolute',
    bottom: verticalScale(70),
    right: horizontalScale(12),
    borderRadius: 40,
    width: verticalScale(50),
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
