import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import InputCard from '../../Components/cards/InputCard';
import PickerCard from '../../Components/cards/PickerCard';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetFormNo,
  GetRoomsListApi,
  GetSeatsListApi,
  handleBasicRegisterDetails,
  handleRegistrationListAPI,
  studentRegisterApi,
} from '../../Service/slices/RegisterSlice';
import {validationSchema} from '../../Helper/ValidationSchema';
import {Formik} from 'formik';
import {getStudentReviewsThunkAPI} from '../../Service/api/thunks';
import Share_Modal from '../../Components/modals/Share_Modal';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';
import Verified_Details_Modal from '../../Components/modals/Verified_Details_Modal';
import ImagePickerComponent from '../../Components/cards/ImagePickerComponent';
import {
  createImageUploadThunkApi,
  deleteImageThunkApi,
} from '../../Service/slices/RegisterSlice';
import {useFocusEffect} from '@react-navigation/native';
import ViewImage_Modal from '../../Tenant/Components/Modals/ViewImage_Modal';
import {
  getPincodeThunkApi,
  referVerifyThunkAPi,
  getStateDataThunkApi,
  getDistrictDataThunkApi,
} from '../../Service/slices/tenant/tenantReferVerifySlice';
import AutoSuggestInputCard from '../../Components/cards/AutoSuggestInputCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Add_Registration_Screen = memo(({navigation, route}) => {
  const studentData = route?.params?.studentData;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isBirthDatePickerVisible, setBirthDatePickerVisibility] =
    useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeclare, setIsDeclare] = useState(false);
  const [isReferVerified, setIsReferVerified] = useState(false);
  const [isStudentReviewData, setIsStudentReviewData] = useState(false);
  const [referVerifiedData, setReferVerifiedData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%', '94%'], []);
  const handlePress = () => {
    bottomSheetRef.current?.present();
  };
  const dispatch = useDispatch();
  const {
    formNumberResponse,
    seatsListResponse,
    roomsListResponse,
    shareRegistrationFormResponse,
    adminVerifiedHostelTokenResponse,
    getStudentReviewsResponse,
    imageUploadResponse,
  } = useSelector(state => state.root.registerData);

  const {token} = useSelector(state => state.root.auth.userData);
  const formikRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const INITIAL_DATA = {
    formNumber: formNumberResponse?.response?.formno,
    roomNumber: studentData?.roomNumber
      ? String(studentData?.roomNumber)
      : null,
    seatNumber: studentData?.seatNumber
      ? String(studentData?.seatNumber)
      : null,
    registrationDate: studentData?.registrationDate
      ? studentData?.registrationDate
      : null,
    candidateName: studentData?.name ? studentData?.name : null,
    birthDate: null,
    idProof: null,
    candidatePhone: studentData?.mobileNumber
      ? studentData?.mobileNumber
      : null,
    email: studentData?.email ? studentData?.email : null,
    blood_Group: null,
    courseName: 'coursetype',
    courseDescription: '',
    jobDescription: '',
    instituteName: 'institute Name',
    instituteDescription: '',
    companyName: null,
    companyDescription: '',
    stayDuration: null,
    healthIssue: 'No',
    healthDescription: '',
    vehicleNumber: 'No',
    vehicleDescription: '',
    fatherName: null,
    fatherOccupation: null,
    motherName: null,
    motherOccupation: null,
    parentsPhone1: null,
    parentsPhone2: null,
    parentsEmail: null,
    parentsAddress: null,
    state: null,
    pincode: null,
    parentAddressCountry: null, // Added missing field
    parentAddressDistrict: null, // Added missing field
    guardianName: null,
    guardianNumber: null,
    guardianAddress: null,
    guardianAddressPincode: null, // Added missing field
    guardianAddressCountry: null, // Added missing field
    guardianAddressState: null, // Added missing field
    guardianAddressDistrict: null, // Added missing field
    candidateImg: null,
    aadhareFront: null,
    aadhareBack: null,
    candidateSignature: null, // Updated typo: candidateSing to candidateSignature
    parentSignature: null, // Updated typo: parentSing to parentSignature
    bookingId: studentData?.id ? studentData?.id : null,
    leadId: studentData?.leadId ? studentData?.leadId : null,
    referCode: null,
    remark: null, // Added missing field
  };
  const [userData, setUserData] = useState(INITIAL_DATA);
  useEffect(() => {
    setUserData(INITIAL_DATA);
  }, [studentData, formNumberResponse, dispatch]);

  const ImageInitialData = {
    candidateImg: null,
    aadhareFront: null,
    aadhareBack: null,
    candidateSign: null,
    parentSign: null,
  };
  const [uploadImage, setUploadImage] = useState(ImageInitialData);

  const updateFields = useCallback(
    fields => {
      setUserData(prev => {
        return {...prev, ...fields};
      });
    },
    [userData],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(GetFormNo());
      dispatch(GetRoomsListApi());
      return () => {
        resetFormState(formikRef.current.resetForm);
      };
    }, []),
  );

  const resetFormState = resetForm => {
    resetForm();
    setUserData(INITIAL_DATA);
    setUploadImage(ImageInitialData);
    setIsDeclare(false);
    setCountryName([]);
    setState([]);
    setDistrict([]);
    setGuardianCountry([]);
    setGuardianState([]);
    setGuardianDistrict([]);
    setChecked(false);
  };

  const onRefresh = useCallback(
    resetForm => {
      resetFormState(resetForm);
      dispatch(GetFormNo());
      dispatch(GetRoomsListApi());
    },
    [refreshing],
  );

  useLayoutEffect(() => {
    updateFields({formNumber: formNumberResponse?.response?.formno});
  }, [formNumberResponse?.response?.formno]);

  const getObjList = useCallback(list => {
    return list?.map(key => ({
      value: key,
      label: key,
    }));
  }, []);

  const toggleModal = useCallback(
    id => {
      setModalVisible(!isModalVisible);
    },
    [isModalVisible],
  );

  const handleStudentVerify = idNumber => {
    let debounceTimeout;

    clearTimeout(debounceTimeout); // Clear the previous timeout
    debounceTimeout = setTimeout(() => {
      dispatch(getStudentReviewsThunkAPI(idNumber))
        .then(res => {
          if (res?.payload?.status === true) {
            setReferVerifiedData({
              isStudentReview: true,
              data: res?.payload?.data,
              // name: res?.payload?.data[0]?.name,
              // mobile: res?.payload?.data[0]?.mobile,
              // email: res?.payload?.data[0]?.email,
              // aadhaar: res?.payload?.data[0]?.aadhaar,
              // hostelname: res?.payload?.data[0]?.hostelname,
              // payment_terms: res?.payload?.data[0]?.payment_terms,
              // tenant_behavior: res?.payload?.data[0]?.tenant_behavior,
              // responsibilities: res?.payload?.data[0]?.responsibilities,
              // additional: res?.payload?.data[0]?.additional,
            });
            if (res?.payload?.data?.length !== 0) {
              alertMessage(res?.payload?.message);
              setIsStudentReviewData(true);
              setIsReferVerified(false);
            } else {
              alertMessage('No reviews found');
            }
            // alertMessage(res?.payload?.message);
            // dispatch(handleRegistrationListAPI());
            // navigation.navigate('Registration');
          } else {
            alertMessage('Something went wrong!');
          }
        })
        .catch(err => {
          alertMessage('Something went wrong!');
        });
    }, 300); // 300ms debounce delay
  };

  const handleReferralVerify = async (code, number) => {
    try {
      const response = await dispatch(
        referVerifyThunkAPi({data: code, number, token}),
      );
      if (response.payload.refer_code_is_valid === true) {
        Alert.alert(
          'Referral Code Validated',
          'You can proceed with the registration.',
        );
      } else {
        Alert.alert(
          'Invalid Referral Code',
          'Please enter a valid referral code.',
        );
      }
    } catch (error) {}
  };
  const [checked, setChecked] = useState(false);
  const handleImageUpload = async (fieldName, data) => {
    const formData = new FormData();
    setLoading(true);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    try {
      await delay(2500);

      if (uploadImage[fieldName]) {
        const deleteResponse = await handleDeleteImage(
          fieldName,
          uploadImage[fieldName],
        );
      }

      if (data[fieldName]) {
        formData.append('image', {
          uri: data[fieldName].uri,
          type: data[fieldName].type,
          name: data[fieldName].name,
        });

        const response = await dispatch(
          createImageUploadThunkApi({data: formData, token}),
        );
        if (response.payload.status === true) {
          const uploadedFilename = response.payload.data.fileName;
          setUploadImage(prevState => ({
            ...prevState,
            [fieldName]: uploadedFilename,
          }));
        }
      }
    } catch (error) {
    } finally {
      if (fieldName !== 'parentSignature') {
        await delay(3000);
      }
      setLoading(false);
    }
  };

  const handleDeleteImage = async (fieldName, imageName) => {
    try {
      const response = await dispatch(
        deleteImageThunkApi({data: imageName, name: fieldName, token}),
      );
      if (response.payload.status === true) {
        setUploadImage(prevState => ({
          ...prevState,
          [fieldName]: null,
        }));
        return true; // Indicate success
      } else {
        return false; // Indicate failure
      }
    } catch (error) {
      return false; // Indicate failure
    }
  };

  const [Country, setCountryName] = useState([]);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [guardianCountry, setGuardianCountry] = useState([]);
  const [guardianState, setGuardianState] = useState([]);
  const [guardianDistrict, setGuardianDistrict] = useState([]);

  const handlePincodeValidation = async (pinno, fieldName, setValues) => {
    try {
      setLoading(true);
      const response = await dispatch(getPincodeThunkApi({pinno, token}));
      if (
        response.payload.status === true &&
        response.payload.statusCode === 200
      ) {
        const {country, district, state} = response.payload.data;
        if (fieldName === 'pincode') {
          setValues(prevValues => ({
            ...prevValues,
            parentAddressDistrict: district,
            state: state,
            parentAddressCountry: country,
          }));
        } else if (fieldName === 'guardianAddressPincode') {
          setValues(prevValues => ({
            ...prevValues,
            guardianAddressDistrict: district,
            guardianAddressState: state,
            guardianAddressCountry: country,
          }));
        }
      } else if (
        response.payload.status === true &&
        response.payload.statusCode === 404
      ) {
        const countryFallback = response.payload.data.uniqueCountries;
        if (fieldName === 'pincode') {
          setCountryName(countryFallback);
        } else if ((fieldName = 'guardianAddressPincode')) {
          setGuardianCountry(countryFallback);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCountryValidation = async (countryName, fieldName) => {
    try {
      const response = await dispatch(
        getStateDataThunkApi({countryName, token}),
      );
      if (response.payload.status === true) {
        const stateList = response.payload.data.uniqueStates;
        if (fieldName === 'parentAddressCountry') {
          setState(stateList);
        } else {
          setGuardianState(stateList);
        }
      }
    } catch (error) {}
  };

  const handleStateValidation = async (countryName, stateName, fieldName) => {
    try {
      const response = await dispatch(
        getDistrictDataThunkApi({countryName, stateName, token}),
      );
      if (response.payload.status === true) {
        const districtList = response.payload.data.uniqueDistricts;
        if (fieldName === 'state') {
          setDistrict(districtList);
        } else {
          setGuardianDistrict(districtList);
        }
      }
    } catch (error) {}
  };

  const {referVerifyData} = useSelector(state => state.tenantReferVerify);
  const referStatus = referVerifyData.data;

  const handleSubmit = async values => {
    const data = {
      formNumber: String(formNumberResponse?.response?.formno),
      roomNumber: values.roomNumber,
      seatNumber: String(values.seatNumber),
      registrationDate: values.registrationDate,
      candidateName: values.candidateName,
      birthDate: values.birthDate,
      idProof: String(values.idProof),
      candidatePhone: String(values.candidatePhone),
      email: values.email,
      blood_Group: values.blood_Group,
      courseName: values.courseName,
      courseDescription: values.courseDescription,
      jobDescription: values.jobDescription,
      instituteName: values.instituteName,
      instituteDescription: values.instituteDescription,
      companyDescription: values.companyDescription,
      stayDuration: values.stayDuration,
      healthIssue: values.healthIssue,
      healthDescription: values.healthDescription,
      vehicleNumber: values.vehicleNumber,
      vehicleDescription: values.vehicleDescription,
      fatherName: values.fatherName,
      fatherOccupation: values.fatherOccupation,
      motherName: values.motherName,
      motherOccupation: values.motherOccupation,
      parentsPhone1: String(values.parentsPhone1),
      parentsPhone2: String(values.parentsPhone2),
      parentsEmail: values.parentsEmail,
      parentsAddress: values.parentsAddress,
      state: values.state,
      pincode: String(values.pincode),
      parentAddressCountry: values.parentAddressCountry,
      parentAddressDistrict: values.parentAddressDistrict,
      guardianName: values.guardianName,
      guardianNumber: String(values.guardianNumber),
      guardianAddress: values.guardianAddress,
      guardianAddressPincode: String(values.guardianAddressPincode),
      guardianAddressCountry: values.guardianAddressCountry,
      guardianAddressState: values.guardianAddressState,
      guardianAddressDistrict: values.guardianAddressDistrict,
      candidateImg: uploadImage['candidateImg'],
      aadharFront: uploadImage['aadhareFront'],
      aadharBack: uploadImage['aadhareBack'],
      candidateSignature: uploadImage['candidateSignature'] || null,
      parentSignature: uploadImage['parentSignature'] || null,
      remark: values.remark || null,
    };
    // Conditionally add optional fields
    if (values?.bookingId) data.bookingId = values.bookingId;
    if (values?.leadId) data.leadId = values.leadId;

    if (referStatus === true && values.referCode) {
      formData.referCode = values.referCode;
    }

    try {
      setLoading(true);
      const response = await dispatch(studentRegisterApi(data));
      if (response?.payload?.status === true) {
        setStudentId(response.payload.studentId);
        dispatch(handleBasicRegisterDetails());
        dispatch(handleRegistrationListAPI());
        navigation.navigate('Registration');
        Alert.alert('Success:', `${response.payload.message}`);
      } else {
        Alert.alert('Failed:', `${response?.payload.error}`);
      }
    } catch (err) {
      Alert.alert('Something went wrong!', err);
    } finally {
      setLoading(false);
    }
  };

  const [imageUri, setImageUri] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  const handleImageView = useCallback(uri => {
    setImageUri(uri);
    setImageModal(true);
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  //.....................
  const Section_Header = ({title}) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{fontSize: moderateScale(16), color: colors.white}}>
          {title}
        </Text>
      </View>
    );
  };

  //................
  const SubmitButton = ({title, handlePress, backgroundColor, disabled}) => {
    return (
      <TouchableOpacity
        disabled={disabled ? disabled : false}
        style={[
          styles.submitButton,
          {
            backgroundColor: disabled
              ? colors.darkgray
              : colors.AppDefaultColor,
          },
        ]}
        onPress={handlePress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader
          loading={
            formNumberResponse?.loading ||
            roomsListResponse?.loading ||
            seatsListResponse?.loading ||
            shareRegistrationFormResponse?.loading ||
            adminVerifiedHostelTokenResponse?.loading ||
            getStudentReviewsResponse?.loading ||
            loading
          }
        />
        <Formik
          initialValues={userData}
          innerRef={formikRef} // Set reference for Formik
          validationSchema={validationSchema}
          onSubmit={values => handleSubmit(values)}>
          {({
            handleChange,
            handleSubmit,
            values,
            setValues,
            errors,
            touched,
            resetForm,
          }) => (
            <FlatList
              data={[1]}
              keyExtractor={item => item.toString()}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => onRefresh(resetForm)}
                />
              }
              renderItem={() => (
                <>
                  <View style={styles.section}>
                    <InputCard
                      title={'Form Number'}
                      value={String(formNumberResponse?.response?.formno)}
                      name={'formNumber'}
                      placeholder={'Form no'}
                      keyboardType={'numeric'}
                      // error={errors.formNumber}
                      editable={false}
                    />

                    <PickerCard
                      title={'Room Number'}
                      placeholder={'Select Room'}
                      value={values.roomNumber}
                      style={{borderRadius: 5}}
                      setValue={item => {
                        setValues({...values, roomNumber: item}),
                          dispatch(GetSeatsListApi({roomNo: item}));
                      }}
                      items={getObjList(roomsListResponse?.response?.rooms)}
                      error={
                        errors.roomNumber && touched.roomNumber
                          ? errors.roomNumber
                          : null
                      }
                    />
                    <PickerCard
                      title={'Seat Number'}
                      placeholder={'Select Seat'}
                      value={values.seatNumber}
                      setValue={item => {
                        if (item) {
                          setValues({...values, seatNumber: item});
                        } else {
                          setValues({...values, seatNumber: ''}); // Optionally set a default empty state
                        }
                      }}
                      items={getObjList(seatsListResponse?.response?.data)}
                      error={
                        errors.seatNumber && touched.seatNumber
                          ? errors.seatNumber
                          : null
                      }
                      disabled={!values.roomNumber}
                    />
                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(16),
                        }}>
                        Registration Date
                      </Text>
                      <TouchableOpacity
                        onPress={() => setDatePickerVisibility(true)}
                        style={{
                          height: verticalScale(50),
                          width: '100%',
                          borderRadius: horizontalScale(4),
                          backgroundColor: colors.white,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: horizontalScale(12),
                          borderWidth: 0.5,
                          borderColor: colors.grey,
                        }}>
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              color: colors.grey,
                            },
                          ]}>
                          {values.registrationDate
                            ? values.registrationDate
                            : 'dd/mm/yyyy'}
                        </Text>
                        <Icon
                          name={'calendar'}
                          color={colors.black}
                          size={20}
                        />
                      </TouchableOpacity>
                      {touched.registrationDate && errors.registrationDate && (
                        <Text style={styles.error}>
                          {errors.registrationDate}{' '}
                        </Text>
                      )}
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, registrationDate: formatDate});
                        setDatePickerVisibility(false);
                      }}
                      onCancel={() => setDatePickerVisibility(false)}
                    />
                  </View>
                  <Section_Header title={'Personal Details'} />

                  <View style={styles.section}>
                    <InputCard
                      title={'Candidate Name'}
                      placeholder={'Full Name'}
                      placeholderStyle={colors.grey}
                      value={values.candidateName}
                      name={'candidateName'}
                      updateFields={text => setValues({...values, ...text})}
                      error={
                        errors.candidateName && touched.candidateName
                          ? errors.candidateName
                          : null
                      }
                    />
                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(14),
                        }}>
                        Birth Date
                      </Text>
                      <TouchableOpacity
                        onPress={() => setBirthDatePickerVisibility(true)}
                        style={{
                          height: verticalScale(50),
                          width: '100%',
                          borderRadius: horizontalScale(4),
                          backgroundColor: colors.white,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: horizontalScale(12),
                          borderWidth: 0.5,
                          borderColor: colors.grey,
                        }}>
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              color: colors.grey,
                            },
                          ]}>
                          {values.birthDate ? values.birthDate : 'dd/MM/yyyy'}
                        </Text>
                        <Icon
                          name={'calendar'}
                          color={colors.black}
                          size={20}
                        />
                      </TouchableOpacity>
                      {touched.birthDate && errors.birthDate && (
                        <Text style={styles.error}>{errors.birthDate} </Text>
                      )}

                      <DateTimePickerModal
                        isVisible={isBirthDatePickerVisible}
                        mode="date"
                        onConfirm={date => {
                          const formatDate = moment(date).format('YYYY-MM-DD');
                          setValues({...values, birthDate: formatDate});
                          setBirthDatePickerVisibility(false);
                        }}
                        onCancel={() => setBirthDatePickerVisibility(false)}
                      />
                    </View>
                    <View style={{gap: verticalScale(6)}}>
                      <InputCard
                        title={'Aadhar/VT/Dl/Id Proof'}
                        placeholder={'Aadhar/VT/Dl/Id Proof'}
                        value={values.idProof}
                        maxLength={12}
                        name={'idProof'}
                        updateFields={text => {
                          setValues({...values, ...text}),
                            setIsStudentReviewData(false);
                        }}
                        keyboardType={'numeric'}
                        error={
                          errors.idProof && touched.idProof
                            ? errors.idProof
                            : null
                        }
                      />
                      {String(values.idProof).length > 11 && (
                        <TouchableOpacity
                          style={[
                            styles.reviewButton,
                            {
                              borderColor: isStudentReviewData
                                ? colors.green
                                : colors.AppDefaultColor,
                            },
                          ]}
                          onPress={() => {
                            isStudentReviewData
                              ? handlePress()
                              : handleStudentVerify(values.idProof);
                          }}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color: isStudentReviewData
                                  ? colors.green
                                  : colors.AppDefaultColor,
                              },
                            ]}>
                            Check Reviews
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <InputCard
                      title={'Mobile Number'}
                      placeholder={'Mobile'}
                      value={values.candidatePhone}
                      name={'candidatePhone'}
                      maxLength={10}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      keyboardType={'numeric'}
                      error={
                        errors.candidatePhone && touched.candidatePhone
                          ? errors.candidatePhone
                          : null
                      }
                    />
                    <InputCard
                      title={'Email'}
                      placeholder={'Email'}
                      value={values.email}
                      name={'email'}
                      updateFields={text => setValues({...values, ...text})}
                      error={
                        errors.email && touched.email ? errors.email : null
                      }
                      keyboardType="email-address" // Show email-specific keyboard
                      autoCapitalize="none"
                    />
                    <PickerCard
                      value={values.blood_Group}
                      setValue={item => {
                        setValues({...values, blood_Group: item});
                      }}
                      placeholder={'Select'}
                      title={'Blood Group'}
                      items={[
                        {value: 'A+', label: 'A+'},
                        {value: 'B+', label: 'B+'},
                        {value: 'AB+', label: 'AB+'},
                        {value: 'O+', label: 'O+'},
                      ]}
                      error={
                        errors.blood_Group && touched.blood_Group
                          ? errors.blood_Group
                          : null
                      }
                    />
                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(16),
                        }}>
                        Course/Job Type
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: horizontalScale(12),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.checkBox,
                              {
                                backgroundColor:
                                  values.courseName === 'coursetype'
                                    ? colors.orange
                                    : colors.white,
                              },
                            ]}
                            onPress={() =>
                              setValues({...values, courseName: 'coursetype'})
                            }>
                            {values.courseName === 'coursetype' ? (
                              <Icon
                                name={'check'}
                                size={16}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Course type
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.checkBox,
                              {
                                backgroundColor:
                                  values.courseName === 'jobtype'
                                    ? colors.orange
                                    : colors.white,
                              },
                            ]}
                            onPress={() =>
                              setValues({...values, courseName: 'jobtype'})
                            }>
                            {values.courseName === 'jobtype' ? (
                              <Icon
                                name={'check'}
                                size={16}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Job type
                          </Text>
                        </View>
                      </View>
                    </View>
                    {values.courseName === 'coursetype' ? (
                      <InputCard
                        title={'Course Details'}
                        placeholder={'Course Details'}
                        value={values.courseDescription}
                        name={'courseDescription'}
                        updateFields={text => setValues({...values, ...text})}
                        error={errors.courseDescription}
                      />
                    ) : (
                      <InputCard
                        title={'job Details'}
                        placeholder={'job Details'}
                        value={values.jobDescription}
                        name={'jobDescription'}
                        updateFields={text => {
                          setValues({...values, ...text});
                        }}
                        error={errors.jobDescription}
                      />
                    )}

                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(16),
                        }}>
                        Institute/Company Name
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: horizontalScale(12),
                          // width: '50%',
                          // justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.checkBox,
                              {
                                backgroundColor:
                                  values.instituteName === 'institute Name'
                                    ? colors.orange
                                    : colors.white,
                              },
                            ]}
                            onPress={() =>
                              setValues({
                                ...values,
                                instituteName: 'institute Name',
                              })
                            }>
                            {values.instituteName === 'institute Name' ? (
                              <Icon
                                name={'check'}
                                size={15}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Institute Name
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={[
                              styles.checkBox,
                              {
                                backgroundColor:
                                  values.instituteName === 'companyName'
                                    ? colors.orange
                                    : colors.white,
                              },
                            ]}
                            onPress={() =>
                              setValues({
                                ...values,
                                instituteName: 'companyName',
                              })
                            }>
                            {values.instituteName === 'companyName' ? (
                              <Icon
                                name={'check'}
                                size={15}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Company Name
                          </Text>
                        </View>
                      </View>
                    </View>
                    {values.instituteName === 'companyName' ? (
                      <InputCard
                        title={'Company description'}
                        placeholder={'Company description'}
                        value={values.companyDescription}
                        name={'companyDescription'}
                        updateFields={text => setValues({...values, ...text})}
                        error={errors.companyDescription}
                      />
                    ) : (
                      <InputCard
                        title={'Institute description'}
                        placeholder={'Institute description'}
                        value={values.instituteDescription}
                        name={'instituteDescription'}
                        updateFields={text => setValues({...values, ...text})}
                        error={errors.instituteDescription}
                      />
                    )}
                    <InputCard
                      title={'Lock-In Period(Month)'}
                      placeholder={'Stay Duration'}
                      value={values.stayDuration}
                      name={'stayDuration'}
                      updateFields={text => setValues({...values, ...text})}
                      error={touched.stayDuration && errors.stayDuration}
                      keyboardType={'number-pad'}
                    />

                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(16),
                        }}>
                        Any Health Issue (If you have not then No)
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={{
                              height: verticalScale(20),
                              width: verticalScale(20),
                              backgroundColor:
                                values.healthIssue === 'Yes'
                                  ? colors.orange
                                  : colors.white,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 2,
                              borderColor: colors.orange,
                              borderRadius: 3,
                            }}
                            onPress={() =>
                              setValues({...values, healthIssue: 'Yes'})
                            }>
                            {values.healthIssue === 'Yes' ? (
                              <Icon
                                name={'check'}
                                size={16}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Yes
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={{
                              height: verticalScale(20),
                              width: verticalScale(20),
                              backgroundColor:
                                values.healthIssue === 'Yes'
                                  ? colors.white
                                  : colors.orange,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 2,
                              borderColor: colors.orange,
                              borderRadius: 3,
                            }}
                            onPress={() =>
                              setValues({...values, healthIssue: 'No'})
                            }>
                            {values.healthIssue === 'No' ? (
                              <Icon
                                name={'check'}
                                size={15}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            No
                          </Text>
                        </View>
                      </View>
                    </View>
                    {values.healthIssue === 'Yes' ? (
                      <InputCard
                        title={'Health Description'}
                        placeholder={'Health Description'}
                        value={values.healthDescription}
                        name={'healthDescription'}
                        updateFields={text => setValues({...values, ...text})}
                      />
                    ) : null}

                    <View style={{gap: verticalScale(10)}}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: moderateScale(16),
                        }}>
                        Vehicle Number(If you have not then No)
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={{
                              height: verticalScale(20),
                              width: verticalScale(20),
                              backgroundColor:
                                values.vehicleNumber === 'Yes'
                                  ? colors.orange
                                  : colors.white,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 2,
                              borderColor: colors.orange,
                              borderRadius: 3,
                            }}
                            onPress={() =>
                              setValues({...values, vehicleNumber: 'Yes'})
                            }>
                            {values.vehicleNumber === 'Yes' ? (
                              <Icon
                                name={'check'}
                                size={15}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            Yes
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: horizontalScale(10),
                          }}>
                          <TouchableOpacity
                            style={{
                              height: verticalScale(20),
                              width: verticalScale(20),
                              backgroundColor:
                                values.vehicleNumber === 'Yes'
                                  ? colors.white
                                  : colors.orange,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 2,
                              borderColor: colors.orange,
                              borderRadius: 3,
                            }}
                            onPress={() =>
                              setValues({...values, vehicleNumber: 'No'})
                            }>
                            {values.vehicleNumber === 'No' ? (
                              <Icon
                                name={'check'}
                                size={16}
                                color={colors.white}
                              />
                            ) : null}
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              color: colors.grey,
                            }}>
                            No
                          </Text>
                        </View>
                      </View>
                    </View>
                    {values.vehicleNumber === 'Yes' ? (
                      <InputCard
                        title={'Vehicle Description'}
                        placeholder={'Vehicle Description'}
                        value={values.vehicleDescription}
                        name={'vehicleDescription'}
                        updateFields={text => setValues({...values, ...text})}
                      />
                    ) : null}
                  </View>

                  <Section_Header title={"Parent's/Guardian Details"} />
                  <View style={styles.section}>
                    <InputCard
                      title={'Father Name'}
                      placeholder={'Father Name'}
                      value={values.fatherName}
                      name={'fatherName'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.fatherName && touched.fatherName
                          ? errors.fatherName
                          : null
                      }
                    />
                    <InputCard
                      title={'Occupation'}
                      placeholder={'Father Occupation'}
                      value={values.fatherOccupation}
                      name={'fatherOccupation'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.fatherOccupation && touched.fatherOccupation
                          ? errors.fatherOccupation
                          : null
                      }
                    />
                    <InputCard
                      title={'Mother Name'}
                      placeholder={'Mother Name'}
                      value={values.motherName}
                      name={'motherName'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.motherName && touched.motherName
                          ? errors.motherName
                          : null
                      }
                    />
                    <InputCard
                      title={'Mother`s Occupation'}
                      placeholder={'Mother Occupation'}
                      value={values.motherOccupation}
                      name={'motherOccupation'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.motherOccupation && touched.motherOccupation
                          ? errors.motherOccupation
                          : null
                      }
                    />
                    <InputCard
                      title={'Father Mobile Number'}
                      placeholder={'Father Mobile Number'}
                      value={values.parentsPhone1}
                      maxLength={10}
                      name={'parentsPhone1'}
                      keyboardType={'numeric'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.parentsPhone1 && touched.parentsPhone1
                          ? errors.parentsPhone1
                          : null
                      }
                    />
                    <InputCard
                      title={'Mother Mobile Number'}
                      placeholder={'Mother Mobile Number'}
                      value={values.parentsPhone2}
                      maxLength={10}
                      keyboardType={'numeric'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      name={'parentsPhone2'}
                      error={
                        errors.parentsPhone2 && touched.parentsPhone2
                          ? errors.parentsPhone2
                          : null
                      }
                    />
                    <InputCard
                      title={'Parent Email'}
                      placeholder={'Parent Email'}
                      value={values.parentsEmail}
                      name={'parentsEmail'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      keyboardType="email-address" // Show email-specific keyboard
                      autoCapitalize="none"
                    />
                    <InputCard
                      title={'Full Address'}
                      placeholder={'House No, Street, Landmark,City'}
                      value={values.parentsAddress}
                      name={'parentsAddress'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.parentsAddress && touched.parentsAddress
                          ? errors.parentsAddress
                          : null
                      }
                    />

                    <InputCard
                      title={'Pincode No'}
                      placeholder={'Pincode No'}
                      value={values.pincode}
                      name={'pincode'}
                      maxLength={6}
                      keyboardType={'numeric'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      onPincodeComplete={text =>
                        handlePincodeValidation(text, 'pincode', setValues)
                      }
                      error={
                        errors.pincode && touched.pincode
                          ? errors.pincode
                          : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="Country"
                      placeholder="Country"
                      name={'parentAddressCountry'}
                      value={values.parentAddressCountry}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={Country}
                      onCountrySelect={text =>
                        handleCountryValidation(text, 'parentAddressCountry')
                      }
                      error={
                        errors.parentAddressCountry &&
                        touched.parentAddressCountry
                          ? errors.parentAddressCountry
                          : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="State"
                      placeholder="State"
                      name={'state'}
                      value={values.state}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={state}
                      onSateSelect={text =>
                        handleStateValidation(
                          values.parentAddressCountry,
                          text,
                          'state',
                        )
                      }
                      error={
                        errors.state && touched.state ? errors.state : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="District"
                      placeholder="District"
                      name={'parentAddressDistrict'}
                      value={values.parentAddressDistrict}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={district}
                      error={
                        errors.parentAddressDistrict &&
                        touched.parentAddressDistrict
                          ? errors.parentAddressDistrict
                          : null
                      }
                    />
                  </View>

                  <Section_Header title={'GUARDIAN DETAILS'} />
                  <View style={styles.section}>
                    <InputCard
                      title={'Guardian Name'}
                      placeholder={'Guardian Name'}
                      value={values.guardianName}
                      name={'guardianName'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.guardianName && touched.guardianName
                          ? errors.guardianName
                          : null
                      }
                    />
                    <InputCard
                      title={'Contact Number '}
                      placeholder={'Phone'}
                      value={values.guardianNumber}
                      name={'guardianNumber'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      keyboardType={'numeric'}
                      maxLength={10}
                      error={
                        errors.guardianNumber && touched.guardianNumber
                          ? errors.guardianNumber
                          : null
                      }
                    />
                    <InputCard
                      title={'Full Address'}
                      placeholder={'Guardian Full address'}
                      value={values.guardianAddress}
                      name={'guardianAddress'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.guardianAddress && touched.guardianAddress
                          ? errors.guardianAddress
                          : null
                      }
                    />

                    <InputCard
                      title={'Pincode'}
                      placeholder={'Guardian pincode'}
                      value={values.guardianAddressPincode}
                      name={'guardianAddressPincode'}
                      maxLength={6}
                      keyboardType={'numeric'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      onPincodeComplete={text =>
                        handlePincodeValidation(
                          text,
                          'guardianAddressPincode',
                          setValues,
                        )
                      }
                      error={
                        errors.guardianAddressPincode &&
                        touched.guardianAddressPincode
                          ? errors.guardianAddressPincode
                          : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="Country"
                      placeholder="Country"
                      name={'guardianAddressCountry'}
                      value={values.guardianAddressCountry}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={guardianCountry}
                      onCountrySelect={text =>
                        handleCountryValidation(text, 'guardianAddressCountry')
                      }
                      error={
                        errors.guardianAddressCountry &&
                        touched.guardianAddressCountry
                          ? errors.guardianAddressCountry
                          : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="State"
                      placeholder="State"
                      name={'guardianAddressState'}
                      value={values.guardianAddressState}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={guardianState}
                      onSateSelect={text =>
                        handleStateValidation(
                          values.guardianAddressCountry,
                          text,
                          'guardianAddressState',
                        )
                      }
                      error={
                        errors.guardianAddressState &&
                        touched.guardianAddressState
                          ? errors.guardianAddressState
                          : null
                      }
                    />

                    <AutoSuggestInputCard
                      title="District"
                      placeholder="District"
                      name={'guardianAddressDistrict'}
                      value={values.guardianAddressDistrict}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      suggestions={guardianDistrict}
                      error={
                        errors.guardianAddressDistrict &&
                        touched.guardianAddressDistrict
                          ? errors.guardianAddressDistrict
                          : null
                      }
                    />
                  </View>

                  <Section_Header title="Documents" />
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: horizontalScale(12),
                      paddingVertical: verticalScale(6),
                    }}>
                    <ImagePickerComponent
                      label="Candidate"
                      fieldName="candidateImg"
                      value={values.candidateImg ? values.candidateImg : null}
                      setFieldValue={(field, value) => {
                        setValues({...values, [field]: value});
                        handleImageUpload(field, {...values, [field]: value});
                      }}
                      error={
                        errors.candidateImg && touched.candidateImg
                          ? errors.candidateImg
                          : null
                      }
                      handleImageView={handleImageView}
                    />

                    <ImagePickerComponent
                      label="Aadhaar Front"
                      fieldName="aadhareFront"
                      value={values.aadhareFront ? values.aadhareFront : null}
                      setFieldValue={(field, value) => {
                        setValues({...values, [field]: value});
                        handleImageUpload(field, {...values, [field]: value});
                      }}
                      handleImageView={handleImageView}
                      error={
                        errors.aadhareFront && touched.aadhareFront
                          ? errors.aadhareFront
                          : null
                      }
                      disabled={!uploadImage.candidateImg}
                      width={400}
                      height={300}
                    />

                    <ImagePickerComponent
                      label="Aadhaar Back"
                      fieldName="aadhareBack"
                      value={values.aadhareBack ? values.aadhareBack : null}
                      setFieldValue={(field, value) => {
                        setValues({...values, [field]: value});
                        handleImageUpload(field, {...values, [field]: value});
                      }}
                      handleImageView={handleImageView}
                      error={
                        errors.aadhareBack && touched.aadhareBack
                          ? errors.aadhareBack
                          : null
                      }
                      disabled={!uploadImage.aadhareFront}
                      width={400}
                      height={300}
                    />

                    <ImagePickerComponent
                      label="Candidate Signature"
                      fieldName="candidateSignature"
                      value={
                        values.candidateSignature
                          ? values.candidateSignature
                          : null
                      }
                      setFieldValue={(field, value) => {
                        setValues({...values, [field]: value});
                        handleImageUpload(field, {...values, [field]: value});
                      }}
                      handleDeleteImage={() => {
                        setValues({...values, candidateSignature: null});
                        handleDeleteImage(
                          'candidateSignature',
                          uploadImage.candidateSign,
                        );
                      }}
                      width={400}
                      height={150}
                    />

                    <ImagePickerComponent
                      label="Parent Signature"
                      fieldName="parentSignature"
                      value={
                        values.parentSignature ? values.parentSignature : null
                      }
                      setFieldValue={(field, value) => {
                        setValues({...values, [field]: value});
                        handleImageUpload(field, {...values, [field]: value});
                      }}
                      handleDeleteImage={() => {
                        setValues({...values, parentSignature: null});
                        handleDeleteImage(
                          'parentSignature',
                          uploadImage.parentSign,
                        );
                      }}
                      width={400}
                      height={150}
                    />
                  </View>

                  <Section_Header title="Others" />
                  <View
                    style={[
                      styles.section,
                      {paddingHorizontal: horizontalScale(12)},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 45,
                        borderWidth: 0.5,
                        borderColor: colors.grey,
                        borderRadius: 5,
                        overflow: 'hidden',
                        paddingHorizontal: 10,
                      }}>
                      <View style={{marginRight: 20}}>
                        <Text style={{color: colors.black}}>
                          Have a referral code?
                        </Text>
                      </View>
                      <View>
                        <Pressable
                          style={[
                            styles.checkbox,
                            {
                              backgroundColor: checked
                                ? colors.orange
                                : colors.white,
                            },
                          ]}
                          onPress={() => {
                            setChecked(!checked);
                            setValues({...values, referCode: ''});
                          }}>
                          {checked && (
                            <MaterialCommunityIcons
                              name="check-bold"
                              size={15}
                              color={colors.white}
                            />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    {checked && (
                      <View
                        style={{
                          flexDirection: 'row',
                          height: verticalScale(50),
                          width: '100%',
                          borderWidth: 0.5,
                          borderColor: colors.grey,
                          height: 50,
                          borderRadius: 5,
                          overflow: 'hidden',
                        }}>
                        <View style={styles.timerRightStyle}>
                          <Text
                            style={[
                              styles.text,
                              {fontSize: moderateScale(14)},
                            ]}>
                            Referral Code
                          </Text>
                        </View>
                        <View style={styles.timerLeftStyle}>
                          <TextInput
                            value={values.referCode}
                            onChangeText={handleChange('referCode')}
                            placeholder="Enter Referral Code"
                            placeholderTextColor={colors.grey}
                            style={styles.text}
                          />
                        </View>
                        <TouchableOpacity
                          disabled={!values.referCode}
                          onPress={() =>
                            handleReferralVerify(
                              values.referCode,
                              values.candidatePhone,
                            )
                          }
                          style={[
                            styles.cornerStyle,
                            {
                              backgroundColor: isReferVerified
                                ? colors.green
                                : colors.AppDefaultColor,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              {
                                fontSize: moderateScale(14),
                                color: colors.white,
                              },
                            ]}>
                            {isReferVerified ? 'Verified' : 'Verify'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <InputCard
                      title={'Admin notes'}
                      placeholder={'Admin notes'}
                      value={values.remark}
                      name={'remark'}
                      updateFields={text => {
                        setValues({...values, ...text});
                      }}
                      error={
                        errors.remark && touched.remark ? errors.remark : null
                      }
                    />
                  </View>

                  <Section_Header title={'DISCLAIMER'} />
                  <View style={styles.section}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        gap: horizontalScale(10),
                      }}>
                      <Pressable
                        onPress={() => {
                          setIsDeclare(!isDeclare);
                        }}
                        style={{
                          marginTop: verticalScale(4),
                          height: verticalScale(25),
                          width: verticalScale(25),
                          borderRadius: 4,
                          backgroundColor: isDeclare
                            ? `${colors.orange}`
                            : colors.white,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 3,
                          borderColor: colors.orange,
                        }}>
                        {isDeclare === true ? (
                          <Icon name={'check'} size={16} color={colors.white} />
                        ) : null}
                      </Pressable>
                      <Text
                        style={[
                          styles.text,
                          {fontSize: moderateScale(12), width: '90%'},
                        ]}>
                        I DECLARE THAT THE INFORMATION GIVEN ABOVE IS TRUE TO
                        THE BEST OF MY KNOWLEDGE. I AGREE THAT IF ANY
                        INFORMATION FURNISHED ABOVE FOUND INCORRECT MY ADMISSION
                        IS LIABLE TO BE CANCELLED.
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.section,
                      {flexDirection: 'row', justifyContent: 'center'},
                    ]}>
                    <SubmitButton title={'Share'} handlePress={toggleModal} />
                    <SubmitButton
                      title={'Submit'}
                      handlePress={handleSubmit}
                      backgroundColor={colors.orange}
                      disabled={!isDeclare}
                    />
                  </View>
                </>
              )}
            />
          )}
        </Formik>
        <Share_Modal isVisible={isModalVisible} onClose={toggleModal} />
        <Verified_Details_Modal
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPoints}
          data={referVerifiedData}
        />
      </View>
      <ViewImage_Modal
        isVisible={imageModal}
        onClose={() => setImageModal(false)}
        imageURL={imageUri}
      />
    </BottomSheetModalProvider>
  );
});

export default Add_Registration_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop:verticalScale(60),
    paddingBottom:verticalScale(80),
  },
  section: {
    padding: horizontalScale(12),
    gap: verticalScale(6),
  },
  sectionHeader: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.darkgrey,
  },
  submitButton: {
    height: verticalScale(50),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.AppDefaultColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(5),
    width: '48%',
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  },
  checkBox: {
    height: verticalScale(20),
    width: verticalScale(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.orange,
    borderWidth: 2,
    borderRadius: 3,
  },
  timerRightStyle: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: horizontalScale(10),
    backgroundColor: colors.lightygrey,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  timerLeftStyle: {
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: horizontalScale(10),
    backgroundColor: colors.white,
    flexDirection: 'row',
  },
  reviewButton: {
    borderWidth: 1,
    borderColor: colors.AppDefaultColor,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(6),
    justifyContent: 'center',
    alignItems: 'center',
    width: horizontalScale(120),
  },
  cornerStyle: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: moderateScale(12),
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: colors.orange,
  },
});
