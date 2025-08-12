import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import Card from '../../Components/cards/Card';
import { colors } from '../../Utils/Colors';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBusinessProfileDataThunkAPI,
  logoutUserSessionThunkAPI,
  updateBusinessProfileThunkAPI,
} from '../../Service/api/thunks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import alertMessage from '../../Utils/alert';
import Loader from '../../Utils/Loader';
import { logoutClient } from '../../Hooks/useAuth';
import Change_Password_Modal from '../../Components/modals/Change_Password_Modal';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Divider } from 'react-native-elements';
import {
  getAdminSubscriptionThunkApi,
  managerProfileThunkApi,
} from '../../Service/slices/profileDataSlice';
import ViewImage_Modal from '../../Tenant/Components/Modals/ViewImage_Modal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import reverseDateFormat from '../../Utils/dateFormat';
import SubscriptionHistoryModal from '../../Components/modals/SubscriptionHistoryModal ';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from "react-native-vector-icons/Ionicons";





const validationSchema = Yup.object().shape({
  hostelId: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  mobileNumber: Yup.number().required(),
  altMobileNumber: Yup.number().nullable(),
  gstNumber: Yup.number().nullable(),
  businessName: Yup.string().required(),
  country: Yup.string().required(),
  state: Yup.string().required(),
  city: Yup.string().required(),
  address: Yup.string().required(),
  pincode: Yup.number().required(),
  //   businessImg: Yup.string().required('Bussiness Image is required'),
});

