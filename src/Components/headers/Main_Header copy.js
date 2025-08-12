import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput} from 'react-native';
import React from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Main_Header = ({title, openDrawer, openMenu}) => {
  const navigation = useNavigation();
  return (
    // <View style={styles.container}>
    <>
      <View style={styles.left}>
        <TouchableOpacity onPress={openDrawer}>
          <MaterialCommunityIcons
            name={'menu'}
            color={colors.white}
            size={25}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
     
      <View style={styles.right}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile_Screen');
          }}>
          <MaterialCommunityIcons
            name={'account'}
            color={colors.black}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </>
    // </View>
  );
};

export default Main_Header;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: `#000000aa`,
    // position:'absolute',
    zIndex: 1,
  },
  left: {
    height: verticalScale(50),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // justifyContent: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: horizontalScale(12),
    position: 'absolute',
    // zIndex: 1,
    left: horizontalScale(0),
    top: horizontalScale(0),
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.white,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    position: 'absolute',
    zIndex: 1,
    top: horizontalScale(12),
    right: horizontalScale(0),
  },
});
