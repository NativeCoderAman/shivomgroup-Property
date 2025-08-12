import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  Alert,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PickerCard from '../../Components/cards/PickerCard';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import InputCard from '../../Components/cards/InputCard';
import { colors } from '../../Utils/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetRoomsListApi,
  GetSeatsListApi,
  handleRegistrationListAPI,
} from '../../Service/slices/RegisterSlice';
import {
  createStudentRegFormDownloadThunkAPI,
  downloadStudentDocumentsThunkAPI,
  getBusinessProfileDataThunkAPI,
  termsAndConditionspdfThunkAPI,
  updateStudentRegisterThunkAPI,
} from '../../Service/api/thunks';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';
import RNFetchBlob from 'rn-fetch-blob';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Share_Modal from '../../Components/modals/Share_Modal';
import { IconButton } from 'react-native-paper';
import {
  getPincodeThunkApi,
  getStateDataThunkApi,
  getDistrictDataThunkApi,
} from '../../Service/slices/tenant/tenantReferVerifySlice';
import AutoSuggestInputCard from '../../Components/cards/AutoSuggestInputCard';
import {
  createImageUploadThunkApi,
  deleteImageThunkApi,
} from '../../Service/slices/RegisterSlice';
import ImagePicker from 'react-native-image-crop-picker';
import ViewImage_Modal from '../../Tenant/Components/Modals/ViewImage_Modal';
import { useFocusEffect } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import RegMultiDate from '../../Components/modals/RegMultiDate';

