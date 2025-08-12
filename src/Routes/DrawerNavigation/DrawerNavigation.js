import React, { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { colors } from '../../Utils/Colors';
import {
  Alert,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import TabNavigation from '../TabNavigation/TabNavigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBusinessImgAndBusinessNamesThunkAPI,
  updateBusinessProfileImgThunkAPI,
} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
import ImagePicker from 'react-native-image-crop-picker';
import { List } from 'react-native-paper';
import Toolbar from '../../Components/ToolBar/Toolbar';
import { handleRoomReportThunkApi } from '../../Service/slices/GetRoomsSlice'
import { useModal } from '../../context/ComingSoonContext';
import { genrateRegisterStudentReportThunkApi } from '../../Service/slices/RegisterSlice';
import SettlementsScreen from '../../Screen/payments/SettlementScreen';
import BusinessWebSite from '../../Screen/OnlineBusiness/BusinessWebsite';
import BusinessProfile from '../../Screen/OnlineBusiness/BusinessProfile';
import RoomViewScreen from '../../Screen/OnlineBusiness/RoomViewScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }) => {
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to exit?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       { text: 'YES', onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  // const navigation = useNavigation();
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const { getBusinessImgAndBusinessNamesResponse } = useSelector(
    state => state.root.bussinessData,
  );
  const user = useSelector(state => state.root.auth.userData);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    dispatch(getBusinessImgAndBusinessNamesThunkAPI());
  }, []);

  const handleRoomseatReport = async () => {
    try {
      const reponse = await dispatch(handleRoomReportThunkApi(user.id));
      // if (reponse?.payload?.status === true) {
      //   navigation.navigate('Pdf_Screen', {
      //     title: 'Room Report',
      //     PDF_URL: reponse?.payload?.data?.download_link, // Replace this with your dynamic value
      //   });
      // }
    } catch (e) { }
  };

  const handleRegistrationReport = async () => {
    try {
      const response = await dispatch(genrateRegisterStudentReportThunkApi());
      if (response?.payload?.status === true) {
        // navigation.navigate('Pdf_Screen', {
        //   PDF_URL: response?.payload?.data?.download_link,
        //   title: 'Register Students Report',
        // });
      } else {
        alertMessage(response?.payload?.status || 'Something went wrong cann`t open pdf');
      }
    } catch (e) { }
  };

  const updateProfileImage = image => {
    var formdata = new FormData();
    formdata.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'profileImage.jpg',
    });
    dispatch(updateBusinessProfileImgThunkAPI(formdata))
      .then(res => {
        if (res?.payload?.status === true) {
          alertMessage('Profile Image Updated Succussfully');
          dispatch(getBusinessImgAndBusinessNamesThunkAPI());
        }
      })
      .catch(err => {
        alertMessage('something went wrong');
      });
  };

  const PickImage = setImage => {
    ImagePicker.openPicker({
      width: 940,
      height: 390,
      cropping: true,
    })
      .then(image => {
        updateProfileImage(image.path);
      })
      .catch(e => {
        Alert.alert('Error', 'User cancelled image selection');
      });
  };

  const CustomDrawerContent = props => {
    return (
      <DrawerContentScrollView>
        <View
          style={{
            padding: horizontalScale(10),
            width: '100%',
            gap: verticalScale(10),
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: `${colors.white}`,
              height: verticalScale(140),
              width: '100%',
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={PickImage}>
            {getBusinessImgAndBusinessNamesResponse?.response?.businessImg && (
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'contain',
                }}
                source={{
                  uri: getBusinessImgAndBusinessNamesResponse?.response
                    ?.businessImg,
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut(), setExpanded(!expanded);
            }}
            style={{
              backgroundColor: `${colors.darkgrey}`,
              width: '100%',
              borderRadius: 4,
              justifyContent: 'space-between',
              padding: horizontalScale(12),
              flexDirection: 'row',
            }}>
            <Text style={[styles.labelStyle, { left: 0 }]}>
              {user?.businessName}
            </Text>
            <Icon
              name={'circle-chevron-down'}
              size={20}
              color={colors.AppDefaultColor}
            />
          </TouchableOpacity>

          {expanded && (
            <>
              {getBusinessImgAndBusinessNamesResponse?.response
                ?.remainingBusinessNames &&
                getBusinessImgAndBusinessNamesResponse?.response?.remainingBusinessNames?.map(
                  (item, i) => {
                    return (
                      item !== user?.businessName && (
                        <TouchableOpacity
                          key={i}
                          onPress={() =>
                            navigation.navigate('BussinessLogin', {
                              ...user,
                              businessName: item,
                            })
                          }
                          style={{
                            backgroundColor: `${colors.darkgrey}`,
                            // height: verticalScale(140),
                            width: '100%',
                            borderRadius: 4,

                            justifyContent: 'space-between',
                            padding: horizontalScale(12),
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={[
                              [styles.labelStyle, { left: 0 }],
                              { textTransform: 'capitalize' },
                            ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )
                    );
                  },
                )}

              <TouchableOpacity
                style={{
                  backgroundColor: `${colors.AppDefaultColor}`,
                  width: '100%',
                  borderRadius: 4,
                  justifyContent: 'space-between',
                  padding: horizontalScale(12),
                  flexDirection: 'row',
                }}>
                <Text style={[styles.labelStyle, { left: 0 }]}>
                  Add Hostel/PG
                </Text>
                <Icon name={'circle-plus'} size={20} color={colors.white} />
              </TouchableOpacity>
            </>
          )}
          
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: 5,
            marginHorizontal: horizontalScale(12),
          }}>
          <List.Accordion
            title="Payment"
            background={'#ffc107'}
            style={[
              {
                height: 50,
                borderCurve: 'circular',
                borderColor: 'red',
                marginLeft: -5,
              },
            ]}
            titleStyle={[
              styles.AccordionStyle,
              { height: 35, textAlignVertical: 'center' },
            ]}
            theme={{ colors: { background: colors.darkgrey } }}
            left={props => (
              <Icon {...props} name={'money-check'} size={20} color={'white'} />
            )}
            right={props => (
              <Icon
                {...props}
                name={
                  props.isExpanded ? 'circle-chevron-up' : 'circle-chevron-down'
                } //'sort-down'
                size={16}
                color={'white'}
              />
            )}>
            <List.Item
              background={'#999966'}
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              title="Bank Details"
              onPress={() => navigation.navigate('Bank Details')}
            />
            <List.Item
              title="Subscription History"
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              onPress={() => navigation.navigate('Subscription History')}
            />
            <List.Item
              title="Transaction History"
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              onPress={() => navigation.navigate('Transaction History')}
            />
            <List.Item
              title="Settlements"
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              onPress={() => navigation.navigate('Settlements')}
            />
          </List.Accordion>
          
        </View>

{/* <-Business Profile-> */}


  <View
          style={{
            flex: 1,
            paddingVertical: 5,
            marginHorizontal: horizontalScale(12),
          }}>
          <List.Accordion
            title="Online Business"
            background={'#ffc107'}
            style={[
              {
                height: 50,
                borderCurve: 'circular',
                borderColor: 'red',
                marginLeft: -5,
              },
            ]}
            titleStyle={[
              styles.AccordionStyle,
              { height: 35, textAlignVertical: 'center' },
            ]}
            theme={{ colors: { background: colors.darkgrey } }}
            left={props => (
              <Icon {...props} name={'cart-shopping'} size={20} color={'white'} />
            )}
            right={props => (
              <Icon
                {...props}
                name={
                  props.isExpanded ? 'circle-chevron-up' : 'circle-chevron-down'
                } //'sort-down'
                size={16}
                color={'white'}
              />
            )}>
            <List.Item
              background={'#999966'}
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              title="Business Website"
              onPress={() => navigation.navigate('BusinessWebSite')}
            />
            <List.Item
              title="Business Profile"
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              onPress={() => navigation.navigate('Business Profile')}
            />
            <List.Item
              title="Make Offer"
              style={{ backgroundColor: '#999966', marginTop: 10, elevation: 20 }}
              onPress={() => navigation.navigate('')}
            />
          
          </List.Accordion>
          
        </View>


      </DrawerContentScrollView>
    );
  };

  const [report, setReport] = useState(false);

  const [activeItem, setActiveItem] = useState('');
  const handlePress = (label, r) => {
    setActiveItem(label);
    if (r) {
      setReport(true);
    } else {
      setReport(false);
    }
    navigation.navigate(label);
  };

  return (
    <Drawer.Navigator
      initialRouteName="TabNavigation"
      screenOptions={{
        header: props => <Toolbar {...props} />,
        drawerType: 'slide',
        overlayColor: 'transparent',
        drawerContentStyle: { backgroundColor: '#333333' },
        drawerActiveTintColor: colors.darkgrey,
        drawerInactiveTintColor: colors.white,
        drawerContentContainerStyle: { backgroundColor: colors.black },
        drawerStyle: { backgroundColor: '#333333' },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{
          headerShown: false,
          drawerLabel: '',
          headerLeftLabelVisible: false,
        }}
      />
  <Drawer.Screen name="Settlements" component={SettlementsScreen} />
  <Drawer.Screen name='BusinessWebSite' component={BusinessWebSite}/>
  <Drawer.Screen name='Business Profile' component={BusinessProfile}/>

  




    </Drawer.Navigator>
  );
};
export default DrawerNavigation;

const styles = StyleSheet.create({
  activeLabelStyle: {
    fontWeight: 'bold',
    color: colors.AppDefaultColor,
  },
  activeDrawerItem: {
    backgroundColor: colors.AppDefaultColor,
    borderRadius: 5,
  },

  labelStyle: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    left: horizontalScale(-20),
    textTransform: 'capitalize',
  },
  AccordionStyle: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    left: horizontalScale(-0),
    // right: horizontalScale(-0),
    textTransform: 'capitalize',
  },
  DrawerItem: {
    backgroundColor: colors.darkgrey,
    gap: horizontalScale(20),
  },
  icon: {
    height: verticalScale(30),
    width: verticalScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
