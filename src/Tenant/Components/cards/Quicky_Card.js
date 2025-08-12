import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import alertMessage from '../../../Utils/alert';

const Quicky_Card = ({title, desc, icon, colorCard, type}) => {
  const navigation = useNavigation();

  // Function to handle card press based on type
  const handlePress = () => {
    switch (type) {
      case 'electricityBill':
        navigation.navigate('Electricity_Screen', {
          title,
          icon,
          desc,
          colorIcon: colorCard,
          type,
        });
        break;
      case 'facingIssue':
        navigation.navigate('Complaint_Screen');
        break;
      case 'referEarn':
        navigation.navigate('Refer_Screen', {
          title,
          icon,
          desc,
          colorIcon: colorCard,
          type,
        });
        break;
      case 'OwnerNotice':
        navigation.navigate('OwnerNotice_Screen', {
          title,
          icon,
          desc,
          colorIcon: colorCard,
          type,
        });
        break;
      default:
        navigation.navigate('Notice_Screen', {
          title,
          icon,
          desc,
          colorIcon: colorCard,
          type,
        });
        break;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.quickCard,
        {backgroundColor: colorCard ? `${colorCard}20` : colors.white},
      ]}>
      <View style={[styles.quickyDetails, styles.flexRowGap]}>
        <View>
          <Text
            style={[
              styles.simpleText,
              {
                fontSize: moderateScale(16),
                color: colorCard ? colorCard : colors.black,
              },
            ]}>
            {title}
          </Text>
          <Text
            style={[
              styles.simpleText,
              {
                fontFamily: 'Roboto-Regular',
                fontSize: moderateScale(14),
                color: colorCard ? colorCard : colors.black,
              },
            ]}>
            {desc}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          padding: verticalScale(12),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={[
            styles.circle,
            {borderColor: colorCard ? colorCard : colors.black},
          ]}>
          <Icon
            name={'angle-right'}
            color={colorCard ? colorCard : colors.black}
            size={15}
          />
        </TouchableOpacity>

        <Image style={styles.quickyimage} source={icon} />
      </View>
    </TouchableOpacity>
  );
};

export default Quicky_Card;

const styles = StyleSheet.create({
  quickCard: {
    width: horizontalScale(200),
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  quickyDetails: {
    paddingVertical: verticalScale(12),
    padding: horizontalScale(12),
  },
  quickyimage: {
    resizeMode: 'contain',
    height: verticalScale(180),
    width: '60%',
  },
  simpleText: {
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  circle: {
    height: verticalScale(30),
    width: verticalScale(30),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
});