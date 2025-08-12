import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../Utils/Colors';
import {horizontalScale, verticalScale} from '../../../Utils/Metrics';

const Tenant_Sec_Header = ({title, path, bc_color}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, {backgroundColor: bc_color}]}>
      <View style={[styles.left]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name={'arrow-left'} color={colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Tenant_Sec_Header;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:colors.white
  },
  left: {
    height: verticalScale(50),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: horizontalScale(12),
    left: horizontalScale(0),
    top: horizontalScale(0),
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  // left: {
  //   flexDirection: 'row',
  //   gap: 5,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