const Profile_Screen = ({ navigation }) => {



  const bottomUpdateSheetModalRef = useRef(null);
  const bottomHistorySheetModalRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [personalVisible, setPersonalVisible] = useState(false);
  const [bankVisible, setBankVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [isDocVisible, setIsDocVisible] = useState(false);
  const [docUrl, setDocUrl] = useState(null);

  const handleViewDocs = url => {
    if (!url) {
      return alertMessage('Document not found');
    }
    setDocUrl(url);
    setIsDocVisible(true);
  };

  const snapPoints = useMemo(() => ['70%', '95%'], []);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const { token } = useSelector(state => state.root.auth.userData);
  // console.log(token);
  const { getBusinessProfileDataResponse } = useSelector(
    state => state.root.bussinessData,
  );
  const data = getBusinessProfileDataResponse.response;
  const user = useSelector(state => state.root.auth.userData);
  const profile = useSelector(
    state => state.profileData.managerProfileResponse.response,
  );

  // Separate fetchData function
  const fetchData = async () => {
    try {
      if (user?.userType.toLowerCase() !== 'admin') {
        await dispatch(managerProfileThunkApi({ token, id: user.userId }));
      }

      const res = await dispatch(getBusinessProfileDataThunkAPI());
      if (res?.payload?.status === true) {
        const data = res?.payload?.data;
        setInitialData(data);
      } else {
        alertMessage('Something went wrong');
      }
      await dispatch(getAdminSubscriptionThunkApi(token));
    } catch (error) {
      alertMessage('Something went wrong');
    }
  };

  const resetState = () => {
    setDocumentVisible(false);
    setPersonalVisible(false);
    setBankVisible(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    return () => {
      resetState();
    };
  }, [dispatch, token, user?.userId, user?.userType]);

  // Refresh data on pull to refresh
  const onRefresh = useCallback(() => {
    fetchData();
  }, [dispatch, token, user?.userId, user?.userType]);

  const { adminSubscriptionResponse, managerProfileResponse } = useSelector(state => state.profileData);

  const currentSubscription = adminSubscriptionResponse.response.find(item => item.status === '1');

  console.log('subscription data:', adminSubscriptionResponse?.response)

  const [initialData, setInitialData] = useState({
    // Default values can be empty strings or null
    hostelId: '',
    firstName: '',
    lastName: '',
    email: '',
    gstNumber: '',
    mobileNumber: '',
    altMobileNumber: '',
    businessName: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    // pincode: '',
  });

  // Handle form submission
  const handleSubmit = async values => {
    try {
      let res = await dispatch(
        updateBusinessProfileThunkAPI({ id: values?.id, values: values }),
      );
      if (res.payload.status === true) {
        alertMessage(res?.payload?.message);
        dispatch(getBusinessProfileDataThunkAPI())
          .then(res => {
            if (res?.payload?.status === true) {
              const data = res?.payload?.data;
              setInitialData(data); // Assuming data structure matches the form's fields
            } else {
              alertMessage('Something went wrong');
            }
          })
          .catch(err => {
            alertMessage('Something went wrong');
          });
        // navigation.replace('Drawer');
      }
    } catch (error) {
      alertMessage('Something went wrong');
    } finally {
      bottomUpdateSheetModalRef?.current.dismiss();
    }
  };

  const logout = async () => {
    dispatch(logoutClient());
    navigation.replace('SwitchRole');
  };

  const handleCPassword = () => {
    setPassVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        bottomUpdateSheetModalRef.current?.dismiss();
        bottomHistorySheetModalRef.current?.dismiss();
      };
    }, []),
  );

  const InfoComponent = ({ iconName, data }) => {
    return (
      <View style={[styles.row, styles.marginB5]}>
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={colors.black}
        />
        <Text style={[styles.black, styles.left10]}>{data || ''}</Text>
      </View>
    );
  };

  const InfoTitleComponent = ({ title, data }) => {
    return (
      <View style={[styles.row, styles.marginB5]}>
        <Text style={[styles.black, styles.bold]}>{title}</Text>
        <Text style={styles.black}>{data}</Text>
      </View>
    );
  };

  const DocumentComponent = ({ title, data, onPress }) => {
    return (
      <View style={[styles.flex, styles.marginB5]}>
        <Text style={[styles.black, styles.bold]}>{title}</Text>
        <TouchableOpacity
          style={styles.iconView}
          onPress={data ? onPress : null}>
          <MaterialCommunityIcons
            name="file-outline"
            size={20}
            color={data ? colors.green : colors.black}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const expandPersonalDtls = () => {
    setPersonalVisible(!personalVisible);
  };

  const expandBankDtls = () => {
    setBankVisible(!bankVisible);
  };
  const expandDocsDtls = () => {
    setDocumentVisible(!documentVisible);
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader
          loading={getBusinessProfileDataResponse?.loading || isLoading}
        />
        <ScrollView
          contentContainerStyle={styles.wrapper}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollToOverflowEnabled={true}>
          {user?.userType.toLowerCase() !== 'admin' && (
            <View style={styles.boxContainer}>
              <View style={[styles.center, styles.marginV10]}>
                {profile?.emp_profile ? (
                  <Image
                    source={{ uri: profile?.emp_profile?.candidate_photo || '' }}
                    style={{ width: 100, height: 100, borderRadius: 50 }} // Adjust dimensions as needed
                  />
                ) : (
                  <Image
                    source={require('../../Assets/Icons/account.png')}
                    style={{ width: 100, height: 100, borderRadius: 50 }} // Adjust dimensions as needed
                  />
                )}
              </View>
              <View>
                <InfoComponent
                  iconName={'human-greeting-variant'}
                  data={profile?.name?.toUpperCase()}
                />

                <InfoComponent
                  iconName={'email-outline'}
                  data={profile?.email?.toLowerCase()}
                />
                <InfoComponent
                  iconName={'phone-outline'}
                  data={profile?.mobile}
                />
                <InfoComponent
                  iconName={'map-marker-outline'}
                  data={
                    profile?.emp_profile?.current_address || 'Not available'
                  }
                />
                <InfoComponent
                  iconName={'account-tie-outline'}
                  data={profile?.user_type}
                />
                {profile?.emp_profile?.registration_date && (
                  <View style={[styles.flex, styles.marginB5]}>
                    <Text style={[styles.black, styles.bold]}>
                      Reg. Date{' '}
                      <Text style={styles.small}>
                        {profile?.emp_profile?.registration_date || ''}
                      </Text>
                    </Text>

                    <Text style={[styles.black, styles.bold]}>
                      Join Date{' '}
                      <Text style={styles.small}>
                        {profile?.emp_profile?.join_date || ''}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.flex, styles.expandTitle]}
                onPress={expandDocsDtls}>
                <Text style={[styles.black]}>Personal Documents</Text>
                <MaterialCommunityIcons
                  name={documentVisible ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
              {documentVisible && (
                <View style={{ marginTop: 5, paddingHorizontal: 8 }}>
                  <DocumentComponent
                    title="Aadhar Front"
                    data={profile?.emp_profile?.aadhar_front}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.aadhar_front)
                    }
                  />
                  <DocumentComponent
                    title="Aadhar Back"
                    data={profile?.emp_profile?.aadhar_back}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.aadhar_back)
                    }
                  />
                  <DocumentComponent
                    title="Signature"
                    data={profile?.emp_profile?.candidate_signature}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.candidate_signature)
                    }
                  />
                  <DocumentComponent
                    title="Experience Letter"
                    data={profile?.emp_profile?.experiece_letter}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.experiece_letter)
                    }
                  />
                  <DocumentComponent
                    title="Bank Document"
                    data={profile?.emp_profile?.bank_doc}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.bank_doc)
                    }
                  />
                  <DocumentComponent
                    title="Other Document"
                    data={profile?.emp_profile?.other_doc}
                    onPress={() =>
                      handleViewDocs(profile?.emp_profile?.other_doc)
                    }
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.flex, styles.expandTitle]}
                onPress={expandPersonalDtls}>
                <Text style={[styles.black]}>Personal Details</Text>
                <MaterialCommunityIcons
                  name={personalVisible ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
              {personalVisible && (
                <View style={{ marginTop: 5 }}>
                  <InfoTitleComponent
                    title="Aadhar Number - "
                    data={profile?.emp_profile?.aadharcard_no}
                  />
                  <InfoTitleComponent
                    title="Health Issue - "
                    data={profile?.emp_profile?.helth_issue}
                  />
                  <InfoTitleComponent
                    title="Guardian Name - "
                    data={profile?.emp_profile?.father_name}
                  />
                  <InfoTitleComponent
                    title="Blood Group - "
                    data={profile?.emp_profile?.blood_group}
                  />
                  <InfoTitleComponent
                    title="Marital Status - "
                    data={profile?.emp_profile?.marital_status}
                  />
                </View>
              )}

              <TouchableOpacity
                style={[styles.flex, styles.expandTitle]}
                onPress={expandBankDtls}>
                <Text style={[styles.black]}>Bank Details</Text>
                <MaterialCommunityIcons
                  name={bankVisible ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.black}
                />
              </TouchableOpacity>
              {bankVisible && (
                <View style={{ marginTop: 5 }}>
                  <InfoTitleComponent
                    title="Holder Name - "
                    data={profile?.emp_profile?.holder_name}
                  />
                  <InfoTitleComponent
                    title="Bank Name - "
                    data={profile?.emp_profile?.bank_name}
                  />
                  <InfoTitleComponent
                    title="IFSC Code - "
                    data={profile?.emp_profile?.Ifcs_code}
                  />
                  <InfoTitleComponent
                    title="Bank Number - "
                    data={profile?.emp_profile?.account_no}
                  />
                </View>
              )}
            </View>
          )}

          <LinearGradient
            colors={['#FFECB3', '#FFB74D']} style={styles.profileContainer}>



            <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>


              <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10 }}>
                <Ionicons name="notifications-circle" size={32} color="#c57906ff" />
              </View>
            </TouchableOpacity>


            {data?.businessImg && (
              <View style={{ flex: 1, alignItems: "center" }}>

                <Image
                  source={{
                    uri: data.businessImg,
                  }}
                  style={styles.profileImage}
                />
              </View>
            )}


            <View style={styles.nameContainer}>
              <Text style={styles.ProfilenameText}>{data?.businessName}</Text>

              {user?.userType === 'Admin' && (
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => {
                    bottomUpdateSheetModalRef.current.present();
                  }}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={colors.black}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles?.memberSinceText}>
              Member Since: 01-September-2024
            </Text>
          </LinearGradient>


          <View style={styles.boxContainer}>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="home-variant"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowTextBold}>
                {data?.businessType
                  ? data?.businessType.length > 35
                    ? data?.businessType.slice(0, 32).concat(' ...')
                    : data?.businessType
                  : null}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>{data?.address}</Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="identifier"
                size={26}
                color={colors.black}
              />
              <Text style={styles.rowText}>{data?.hostelId}</Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="human-greeting-variant"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowTextBold}>
                {data?.firstName} {data?.lastName}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="phone"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>{data?.mobileNumber}</Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>{data?.email}</Text>
            </View>



          </View>



          {/* subscription view  */}
          <View style={styles.boxContainer}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Active Subscription</Text>
              <TouchableOpacity
                style={styles.historyIcon}
                onPress={() => {
                  bottomHistorySheetModalRef.current.present();
                }}>
                <MaterialCommunityIcons
                  name="history"
                  size={20}
                  color={colors.orange}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="laptop"
                size={20}
                color={colors.black}
              />

              <Text style={styles.rowText}>
                {currentSubscription
                  ? currentSubscription?.subscription_detail?.package_title
                  : '-----'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="gold"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>
                {currentSubscription
                  ? currentSubscription?.subscription_detail?.package_category
                  : '-----'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="bed-queen"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>
                {currentSubscription
                  ? currentSubscription?.no_of_seats
                  : '-----'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>
                From{' '}
                {currentSubscription ? currentSubscription?.startdate : '-----'}{' '}
                to{currentSubscription ? currentSubscription?.enddate : '-----'}
              </Text>
            </View>

            <View style={styles.rowContainer}>
              <MaterialCommunityIcons
                name="undo-variant"
                size={20}
                color={colors.black}
              />
              <Text style={styles.rowText}>
                {currentSubscription ? currentSubscription?.counter : '-----'}{' '}
                Days remaining
              </Text>
            </View>
          </View>

          <View style={styles.boxContainer}>

            <TouchableOpacity
              style={[styles.boxContainer, styles.flex]}
              onPress={() => navigation.navigate('Permissions_Screen')}>
              <Text style={styles.subscriptionTitle}>Permissions</Text>

              <MaterialCommunityIcons
                name="more"
                size={20}
                color={colors.green}
              />
            </TouchableOpacity>
          </View>
          {/* buttons view  */}
          <View style={styles.boxContainer}>
            <TouchableOpacity
              onPress={handleCPassword}
              style={[
                styles.button,
                { marginTop: verticalScale(12) },
                styles.flex,
              ]}>
              <MaterialCommunityIcons
                name="key-variant"
                size={20}
                color={colors.white}
              />
              <Text style={styles.btntext}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('DocumentUploadScreen')}
              style={[
                styles.button,
                { marginTop: verticalScale(12) },
                styles.flex,
              ]}>
              <MaterialCommunityIcons
                name="folder-upload-outline"
                size={20}
                color={colors.white}
              />
              <Text style={styles.btntext}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings_Screen');
              }}
              style={[
                styles.button,
                { marginTop: verticalScale(12) },
                styles.flex,
              ]}>
              <MaterialCommunityIcons
                name="youtube-studio"
                size={20}
                color={colors.white}
              />
              <Text style={styles.btntext}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={[
                styles.button,
                { marginTop: verticalScale(12), backgroundColor: colors.red },
                styles.flex,
              ]}>
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={colors.white}
              />
              <Text style={styles.btntext}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomSheetModal
          ref={bottomUpdateSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onDismiss={() => { }}>
          <Text style={styles.sheetTitle}>Update Profile</Text>
          <Divider />
          <BottomSheetScrollView>
            <Formik
              initialValues={initialData}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={values => handleSubmit(values)}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setValues,
                errors,
                touched,
              }) => (
                <Card>
                  <View>
                    <Text style={styles.text}>Business ID </Text>
                    <TextInput
                      value={values.hostelId}
                      editable={false}
                      onChangeText={handleChange('hostelId')}
                      style={[styles.input, { backgroundColor: 'white' }]}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>First Name </Text>
                    <TextInput
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      style={[styles.input, { backgroundColor: 'white' }]}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Last Name </Text>
                    <TextInput
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      style={[styles.input]}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Email </Text>
                    <TextInput
                      value={values.email}
                      onChangeText={handleChange('email')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Mobile</Text>
                    <TextInput
                      value={values.mobileNumber}
                      onChangeText={handleChange('mobileNumber')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Alternate Mobile</Text>
                    <TextInput
                      value={values.altMobileNumber}
                      onChangeText={handleChange('altMobileNumber')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>GST Number</Text>
                    <TextInput
                      value={values.gstNumber}
                      placeholder="Enter GST Number"
                      placeholderTextColor={colors.grey}
                      onChangeText={handleChange('gstNumber')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Business Name</Text>
                    <TextInput
                      value={values.businessName}
                      onChangeText={handleChange('businessName')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>City </Text>
                    <TextInput
                      value={values.city}
                      onChangeText={handleChange('city')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>State</Text>
                    <TextInput
                      value={values.state}
                      onChangeText={handleChange('state')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Country</Text>
                    <TextInput
                      value={values.country}
                      onChangeText={handleChange('country')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Address </Text>
                    <TextInput
                      value={values.address}
                      onChangeText={handleChange('address')}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputPadding}>
                    <Text style={styles.text}>Pincode </Text>
                    <TextInput
                      value={values.pincode}
                      onChangeText={handleChange('pincode')}
                      style={styles.input}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.button, styles.marginB50]}>
                    <Text style={styles.btntext}>Submit</Text>
                  </TouchableOpacity>
                </Card>
              )}
            </Formik>
          </BottomSheetScrollView>
        </BottomSheetModal>

        <SubscriptionHistoryModal
          adminSubscriptionResponse={adminSubscriptionResponse}
          bottomHistorySheetModalRef={bottomHistorySheetModalRef}
          snapPoints={snapPoints}
        />

        <Change_Password_Modal
          isVisible={passVisible}
          onClose={() => setPassVisible(false)}
        />

        <ViewImage_Modal
          isVisible={isDocVisible}
          onClose={() => setIsDocVisible(false)}
          imageURL={docUrl}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

export default Profile_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapper: {
    // paddingTop: verticalScale(50),
    // paddingHorizontal: horizontalScale(12),
    width: '100%',
    paddingBottom: verticalScale(100),
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 20,
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Medium',
  },
  topRow: { paddingVertical: verticalScale(12), alignItems: 'center' },
  inputPadding: {
    paddingVertical: verticalScale(6),
  },
  input: {
    color: colors.black,
    fontSize: 14,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
    fontWeight: '600',
  },
  btntext: {
    fontSize: moderateScale(14),
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    width: '90%',
    textAlign: 'center',
  },
  button: {
    height: verticalScale(50),
    paddingHorizontal: horizontalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(4),
    backgroundColor: colors.AppDefaultColor,
    marginTop: 10,
    borderRadius: 10
  },

  marginB50: {
    marginBottom: 50,
  },

  marginB5: {
    marginBottom: 5,
  },

  center: {
    alignItems: 'center',
  },
  ///

  profileContainer: {
    flexDirection: 'column',
    backgroundColor: '#f7aa47ff',
    padding: 10,

    // borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderStyle: 'dashed',

    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    paddingVertical: 30,

    // alignItems:"center",
  },
  ProfilenameText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600"
  },

  profileImage: {
    width: "50%",
    height: moderateScale(150),
    borderRadius: moderateScale(30),
  },


  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.black,
    paddingHorizontal: 25,
    marginBottom: 10,
  },

  editIcon: {
    // marginLeft: 10,
    position: 'absolute',
    right: horizontalScale(90),
    bottom: verticalScale(25),
    padding: moderateScale(6),
    borderRadius: moderateScale(50),
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(3),
  },

  memberSinceText: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 10,
    color: "#fff",
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: '#f5f5f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,


  },
  rowText: {
    marginLeft: horizontalScale(14),
    color: colors.black,
    fontSize: moderateScale(15),
    fontWeight: '400',
    flexShrink: 1,
  },
  rowTextBold: {
    marginLeft: horizontalScale(14),
    color: colors.black,
    fontSize: moderateScale(16),
    fontWeight: '600',
    flexShrink: 1,
  },
  boxContainer: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  borderDot: {
    borderWidth: 0.5,
    borderColor: 'grey',
    borderStyle: 'dashed',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    color: colors.black,
    justifyContent: 'space-between',
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.black,
  },
  historyIcon: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 50,
  },

  ///
  sheetTitle: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
    fontSize: 16,
  },
  subList: {
    backgroundColor: colors.white,
    marginTop: 10,
    marginHorizontal: '2.5%',
    padding: 10,
    borderRadius: 5,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginV10: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  height40: {
    height: 40,
  },
  black: {
    color: colors.black,
  },
  bold: {
    fontWeight: '500',
  },
  small: {
    fontSize: 12,
    color: colors.grey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTab: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  topTabText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '500',
  },
  permissionView: {
    backgroundColor: colors.red,
  },
  left10: {
    marginLeft: 10,
  },
  expandTitle: {
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 0.5,
    borderColor: colors.darkgrey,
    borderStyle: 'dashed',
    backgroundColor: colors.orange,
  },
  iconView: {
    padding: 6,
    borderRadius: 25,
  },
});
