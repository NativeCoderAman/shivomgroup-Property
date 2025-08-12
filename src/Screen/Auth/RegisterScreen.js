import React, {memo, useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import {colors} from '../../Utils/Colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import {
  checkBusinessNameThunkApi,
  checkBusinessEmailThunkApi,
  checkBusinessMobileThunkApi,
  businessRegisterThunkAPI,
} from '../../Service/api/thunks';
import {
  getDistrictDataThunkApi,
  getPincodeThunkApi,
  getStateDataThunkApi,
} from '../../Service/slices/tenant/tenantReferVerifySlice';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import Loader from '../../Utils/Loader';
import {createImageUploadThunkApi} from '../../Service/slices/RegisterSlice';

const validationSchemas = [
  Yup.object().shape({
    businessType: Yup.string().required('Business Type is required'),
    logo: Yup.string().required('Logo image is required'),
    date: Yup.string().required('Date is required'),
    businessName: Yup.string().required('Business Name is required'),
    businessId: Yup.string()
      .required('Business ID is required')
      .oneOf(['GST Number', 'PAN Number'], 'Invalid Business ID'),
    businessNumber: Yup.string()
      .required('Business Number is required')
      .when('businessId', {
        is: 'GST Number',
        then: schema =>
          schema.matches(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
            'Invalid GST Number format. Example: 22AAAAA0000A1Z5',
          ),
      })
      .when('businessId', {
        is: 'PAN Number',
        then: schema =>
          schema.matches(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            'Invalid PAN Number format. Example: ABCDE1234F',
          ),
      }),
    pincode: Yup.string().required('Pincode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    district: Yup.string().required('District is required'),
    address: Yup.string().required('Address is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email!').required('Email is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^[0-9]{10}$/, 'Invalid mobile number'),
    alternateMobileNumber: Yup.string().matches(
      /^[0-9]{10}$/,
      'Invalid alternate mobile number',
    ),
  }),
  Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must not exceed 20 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character (@$!%*?&)',
      ),

    confirm_password: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Passwords must match') // Ensure it matches the password field
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must not exceed 20 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least one special character (@$!%*?&)',
      ),
  }),
];

