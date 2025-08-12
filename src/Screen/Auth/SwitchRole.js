import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Card from '../../Components/cards/Card';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';
import CopyRigthMessage from '../../Components/common/CopyRigthMessage';
import {useSelector} from 'react-redux';
import NotificationCard from '../../Components/cards/NotificationCard';

const SwitchRole = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const {version} = useSelector(state => state.version);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <View style={styles.wrapper}>
        <Card>
          <View style={styles.imgbxstyle}>
            <Image
              source={require('../../Assets/Photos/logo.png')}
              style={styles.img}
            />
          </View>
          <Text style={styles.title}>Login as </Text>
          <View style={styles.innercard}>
            <TouchableOpacity
              onPress={() => {
                setSelected('admin'), navigation.push('LoginScreen');
              }}
              style={[
                styles.button,
                {
                  backgroundColor:
                    selected === 'admin'
                      ? colors.AppDefaultColor
                      : colors.white,
                },
              ]}>
              <View
                style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <View style={styles.circle}>
                  <Icon
                    name={selected === 'admin' ? 'circle-check' : 'circle'}
                    size={20}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.label}>PROPERTY ADMIN</Text>
              </View>
              <Icon name={'house-user'} size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelected('tenant'), navigation.push('Tenant_Auth');
              }}
              style={[
                styles.button,
                {
                  backgroundColor:
                    selected === 'tenant'
                      ? colors.AppDefaultColor
                      : colors.white,
                },
              ]}>
              <View
                style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <View style={styles.circle}>
                  <Icon
                    name={selected === 'tenant' ? 'circle-check' : 'circle'}
                    size={20}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.label}>TENANT</Text>
              </View>
              <Icon name={'circle-user'} size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <CopyRigthMessage />
      {/* <Text
        style={{
          color: colors.grey,
          position: 'absolute',
          bottom: 10,
          fontSize: 10,
        }}>
        Copyright-2023-2024 @Shri Shivom Secura-nation PVT Ltd
      </Text> */}
    </SafeAreaView>
  );
};

export default SwitchRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '90%',
    alignSelf: 'center',
  },
  innercard: {
    padding: horizontalScale(12),
    gap: verticalScale(12),
  },
  circle: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    padding: horizontalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.AppDefaultColor,
    elevation: 2,
    borderWidth: 2,
    borderColor: colors.AppDefaultColor,
  },
  imgbxstyle: {
    height: verticalScale(100),
    width: horizontalScale(160),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    // textTransform: 'capitalize',
    alignSelf: 'center',
  },
  label: {
    fontSize: moderateScale(12),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
});
