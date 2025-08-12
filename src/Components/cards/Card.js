import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {horizontalScale, verticalScale} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';

const Card = ({
  children,
  title,
  container_height,
  backgroundColor,
  elevation,
  isChange
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          height: container_height ? container_height : 'auto',
          backgroundColor: backgroundColor ? backgroundColor : colors.white,
          elevation: elevation ? elevation : 2,
          borderColor:colors.orange,
          borderWidth: isChange ? 1 : 0
        },
      ]}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: verticalScale(10),
        }}></View>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: verticalScale(280),
    borderRadius: 10,
    padding: horizontalScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 13,
    color: colors.black,
    fontWeight: '600',
  },
});
