import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  RefreshControl,
  FlatList,
  Alert,
  LayoutAnimation,
} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Pdf from 'react-native-pdf';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import {fontSize} from '../../../Utils/Size';
import InputCard from '../../../Components/cards/InputCard';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import {PickImage} from '../../../Hooks/useImagePicker';
import Loader from '../../../Utils/Loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewImage_Modal from '../../Components/Modals/ViewImage_Modal';
import {
  referVerifyThunkAPi,
  tenantSeltRegistrationThunkApi,
  getPincodeThunkApi,
  getStateDataThunkApi,
  getDistrictDataThunkApi,
} from '../../../Service/slices/tenant/tenantReferVerifySlice';
import {
  createImageUploadThunkApi,
  deleteImageThunkApi,
} from '../../../Service/slices/RegisterSlice';
import AutoSuggestInputCard from '../../../Components/cards/AutoSuggestInputCard';
import {tenantTermsAndConditionspdfThunkAPI} from '../../../Service/api/thunks';
import {setTenantToken} from '../../../Service/slices/tenant/clientAuthSlice';

const Tenant_Details = ({navigation, route}) => {
  const {clientSessionData} = useSelector(state => state.root?.clientAuth);
  const {token} = useSelector(
    state => state.root?.clientAuth.clientSessionData,
  );

  const {referVerifyData, tenantRegisterResponse} = useSelector(
    state => state.tenantReferVerify,
  );
  const referStatus = referVerifyData.data;

  const [checked, setChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {id, mobileNumber} = route?.params;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [isBirthDatePickerVisible, setBirthDatePickerVisibility] =
    useState(false);

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = selectedDate => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const currentdate = new Date();
  const year = currentdate.getFullYear();
  const month = String(currentdate.getMonth() + 1).padStart(2, '0');
  const day = String(currentdate.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  const validationSchema = Yup.object().shape({
    regdate: Yup.string().required('Registration Date is required'),
    candidatename: Yup.string()
      .required('Candidate name is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Candidate name can only contain letters and spaces',
      ),

    dob: Yup.string()
      .required('Date Of Birth is required')
      .matches(
        /^\d{4}-\d{2}-\d{2}$/,
        'Date Of Birth must be in YYYY-MM-DD format',
      ),

    aadhar: Yup.string().required('ID is required'),

    phone: Yup.string()
      .required('Phone Number is required')
      .matches(/^[0-9]{10}$/, 'Phone Number must be 10 digits'),

    email: Yup.string().email('Invalid email').required('Email is required'),

    blood: Yup.string()
      .required('Blood Group is required')
      .matches(/^(A|B|AB|O)[+-]$/, 'Invalid Blood Group format'),

    stydrt: Yup.string().required('Stay Duration is required'),

    father_name: Yup.string()
      .required('Father Name is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Father Name can only contain letters and spaces',
      ),

    father_occ: Yup.string()
      .required('Father Occupation is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Father Occupation can only contain letters and spaces',
      ),

    mother_name: Yup.string()
      .required('Mother Name is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Mother Name can only contain letters and spaces',
      ),

    mother_occ: Yup.string()
      .required('Mother Occupation is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Mother Occupation can only contain letters and spaces',
      ),

    father_mobile: Yup.string()
      .required('Father Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number must be 10 digits'),

    mother_mobile: Yup.string()
      .required('Mother Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number must be 10 digits'),

    parent_email: Yup.string().email('Invalid Parent email format').nullable(),

    parent_address: Yup.string().required('Parent Address is required'),

    parent_pinno: Yup.number()
      .required('Pin Code is required')
      .typeError('Pin Code must be a number')
      .test(
        'len',
        'Pin Code must be exactly 6 digits',
        val => val && val.toString().length === 6,
      ),

    parent_district: Yup.string().required('Parent District is required'),

    parent_state: Yup.string().required('Parent State is required'),

    parent_country: Yup.string().required('Parent Country is required'),

    guardian_name: Yup.string()
      .required('Guardian Name is required')
      .matches(
        /^[a-zA-Z\s]+$/,
        'Guardian Name can only contain letters and spaces',
      ),

    guardian_number: Yup.string()
      .required('Guardian Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number must be 10 digits'),

    guardian_address: Yup.string().required('Guardian Address is required'),

    guardian_pinno: Yup.number()
      .required('Guardian Pin Code is required')
      .typeError('Pin Code must be a number')
      .test(
        'len',
        'Pin Code must be exactly 6 digits',
        val => val && val.toString().length === 6,
      ),

    guardian_district: Yup.string().required('Guardian District is required'),

    guardian_state: Yup.string().required('Guardian State is required'),

    guardian_country: Yup.string().required('Guardian Country is required'),

    candidate_image: Yup.string().required('Candidate Image is required'),

    aadhare_front: Yup.string().required('Aadhaar Front Image is required'),

    aadhare_back: Yup.string().required('Aadhaar Back Image is required'),

    candidate_sign: Yup.string().required('Student Sign Image is required'),

    parent_sign: Yup.string().required('Parent Signature Inage is required'),

    refer_code: Yup.string().notRequired(),

    checkbox: Yup.boolean()
      .required('Checkbox is required')
      .oneOf([true], 'You must accept the terms and conditions'),

    termConditions: Yup.boolean()
      .required('You must accept the terms and conditions')
      .oneOf([true], 'You must accept the terms and conditions'),
  });

  const INITIAL_DATA = {
    regdate: currentDate,
    candidatename: '',
    dob: '',
    aadhar: '',
    phone: mobileNumber,
    email: '',
    blood: '',
    coursename: 'coursetype',
    coursedetails: '',
    jobdetails: '',
    institute: 'institute Name',
    institutename: '',
    companyname: '',
    stydrt: '',
    healthissue: 'No',
    health_description: '',
    vehicalno: 'No',
    vehicledescription: '',

    father_name: '',
    father_occ: '',
    mother_name: '',
    mother_occ: '',
    father_mobile: '',
    mother_mobile: '',
    parent_email: '',
    parent_address: '',
    parent_pinno: '',
    parent_district: '',
    parent_state: '',
    parent_country: '',

    guardian_name: '',
    guardian_number: '',
    guardian_address: '',
    guardian_pinno: '',
    guardian_district: '',
    guardian_state: '',
    guardian_country: '',

    candidate_image: '',
    aadhare_front: '',
    aadhare_back: '',
    candidate_sign: '',
    parent_sign: '',

    refer_code: '',
    checkbox: true,
    termConditions: false,
  };

  const imageInitialData = {
    candidate_image: '',
    aadhare_front: '',
    aadhare_back: '',
    candidate_sign: '',
    parent_sign: '',
  };

  const [uploadImage, setUploadImage] = useState(imageInitialData);

  const onRefresh = useCallback(resetForm => {}, []);

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
        if (fieldName === 'parent_pinno') {
          setValues(prevValues => ({
            ...prevValues,
            parent_district: district,
            parent_state: state,
            parent_country: country,
          }));
        } else if (fieldName === 'guardian_pinno') {
          setValues(prevValues => ({
            ...prevValues,
            guardian_district: district,
            guardian_state: state,
            guardian_country: country,
          }));
        }
      } else if (
        response.payload.status === true &&
        response.payload.statusCode === 404
      ) {
        const countryFallback = response.payload.data.uniqueCountries;
        if (fieldName === 'parent_pinno') {
          setCountryName(countryFallback);
        } else if ((fieldName = 'guardian_pinno')) {
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
        if (fieldName === 'parent_country') {
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
        if (fieldName === 'parent_state') {
          setDistrict(districtList);
        } else {
          setGuardianDistrict(districtList);
        }
      }
    } catch (error) {}
  };

  const handleImageUpload = async (fieldName, data, values) => {
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

        if (!deleteResponse) {
          return;
        }
      }

      if (data) {
        formData.append('image', {
          uri: data,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
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
        } else {
        }
      } else {
      }
    } catch (error) {
      if (error.message === 'Network Error' || error.response?.status === 0) {
      } else {
      }
    } finally {
      if (fieldName !== 'parent_sign') {
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

  const handleReferralVerify = async code => {
    try {
      const response = await dispatch(
        referVerifyThunkAPi({data: code, number: mobileNumber, token}),
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

  const [error, setErrors] = useState({});
  const newErrors = {};

  const handleSubmit = async values => {
    const formData = {
      regdate: values.regdate,
      candidatename: values.candidatename,
      dob: values.dob,
      aadhar: values.aadhar,
      phone: values.phone,
      email: values.email,
      blood: values.blood,
      coursename: values.coursename,
      coursedetails: values.coursedetails || '',
      jobdetails: values.jobdetails || '',
      institute: values.institute,
      institutename: values.institutename || '',
      companyname: values.companyname || '',
      stydrt: values.stydrt,
      healthissue: values.healthissue,
      health_description: values.health_description || '',
      vehicalno: values.vehicalno,
      vehicledescription: values.vehicledescription || '',

      // Parent details
      fathername: values.father_name,
      fatheroocc: values.father_occ,
      mothername: values.mother_name,
      motheroocc: values.mother_occ,
      tel: values.father_mobile,
      mobilenumber: values.mother_mobile || '',
      pemail: values.parent_email || '',
      fullAddress: values.parent_address,
      pinno: values.parent_pinno,
      district: values.parent_district,
      state: values.parent_state,
      country: values.parent_country,

      // Guardian details
      guardianname: values.guardian_name,
      guardiannumber: values.guardian_number,
      guardianaddress: values.guardian_address,
      gurdianPincode: values.guardian_pinno,
      gurdianDistrict: values.guardian_district,
      gurdianState: values.guardian_state,
      gurdianCountry: values.guardian_country,

      // Candidate-related files
      uploadimage: uploadImage['candidate_image'],
      uploadaadharfront: uploadImage['aadhare_front'],
      uploadaadharback: uploadImage['aadhare_back'],

      // Conditional fields (signatures)
      candidatesign: uploadImage['candidate_sign'] || '',
      Parentsign: uploadImage['parent_sign'] || '',

      // Other fields
      checkbox: values.checkbox,
      termConditions: values.termConditions ? 1 : 0,
    };

    if (values.healthissue === 'Yes' && values.health_description === '') {
      newErrors.health_description = 'Health description is required.';
    }

    if (values.vehicalno === 'Yes' && values.vehicledescription === '') {
      newErrors.vehicledescription = 'Vehicle description is required.';
    }

    if (values.coursename === 'coursetype' && values.coursedetails === '') {
      newErrors.coursedetails = 'Course details are required.';
    }

    if (values.coursename === 'jobtype' && values.jobdetails === '') {
      newErrors.jobdetails = 'Job details are required.';
    }

    if (values.institute === 'institute Name' && values.institutename === '') {
      newErrors.institutename = 'Institute details are required.';
    }

    if (values.institute !== 'institute Name' && values.companyname === '') {
      newErrors.companyname = 'Company details are required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return; // Stop execution here if errors exist
    }

    if (referStatus === true && values.refer_code) {
      formData.referCode = values.refer_code;
    }

    // Check if "checked" is true and "refer_code" is provided
    if (checked === true && !values.refer_code) {
      Alert.alert('Refer code is required if checked');
      return;
    }

    try {
      setLoading(true);
      const response = await dispatch(
        tenantSeltRegistrationThunkApi({data: formData, token, id}),
      );

      if (response.payload.status === true) {
        Alert.alert(
          `Successful: `,
          `Your registration request has been sent successfully. Please wait until the request is accepted.`,
        );
        const data = {
          token: clientSessionData.token,
          studentID: null,
          userType: clientSessionData.userType,
          id: clientSessionData.id,
          hostelStatus: 3,
          mobileNumber: clientSessionData.mobileNumber,
        };
        dispatch(setTenantToken(data));
        navigation.replace('TenantBottomNavigation');
      } else {
        Alert.alert(`Failed: `, `${response.payload.message}`);
      }
    } catch (error) {
      Alert.alert('Failed: Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const flatListRef = useRef(null); // Create a reference for the FlatList
  const secondInputRef = useRef(null);
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0}); // Scroll to the top
    }
  };

  const [accepted, setAccepted] = useState(false);
  const [referCode, setReferCode] = useState('');

  const RenderUploadButton = ({
    setImageUrl,
    imageUrl,
    setSelectedImage,
    height,
    width,
    disabled,
  }) => {
    const handleImageSet = imageUrl => {
      // setSelectedImage(imageUrl);
    };
    return (
      <TouchableOpacity
        disabled={disabled}
        style={styles.uploadButton}
        onPress={() => PickImage(setImageUrl, width, height)}>
        <View
          style={{
            backgroundColor: colors.darkgray,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            borderRightWidth: 0.5,
            borderRightColor: 'gray',
            position: 'relative',
          }}>
          <Text style={{color: 'black'}}>Choose File</Text>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
            flex: 1,
          }}>
          <Text style={styles.uploadButtonText}>{'Select Image'}</Text>
          <Pressable
            style={{
              width: 40,
              height: '100%',
              position: 'absolute',
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleImageSet}>
            <MaterialCommunityIcons
              size={20}
              name={imageUrl ? 'file-image' : 'cloud-upload-outline'}
              color={imageUrl ? colors.green : colors.black}
            />
          </Pressable>
        </View>
      </TouchableOpacity>
    );
  };

  const {tenantTermsAndConditionspdfResponse} = useSelector(
    state => state?.root?.clientProfileData,
  );

  const [isBondExpanded, setIsBondExpanded] = useState(false);
  const handleLoaBond = async () => {
    if (isBondExpanded) {
      // LayoutAnimation.easeInEaseOut();
      setIsBondExpanded(prev => !prev);
    } else {
      try {
        const res = await dispatch(tenantTermsAndConditionspdfThunkAPI());
        if (res?.payload?.status === true) {
          // LayoutAnimation.easeInEaseOut();
          setIsBondExpanded(prev => !prev);
        } else {
          alertMessage('Something went wrong');
        }
      } catch (error) {
        alertMessage('Something went wrong');
      }
    }
  };

  const downloadFile = (url, title) => {
    setLoading(true); // Start loading

    const source = url;

    const date = moment().format('DD-MM-YYYY'); // Get the current date
    const pdfName = title.split(' ').join('_'); // Format the title for the file name
    const fileName = `${pdfName}_${date}.pdf`; // Add file extension in fileName
    const {config, fs} = RNFetchBlob;
    const downloadDir = fs.dirs.DownloadDir;
    const filePath = `${downloadDir}/${fileName}`; // Ensure file extension is added

    config({
      fileCache: true,
      appendExt: 'pdf',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        title: fileName,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
        mediaScannable: true, // Make the file available to the media scanner
      },
    })
      .fetch('GET', source)
      .then(res => {
        // Additional success handling, if needed
      })
      .catch(err => {
        // Error handling
      })
      .finally(() => {
        setLoading(false); // Ensure loading state is reset
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      {loading ? <Loader isLoading={loading} /> : null}
      <Formik
        initialValues={INITIAL_DATA}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setValues,
          touched,
          errors,
          resetForm,
        }) => (
          <FlatList
            ref={flatListRef} // Attach the reference here
            data={[1]}
            keyExtractor={item => item.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => onRefresh(resetForm)}
              />
            }
            renderItem={() => (
              <>
                <View style={styles.card}>
                  <View
                    style={{
                      backgroundColor: colors.darkgrey,
                      width: '100%',
                      alignSelf: 'center',
                      height: 40,
                      borderRadius: 5,
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.textstyle,
                        {color: colors.white, textAlign: 'center'},
                      ]}>
                      REGISTRATION FORM
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontWeight: '500',
                        }}>
                        {formatDate(date)}
                      </Text>
                      <TouchableOpacity
                        style={{marginLeft: 15}}
                        onPress={showDatePicker}>
                        <Icon
                          name={'calendar'}
                          color={colors.black}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                      date={date}
                    />
                  </View>
                </View>

                {/* PERSONAL DETAILS  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={styles.textstyle}>PERSONAL DETAILS</Text>
                  </View>

                  {/* personal Details */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Candidate name <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.candidatename}
                        placeholder="Full Name"
                        placeholderTextColor="grey"
                        onChangeText={handleChange('candidatename')}
                        onBlur={handleBlur('candidatename')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.candidatename && touched.candidatename ? (
                      <Text style={styles.error}>{errors.candidatename}</Text>
                    ) : null}
                  </View>

                  <View style={{gap: verticalScale(3)}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(14),
                      }}>
                      Birth Date (dd/mm/yyyy){' '}
                      <Text style={styles.astric}>*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setBirthDatePickerVisibility(true)}
                      style={[
                        {
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
                        },
                      ]}>
                      <Text
                        style={[
                          styles.buttonText,
                          {
                            color: colors.grey,
                          },
                        ]}>
                        {values.dob ? values.dob : 'dd/mm/yyyy'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    {touched.dob && errors.dob && (
                      <Text style={styles.error}>{errors.dob} </Text>
                    )}

                    <DateTimePickerModal
                      isVisible={isBirthDatePickerVisible}
                      mode="date"
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, dob: formatDate});
                        setBirthDatePickerVisibility(false);
                      }}
                      onCancel={() => setBirthDatePickerVisibility(false)}
                    />
                  </View>

                  {/* aadhar  */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Aadhar/VT/DI/id Proof <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.aadhar}
                        placeholder="0000 0000 0000"
                        placeholderTextColor="grey"
                        onChangeText={handleChange('aadhar')}
                        onBlur={handleBlur('aadhar')}
                        keyboardType="numeric"
                        maxLength={12}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.aadhar && touched.aadhar ? (
                      <Text style={styles.error}>{errors.aadhar}</Text>
                    ) : null}
                  </View>

                  {/* phone */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Mobile Number <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.phone}
                        editable={false}
                        placeholder="Mobile Number"
                        placeholderTextColor="grey"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        keyboardType="numeric"
                        maxLength={10}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.phone && touched.phone ? (
                      <Text style={styles.error}>{errors.phone}</Text>
                    ) : null}
                  </View>

                  {/* email */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Email <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.email}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.email && touched.email ? (
                      <Text style={styles.error}>{errors.email}</Text>
                    ) : null}
                  </View>

                  {/* blood Group */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Blood Group <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={[styles.bax, {paddingHorizontal: 0}]}>
                      <Picker
                        selectedValue={values.blood}
                        dropdownIconColor={colors.grey}
                        style={{
                          color: colors.grey,
                          fontSize: moderateScale(10),
                          marginTop: verticalScale(-5),
                        }}
                        onValueChange={(itemValue, itemIndex) => {
                          setValues({...values, blood: itemValue});
                        }}>
                        <Picker.Item
                          label="--Select blood group--"
                          value={null}
                        />
                        <Picker.Item label="A+" value="A+" />
                        <Picker.Item label="A-" value="A-" />
                        <Picker.Item label="B+" value="B+" />
                        <Picker.Item label="B-" value="B-" />
                        <Picker.Item label="AB+" value="AB+" />
                        <Picker.Item label="AB-" value="AB-" />
                        <Picker.Item label="O-" value="O-" />
                        <Picker.Item label="O+" value="O+" />
                      </Picker>
                    </View>
                    {errors.blood && touched.blood ? (
                      <Text style={styles.error}>{errors.blood}</Text>
                    ) : null}
                  </View>

                  {/* course job Details */}
                  <View style={{gap: verticalScale(10)}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(16),
                      }}>
                      Course/Job Type <Text style={styles.astric}>*</Text>
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
                          style={[styles.checkBox, {}]}
                          onPress={() =>
                            setValues({...values, coursename: 'coursetype'})
                          }>
                          {values.coursename === 'coursetype' ? (
                            <View style={styles.radioCirlce}></View>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({...values, coursename: 'jobtype'})
                          }>
                          {values.coursename === 'jobtype' ? (
                            <View style={styles.radioCirlce}></View>
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
                  {errors.coursename && touched.coursename ? (
                    <Text style={styles.error}>{errors.coursename}</Text>
                  ) : null}

                  {values.coursename === 'coursetype' ? (
                    <View style={styles.inputcard}>
                      <View style={styles.bax}>
                        <TextInput
                          name={'coursedetails'}
                          value={values.coursedetails}
                          placeholder="Course Name"
                          placeholderTextColor={colors.grey}
                          onChangeText={text => {
                            setValues({...values, coursedetails: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {error.coursedetails && (
                        <Text style={styles.error}>{error.coursedetails}</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.inputcard}>
                      <View style={styles.bax}>
                        <TextInput
                          name={'jobdetails'}
                          value={values.jobdetails}
                          placeholder="Job Details"
                          placeholderTextColor={colors.grey}
                          onChangeText={text => {
                            setValues({...values, jobdetails: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {error.jobdetails && (
                        <Text style={styles.error}>{error.jobdetails}</Text>
                      )}
                    </View>
                  )}

                  {/* institute and companyName */}
                  <View style={{gap: verticalScale(10)}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(16),
                      }}>
                      Institute/Company Name{' '}
                      <Text style={styles.astric}>*</Text>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({
                              ...values,
                              institute: 'institute Name',
                            })
                          }>
                          {values.institute === 'institute Name' ? (
                            <View style={styles.radioCirlce}></View>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({
                              ...values,
                              institute: 'Company Name',
                            })
                          }>
                          {values.institute === 'Company Name' ? (
                            <View style={styles.radioCirlce}></View>
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
                  {errors.institute && touched.institute ? (
                    <Text style={styles.error}>{errors.institute}</Text>
                  ) : null}
                  {values.institute !== 'Company Name' ? (
                    <View style={styles.inputcard}>
                      <View style={styles.bax}>
                        <TextInput
                          name={'institutename'}
                          value={values.institutename}
                          placeholder="Institute Name"
                          placeholderTextColor={colors.grey}
                          onChangeText={text => {
                            setValues({...values, institutename: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {error.institutename && (
                        <Text style={styles.error}>{error.institutename}</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.inputcard}>
                      <View style={styles.bax}>
                        <TextInput
                          name={'companyname'}
                          value={values.companyname}
                          placeholder="Company Name"
                          placeholderTextColor={colors.grey}
                          onChangeText={text => {
                            setValues({...values, companyname: text});
                          }}
                          returnKeyType="next"
                          style={styles.inputStyle}
                        />
                      </View>
                      {error.companyname && (
                        <Text style={styles.error}>{error.companyname}</Text>
                      )}
                    </View>
                  )}

                  {/* stay Duration */}
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Lock-In Period(Month) <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'stydrt'}
                        value={values.stydrt}
                        placeholder="Stay Duration"
                        placeholderTextColor={colors.grey}
                        onChangeText={text => {
                          setValues({...values, stydrt: text});
                        }}
                        returnKeyType="next"
                        style={styles.inputStyle}
                        keyboardType='number-pad'
                      />
                    </View>
                    {errors.stydrt && touched.stydrt ? (
                      <Text style={styles.error}>{errors.stydrt}</Text>
                    ) : null}
                  </View>

                  {/* Health issue  */}
                  <View style={{gap: verticalScale(10)}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: 'Roboto-Regular',
                      }}>
                      Any Health Issue (If you have not then No){' '}
                      <Text style={styles.astric}>*</Text>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({...values, healthissue: 'Yes'})
                          }>
                          {values.healthissue === 'Yes' ? (
                            <View style={styles.radioCirlce}></View>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({...values, healthissue: 'No'})
                          }>
                          {values.healthissue === 'No' ? (
                            <View style={styles.radioCirlce}></View>
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
                    {errors.healthissue && touched.healthissue ? (
                      <Text style={styles.error}>{errors.healthissue}</Text>
                    ) : null}
                  </View>
                  {values.healthissue === 'Yes' ? (
                    <InputCard
                      title={'Health Description'}
                      placeholder={'Health Description'}
                      value={values.health_description}
                      name={'health_description'}
                      updateFields={text => setValues({...values, ...text})}
                    />
                  ) : null}
                  {error.healthissue && (
                    <Text style={styles.error}>{error.healthissue}</Text>
                  )}

                  {/* vehicle number  */}
                  <View style={{gap: verticalScale(10)}}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: moderateScale(14),
                      }}>
                      Vehicle Number(If you have not then No){' '}
                      <Text style={styles.astric}>*</Text>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({...values, vehicalno: 'Yes'})
                          }>
                          {values.vehicalno === 'Yes' ? (
                            <View style={styles.radioCirlce}></View>
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
                          style={styles.checkBox}
                          onPress={() =>
                            setValues({...values, vehicalno: 'No'})
                          }>
                          {values.vehicalno === 'No' ? (
                            <View style={styles.radioCirlce}></View>
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
                    {errors.vehicalno && touched.vehicalno ? (
                      <Text style={styles.error}>{errors.vehicalno}</Text>
                    ) : null}
                  </View>
                  {values.vehicalno === 'Yes' ? (
                    <InputCard
                      title={'Vehicle Description'}
                      placeholder={'Vehicle Description'}
                      value={values.vehicledescription}
                      name={'vehicledescription'}
                      updateFields={text => setValues({...values, ...text})}
                    />
                  ) : null}
                  {error.vehicalno && (
                    <Text style={styles.error}>{error.vehicalno}</Text>
                  )}
                </View>

                {/* PARENT DETAILS  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={styles.textstyle}>
                      PARENT'S/GUARDIAN DETAIL
                    </Text>
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Father Name <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.father_name}
                        placeholder="Father Name "
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('father_name')}
                        onBlur={handleBlur('father_name')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                        onSubmitEditing={() => secondInputRef.current.focus()}
                      />
                    </View>
                    {errors.father_name && touched.father_name ? (
                      <Text style={styles.error}>{errors.father_name}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Occupation <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        ref={secondInputRef}
                        value={values.father_occ}
                        placeholder="Father Occupation "
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('father_occ')}
                        onBlur={handleBlur('father_occ')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.father_occ && touched.father_occ ? (
                      <Text style={styles.error}>{errors.father_occ}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Mother Name <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.mother_name}
                        placeholder="Mother Name "
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('mother_name')}
                        onBlur={handleBlur('mother_name')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.mother_name && touched.mother_name ? (
                      <Text style={styles.error}>{errors.mother_name}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Mother's Occupation <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.mother_occ}
                        placeholder="Mother Occupation "
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('mother_occ')}
                        onBlur={handleBlur('mother_occ')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.mother_occ && touched.mother_occ ? (
                      <Text style={styles.error}>{errors.mother_occ}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Father's Mobile Number{' '}
                      <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.father_mobile}
                        placeholder="Mobile Number"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('father_mobile')}
                        onBlur={handleBlur('father_mobile')}
                        maxLength={10}
                        keyboardType="numeric"
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.father_mobile && touched.father_mobile ? (
                      <Text style={styles.error}>{errors.father_mobile}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Mother's Mobile Number{' '}
                      <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.mother_mobile}
                        placeholder="Mobile Number"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('mother_mobile')}
                        onBlur={handleBlur('mother_mobile')}
                        maxLength={10}
                        keyboardType="numeric"
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.mother_mobile && touched.mother_mobile ? (
                      <Text style={styles.error}>{errors.mother_mobile}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>Parent Email </Text>
                    <View style={styles.bax}>
                      <TextInput
                        value={values.parent_email}
                        placeholder="Parent Email"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('parent_email')}
                        onBlur={handleBlur('parent_email')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_email && touched.parent_email ? (
                      <Text style={styles.error}>{errors.parent_email}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Full Address <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'parent_address'}
                        value={values.parent_address}
                        placeholder="House No, Street, Landmark, City"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('parent_address')}
                        onBlur={handleBlur('parent_address')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_address && touched.parent_address ? (
                      <Text style={styles.error}>{errors.parent_address}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Pin Code <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'parent_pinno'}
                        value={values.parent_pinno}
                        placeholder="Pincode No"
                        placeholderTextColor={colors.grey}
                        onChangeText={text => {
                          handleChange('parent_pinno')(text); // Update Formik value
                          if (text.length === 6) {
                            handlePincodeValidation(
                              text,
                              'parent_pinno',
                              setValues,
                            ); // Pass setValues here
                          }
                        }}
                        onBlur={handleBlur('parent_pinno')}
                        returnKeyType="next"
                        maxLength={6}
                        keyboardType="numeric"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_pinno && touched.parent_pinno ? (
                      <Text style={styles.error}>{errors.parent_pinno}</Text>
                    ) : null}
                  </View>

                  <AutoSuggestInputCard
                    title="Country"
                    placeholder="Country"
                    name={'parent_country'}
                    value={values.parent_country}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={Country}
                    onCountrySelect={text =>
                      handleCountryValidation(text, 'parent_country')
                    }
                    error={
                      errors.parent_country && touched.parent_country
                        ? errors.parent_country
                        : null
                    }
                  />

                  <AutoSuggestInputCard
                    title="State"
                    placeholder="State"
                    name={'parent_state'}
                    value={values.parent_state}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={state}
                    onSateSelect={text =>
                      handleStateValidation(
                        values.parent_country,
                        text,
                        'parent_state',
                      )
                    }
                    error={
                      errors.parent_state && touched.parent_state
                        ? errors.parent_state
                        : null
                    }
                  />

                  <AutoSuggestInputCard
                    title="District"
                    placeholder="District"
                    name={'parent_district'}
                    value={values.parent_district}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={district}
                    error={
                      errors.parent_district && touched.parent_district
                        ? errors.parent_district
                        : null
                    }
                  />

                  {/* <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Country <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'parent_country'}
                        value={values.parent_country}
                        placeholder="Country"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('parent_country')}
                        onBlur={handleBlur('parent_country')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_country && touched.parent_country ? (
                      <Text style={styles.error}>{errors.parent_country}</Text>
                    ) : null}
                  </View>

           
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      State <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'parent_state'}
                        value={values.parent_state}
                        placeholder="State"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('parent_state')}
                        onBlur={handleBlur('parent_state')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_state && touched.parent_state ? (
                      <Text style={styles.error}>{errors.parent_state}</Text>
                    ) : null}
                  </View>


          
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      District <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'parent_district'}
                        value={values.parent_district}
                        placeholder="District Name"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('parent_district')}
                        onBlur={handleBlur('parent_district')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.parent_district && touched.parent_district ? (
                      <Text style={styles.error}>{errors.parent_district}</Text>
                    ) : null}
                  </View> */}
                </View>

                {/* GUARDIAN DETAILS  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={[styles.textstyle]}>GUARDIAN DETIALS</Text>
                  </View>

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Guardian Name <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_name'}
                        value={values.guardian_name}
                        placeholder="Guardian Name"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_name')}
                        onBlur={handleBlur('guardian_name')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_name && touched.guardian_name ? (
                      <Text style={styles.error}>{errors.guardian_name}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Guardian Number <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_number'}
                        value={values.guardian_number}
                        placeholder="Guardian Number"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_number')}
                        onBlur={handleBlur('guardian_number')}
                        returnKeyType="next"
                        keyboardType="numeric"
                        maxLength={10}
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_number && touched.guardian_number ? (
                      <Text style={styles.error}>{errors.guardian_number}</Text>
                    ) : null}
                  </View>
                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Full Address <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_address'}
                        value={values.guardian_address}
                        placeholder="House No,Street,Landmark,City,State,Pincode"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_address')}
                        onBlur={handleBlur('guardian_address')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_address && touched.guardian_address ? (
                      <Text style={styles.error}>
                        {errors.guardian_address}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Pin Code <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_pinno'}
                        value={values.guardian_pinno}
                        placeholder="Pincode No"
                        placeholderTextColor={colors.grey}
                        onChangeText={text => {
                          handleChange('guardian_pinno')(text); // Update Formik value
                          if (text.length === 6) {
                            handlePincodeValidation(
                              text,
                              'guardian_pinno',
                              setValues,
                            ); // Pass setValues here
                          }
                        }}
                        onBlur={handleBlur('guardian_pinno')}
                        returnKeyType="next"
                        maxLength={6}
                        keyboardType="numeric"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_pinno && touched.guardian_pinno ? (
                      <Text style={styles.error}>{errors.guardian_pinno}</Text>
                    ) : null}
                  </View>

                  <AutoSuggestInputCard
                    title="Country"
                    placeholder="Country"
                    name={'guardian_country'}
                    value={values.guardian_country}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={guardianCountry}
                    onCountrySelect={text =>
                      handleCountryValidation(text, 'guardian_country')
                    }
                    error={
                      errors.guardian_country && touched.guardian_country
                        ? errors.guardian_country
                        : null
                    }
                  />

                  <AutoSuggestInputCard
                    title="State"
                    placeholder="State"
                    name={'guardian_state'}
                    value={values.guardian_state}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={guardianState}
                    onSateSelect={text =>
                      handleStateValidation(
                        values.guardian_country,
                        text,
                        'guardian_state',
                      )
                    }
                    error={
                      errors.guardian_state && touched.guardian_state
                        ? errors.guardian_state
                        : null
                    }
                  />

                  <AutoSuggestInputCard
                    title="District"
                    placeholder="District"
                    name={'guardian_district'}
                    value={values.guardian_district}
                    updateFields={text => {
                      setValues({...values, ...text});
                    }}
                    suggestions={guardianDistrict}
                    error={
                      errors.guardian_district && touched.guardian_district
                        ? errors.guardian_district
                        : null
                    }
                  />

                  {/* <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Country <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_country'}
                        value={values.guardian_country}
                        placeholder="Country"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_country')}
                        onBlur={handleBlur('guardian_country')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_country && touched.guardian_country ? (
                      <Text style={styles.error}>{errors.guardian_country}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      State <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_state'}
                        value={values.guardian_state}
                        placeholder="guardian_State"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_state')}
                        onBlur={handleBlur('guardian_state')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_state && touched.guardian_state ? (
                      <Text style={styles.error}>{errors.guardian_state}</Text>
                    ) : null}
                  </View>



                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      District <Text style={styles.astric}>*</Text>
                    </Text>
                    <View style={styles.bax}>
                      <TextInput
                        name={'guardian_district'}
                        value={values.guardian_district}
                        placeholder="District Name"
                        placeholderTextColor={colors.grey}
                        onChangeText={handleChange('guardian_district')}
                        onBlur={handleBlur('guardian_district')}
                        returnKeyType="next"
                        style={styles.inputStyle}
                      />
                    </View>
                    {errors.guardian_district && touched.guardian_district ? (
                      <Text style={styles.error}>{errors.guardian_district}</Text>
                    ) : null}
                  </View> */}
                </View>

                {/* DOCUMENTS  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={[styles.textstyle]}>DOCUMENTS</Text>
                  </View>

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Candidate Image <Text style={styles.astric}>*</Text>
                    </Text>
                    <RenderUploadButton
                      setImageUrl={image => {
                        setValues({...values, candidate_image: image});
                        handleImageUpload('candidate_image', image, values);
                      }}
                      imageUrl={values.candidate_image}
                      setSelectedImage={setSelectedImage}
                    />
                  </View>
                  {errors.candidate_image && touched.candidate_image ? (
                    <Text style={styles.error}>{errors.candidate_image}</Text>
                  ) : null}
                  {uploadImage.candidate_image && (
                    <View style={styles.imageBox}>
                      <Image
                        source={{uri: values?.candidate_image}}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() =>
                          setValues({...values, candidate_image: ''})
                        }
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Aadhaar Front <Text style={styles.astric}>*</Text>
                    </Text>
                    <RenderUploadButton
                      setImageUrl={image => {
                        setValues({...values, aadhare_front: image});
                        handleImageUpload('aadhare_front', image);
                      }}
                      imageUrl={values.aadhare_front}
                      disabled={!uploadImage.candidate_image}
                      height={300}
                      width={400}
                    />
                  </View>
                  {errors.aadhare_front && touched.aadhare_front ? (
                    <Text style={styles.error}>{errors.aadhare_front}</Text>
                  ) : null}
                  {uploadImage.aadhare_front && (
                    <View style={styles.imageBox}>
                      <Image
                        source={{uri: values?.aadhare_front}}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() =>
                          setValues({...values, aadhare_front: ''})
                        }
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>
                      Aadhaar Back <Text style={styles.astric}>*</Text>
                    </Text>
                    <RenderUploadButton
                      setImageUrl={image => {
                        setValues({...values, aadhare_back: image});
                        handleImageUpload('aadhare_back', image);
                      }}
                      imageUrl={values.aadhare_back}
                      disabled={!uploadImage.aadhare_front}
                      height={300}
                      width={400}
                    />
                  </View>
                  {errors.aadhare_back && touched.aadhare_back ? (
                    <Text style={styles.error}>{errors.aadhare_back}</Text>
                  ) : null}
                  {uploadImage.aadhare_back && (
                    <View style={styles.imageBox}>
                      <Image
                        source={{uri: values?.aadhare_back}}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() => setValues({...values, aadhare_back: ''})}
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>Candidate Sign</Text>
                    <RenderUploadButton
                      setImageUrl={image => {
                        setValues({...values, candidate_sign: image});
                        handleImageUpload('candidate_sign', image);
                      }}
                      imageUrl={values.candidate_sign}
                      disabled={!uploadImage.aadhare_back}
                      height={150}
                      width={400}
                    />
                  </View>
                  {errors.candidate_sign && touched.candidate_sign ? (
                    <Text style={styles.error}>{errors.candidate_sign}</Text>
                  ) : null}
                  {uploadImage.candidate_sign && (
                    <View style={styles.imageBox}>
                      <Image
                        source={{uri: values?.candidate_sign}}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() =>
                          setValues({...values, candidate_sign: ''})
                        }
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.inputcard}>
                    <Text style={styles.inptitle}>Parent Sign</Text>
                    <RenderUploadButton
                      setImageUrl={image => {
                        setValues({...values, parent_sign: image});
                        handleImageUpload('parent_sign', image);
                      }}
                      imageUrl={values.parent_sign}
                      disabled={!uploadImage.candidate_sign}
                      height={150}
                      width={400}
                    />
                  </View>
                  {errors.parent_sign && touched.parent_sign ? (
                    <Text style={styles.error}>{errors.parent_sign}</Text>
                  ) : null}
                  {uploadImage.parent_sign && (
                    <View style={styles.imageBox}>
                      <Image
                        source={{uri: values?.parent_sign}}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        // disabled={!editable}
                        onPress={() => setValues({...values, parent_sign: ''})}
                        style={styles.closeButton}>
                        <Icon name={'xmark'} size={15} color={colors.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* OTHERS  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={[styles.textstyle]}>OTHERS</Text>
                  </View>

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
                          if (checked === true) {
                            setValues({...values, refer_code: ''});
                          }
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
                        height: 45,
                        width: '100%',
                        alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: 'grey',
                        borderRadius: 5,
                        overflow: 'hidden',
                      }}>
                      <TextInput
                        placeholder="Referral code"
                        placeholderTextColor={'grey'}
                        value={values.refer_code}
                        onChangeText={handleChange('refer_code')}
                        onBlur={handleBlur('refer_code')}
                        style={{
                          backgroundColor: 'white',
                          width: '70%',
                          paddingLeft: 10,
                          color: colors.black,
                        }}
                      />
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'white',
                          width: '10%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderLeftWidth: 1,
                          borderColor: colors.darkgray,
                        }}>
                        <MaterialCommunityIcons
                          name="information-variant"
                          size={22}
                          color={colors.orange}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleReferralVerify(values.refer_code)}
                        style={{
                          backgroundColor: colors.orange,
                          height: '100%',
                          width: '20%',
                          borderTopRightRadius: 5,
                          borderBottomRightRadius: 5,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: 'black', fontSize: 14}}>
                          Verify
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* DISCLAIMER  */}
                <View style={styles.card}>
                  <View style={styles.seactionHeader}>
                    <Text style={[styles.textstyle]}>DISCLAIMER</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      gap: horizontalScale(10),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setValues({
                          ...values,
                          termConditions: !values?.termConditions,
                        });
                      }}
                      style={{
                        marginTop: verticalScale(4),
                        height: verticalScale(20),
                        width: verticalScale(20),
                        borderRadius: 4,
                        backgroundColor: values.termConditions
                          ? `${colors.navy}90`
                          : colors.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.grey,
                      }}>
                      {values?.termConditions === true ? (
                        <Icon name={'check'} size={15} color={colors.white} />
                      ) : null}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.altext,
                        {fontSize: moderateScale(8), width: '90%'},
                      ]}>
                      I DECLARE THAT THE INFORMATION GIVEN ABOVE IS TRUE TO THE
                      BEST OF MY KNOWLEDGE. I AGREE THAT IF ANY INFORMATION
                      FURNISHED ABOVE FOUND INCORRECT MY ADMISSION IS LIABLE TO
                      BE CANCELLED.
                    </Text>
                  </View>
                  {errors.termConditions && touched.termConditions ? (
                    <Text style={styles.error}>{errors.termConditions}</Text>
                  ) : null}
                </View>

                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={() => handleLoaBond()}
                    style={{
                      backgroundColor: '#363535',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 45,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                      {isBondExpanded
                        ? 'Hide Terms And Conditions'
                        : 'Please Read Terms And Conditions'}
                    </Text>
                  </TouchableOpacity>

                  {isBondExpanded && (
                    <View style={{width: '100%', alignItems: 'center'}}>
                      <Pdf
                        trustAllCerts={false}
                        enablePaging={true}
                        horizontal={true}
                        source={{
                          uri: `${tenantTermsAndConditionspdfResponse?.response?.rules_file}`,
                          cache: true,
                        }}
                        onLoadComplete={(numberOfPages, filePath) => {}}
                        onPageChanged={(page, numberOfPages) => {}}
                        onError={error => {}}
                        onPressLink={uri => {}}
                        style={{height: verticalScale(550), width: '100%'}}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          downloadFile(
                            tenantTermsAndConditionspdfResponse?.response
                              ?.rules_file,
                            'TermsAndConditions',
                          )
                        }
                        style={[styles.downloadButton]}>
                        <Icon
                          name={'download'}
                          color={colors.white}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => setAccepted(!accepted)}
                      style={{
                        marginTop: verticalScale(4),
                        height: verticalScale(20),
                        width: verticalScale(20),
                        borderRadius: 4,
                        backgroundColor: accepted
                          ? `${colors.navy}90`
                          : colors.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.grey,
                      }}>
                      {accepted && (
                        <Icon name="check" size={15} color={colors.white} />
                      )}
                    </TouchableOpacity>
                    <Text
                      style={{fontSize: 11, color: 'black', marginLeft: 10}}>
                      PLEASE READ AND ACCEPT TERMS & CONDITIONS
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      scrollToTop();
                    }}
                    style={styles.btn}>
                    <Text style={styles.textstyle}>Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!accepted}
                    onPress={() => handleSubmit(resetForm)}
                    style={[
                      styles.btn,
                      {backgroundColor: accepted ? colors.orange : '#666665'},
                    ]}>
                    <Text style={styles.textstyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          />
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Tenant_Details;

const styles = StyleSheet.create({
  astric: {color: 'red', fontSize: 14, fontWeight: '600'},
  container: {
    flex: 1,
  },
  card: {
    // verticalAlign: 'middle',
    width: '100%',
    alignSelf: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  img: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  inputcard: {
    gap: 2.5,
  },
  inptitle: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Regular',
  },
  bax: {
    width: '100%',
    height: verticalScale(50),
    // elevation: 2,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderWidth: 0.5,
  },
  inputStyle: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    color: colors.black,
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
  seactionHeader: {
    // alignItems: 'center',
    paddingVertical: verticalScale(12),
    backgroundColor: colors.darkgrey,
    borderRadius: 4,
    paddingLeft: 10,
  },
  btn: {
    height: verticalScale(50),
    width: '43%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btn,
    borderRadius: 4,
    alignSelf: 'center',
  },
  textstyle: {
    fontSize: fontSize.lable,
    color: colors.white,
    fontFamily: 'Roboto-Medium',
  },
  altext: {
    color: '#000',
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Regular',
    marginVertical: verticalScale(5),
  },
  loginText: {
    color: '#000',
    fontSize: moderateScale(18),
    fontFamily: 'Roboto-Regular',
    marginHorizontal: horizontalScale(10),
  },
  uploadButton: {
    flexDirection: 'row',
    height: verticalScale(50),
    borderRadius: horizontalScale(4),
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderColor: colors.grey,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  uploadButtonText: {
    fontSize: moderateScale(14),
    color: colors.grey,
    fontFamily: 'Roboto-Regular',
  },

  imageBox: {
    height: verticalScale(200),
    width: '100%',
    borderWidth: 1,
    borderColor: colors.lightygrey,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: horizontalScale(180),
    height: horizontalScale(180),
    resizeMode: 'contain',
  },

  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(6),
    top: verticalScale(6),
  },
  checkBox: {
    height: verticalScale(24),
    width: verticalScale(24),
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.orange,
  },
  error: {
    fontSize: moderateScale(12),
    color: colors.red,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
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
  downloadButton: {
    backgroundColor: '#dc3545',
    position: 'absolute',
    bottom: verticalScale(12),
    borderRadius: 40,
    width: verticalScale(50),
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  radioCirlce: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: colors.orange,
  },
});