const validationSchemaforEdit = Yup.object().shape({
  // Candidate Information
  roomNumber: Yup.string().required('Room Number is required'),
  seatNumber: Yup.string().required('Seat Number is required'),
  registrationDate: Yup.date().required('Registration Date is required'),

  candidateName: Yup.string().required('Candidate Name is required'),
  // birthDate: Yup.date().required('Birth Date is required'),
  // idProof: Yup.string().required('ID Proof (Aadhar Number) is required'),
  // candidatePhone: Yup.string().required('Candidate Phone is required'),
  // email: Yup.email('Invalid Email').required('Email is required'),
  // blood_Group: Yup.string().required('Blood Group is required'),
  // courseName: Yup.string().required('Course Name is required'),
  // courseDescription: Yup.string().required('Course Description is required'),
  // jobDescription: Yup.string().required('Job Description is required'),
  // instituteName: Yup.string().required('Institute Name is required'),
  // stayDuration: Yup.string().required('Stay Duration is required'),
  // healthIssue: Yup.string().required('Health Issue field is required'),
  // vehicleNumber: Yup.string().required('Vehicle Number is required'),

  // Parent Information
  fatherName: Yup.string().required('Father Name is required'),
  fatherOccupation: Yup.string().required('Father Occupation is required'),
  motherName: Yup.string().required('Mother Name is required'),
  motherOccupation: Yup.string().required('Mother Occupation is required'),

  parentsPhone1: Yup.string()
    .required('Father mobile is required')
    .min(10, 'Father mobile must be exactly 10 digits long')
    .max(10, 'Father mobile must be exactly 10 digits long')
    .matches(
      /^[0-9]+$/,
      'Father mobile must be a valid number (only digits allowed)',
    ),

  parentsPhone2: Yup.string()
    .required('Mother mobile is required')
    .min(10, 'Mother mobile must be exactly 10 digits long')
    .max(10, 'Mother mobile must be exactly 10 digits long')
    .matches(
      /^[0-9]+$/,
      'Mother mobile must be a valid number (only digits allowed)',
    ),

  parentsAddress: Yup.string().required('Parent Address is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .min(6, 'Pincode must be exactly 6 digits long')
    .matches(/^[0-9]+$/, 'pincode should contain (only digits allowed)'),

  country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  district: Yup.string().required('District is required'),

  // Guardian Information
  guardianName: Yup.string().required('Guardian Name is required'),
  guardianNumber: Yup.string()
    .required('Guardian Phone Number is required')
    .min(10, 'Mother mobile must be exactly 10 digits long'),
  guardianAddress: Yup.string().required('Guardian Address is required'),
  guardianPincode: Yup.string()
    .min(6, 'Pincode must be exactly 6 digits long')
    .required('Guardian Pincode is required'),

  guardianCountry: Yup.string().required('Guardian Country is required'),
  guardianState: Yup.string().required('Guardian State is required'),
  guardianDistrict: Yup.string().required('Guardian District is required'),
});

const Registarion_View = ({ navigation, route }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isBirthDatePickerVisible, setBirthDatePickerVisibility] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeclare, setIsDeclare] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [multiDateModal, setMultiDateModal] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [refreshing, setrefreshing] = useState(false);
  const [Country, setCountryName] = useState([]);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [guardianCountry, setGuardianCountry] = useState([]);
  const [guardianState, setGuardianState] = useState([]);
  const [guardianDistrict, setGuardianDistrict] = useState([]);
  const [regmultiDateRef, setRegMultiDateRef] = useState(false);
  const [multiDate, setMultiDate] = useState([]);


  const closeMultiDate = () => setMultiDateModal(false);
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const formikRef = useRef(null);
  const scrollViewRef = useRef(null);

  const dispatch = useDispatch();

  const { token } = useSelector(state => state.root.auth.userData);
  const {
    seatsListResponse,
    roomsListResponse,
    termsAndConditionspdfResponse,
    createStudentRegFormDownloadResponse,
  } = useSelector(state => state.root.registerData);

  useEffect(() => {
    dispatch(getBusinessProfileDataThunkAPI());
    dispatch(termsAndConditionspdfThunkAPI());
    dispatch(GetRoomsListApi());
  }, []);

  const { getBusinessProfileDataResponse } = useSelector(
    state => state.root.bussinessData,
  );
  const user = useSelector(state => state?.root.auth.userData);
  const { studentData } = route.params;
  const mode = route.params?.mode;
  const { registrationNumber } = route.params.studentData;

  const INITIAL_DATA = {
    roomNumber: studentData?.roomNumber,
    seatNumber: studentData?.seatNumber,
    registrationDate: studentData?.registrationDate,

    candidateName: studentData?.name,
    birthDate: studentData?.bithDate,
    idProof: studentData?.aadharNumber,
    candidatePhone: studentData?.mobileNumber,
    email: studentData?.email,
    blood_Group: studentData?.bloodGroup,
    courseName: studentData?.courseName,
    courseDescription: studentData?.courseDescription,
    jobDescription: studentData?.jobdDescription,
    instituteName: studentData?.instituteCompany,
    instituteDescription: studentData?.instituteName,
    companyDescription: studentData?.companyName,
    stayDuration: studentData?.stayDuration,
    healthIssue: studentData?.helthIssue,
    healthDescription: studentData?.healthDescription,
    vehicleNumber: studentData?.vehicalNumber,
    vehicleDescription: studentData?.vehicleDescription,

    fatherName: studentData?.fatherName,
    fatherOccupation: studentData?.fatherOccupation,
    motherName: studentData?.motherName,
    motherOccupation: studentData?.motherOccupation,
    parentsPhone1: studentData?.parentMobile1,
    parentsPhone2: studentData?.parentMobile2,
    parentsEmail: studentData?.parentEmail || '',
    parentsAddress: studentData?.parentAddress,
    pincode: studentData?.pincode,
    country: studentData?.country,
    state: studentData?.state,
    district: studentData?.district,

    guardianName: studentData?.guardianName,
    guardianNumber: studentData?.guardianMobileNumber,
    guardianAddress: studentData?.guardianAddress,
    guardianPincode: studentData?.guardianPincode,
    guardianCountry: studentData?.guardianCountry,
    guardianState: studentData?.guardianState,
    guardianDistrict: studentData?.guardianDistrict,

    CandidateImage: studentData?.CandidateImage,
    aadhareFront: studentData?.aadharFrount,
    aadhareBack: studentData?.AadharBack,
    candidateSing: studentData?.candidateSignature,
    parentSing: studentData?.ParentSignature,

    remark: studentData?.remark,
  };
  const [formikdata, setFormikdata] = useState(INITIAL_DATA);

  useEffect(() => {
    setFormikdata(prevData => ({
      ...INITIAL_DATA, // Set formikdata to match the initial structure
    }));
  }, [studentData]);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  useFocusEffect(
    useCallback(() => {
      scrollToTop();
      return () => {
        setIsEditable(false);
      };
    }, []),
  );

  const onRefresh = useCallback(resetForm => {
    resetForm();
    setIsEditable(false);
    setUploadImage({
      CandidateImage: '',
      aadhareFront: '',
      aadhareBack: '',
      candidateSing: '',
      parentSing: '',
    });
  }, []);

  const handlePincodeValidation = async (pinno, fieldName, setValues) => {
    try {
      setIsLoading(true);
      const response = await dispatch(getPincodeThunkApi({ pinno, token }));
      if (
        response.payload.status === true &&
        response.payload.statusCode === 200
      ) {
        const { country, district, state } = response.payload.data;
        if (fieldName === 'pincode') {
          setValues(prevValues => ({
            ...prevValues,
            district: district,
            state: state,
            country: country,
          }));
        } else if (fieldName === 'guardianPincode') {
          setValues(prevValues => ({
            ...prevValues,
            guardianDistrict: district,
            guardianState: state,
            guardianCountry: country,
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
      setIsLoading(false);
    }
  };
  const handleCountryValidation = async (countryName, fieldName) => {
    try {
      const response = await dispatch(
        getStateDataThunkApi({ countryName, token }),
      );
      if (response.payload.status === true) {
        const stateList = response.payload.data.uniqueStates;
        if (fieldName === 'country') {
          setState(stateList);
        } else {
          setGuardianState(stateList);
        }
      }
    } catch (error) { }
  };
  const handleStateValidation = async (countryName, stateName, fieldName) => {
    try {
      const response = await dispatch(
        getDistrictDataThunkApi({ countryName, stateName, token }),
      );
      if (response.payload.status === true) {
        const districtList = response.payload.data.uniqueDistricts;
        if (fieldName === 'state') {
          setDistrict(districtList);
        } else {
          setGuardianDistrict(districtList);
        }
      }
    } catch (error) { }
  };

  const [uploadImage, setUploadImage] = useState({
    CandidateImage: '',
    aadhareFront: '',
    aadhareBack: '',
    candidateSing: '',
    parentSing: '',
  });

  useEffect(() => {
    if (mode === 'request') {
      setUploadImage({
        CandidateImage: studentData?.CandidateImage,
        aadhareFront: studentData?.aadharFrount,
        aadhareBack: studentData?.AadharBack,
        candidateSing: studentData?.candidateSignature,
        parentSing: studentData?.ParentSignature,
      });
    }
  }, [studentData]);

  const MAX_SIZE_IN_KB = 1024; // 1 MB in KB
  const TARGET_SIZE_IN_KB = 1024; // Target size after compression
  const TARGET_SIZE_IN_BYTES = TARGET_SIZE_IN_KB * 1024; // Convert to bytes

  const PickImage = (width, height) => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: true,
        width: width || 300,
        height: height || 400,
        freeStyleCropEnabled: false,
        multiple: false,
      })
        .then(async image => {
          const imageName = image.filename || image.path.split('/').pop();

          // Check the size of the selected image
          const imageSize = await RNFS.stat(image.path);
          let imageUri = image.path;

          if (imageSize.size > TARGET_SIZE_IN_BYTES) {
            // Image size is greater than 1 MB, resize it
            try {
              const resizedImage = await ImageResizer.createResizedImage(
                image.path,
                width || 300, // width after resize
                height || 400, // height after resize
                image.mime.includes('png') ? 'PNG' : 'JPEG', // format
                80, // quality (adjust based on desired compression)
                0, // rotation
                undefined, // output path
                true, // keep the file extension
              );
              imageUri = resizedImage.uri; // Use resized image URI
            } catch (resizeError) {
              Alert.alert('Image resize failed', 'Unable to resize the image');
              reject(resizeError);
              return;
            }
          }

          resolve({
            uri: imageUri,
            type: image.mime,
            name: imageName,
          });
        })
        .catch(e => {
          if (e.message !== 'User cancelled image selection') {
            Alert.alert('Something went wrong');
            reject(e);
          } else {
            reject(e);
          }
        });
    });
  };

  const handleImage = async (setValues, fieldName, width, height) => {
    if (!isEditable) return;

    try {
      const image = await PickImage(width, height);

      // Set the image path in Formik values using setValues
      setValues(prevValues => ({
        ...prevValues,
        [fieldName]: image.uri, // Set the image URI in the specified field
      }));

      // Automatically upload the image after selecting it
      await handleImageUpload(fieldName, { [fieldName]: image }); // Pass the updated image data
    } catch (error) { }
  };

  const handleImageUpload = async (fieldName, data) => {
    const formData = new FormData();
    setIsLoading(true);
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    try {
      await delay(2000);
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
          createImageUploadThunkApi({ data: formData, token }),
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
    } finally {
      if (fieldName !== 'parentSing') {
        await delay(3000);
      }
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (fieldName, imageName) => {
    try {
      const response = await dispatch(
        deleteImageThunkApi({ data: imageName, name: fieldName, token }),
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

  const handleSubmit = values => {
    const id = registrationNumber;

    function capitalizeFirstLetter(string) {
      if (typeof string !== 'string' || string.length === 0) return ''; // Handle non-string or empty input
      return string.charAt(0).toUpperCase() + string.slice(1); // Capitalize first letter, keep the rest unchanged
    }

    let formdata = new FormData();

    formdata.append('roomNumber', values.roomNumber);
    formdata.append('seatNumber', String(values.seatNumber));
    formdata.append('registrationDate', values.registrationDate);
    formdata.append('candidateName', values.candidateName);
    formdata.append('birthDate', values.birthDate);
    formdata.append('idProof', values.idProof);
    formdata.append('candidatePhone', values.candidatePhone);
    formdata.append('email', values.email);
    formdata.append('blood_Group', values.blood_Group);
    formdata.append('courseName', values.courseName);
    formdata.append('courseDescription', values.courseDescription);
    formdata.append('jobDescription', values.jobDescription);
    formdata.append('instituteName', values.instituteName);
    formdata.append('instituteDescription', values.instituteDescription);
    formdata.append('companyDescription', values.companyDescription);
    formdata.append('stayDuration', values.stayDuration);

    formdata.append('healthIssue', capitalizeFirstLetter(values.healthIssue));

    formdata.append('healthDescription', values.healthDescription);
    formdata.append(
      'vehicleNumber',
      capitalizeFirstLetter(values.vehicleNumber),
    );
    formdata.append('vehicleDescription', values.vehicleDescription);

    formdata.append('fatherName', values.fatherName);
    formdata.append('fatherOccupation', values.fatherOccupation);
    formdata.append('motherName', values.motherName);
    formdata.append('motherOccupation', values.motherOccupation);
    formdata.append('parentsPhone1', values.parentsPhone1);
    formdata.append('parentsPhone2', values.parentsPhone2);
    formdata.append('parentsEmail', values.parentsEmail || '');
    formdata.append('parentsAddress', values.parentsAddress);
    formdata.append('pincode', values.pincode);
    formdata.append('parentAddressCountry', values.country);
    formdata.append('state', values.state);
    formdata.append('parentAddressDistrict', values.district);

    formdata.append('guardianName', values.guardianName);
    formdata.append('guardianNumber', values.guardianNumber);
    formdata.append('guardianAddress', values.guardianAddress);
    formdata.append('guardianAddressPincode', values.guardianPincode);
    formdata.append('guardianAddressCountry', values.guardianCountry);
    formdata.append('guardianAddressState', values.guardianState);
    formdata.append('guardianAddressDistrict', values.guardianDistrict);

    // Check if uploadImage has a value, else fallback to values

    if (uploadImage.CandidateImage) {
      const candidateImage = uploadImage['CandidateImage'];
      formdata.append('candidateImg', candidateImage);
    }
    if (uploadImage.aadhareFront) {
      const aadharFront = uploadImage['aadhareFront'];
      formdata.append('aadharFront', aadharFront);
    }
    if (uploadImage.aadhareBack) {
      const aadharBack = uploadImage['aadhareBack'];
      formdata.append('aadharBack', aadharBack);
    }

    const candidateSignature =
      uploadImage['candidateSing'] || values.candidateSing;
    const parentSignature = uploadImage['parentSing'] || values.parentSing;

    if (candidateSignature) {
      formdata.append('candidateSignature', candidateSignature);
    } else {
    }

    if (parentSignature) {
      formdata.append('parentSignature', parentSignature);
    } else {
    }

    formdata.append('remark', values.remark);

    setIsLoading(true);
    dispatch(updateStudentRegisterThunkAPI({ id, formdata }))
      .then(res => {
        if (res?.payload?.status === true && res?.payload.statusCode === 200) {
          Alert.alert('Success', res?.payload?.message);
          dispatch(handleRegistrationListAPI());
          navigation.navigate('Registration');
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Something went wrong!',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25, // X offset
            50, // Y offset
          );
          // navigation.navigate('Registration');
        }
      })
      .catch(err => {
        ToastAndroid.show('Something went wrong!' + err, 5000);
      })
      .finally(() => {
        setUploadImage({
          CandidateImage: '',
          aadhareFront: '',
          aadhareBack: '',
          candidateSing: '',
          parentSing: '',
        });
        setIsLoading(false);
        setIsEditable(false);
      });
  };

  const downloadFile = (url, title) => {
    setIsLoading(true);
    const pdfName = title.split(' ').join('_');
    const source = url;

    const ext = 'pdf';
    const { config, fs } = RNFetchBlob;
    const downloadDir = fs.dirs.DownloadDir; // For Android
    const fileName = `${pdfName}_${Date.now()}`;
    const filePath = `${downloadDir}/${fileName}.${ext}`;

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading PDF file',
      },
    })
      .fetch('GET', source)
      .progress((received, total) => { })
      .then(res => {
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  const handleDownloadReg = async id => {
    try {
      const res = await dispatch(createStudentRegFormDownloadThunkAPI(id));
      if (res?.payload?.status === 200) {
        downloadFile(res?.payload?.data?.download_link, 'Registration Form');
      } else {
        alertMessage('Something went wrong');
      }
    } catch (err) {
      alertMessage(err.message);
    } finally {
    }
  };

  const handleDocDownload = async id => {
    try {
      const response = await dispatch(downloadStudentDocumentsThunkAPI(id));
      if (response?.payload?.status === true) {
        downloadFile(response?.payload?.data?.download_link, 'Documents File');
      } else {
        alertMessage('Something went wrong');
      }
    } catch (error) {
    } finally {
    }
  };

  const getObjList = useCallback(list => {
    return list?.map(key => ({
      value: key,
      label: key,
    }));
  }, []);

  const handlePress = () => {
    setIsEditable(!isEditable);
    // if (flatListRef.current) {
    //   flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    // }
  };

  const RenderImageCard = ({ imageUrl, title, setImageUrl, editable }) => {
    return (
      <View style={styles.ImgageCard}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ height: '90%', width: '90%', resizeMode: 'contain' }}
          />
        ) : (
          <Text style={styles.textstyle}> No Data Available</Text>
        )}
        <TouchableOpacity
          onPress={() => PickImage(setImageUrl)}
          disabled={!editable}
          style={styles.bottomDetails}>
          <Text style={styles.textstyle}>{title ? title : 'Upload file'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Section_Header = ({ title }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{ fontSize: moderateScale(16), color: colors.white }}>
          {title}
        </Text>
      </View>
    );
  };

  const SubmitButton = ({ title, backgroundColor, handlePress, disabled }) => {
    return (
      <TouchableOpacity
        disabled={disabled ? disabled : false}
        style={[
          styles.submitButton,
          {
            backgroundColor: backgroundColor
              ? backgroundColor
              : colors.AppDefaultColor,
          },
        ]}
        onPress={handlePress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const [imageUri, setImageUri] = useState(null);
  const [imageModal, setImageModal] = useState(false);

  const handleImageView = useCallback(uri => {
    setImageUri(uri);
    setImageModal(true);
  }, []);

  const showMultiDatePop = () => {
    console.log('pop up run', studentData?.registrationsDate);
    setRegMultiDateRef(true);
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader
          loading={
            termsAndConditionspdfResponse.loading ||
            roomsListResponse.loading ||
            seatsListResponse.loading ||
            getBusinessProfileDataResponse?.loading ||
            isLoading
          }
        />
        <Formik
          innerRef={formikRef}
          initialValues={formikdata}
          enableReinitialize={true}
          validationSchema={validationSchemaforEdit}
          onSubmit={values => handleSubmit(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setValues,
            errors,
            touched,
            resetForm,
          }) => {
            return (
              <FlatList
                ref={scrollViewRef}
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
                    {!mode && (
                      <View style={styles.section}>
                        <View style={[styles.chip, styles.shadow]}>
                          <View style={{ gap: verticalScale(5), width: '70%' }}>
                            <Text style={styles.title}>
                              {user?.businessName}
                            </Text>
                            <View style={styles.flexRowWithGap}>
                              <View
                                style={[
                                  styles.flexRowWithGap,
                                  {
                                    alignItems: 'center',
                                    gap: horizontalScale(5),
                                  },
                                ]}>
                                <Icon
                                  name={'envelope'}
                                  size={12}
                                  color={colors.black}
                                />
                                <Text numberOfLines={1} style={styles.label}>
                                  {
                                    getBusinessProfileDataResponse?.response
                                      ?.email
                                  }
                                </Text>
                              </View>
                            </View>
                            <View
                              style={[
                                styles.flexRowWithGap,
                                { alignItems: 'center', gap: horizontalScale(5) },
                              ]}>
                              <Icon
                                name={'phone-volume'}
                                size={12}
                                color={colors.black}
                              />
                              <Text numberOfLines={1} style={styles.label}>
                                {
                                  getBusinessProfileDataResponse?.response
                                    ?.mobileNumber
                                }
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.flexRowWithGap,
                                { alignItems: 'center', gap: horizontalScale(5) },
                              ]}>
                              <Icon
                                name={'house'}
                                size={12}
                                color={colors.black}
                              />
                              <Text
                                numberOfLines={textShown ? undefined : 2}
                                style={styles.label}>
                                {
                                  getBusinessProfileDataResponse?.response
                                    ?.address
                                }
                              </Text>
                            </View>
                          </View>
                          <View style={styles.right}>
                            <Image
                              source={require('../../Assets/Photos/logo.png')}
                              style={{
                                height: verticalScale(60),
                                width: horizontalScale(90),
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    )}
                    {mode === 'request' ? (
                      // Mode "request": show only date and image fields
                      <View style={styles.section}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{ width: '50%' }}>
                            {/* Date Field */}
                            <View
                              style={{
                                gap: verticalScale(10),
                                position: 'relative',
                              }}>
                              <Text
                                style={{
                                  color: colors.black,
                                  fontSize: moderateScale(14),
                                }}>
                                Date
                              </Text>
                              <TouchableOpacity
                                disabled={!isEditable}
                                onPress={() => setDatePickerVisibility(true)}
                                style={{
                                  height: verticalScale(50),
                                  width: '100%',
                                  backgroundColor: colors.white,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingHorizontal: horizontalScale(12),
                                  borderRadius: horizontalScale(4),
                                  borderWidth: 0.5,
                                  borderColor: colors.grey,
                                  height: 45,
                                }}>
                                <Text
                                  style={{
                                    fontSize: moderateScale(12),
                                    color: colors.grey,
                                  }}>
                                  {values.registrationDate}
                                </Text>
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
                              onConfirm={date => {
                                const formatDate =
                                  moment(date).format('YYYY-MM-DD');
                                setValues({
                                  ...values,
                                  registrationDate: formatDate,
                                });
                                setDatePickerVisibility(false);
                              }}
                              onCancel={() => setDatePickerVisibility(false)}
                            />
                          </View>
                          <View
                            style={{
                              width: '45%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderColor: colors.lightygrey,
                              borderWidth: 0.5,
                              borderStyle: 'dashed',
                              borderRadius: 5,
                            }}>
                            {/* Candidate Image Field */}
                            {isEditable ? (
                              <View>
                                <TouchableOpacity
                                  style={styles.noImage}
                                  onPress={() =>
                                    handleImage(
                                      setValues,
                                      'CandidateImage',
                                      300,
                                      400,
                                    )
                                  }>
                                  <MaterialCommunityIcons
                                    name="cloud-upload-outline"
                                    size={30}
                                    color="black"
                                  />
                                  <Text
                                    style={{ color: colors.grey, fontSize: 12 }}>
                                    Upload Candidate Image
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.CandidateImage)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : // If not editable, show the image if it exists
                              values.CandidateImage ? (
                                <Image
                                  source={{ uri: values.CandidateImage }}
                                  style={{
                                    height: verticalScale(100),
                                    width: '90%',
                                    resizeMode: 'contain',
                                  }}
                                />
                              ) : null}
                          </View>
                        </View>
                      </View>
                    ) : (
                      // Mode undefined or null: show everything
                      <View style={styles.section}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{ width: '50%' }}>
                            <PickerCard
                              editable={isEditable}
                              title={'Room Number'}
                              placeholder={'Select Room'}
                              value={values.roomNumber}
                              setValue={item => {
                                setValues({ ...values, roomNumber: item });
                                dispatch(GetSeatsListApi({ roomNo: item }));
                              }}
                              items={getObjList(
                                roomsListResponse?.response?.rooms,
                              )}
                              error={
                                errors.roomNumber && touched.roomNumber
                                  ? errors.roomNumber
                                  : null
                              }
                            />
                            <PickerCard
                              editable={isEditable}
                              title={'Seat Number'}
                              placeholder={'Select Seat'}
                              value={values.seatNumber}
                              setValue={item =>
                                setValues({ ...values, seatNumber: item })
                              }
                              items={getObjList(
                                seatsListResponse?.response?.data,
                              )}
                              error={
                                errors.seatNumber && touched.seatNumber
                                  ? errors.seatNumber
                                  : null
                              }
                            />
                            <View
                              style={{
                                gap: verticalScale(10),
                                position: 'relative',
                              }}>
                              <Text
                                style={{
                                  color: colors.black,
                                  fontSize: moderateScale(14),
                                }}>
                                Date
                              </Text>
                              <TouchableOpacity
                                disabled={!isEditable}
                                onPress={() => setDatePickerVisibility(true)}
                                style={{
                                  height: verticalScale(50),
                                  width: '100%',
                                  backgroundColor: colors.white,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingHorizontal: horizontalScale(12),
                                  borderRadius: horizontalScale(4),
                                  borderWidth: 0.5,
                                  borderColor: colors.grey,
                                  height: 45,
                                }}>
                                <Text
                                  style={{
                                    fontSize: moderateScale(12),
                                    color: colors.grey,
                                  }}>
                                  {values.registrationDate}
                                </Text>
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
                              onConfirm={date => {
                                const formatDate =
                                  moment(date).format('YYYY-MM-DD');
                                setValues({
                                  ...values,
                                  registrationDate: formatDate,
                                });
                                setDatePickerVisibility(false);
                              }}
                              onCancel={() => setDatePickerVisibility(false)}
                            />
                            {studentData?.registrationsDate &&
                              studentData?.registrationsDate.length > 1 && (
                                <TouchableOpacity
                                  onPress={() => showMultiDatePop()}
                                  style={{
                                    marginLeft: horizontalScale(-10),
                                    position: 'absolute',
                                    left: 120,
                                    top: verticalScale(190),
                                  }}>
                                  <IconButton
                                    size={20}
                                    icon={'information'}
                                    iconColor={colors.orange}
                                  // onPress={() => {
                                  //   setMultiDateModal(true);
                                  // }}
                                  />
                                </TouchableOpacity>
                              )}
                          </View>
                          <View
                            style={{
                              width: '45%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderColor: colors.lightygrey,
                              borderWidth: 0.5,
                              borderStyle: 'dashed',
                              borderRadius: 5,
                            }}>
                            {isEditable ? (
                              <View>
                                <TouchableOpacity
                                  style={styles.noImage}
                                  onPress={() =>
                                    handleImage(
                                      setValues,
                                      'CandidateImage',
                                      300,
                                      400,
                                    )
                                  }>
                                  <MaterialCommunityIcons
                                    name="cloud-upload-outline"
                                    size={30}
                                    color="black"
                                  />
                                  <Text
                                    style={{ color: colors.grey, fontSize: 12 }}>
                                    Upload Candidate Image
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.CandidateImage)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : // If not editable, show the image if it exists
                              values.CandidateImage ? (
                                <Image
                                  source={{ uri: values.CandidateImage }}
                                  style={{
                                    height: verticalScale(250),
                                    width: '90%',
                                    resizeMode: 'contain',
                                  }}
                                />
                              ) : null}
                          </View>
                        </View>
                      </View>
                    )}

                    {/* personal details  */}
                    <Section_Header title={'Personal Details'} />
                    <View style={styles.section}>
                      <InputCard
                        editable={isEditable}
                        title={'Candidate Name'}
                        placeholder={'Full Name'}
                        value={values.candidateName}
                        name={'candidateName'}
                        updateFields={text => setValues({ ...values, ...text })}
                        error={
                          errors.candidateName && touched.candidateName
                            ? errors.candidateName
                            : null
                        }
                      />
                      <View style={{ gap: verticalScale(10) }}>
                        <Text
                          style={{
                            color: colors.black,
                            fontSize: moderateScale(14),
                          }}>
                          Birth Date
                        </Text>
                        <TouchableOpacity
                          disabled={!isEditable}
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
                            height: 45,
                            borderWidth: 0.5,
                            borderColor: colors.grey,
                          }}>
                          <Text
                            style={{
                              fontSize: moderateScale(12),
                              color: colors.grey,
                            }}>
                            {values.birthDate}
                          </Text>
                          <Icon
                            name={'calendar'}
                            color={colors.black}
                            size={20}
                          />
                        </TouchableOpacity>
                        <DateTimePickerModal
                          isVisible={isBirthDatePickerVisible}
                          mode="date"
                          onConfirm={date => {
                            const formatDate =
                              moment(date).format('YYYY-MM-DD');
                            setValues({ ...values, birthDate: formatDate });
                            setBirthDatePickerVisibility(false);
                          }}
                          onCancel={() => setBirthDatePickerVisibility(false)}
                        />
                      </View>
                      <InputCard
                        editable={isEditable}
                        title={'Aadhar/VT/Dl/Id Proof'}
                        placeholder={'Aadhar/VT/Dl/Id Proof'}
                        value={values.idProof}
                        maxLength={12}
                        name={'idProof'}
                        updateFields={text => setValues({ ...values, ...text })}
                        keyboardType={'numeric'}
                        error={
                          errors.idProof && touched.idProof
                            ? errors.idProof
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Mobile Number'}
                        placeholder={'Phone Number'}
                        value={values.candidatePhone}
                        name={'candidatePhone'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        keyboardType={'numeric'}
                        error={
                          errors.candidatePhone && touched.candidatePhone
                            ? errors.candidatePhone
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Email'}
                        placeholder={'Email'}
                        value={values.email}
                        name={'email'}
                        updateFields={text => setValues({ ...values, ...text })}
                        error={
                          errors.email && touched.email ? errors.email : null
                        }
                      />
                      <PickerCard
                        editable={isEditable}
                        value={values.blood_Group}
                        setValue={item => {
                          setValues({ ...values, blood_Group: item });
                        }}
                        placeholder={'Select'}
                        title={'Blood Group'}
                        items={[
                          { value: 'A+', label: 'A+' },
                          { value: 'B+', label: 'B+' },
                          { value: 'AB+', label: 'AB+' },
                          { value: 'O+', label: 'O+' },
                        ]}
                        error={
                          errors.blood_Group && touched.blood_Group
                            ? errors.blood_Group
                            : null
                        }
                      />
                      <View style={{ gap: verticalScale(10) }}>
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
                              style={styles.checkBox}
                              disabled={!isEditable}
                              onPress={() =>
                                setValues({ ...values, courseName: 'coursetype' })
                              }>
                              {values.courseName === 'coursetype' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                              style={styles.checkBox}
                              disabled={!isEditable}
                              onPress={() =>
                                setValues({ ...values, courseName: 'jobtype' })
                              }>
                              {values.courseName === 'jobtype' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                          updateFields={text => setValues({ ...values, ...text })}
                          error={errors.courseDescription}
                        />
                      ) : (
                        <InputCard
                          title={'job Details'}
                          placeholder={'job Details'}
                          value={values.jobDescription}
                          name={'jobDescription'}
                          updateFields={text => {
                            setValues({ ...values, ...text });
                          }}
                          error={errors.jobDescription}
                        />
                      )}

                      <View style={{ gap: verticalScale(10) }}>
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
                              style={styles.checkBox}
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
                                  color={colors.black}
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
                              style={styles.checkBox}
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
                                  color={colors.black}
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
                          updateFields={text => setValues({ ...values, ...text })}
                          error={errors.companyDescription}
                        />
                      ) : (
                        <InputCard
                          title={'Institute description'}
                          placeholder={'Institute description'}
                          value={values.instituteDescription}
                          name={'instituteDescription'}
                          updateFields={text => setValues({ ...values, ...text })}
                          error={errors.instituteDescription}
                        />
                      )}
                      <InputCard
                        editable={isEditable}
                        title={'Stay Duration'}
                        placeholder={'Stay Duration'}
                        value={values.stayDuration}
                        name={'stayDuration'}
                        updateFields={text => setValues({ ...values, ...text })}
                        error={errors.stayDuration}
                      />
                      <View style={{ gap: verticalScale(10) }}>
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
                              style={styles.checkBox}
                              onPress={() =>
                                setValues({ ...values, healthIssue: 'Yes' })
                              }>
                              {values.healthIssue === 'Yes' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                              style={styles.checkBox}
                              onPress={() =>
                                setValues({ ...values, healthIssue: 'No' })
                              }>
                              {values.healthIssue === 'No' ||
                                values.healthIssue === 'no' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                      {values.healthIssue === 'Yes' ||
                        values.healthIssue === 'yes' ? (
                        <InputCard
                          editable={isEditable}
                          title={'Health Description'}
                          placeholder={'Health Description'}
                          value={values.healthDescription}
                          name={'healthDescription'}
                          updateFields={text => setValues({ ...values, ...text })}
                        />
                      ) : null}
                      <View style={{ gap: verticalScale(10) }}>
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
                              style={styles.checkBox}
                              onPress={() =>
                                setValues({ ...values, vehicleNumber: 'Yes' })
                              }>
                              {values.vehicleNumber === 'Yes' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                              style={styles.checkBox}
                              onPress={() =>
                                setValues({ ...values, vehicleNumber: 'No' })
                              }>
                              {values.vehicleNumber === 'No' ||
                                values.vehicleNumber === 'no' ? (
                                <Icon
                                  name={'check'}
                                  size={15}
                                  color={colors.black}
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
                      {values.vehicleNumber === 'Yes' ||
                        values.vehicleNumber === 'yes' ? (
                        <InputCard
                          editable={isEditable}
                          title={'Vehicle Description'}
                          placeholder={'Vehicle Description'}
                          value={values.vehicleDescription}
                          name={'vehicleDescription'}
                          updateFields={text => setValues({ ...values, ...text })}
                        />
                      ) : null}
                    </View>

                    {/* parents details  */}
                    <Section_Header title={"Parent's/Guardian Details"} />
                    <View style={styles.section}>
                      <InputCard
                        editable={isEditable}
                        title={'Father Name'}
                        placeholder={'Father Name'}
                        value={values.fatherName}
                        name={'fatherName'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.fatherName && touched.fatherName
                            ? errors.fatherName
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Occupation'}
                        placeholder={'Father Occupation'}
                        value={values.fatherOccupation}
                        name={'fatherOccupation'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.fatherOccupation && touched.fatherOccupation
                            ? errors.fatherOccupation
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Mother Name'}
                        placeholder={'Mother Name'}
                        value={values.motherName}
                        name={'motherName'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.motherName && touched.motherName
                            ? errors.motherName
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Mother`s Occupation'}
                        placeholder={'Mother Occupation'}
                        value={values.motherOccupation}
                        name={'motherOccupation'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.motherOccupation && touched.motherOccupation
                            ? errors.motherOccupation
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Father Mobile Number'}
                        placeholder={'Father Mobile Number'}
                        value={values.parentsPhone1}
                        name={'parentsPhone1'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        maxLength={10}
                        keyboardType={'number-pad'}
                        error={
                          errors.parentsPhone1 && touched.parentsPhone1
                            ? errors.parentsPhone1
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Mother Mobile Number'}
                        placeholder={'Mother Mobile Number'}
                        value={values.parentsPhone2}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        maxLength={10}
                        keyboardType={'decimal-pad'}
                        name={'parentsPhone2'}
                        error={
                          errors.parentsPhone2 && touched.parentsPhone2
                            ? errors.parentsPhone2
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Parent Email'}
                        placeholder={'Parent Email'}
                        value={values.parentsEmail}
                        name={'parentsEmail'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                      />

                      <InputCard
                        editable={isEditable}
                        title={'Pincode No'}
                        placeholder={'Pincode No'}
                        value={values.pincode}
                        name={'pincode'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        onPincodeComplete={text =>
                          handlePincodeValidation(text, 'pincode', setValues)
                        }
                        maxLength={6}
                        keyboardType={'numeric'}
                        error={
                          errors.pincode && touched.pincode
                            ? errors.pincode
                            : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="Country"
                        placeholder="Country"
                        name={'country'}
                        value={values.country}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={Country}
                        onCountrySelect={text =>
                          handleCountryValidation(text, 'country')
                        }
                        error={
                          errors.country && touched.country
                            ? errors.country
                            : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="State"
                        placeholder="State"
                        name={'state'}
                        value={values.state}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={state}
                        onSateSelect={text =>
                          handleStateValidation(values.country, text, 'state')
                        }
                        error={
                          errors.state && touched.state ? errors.state : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="District"
                        placeholder="District"
                        name={'district'}
                        value={values.district}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={district}
                        error={
                          errors.district && touched.district
                            ? errors.district
                            : null
                        }
                      />

                      <InputCard
                        editable={isEditable}
                        title={'Address'}
                        placeholder={'House No, Street, Landmark,City'}
                        value={values.parentsAddress}
                        name={'parentsAddress'}
                        multiline={true}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.parentsAddress && touched.parentsAddress
                            ? errors.parentsAddress
                            : null
                        }
                      />
                    </View>

                    {/* guardian details  */}
                    <Section_Header title={'GUARDIAN DETAILS'} />
                    <View style={styles.section}>
                      <InputCard
                        editable={isEditable}
                        title={'Guardian Name'}
                        placeholder={'Guardian Name'}
                        value={values.guardianName}
                        name={'guardianName'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.guardianName && touched.guardianName
                            ? errors.guardianName
                            : null
                        }
                      />
                      <InputCard
                        editable={isEditable}
                        title={'Contact Number '}
                        placeholder={'Contact Number'}
                        value={values.guardianNumber}
                        name={'guardianNumber'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        maxLength={10}
                        error={
                          errors.guardianNumber && touched.guardianNumber
                            ? errors.guardianNumber
                            : null
                        }
                      />

                      <InputCard
                        editable={isEditable}
                        title={'Pincode '}
                        placeholder={'Pincode'}
                        value={values.guardianPincode}
                        name={'guardianPincode'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        onPincodeComplete={text =>
                          handlePincodeValidation(
                            text,
                            'guardianPincode',
                            setValues,
                          )
                        }
                        maxLength={6}
                        keyboardType={'numeric'}
                        error={
                          errors.guardianPincode && touched.guardianPincode
                            ? errors.guardianPincode
                            : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="Country"
                        placeholder="Country"
                        name={'guardianCountry'}
                        value={values.guardianCountry}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={guardianCountry}
                        onCountrySelect={text =>
                          handleCountryValidation(text, 'guardianCountry')
                        }
                        error={
                          errors.guardianCountry && touched.guardianCountry
                            ? errors.guardianCountry
                            : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="State"
                        placeholder="State"
                        name={'guardianState'}
                        value={values.guardianState}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={guardianState}
                        onSateSelect={text =>
                          handleStateValidation(
                            values.country,
                            text,
                            'guardianState',
                          )
                        }
                        error={
                          errors.guardianState && touched.guardianState
                            ? errors.guardianState
                            : null
                        }
                      />

                      <AutoSuggestInputCard
                        editable={isEditable}
                        title="District"
                        placeholder="District"
                        name={'guardianDistrict'}
                        value={values.guardianDistrict}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        suggestions={guardianDistrict}
                        error={
                          errors.guardianDistrict && touched.guardianDistrict
                            ? errors.guardianDistrict
                            : null
                        }
                      />

                      <InputCard
                        editable={isEditable}
                        multiline={true}
                        title={'Address'}
                        placeholder={
                          'House No,Street,Landmark,City,State,Pincode'
                        }
                        value={values.guardianAddress}
                        name={'guardianAddress'}
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.guardianAddress && touched.guardianAddress
                            ? errors.guardianAddress
                            : null
                        }
                      />
                    </View>

                    {/* DOCUMETNS  */}
                    <Section_Header title={'DOCUMENTS'} />
                    <View style={[styles.section, { alignItems: 'center' }]}>
                      {/* aadhare docs  */}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          marginBottom: 10,
                        }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                          {isEditable ? (
                            <>
                              <TouchableOpacity
                                style={styles.noImage}
                                onPress={() =>
                                  handleImage(
                                    setValues,
                                    'aadhareFront',
                                    400,
                                    300,
                                  )
                                }>
                                <MaterialCommunityIcons
                                  name="cloud-upload-outline"
                                  size={20}
                                  color="black"
                                />
                                <Text
                                  style={{ color: colors.grey, fontSize: 10 }}>
                                  Upload Aadhar Front
                                </Text>
                              </TouchableOpacity>
                              {values.aadhareFront && (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.aadhareFront)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ) : // If not editable and value exists, show the image
                            values.aadhareFront ? (
                              <Image
                                source={{ uri: values.aadhareFront }}
                                style={styles.imageStyle}
                              />
                            ) : null}
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                          {isEditable ? (
                            <>
                              <TouchableOpacity
                                style={styles.noImage}
                                onPress={() =>
                                  handleImage(
                                    setValues,
                                    'aadhareBack',
                                    400,
                                    300,
                                  )
                                }>
                                <MaterialCommunityIcons
                                  name="cloud-upload-outline"
                                  size={20}
                                  color="black"
                                />
                                <Text
                                  style={{ color: colors.grey, fontSize: 10 }}>
                                  Upload Aadhar Back
                                </Text>
                              </TouchableOpacity>
                              {values.aadhareBack && (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.aadhareBack)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ) : // If not editable and value exists, show the image
                            values.aadhareBack ? (
                              <Image
                                source={{ uri: values.aadhareBack }}
                                style={styles.imageStyle}
                              />
                            ) : null}
                        </View>
                      </View>

                      {/* sign docs  */}
                      <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                          {isEditable ? (
                            <>
                              <TouchableOpacity
                                style={styles.noImage}
                                onPress={() =>
                                  handleImage(
                                    setValues,
                                    'candidateSing',
                                    400,
                                    300,
                                  )
                                }>
                                <MaterialCommunityIcons
                                  name="cloud-upload-outline"
                                  size={20}
                                  color="black"
                                />
                                <Text
                                  style={{ color: colors.grey, fontSize: 10 }}>
                                  Upload Aadhar Front
                                </Text>
                              </TouchableOpacity>
                              {values.candidateSing && (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.candidateSing)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ) : values.candidateSing ? (
                            <Image
                              source={{ uri: values.candidateSing }}
                              style={styles.imageStyle}
                            />
                          ) : null}
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                          {isEditable ? (
                            <>
                              <TouchableOpacity
                                style={styles.noImage}
                                onPress={() =>
                                  handleImage(setValues, 'parentSing', 400, 300)
                                }>
                                <MaterialCommunityIcons
                                  name="cloud-upload-outline"
                                  size={20}
                                  color="black"
                                />
                                <Text
                                  style={{ color: colors.grey, fontSize: 10 }}>
                                  Upload Aadhar Back
                                </Text>
                              </TouchableOpacity>
                              {values.parentSing && (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '90%',
                                    height: 30,
                                  }}
                                  onPress={() =>
                                    handleImageView(values.parentSing)
                                  }>
                                  <MaterialCommunityIcons
                                    name="file-image"
                                    size={20}
                                    color={colors.green}
                                  />
                                  <Text
                                    style={{
                                      color: colors.black,
                                      marginLeft: 10,
                                    }}>
                                    View
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ) : // If not editable and value exists, show the image
                            values.parentSing ? (
                              <Image
                                source={{ uri: values.parentSing }}
                                style={styles.imageStyle}
                              />
                            ) : null}
                        </View>
                      </View>

                      <TouchableHighlight
                        onPress={() => handleDocDownload(studentData?.id)}
                        style={{
                          backgroundColor: colors.red,
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Icon
                          name={'download'}
                          color={colors.white}
                          size={20}
                        />
                      </TouchableHighlight>
                    </View>

                    {/* OTHERS */}
                    <Section_Header title={'OTHERS'} />
                    <View style={styles.section}>
                      <InputCard
                        editable={isEditable}
                        title={'Admin Notes'}
                        placeholder={'Admin notes'}
                        value={values.remark}
                        name={'remark'}
                        multiline={true} // Enable multiline input
                        numberOfLines={4} // Adjust the visible lines
                        updateFields={text => {
                          setValues({ ...values, ...text });
                        }}
                        error={
                          errors.remark && touched.remark ? errors.remark : null
                        }
                      />
                    </View>

                    {/* discailmer details  */}
                    <Section_Header title={'DISCLAIMER'} />
                    <View style={styles.section}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: horizontalScale(10),
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setIsDeclare(!isDeclare);
                          }}
                          style={{
                            marginTop: verticalScale(4),
                            height: verticalScale(20),
                            width: verticalScale(20),
                            borderRadius: 4,
                            backgroundColor: isDeclare
                              ? `${colors.navy}90`
                              : colors.white,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {isDeclare === true ? (
                            <Icon
                              name={'check'}
                              size={15}
                              color={colors.white}
                            />
                          ) : null}
                        </TouchableOpacity>
                        <Text style={[styles.textstyle, { color: colors.black }]}>
                          I DECLARE THAT THE INFORMATION GIVEN ABOVE IS TRUE TO
                          THE BEST OF MY KNOWLEDGE. I AGREE THAT IF ANY
                          INFORMATION FURNISHED ABOVE FOUND INCORRECT MY
                          ADMISSION IS LIABLE TO BE CANCELLED.
                        </Text>
                      </View>
                    </View>

                    {mode && <View style={{ height: 100 }} />}

                    {mode !== 'request' && (
                      <View style={styles.section}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            height: verticalScale(50),
                            width: '100%',
                            backgroundColor: colors.darkgrey,
                            paddingHorizontal: horizontalScale(20),
                            alignItems: 'center',
                            gap: 5,
                          }}
                          onPress={() => {
                            alertMessage('File not Found!')
                            // termsAndConditionspdfResponse?.response?.rules_file
                            //   ? navigation.navigate('Pdf_Screen', {
                            //       PDF_URL:
                            //         termsAndConditionspdfResponse?.response
                            //           ?.rules_file,
                            //       title: 'Rules And Regulation',
                            //     })
                            //   : alertMessage('File not Found!');
                          }}>
                          <Text style={styles.buttonText}>
                            Rules And Regulation
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* buttons  */}
                    {!mode && (
                      <View
                        style={[
                          styles.section,
                          { paddingBottom: verticalScale(50) },
                        ]}>
                        <View
                          style={[
                            styles.section,
                            {
                              flexDirection: 'row',
                              justifyContent: 'center',
                              marginBottom: 55,
                            },
                          ]}>
                          <SubmitButton
                            handlePress={() =>
                              handleDownloadReg(studentData?.id)
                            }
                            title={'Download'}
                          />
                          <SubmitButton
                            title={'Share'}
                            studentId={studentData?.id}
                            handlePress={() => {
                              toggleModal();
                            }}
                          />
                          <SubmitButton
                            title={'Edit'}
                            handlePress={handlePress}
                            backgroundColor={'#999966'}
                          />
                          {isEditable && (
                            <SubmitButton
                              title={'Update'}
                              handlePress={handleSubmit}
                              backgroundColor={'#999966'}
                              disabled={!isDeclare}
                            />
                          )}
                        </View>
                        <RegMultiDate
                          isVisible={regmultiDateRef}
                          multiDate={studentData?.registrationsDate}
                          onClose={() => setRegMultiDateRef(!regmultiDateRef)}
                        />
                      </View>
                    )}
                  </>
                )}
              />
            );
          }}
        </Formik>
      </View>
      <ViewImage_Modal
        isVisible={imageModal}
        onClose={() => setImageModal(false)}
        imageURL={imageUri}
      />
      <Share_Modal
        isVisible={isModalVisible}
        studentId={studentData?.id}
        onClose={toggleModal}
      />
    </BottomSheetModalProvider>
  );
};

export default Registarion_View;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: verticalScale(60),
    paddingTop: 45,
  },
  section: {
    padding: horizontalScale(12),
    gap: verticalScale(12),
    width: '100%',
  },
  sectionHeader: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#4c4747',
  },
  submitButton: {
    height: verticalScale(40),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.AppDefaultColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(4),
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    fontSize: moderateScale(14),
  },
  chip: {
    height: verticalScale(170),
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    padding: horizontalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 5,
  },
  flexRowWithGap: {
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  title: {
    fontSize: moderateScale(22),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  right: {
    width: '30%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  checkBox: {
    height: verticalScale(20),
    width: verticalScale(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightygrey,
  },
  ImgageCard: {
    height: verticalScale(250),
    width: horizontalScale(180),
    borderRadius: 10,
    backgroundColor: colors.lightygrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomDetails: {
    position: 'absolute',
    height: verticalScale(50),
    width: '100%',
    backgroundColor: `${colors.darkgrey}80`,
    bottom: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#dc3545',
    // position: 'absolute',
    // bottom: verticalScale(120),
    borderRadius: 40,
    width: verticalScale(50),
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textstyle: {
    fontSize: moderateScale(14),
    color: colors.white,
    fontFamily: 'Roboto-Medium',
  },
  pdf: {
    // flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    width: '90%',
    height: 100,
  },
  noImage: {
    width: '90%',
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.grey,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
