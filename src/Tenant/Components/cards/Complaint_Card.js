import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
const Complaint_Card = ({title, icon, colorCard, hostelStatus, index}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        hostelStatus === 3
          ? alertMessage('Your Profile is under review')
          : navigation.navigate('Complaint_Screen', {
              colorCard: colorCard,
              scrIndex:index,
            });
      }}
      style={[
        styles.quickCard,

        {backgroundColor: colorCard ? `${colorCard}` : colors.white},
      ]}>
      <View
        style={{
          width: '80%',
          padding: verticalScale(12),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {icon && <Image style={styles.quickyimage} source={icon} />}
        <Text style={styles.simpleText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Complaint_Card;

const styles = StyleSheet.create({
  quickCard: {
    width: horizontalScale(170),
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickyDetails: {
    width: '60%',
    paddingVertical: verticalScale(12),
    padding: horizontalScale(12),
  },
  quickyimage: {
    resizeMode: 'contain',
    height: verticalScale(180),
    width: '100%',
  },
  simpleText: {
    fontSize: moderateScale(14),
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 2,
  },
});
