import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import { colors } from '../../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Food_Card = ({
  title,
  timing,
  menuItem,
  menuMessage,
  icon,
  colorCard,
  titleColor,
  textColor,
}) => {
  // Compute dynamic styles
  const cardBackgroundColor = colorCard ? `${colorCard}12` : colors.white;
  const computedQuickCardStyle = [styles.quickCard, { backgroundColor: cardBackgroundColor }];

  const titleTextStyle = [styles.titleText, { color: titleColor || colors.black }];
  const timingTextStyle = [styles.timingText, { color: titleColor || colors.black }];
  const menuItemTextStyle = [styles.menuItemText, { color: titleColor || colors.black }];
  const menuMessageTextStyle = [styles.menuMessageText, { color: textColor || colors.black }];

  // Join menu items into a comma-separated string or use fallback text
  const joinedMenuItem =
    Array.isArray(menuItem) && menuItem.length > 0
      ? menuItem.join(', ')
      : 'Management has not updated the menu';

  return (
    <View style={computedQuickCardStyle}>
      <View style={styles.quickCardDetails}>
        <Text style={titleTextStyle}>{title}</Text>
        <Text style={timingTextStyle}>{timing}</Text>
        <Text style={menuItemTextStyle}>{joinedMenuItem}</Text>
        <Text style={menuMessageTextStyle}>{menuMessage}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.cardImage}
          source={
            icon ? { uri: icon } : require('../../../Assets/Icons/tray.png')
          }
        />
      </View>
    </View>
  );
};

export default Food_Card;

const styles = StyleSheet.create({
  quickCard: {
    width: horizontalScale(350),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems:'center'
  },
  quickCardDetails: {
    width: '70%',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
  },
  titleText: {
    fontSize: moderateScale(20),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
    fontWeight: '500',
    marginBottom: verticalScale(5),
  },
  timingText: {
    fontSize: moderateScale(13),
    marginBottom: verticalScale(5),
  },
  menuItemText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginBottom: verticalScale(5),
  },
  menuMessageText: {
    fontSize: moderateScale(11),
  },
  imageContainer: {
    width: horizontalScale(100),
    height: horizontalScale(100),
  },
  cardImage: {
    // resizeMode: 'contain',
    height: '90%',
    width: '90%',
    borderRadius: 100,
  },
});