const RegisterScreen = memo(({navigation}) => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);

  const [availableFields, setAvailableFields] = useState([
    {key: 'GST Number', value: 'gstcertificate'},
    {key: 'PAN Number', value: 'pancard'},
    {key: 'MSME', value: 'msmeDoc'},
    {key: 'Business License', value: 'businesscertificate'},
    {key: 'Others', value: 'other_doc'},
  ]);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [samevalue, setSamevalue] = useState({
    name: false,
    email: false,
    mobile: false,
  });
  const [showAddress, setAddressShow] = useState({
    country: false,
    state: false,
    district: false,
  });
  const [showAddressList, setAddressShowList] = useState({
    country: false,
    state: false,
    district: false,
  });
  const [loading, setLoading] = useState(false);

  const initialValues = {
    businessType: '',
    logo: '',
    date: '',

    businessName: '',
    businessId: '',
    businessNumber: '',

    pincode: '',
    district: '',
    state: '',
    country: '',
    address: '',

    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    alternateMobileNumber: '',

    ruleRegulation: '',
    stamp: '',

    gstcertificate: '',
    pancard: '',
    msmeDoc: '',
    businesscertificate: '',
    other_doc: '',

    password: '',
    confirm_password: '',
  };

  const getBusinessNumberPlaceholder = businessId => {
    switch (businessId) {
      case 'GST Number':
        return 'Enter GST Number';
      case 'PAN Number':
        return 'Enter PAN Number';
      case 'MSME':
        return 'Enter MSME Number';
      case 'Business Licenses':
        return 'Enter Business License Number';
      default:
        return 'Enter Business Number';
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date, setFieldValue) => {
    setFieldValue('date', date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const [logoImageResponse, setlogoImageResponse] = useState('');
  const [stampImageResponse, setstampImageResponse] = useState('');


  const handleImageUpload = async (field, setFieldValue, id) => {
    try {
      if (field === 'logo' || field === 'stamp') {
        // Image Upload
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          mediaType: 'photo',
        });
        setFieldValue(field, image.path);

        await handleImageUploadServer({
          uri: image.path,
          type: image.mime,
          name:
            field === 'logo'
              ? `userslogo${image.modificationDate}`
              : `stamplogo${image.modificationDate}`,
        });
      } else {
        // PDF Upload
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
        });
        if (id) {
          setDynamicFields(prev =>
            prev.map(field =>
              field.id === id
                ? {...field, [`doc_value_${id}`]: res[0].uri}
                : field,
            ),
          );
        } else {
          setFieldValue(field, res[0].uri);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddField = () => {
    if (dynamicFields.length >= 5) {
      alert('You can add a maximum of 5 fields.');
      return;
    }

    const newId = dynamicFields.length + 1;
    const newField = {
      id: newId,
      [`doc_name_${newId}`]: '',
      [`doc_value_${newId}`]: '',
    };

    setDynamicFields(prev => [...prev, newField]);
  };

  const handleRemoveField = id => {
    setDynamicFields(prev => {
      const removedField = prev.find(field => field.id === id);
      if (removedField && removedField.type) {
        setAvailableFields(prevFields => [...prevFields, removedField.type]);
      }
      return prev.filter(field => field.id !== id);
    });
  };

  const handleFieldTypeChange = (id, name) => {
    setDynamicFields(prev =>
      prev.map(field =>
        field.id === id
          ? {...field, [`doc_name_${id}`]: name, [`doc_value_${id}`]: ''}
          : field,
      ),
    );
  };

  const Section_Header = ({title}) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={{fontSize: 16, color: colors.white}}>{title}</Text>
      </View>
    );
  };

  const passwordValidation = {
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    length: false,
  };
  const [password, setPassword] = useState(passwordValidation);
  const validatePassword = passwordInput => {
    const newPasswordStatus = {...passwordValidation};

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(passwordInput);
    const hasLowerCase = /[a-z]/.test(passwordInput);
    const hasNumber = /[0-9]/.test(passwordInput);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordInput);

    newPasswordStatus.uppercase = hasUpperCase;
    newPasswordStatus.lowercase = hasLowerCase;
    newPasswordStatus.number = hasNumber;
    newPasswordStatus.specialChar = hasSpecialChar;
    newPasswordStatus.length = passwordInput.length >= minLength;
    passwordToggle(newPasswordStatus);
  };

  const passwordToggle = newPasswordStatus => {
    setPassword(newPasswordStatus);
  };

  const handleNameCheking = async name => {
    const response = await dispatch(checkBusinessNameThunkApi(name));
    if (response?.payload?.message == 'This Business Name is already in use') {
      setSamevalue(prevValues => ({
        ...prevValues,
        name: true,
      }));
    } else {
      setSamevalue(prevValues => ({
        ...prevValues,
        name: false,
      }));
    }
  };
  const handleEmailCheking = async email => {
    const response = await dispatch(checkBusinessEmailThunkApi(email));
    if (response?.payload?.message == 'This Email is already in use') {
      setSamevalue(prevValues => ({
        ...prevValues,
        email: true,
      }));
    } else {
      setSamevalue(prevValues => ({
        ...prevValues,
        email: false,
      }));
    }
  };
  const handleMobileCheking = async mobile => {
    const response = await dispatch(checkBusinessMobileThunkApi(mobile));

    response.payload;
    if (response?.payload?.message == 'This Mobile No. is already in use') {
      setSamevalue(prevValues => ({
        ...prevValues,
        mobile: true,
      }));
    } else {
      setSamevalue(prevValues => ({
        ...prevValues,
        mobile: false,
      }));
    }
  };

  const handlePincodeChange = async (text, setValues) => {
    if (text.length === 6) {
      try {
        const response = await dispatch(getPincodeThunkApi({pinno: text}));
        if (
          response?.payload?.status === true &&
          response?.payload?.statusCode === 200
        ) {
          const {country, district, state} = response?.payload?.data;
          setValues(prevValues => ({
            ...prevValues,
            district: district,
            state: state,
            country: country,
          }));
          setAddressShow({country: true, state: true, district: true});
        } else if (
          response?.payload?.status === true &&
          response?.payload?.statusCode === 404
        ) {
          setValues(prevValues => ({
            ...prevValues,
            district: '',
            state: '',
            country: '',
          }));
          setCountryList(response?.payload?.data?.uniqueCountries);
          setAddressShow({country: true, state: false, district: false});
          setAddressShowList({country: true, state: true, district: true});
        } else {
        }
      } catch (error) {}
    }
  };

  const handleCountryChange = async values => {
    try {
      const response = await dispatch(
        getStateDataThunkApi({countryName: values}),
      );
      if (response.payload.status === true) {
        setStateList(response?.payload?.data?.uniqueStates);
        setAddressShow({country: true, state: true, district: false});
      }
    } catch (error) {}
  };
  const handleStateChange = async values => {
    try {
      const response = await dispatch(
        getDistrictDataThunkApi({countryName: 'INDIA', stateName: values}),
      );
      if (response.payload.status === true) {
        setDistrictList(response?.payload?.data?.uniqueDistricts);
        setAddressShow({country: true, state: true, district: true});
      }
    } catch (error) {}
  };

  const handleImageUploadServer = async ({uri, type, name}) => {
    const formData = new FormData();
    setLoading(true);
    try {
      // if (logoImage || stampImage) {
      //   const deleteResponse = await handleDeleteImage(
      //     fieldName,
      //     uploadImage[fieldName],
      //   );
      // }
      if (uri !== '') {
        formData.append('image', {
          uri: uri,
          type: type,
          name: name,
        });

        const response = await dispatch(
          createImageUploadThunkApi({data: formData}),
        );
        if (response.payload.status === true) {
          const uploadedFilename = response.payload.data.fileName;
          const imagetype = name.slice(0, 5);
          if (imagetype === 'users') {
            setlogoImageResponse(uploadedFilename);
          } else {
            setstampImageResponse(uploadedFilename);
          }
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    const formData = new FormData();

    // Append text fields to FormData
    formData.append('business_type', values.businessType);
    if (values.logo && logoImageResponse !== '') {
      formData.append('userUploadImg', logoImageResponse);
    } else {
      alert('Upload logo image.');
      return;
    }
    formData.append('regDate', values.date);

    formData.append('businessName', values.businessName);
    formData.append('businessIdName', values.businessId);
    formData.append('businessIdValue', values.businessNumber);

    formData.append('addressPincode', values.pincode);
    formData.append('district', values.district);
    formData.append('state', values.state);
    formData.append('country', values.country);
    formData.append('address', values.address);

    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('businessEmail', values.email);
    formData.append('businessMobileNumber', values.mobileNumber);
    formData.append('businessAlternetMobileNo', values.alternateMobileNumber);

    formData.append('isPasswordSkip', 0);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.confirm_password);

    // ✅ Append Documents (if exists)
    if (values.ruleRegulation !== '') {
      formData.append('rulesAndRegulationsDoc', {
        uri: values.ruleRegulation,
        type: 'application/pdf',
        name: `rulesAndRegulationsDoc.pdf`,
      });
    }
    if (values.stamp && stampImageResponse !== '') {
      formData.append('stampWithSignatureDoc', stampImageResponse);
    } else {
      alert('Upload logo image.');
      return;
    }

    // ✅ Append PDF files from `dynamicFields`
    dynamicFields.forEach(item => {
      // Check if any value (except 'id') is empty
      const hasEmptyValue = Object.keys(item).some(
        key => key !== 'id' && item[key].trim() === '',
      );

      if (!hasEmptyValue) {
        Object.keys(item).forEach(key => {
          if (key !== 'id') {
            const fileData = item[key];

            // Check if the value is a file (PDF)
            if (fileData.startsWith('content://')) {
              formData.append(key, {
                uri: fileData,
                type: 'application/pdf',
                name: `${key}.pdf`,
              });
            } else {
              formData.append(key, fileData);
            }
          }
        });
      }
    });


    try {
      setLoading(true);
      const response = await dispatch(businessRegisterThunkAPI(formData));

      if (response?.payload?.statusCode === 200) {
        alert('Business registration successful.');
        navigation.goBack();
      } else if (response?.payload?.statusCode === 422) {
        alert('Failed to register business. Validation errors occurred.');
      } else {
        alert('Failed to register business.');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const DropdownListPicker = ({dataList, onSelect}) => {
    return (
      <FlatList
        data={dataList}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Text style={styles.suggestionItem}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.suggestionList}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true} // Show vertical scroll indicator
        nestedScrollEnabled={true} // Enable nested scrolling
      />
    );
  };

  const StepOne = ({
    values,
    handleChange,
    errors,
    touched,
    setFieldValue,
    setValues,
  }) => (
    <>
      {/* Business Type Dropdown */}
      <View style={styles.inputContainer}>
        <View
          style={{
            borderColor: colors.darkgray,
            borderWidth: 0.5,
            borderRadius: 5,
          }}>
          <Picker
            selectedValue={values.businessType}
            onValueChange={itemValue =>
              setFieldValue('businessType', itemValue)
            }
            style={styles.picker}>
            <Picker.Item label="Select Business" value="" />
            <Picker.Item label="Girls Hostel" value="Girls Hostel" />
            <Picker.Item label="Boys Hostel" value="Boys Hostel" />
            <Picker.Item label="Girls PG" value="Girls PG" />
            <Picker.Item label="Boys PG" value="Boys PG" />
            <Picker.Item label="Co-living Hostel" value="Co living Hostel" />
            <Picker.Item label="Co-living PG" value="Co living PG" />
            <Picker.Item label="Studio Rooms" value="Studio Rooms" />
            <Picker.Item label="Student Housing" value="Student Housing" />
          </Picker>
        </View>
        {touched.businessType && errors.businessType && (
          <Text style={styles.errorText}>{errors.businessType}</Text>
        )}
      </View>

      <Pressable
        style={styles.inputContainer}
        onPress={() => handleImageUpload('logo', setFieldValue)}>
        <TextInput
          editable={false}
          placeholder="Logo (Upload image)"
          style={styles.input}
          value={values.logo}
        />
        <View style={styles.iconView}>
          <Icon name="cloud-upload-outline" size={20} color={colors.black} />
        </View>
      </Pressable>
      {touched.logo && errors.logo && (
        <Text style={styles.errorText}>{errors.logo}</Text>
      )}

      {/* Display Uploaded Image */}
      {values.logo ? (
        <Image
          source={{uri: values.logo}}
          style={{
            width: 100,
            height: 100,
            marginTop: 10,
            borderRadius: 5,
          }}
          resizeMode="contain"
        />
      ) : null}

      <Pressable style={styles.inputContainer} onPress={showDatePicker}>
        <TextInput
          editable={false}
          placeholder="Date"
          style={styles.input}
          value={values.date}
        />
        <View style={styles.iconView}>
          <Icon name="calendar-today" size={20} color={colors.black} />
        </View>
      </Pressable>
      {touched.date && errors.date && (
        <Text style={styles.errorText}>{errors.date}</Text>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={date => handleConfirm(date, setFieldValue)}
        onCancel={hideDatePicker}
      />

      <Section_Header title={'Business Detail'} />

      {/* Business Name */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Business Name"
          style={styles.input}
          onChangeText={text => {
            // Sanitize input: allow only letters and spaces
            const sanitizedText = text.replace(/[^A-Za-z ]/g, '');
            // Update Formik's value
            setFieldValue('businessName', sanitizedText);
          }}
          onBlur={() => handleNameCheking(values.businessName)}
          value={values.businessName}
        />
        {touched.businessName && errors.businessName && (
          <Text style={styles.errorText}>{errors.businessName}</Text>
        )}
      </View>

      {samevalue.name && (
        <View style={styles.existview}>
          <Text style={styles.existtext}>
            This Business Name is already taken!.
          </Text>
        </View>
      )}

      {/* Business ID Dropdown */}
      <View style={styles.inputContainer}>
        <View
          style={{
            borderColor: colors.darkgray,
            borderWidth: 0.5,
            borderRadius: 5,
          }}>
          <Picker
            selectedValue={values.businessId}
            onValueChange={itemValue => setFieldValue('businessId', itemValue)}
            style={styles.picker}>
            <Picker.Item label="Business ID" value="" />
            <Picker.Item label="GST Number" value="GST Number" />
            <Picker.Item label="PAN Number" value="PAN Number" />
            <Picker.Item label="MSME" value="MSME" />
            <Picker.Item label="Business License" value="Business License" />
          </Picker>
        </View>
        {touched.businessId && errors.businessId && (
          <Text style={styles.errorText}>{errors.businessId}</Text>
        )}
      </View>

      {/* Business Number */}
      {values.businessId !== '' && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={getBusinessNumberPlaceholder(values.businessId)}
            style={styles.input}
            onChangeText={handleChange('businessNumber')}
            value={values.businessNumber}
          />
          {touched.businessNumber && errors.businessNumber && (
            <Text style={styles.errorText}>{errors.businessNumber}</Text>
          )}
        </View>
      )}

      {/* Pincode */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Pincode"
          style={styles.input}
          onChangeText={text => {
            setFieldValue('pincode', text);
            if (text.length === 6) {
              handlePincodeChange(text, setValues);
            }
          }}
          value={values.pincode}
          keyboardType="numeric"
          maxLength={6}
        />
        {touched.pincode && errors.pincode && (
          <Text style={styles.errorText}>{errors.pincode}</Text>
        )}
      </View>

      {/* country */}
      {showAddress.country && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Country"
            style={styles.input}
            onChangeText={handleChange('country')}
            value={values.country}
            // onFocus={() => {
            //   setAddressShowList(prev => ({...prev, country: true}));
            // }}
          />
          {touched.country && errors.country && (
            <Text style={styles.errorText}>{errors.country}</Text>
          )}
        </View>
      )}

      {/* Suggestions Dropdown */}
      {countryList.length > 0 && showAddressList.country && (
        <DropdownListPicker
          dataList={countryList}
          onSelect={value => {
            setFieldValue('country', value);
            handleCountryChange(value);
            setAddressShowList(prev => ({...prev, country: false}));
          }}
        />
      )}

      {/* state */}
      {showAddress.state && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="State"
            style={styles.input}
            onChangeText={handleChange('state')}
            value={values.state}
          />
          {touched.state && errors.state && (
            <Text style={styles.errorText}>{errors.state}</Text>
          )}
        </View>
      )}

      {stateList.length > 0 && showAddressList.state && (
        <DropdownListPicker
          dataList={stateList}
          onSelect={value => {
            setFieldValue('state', value);
            handleStateChange(value);
            setAddressShowList(prev => ({...prev, state: false}));
          }}
        />
      )}

      {/* district */}
      {showAddress.district && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="District"
            style={styles.input}
            onChangeText={handleChange('district')}
            value={values.district}
          />
          {touched.district && errors.district && (
            <Text style={styles.errorText}>{errors.district}</Text>
          )}
        </View>
      )}

      {districtList.length > 0 && showAddressList.district && (
        <DropdownListPicker
          dataList={districtList}
          onSelect={value => {
            setFieldValue('district', value);
            setAddressShowList(prev => ({...prev, district: false}));
          }}
        />
      )}

      {/* address */}
      {showAddress.district && (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Address"
            style={styles.input}
            onChangeText={handleChange('address')}
            value={values.address}
          />
          {touched.address && errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>
      )}

      <Section_Header title={'Personal Details'} />

      {/* First Name */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First Name"
          style={styles.input}
          onChangeText={handleChange('firstName')}
          value={values.firstName}
        />
        {touched.firstName && errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
      </View>

      {/* Last Name */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          onChangeText={handleChange('lastName')}
          value={values.lastName}
        />
        {touched.lastName && errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={handleChange('email')}
          onBlur={() => handleEmailCheking(values.email)}
          value={values.email}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={50}
        />
        {touched.email && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      {samevalue.email && (
        <View style={styles.existview}>
          <Text style={styles.existtext}>
            Given email address is already exist.
          </Text>
          <View style={styles.existbutton}>
            <TouchableOpacity
              style={styles.existbuttontab}
              onPress={() => navigation.goBack()}>
              <Text style={styles.existtext}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSamevalue(prevValues => ({
                  ...prevValues,
                  email: false,
                }))
              }
              style={[styles.existbuttontab, {marginLeft: 10}]}>
              <Text style={styles.existtext}>New Business</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mobile Number */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mobile Number"
          style={styles.input}
          onChangeText={handleChange('mobileNumber')}
          onBlur={() => handleMobileCheking(values.mobileNumber)}
          value={values.mobileNumber}
          keyboardType="numeric"
          maxLength={10}
        />
        {touched.mobileNumber && errors.mobileNumber && (
          <Text style={styles.errorText}>{errors.mobileNumber}</Text>
        )}
      </View>

      {samevalue.mobile && (
        <View style={styles.existview}>
          <Text style={styles.existtext}>
            Given mobile number is already exist.
          </Text>
          <View style={styles.existbutton}>
            <TouchableOpacity
              style={styles.existbuttontab}
              onPress={() => navigation.goBack()}>
              <Text style={styles.existtext}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setSamevalue(prevValues => ({
                  ...prevValues,
                  mobile: false,
                }))
              }
              style={[styles.existbuttontab, {marginLeft: 10}]}>
              <Text style={styles.existtext}>New Business</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Alternate Mobile Number */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Alternate Mobile Number"
          style={styles.input}
          onChangeText={handleChange('alternateMobileNumber')}
          value={values.alternateMobileNumber}
          keyboardType="numeric"
          maxLength={10}
        />
        {touched.alternateMobileNumber && errors.alternateMobileNumber && (
          <Text style={styles.errorText}>{errors.alternateMobileNumber}</Text>
        )}
      </View>

      <Section_Header title={'Document Upload'} />

      {/* Alternate Mobile Number */}
      <Pressable
        style={styles.inputContainer}
        onPress={() => handleImageUpload('ruleRegulation', setFieldValue)}>
        <TextInput
          editable={false}
          placeholder="Rules & Regulations (Upload file)"
          style={styles.input}
          value={values.ruleRegulation}
        />
        <View style={styles.iconView}>
          <Icon name="cloud-upload-outline" size={20} color={colors.black} />
        </View>
      </Pressable>

      {/* Display Uploaded PDF Link */}
      {values.ruleRegulation ? (
        <TouchableOpacity
          onPress={() => Linking.openURL(values.ruleRegulation)}
          style={{marginTop: 10}}>
          <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
            View Uploaded PDF
          </Text>
        </TouchableOpacity>
      ) : null}

      <Pressable
        style={styles.inputContainer}
        onPress={() => handleImageUpload('stamp', setFieldValue)}>
        <TextInput
          editable={false}
          placeholder="Stamp With Signature (Upload image)"
          style={styles.input}
          value={values.stamp}
        />
        <View style={styles.iconView}>
          <Icon name="cloud-upload-outline" size={20} color={colors.black} />
        </View>
      </Pressable>

      {/* Dynamic Fields */}
      {dynamicFields.map(field => (
        <View key={field.id} style={styles.inputContainer}>
          <View
            style={{
              borderColor: colors.darkgray,
              borderWidth: 0.5,
              borderRadius: 5,
            }}>
            <Picker
              selectedValue={field[`doc_name_${field.id}`]}
              onValueChange={itemValue =>
                handleFieldTypeChange(field.id, itemValue, setFieldValue)
              }
              style={styles.picker}>
              <Picker.Item label="Select Field Type" value="" />
              {availableFields.map(fieldType => (
                <Picker.Item
                  key={fieldType.value}
                  label={fieldType.key}
                  value={fieldType.value}
                />
              ))}
            </Picker>
          </View>
          {field[`doc_name_${field.id}`] && (
            <Pressable
              style={styles.inputContainer}
              onPress={() => {
                const keyValue = field[`doc_name_${field.id}`];
                handleImageUpload(keyValue, setFieldValue, field.id);
              }}>
              <TextInput
                editable={false}
                placeholder={`Upload ${field[`doc_name_${field.id}`]}`}
                style={styles.input}
                value={field[`doc_value_${field.id}`]}
              />
              <View style={styles.iconView}>
                <Icon
                  name="cloud-upload-outline"
                  size={20}
                  color={colors.black}
                />
              </View>
            </Pressable>
          )}
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleRemoveField(field.id)}>
            <Icon name="delete" size={20} color={colors.red} />
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={() => handleAddField()}
        style={[
          styles.inputContainer,
          {
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: colors.orange,
          },
        ]}>
        <Icon name="plus" size={30} color={colors.black} />
      </Pressable>
    </>
  );

  const StepTwo = ({values, errors, touched, setFieldValue}) => (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={text => setFieldValue('password', text)}
          value={values.password}
        />
        {touched.password && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          onChangeText={text => setFieldValue('confirm_password', text)}
          value={values.confirm_password}
        />
        {touched.confirm_password && errors.confirm_password && (
          <Text style={styles.errorText}>{errors.confirm_password}</Text>
        )}
      </View>

      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            Example: Pass@123.
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="check"
            size={12}
            color={password.uppercase ? colors.green : colors.black}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            At least use one Uppercase letter.
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="check"
            size={12}
            color={password.lowercase ? colors.green : colors.black}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            At least use lowercase letter.
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="check"
            size={12}
            color={password.number ? colors.green : colors.black}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            At least use one digit.
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="check"
            size={12}
            color={password.specialChar ? colors.green : colors.black}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            At least use one special character.
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="check"
            size={12}
            color={password.length ? colors.green : colors.black}
          />
          <Text
            style={{
              color: colors.black,
              fontSize: 12,
              marginLeft: 5,
            }}>
            Password minimum length should be 8.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <View style={styles.card}>
          <Image
            source={require('../../Assets/Photos/logo.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[step - 1]}
            onSubmit={handleSubmit}>
            {({
              handleChange,
              setFieldValue,
              setValues,
              handleSubmit,
              values,
              errors,
              touched,
              validateForm,
              setTouched,
            }) => (
              <View>
                {step === 1 && (
                  <StepOne
                    values={values}
                    handleChange={handleChange}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    setValues={setValues}
                  />
                )}
                {step === 2 && (
                  <StepTwo
                    values={values}
                    handleChange={handleChange}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    setValues={setValues}
                  />
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  {step > 1 && (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {width: '45%', backgroundColor: '#333'},
                      ]}
                      onPress={() => setStep(step - 1)}>
                      <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                  )}
                  {step < 2 ? (
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={async () => {
                        // Mark only the current step's fields as touched
                        const touchedFields = Object.keys(
                          validationSchemas[step - 1].fields,
                        ).reduce((acc, field) => ({...acc, [field]: true}), {});

                        await setTouched(touchedFields);

                        validateForm().then(stepErrors => {
                          if (Object.keys(stepErrors).length === 0) {
                            setStep(step + 1);
                          }
                        });
                      }}>
                      <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.button, {width: '45%'}]}
                      onPress={handleSubmit}>
                      <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 20,
  },
  img: {
    alignSelf: 'center',
    width: '100%',
    height: 100,
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 5,
  },
  iconView: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.darkgray,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: colors.orange,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    backgroundColor: colors.white,
    padding: 10,
  },
  sectionHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.darkgrey,
  },
  suggestionList: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    overflow: 'hidden',
    maxHeight: 200,
  },
  suggestionItem: {
    padding: verticalScale(10),
    fontSize: moderateScale(14),
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey,
  },
  existview: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: colors.darkgray,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  existtext: {
    color: colors.black,
    fontSize: 12,
  },
  existbutton: {
    flexDirection: 'row',
  },
  existbuttontab: {
    backgroundColor: colors.orange,
    borderRadius: 10,
    padding: 5,
  },
});
