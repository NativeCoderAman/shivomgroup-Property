import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import {studentDetailsThunkAPI} from '../../../Service/api/thunks';
import {useDispatch, useSelector} from 'react-redux';
import alertMessage from '../../../Utils/alert';

const TenantHeader = ({title, openDrawer, openMenu}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {token, hostelStatus} = useSelector(
    state => state.root?.clientAuth?.clientSessionData,
  );
  const [user, setUser] = useState();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchAnim = useRef(new Animated.Value(-100)).current; // Initial position off-screen

  const fetchDetails = async () => {
    try {
      const res = await dispatch(studentDetailsThunkAPI());

      if (res?.payload?.status === true) {
        setUser(res?.payload?.data);
      }
    } catch (error) {
      alertMessage('something went wrong');
    }
  };

  useEffect(() => {
    if (hostelStatus === 2) {
      fetchDetails();
    }
  }, [hostelStatus]);

  const handleSearch = query => {
    setSearchQuery(query);
    // Handle your search logic here
  };

  return (
    <View style={styles.container}>
      <>
        <View style={styles.left}>
          <TouchableOpacity
            style={styles.circle}
            onPress={() => navigation.navigate('Tenant_Profile_Screen')}>
            <Image
              source={
                user?.upload_img_url
                  ? {uri: user?.upload_img_url}
                  : require('../../../Assets/Icons/user.png')
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.right}>
          {title !== 'Search' && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Search_PG');
              }}>
              <Text
                style={{
                  color: colors.orange,
                  fontSize: 14,
                  fontWeight: '500',
                  marginLeft: 10,
                }}>
                Find PG & Hostel
              </Text>
            </TouchableOpacity>
          )}

          {/* bell icon  */}
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('Profile_Screen');
            }}>
            <Icon name={'bell'} color={colors.black} size={25} />
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
};

export default TenantHeader;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  left: {
    height: verticalScale(50),
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `#333333`,
    paddingHorizontal: horizontalScale(12),
    zIndex: 2,
    left: horizontalScale(0),
    top: horizontalScale(0),
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  circle: {
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: horizontalScale(20),
    borderWidth: 2,
    borderColor: colors.AppDefaultColor,
    justifyContent: 'center',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.white,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
    maxWidth: '80%',
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
  profileImage: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    resizeMode: 'cover',
  },
  searchOverlay: {
    position: 'absolute',
    // top: verticalScale(50),
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
  },
  searchCloseButton: {
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: colors.black,
  },
});
