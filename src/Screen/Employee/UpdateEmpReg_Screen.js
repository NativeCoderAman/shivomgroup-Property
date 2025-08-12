import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Loader from '../../Utils/Loader';
import Header from '../../Components/headers/Header';
import {PickImage} from '../../Hooks/useImagePicker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {
  addEmployeeThunkAPI,
  getEmployesThunkAPI,
  updateEmployeesThunkAPI,
} from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
import {useDispatch, useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

const validationSchema = Yup.object().shape({
  // candidate_name: Yup.string().required('Candidate Name is required'),
  // email: Yup.string().required('Email is required'),
  // registration_date: Yup.date().required('Registration Date is required'),
  // mobile: Yup.string().required('Mobile Number is required'),
  // dob: Yup.string().required('Date Of Birth is required'),
  // aadharcard_no: Yup.string().required('Aadhar Number is required'),
  // blood_group: Yup.string().required('Blood Group is required'),
  // helth_issue: Yup.string().required('Health issue is required'),
  // helth_description: Yup.string().required('Health Description is required'),
  // marital_status: Yup.string().required('Marital Status is required'),
  // vehical_check: Yup.string().required('Vehical Status is required'),
  // vehical_no: Yup.string().required('Vehical Number is required'),
  // father_name: Yup.string().required('Father Name is required'),
  // current_address: Yup.string().required('Current Address is required'),
  // current_state: Yup.string().required('Current State is required'),
  // current_pincode: Yup.string().required('Current pincode is required'),
  // parmanent_address: Yup.string().required('Parmanent Address is required'),
  // parmanent_state: Yup.string().required('Parmanent State is required'),
  // parmanent_pincode: Yup.string().required('Parmanent pincode is required'),
  // bank_name: Yup.string().required('Bank Name is required'),
  // holder_name: Yup.string().required('Account Holder Name is required'),
  // Ifcs_code: Yup.string().required('IFSC code is required'),
  // account_no: Yup.string().required('Account number is required'),
  // designation: Yup.string().required('Designation is required'),
  // data: Yup.object().shape({
  //   monday: Yup.string().required('Start time is required'),
  // }),
});

const UpdateEmpReg_Screen = ({navigation, route}) => {
  const data = route?.params;
  const [isDeclare, setIsDeclare] = useState(true);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [regDatePickerVisible, setRegDatePickerVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const {generateUniqueEmpFormNoResponse} = useSelector(
    state => state.root.employeeData,
  );
  const dispatch = useDispatch();

  const [openPaymentPcr, setOpenPaymentPcr] = useState(false);
  const [value, setValue] = useState(null);
  const INITIAL_DATA = {
    form_no: data?.form_no,
    registration_date: data?.registration_date,
    candidate_name: data?.candidate_name,
    email: data?.email,
    mobile: data?.mobile,
    dob: data?.dob,
    aadharcard_no: data?.aadharcard_no,
    blood_group: data?.blood_group,
    helth_issue: data?.helth_issue,
    helth_description: data?.helth_description,
    marital_status: data?.marital_status,
    vehical_check: data?.vehical_check,
    vehical_no: data?.vehical_no,
    father_name: data?.father_name,
    current_address: data?.current_address,
    current_state: data?.current_state,
    current_pincode: data?.current_pincode,
    parmanent_address: data?.parmanent_address,
    parmanent_state: data?.parmanent_state,
    parmanent_pincode: data?.parmanent_pincode,
    bank_name: data?.bank_name,
    holder_name: data?.holder_name,
    Ifcs_code: data?.Ifcs_code,
    account_no: data?.account_no,
    companyDetails: [...data?.companyDetails],
    current_designation: data?.current_designation,
    current_department: data?.current_department,
    current_salary: data?.current_salary,
    candidate_signature: data?.candidate_signature,
    candidate_photo: data?.candidate_photo,
    aadhar_front: data?.aadhar_front,
    aadhar_back: data?.aadhar_back,
    experienceLatter: data?.experiece_letter,
    bankDetailPdf: data?.bank_doc,
    other_doc: data?.otherDocumets,
  };

  const handleSubmit = values => {
    var formdata = new FormData();
    formdata.append('form_no', String(values.form_no));
    formdata.append('registration_date', values.registration_date);
    formdata.append('candidate_name', values.candidate_name);
    formdata.append('email', values.email);
    formdata.append('mobile', values.mobile);
    formdata.append('dob', values.dob);
    formdata.append('aadharcard_no', values.aadharcard_no);
    formdata.append('blood_group', values.blood_group);
    formdata.append('helth_issue', values.helth_issue);
    formdata.append('helth_description', values.helth_description);
    formdata.append('marital_status', values.marital_status);
    formdata.append('vehical_check', values.vehical_check);
    formdata.append('vehical_no', values.vehical_no);
    formdata.append('father_name', values.father_name);
    formdata.append('current_address', values.current_address);
    formdata.append('current_state', values.current_state);
    formdata.append('current_pincode', values.current_pincode);
    formdata.append('parmanent_address', values.parmanent_address);
    formdata.append('parmanent_state', values.parmanent_state);
    formdata.append('parmanent_pincode', values.parmanent_pincode);
    formdata.append('bank_name', values.bank_name);
    formdata.append('holder_name', values.holder_name);
    formdata.append('Ifcs_code', values.Ifcs_code);
    formdata.append('account_no', values.account_no);
    formdata.append('companyDetails', JSON.stringify(values.companyDetails));
    formdata.append('current_designation', values.current_designation);
    formdata.append('current_department', values.current_department);
    formdata.append('current_salary', values.current_salary);

    if (values.candidate_signature) {
      formdata.append('candidate_signature', {
        uri: values.candidate_signature,
        type: 'image/jpeg',
        name: 'candidate_signature.jpg',
      });
    }
    if (values.candidate_photo) {
      formdata.append('candidate_photo', {
        uri: values.candidate_photo,
        type: 'image/jpeg',
        name: 'candidate_photo.jpg',
      });
    }

    if (values.aadhar_front) {
      formdata.append('aadhar_front', {
        uri: values.aadhar_front,
        type: 'image/jpeg',
        name: 'aadhar_front.jpg',
      });
    }
    if (values.aadhar_back) {
      formdata.append('aadhar_back', {
        uri: values.aadhar_back,
        type: 'image/jpeg',
        name: 'aadhar_back.jpg',
      });
    }

    if (values.experienceLatter) {
      formdata.append('experienceLatter', {
        uri: values.experienceLatter,
        type: 'image/jpeg',
        name: 'experienceLatter.jpg',
      });
    }

    if (values.bankDetailPdf) {
      formdata.append('bankDetailPdf', {
        uri: values.bankDetailPdf,
        type: 'image/jpeg',
        name: 'bankDetailPdf.jpg',
      });
    }

    if (values.otherDocumets) {
      formdata.append('otherDocumets', {
        uri: values.otherDocumets,
        type: 'image/jpeg',
        name: 'otherDocumets.jpg',
      });
    }

    dispatch(updateEmployeesThunkAPI({id: data?.id, data: formdata}))
      .then(res => {
        
        if (res?.payload?.status === true) {
          alertMessage('Registration updated successfully');
          dispatch(getEmployesThunkAPI());
          navigation.goBack();
        } else {
          alertMessage('Something went wrong!');
        }
      })
      .catch(err => {
        alertMessage('Something went wrong!');
      });
  };

  const updateCompanyNameAtIndex = (
    index,
    newCompanyName,
    key,
    values,
    setValues,
  ) => {
    const updatedCompanyDetails = values.companyDetails.map((company, i) => {
      if (i === index) {
        return {
          ...company,
          [key]: newCompanyName,
        };
      }
      return company;
    });

    setValues({
      ...values,
      companyDetails: updatedCompanyDetails,
    });
  };

  const InputComponent = ({
    title,
    placeholder,
    value,
    editable,
    onChangeText,
    multiline,
    keyboardType,
    maxLength,
    error,
  }) => {
    return (
      <View style={{gap: 5}}>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={styles.inputView}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.grey}
            editable={editable && editable}
            value={value}
            maxLength={maxLength && maxLength}
            onChangeText={onChangeText}
            multiline={multiline && multiline}
            style={styles.text}
            keyboardType={keyboardType}
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  };

  const Section_Header = ({title}) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={[styles.textstyle, {fontSize: moderateScale(16)}]}>
          {title}
        </Text>
      </View>
    );
  };

  const RenderImageCard = ({imageUrl, title, setImageUrl, editable}) => {
    return (
      <View style={styles.ImgageCard}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={{height: '90%', width: '90%', resizeMode: 'contain'}}
          />
        ) : (
          <Text style={styles.textstyle}> No Data Available</Text>
        )}
        <TouchableOpacity
          onPress={() => PickImage(setImageUrl)}
          //   disabled={!editable}
          style={styles.bottomDetails}>
          <Text style={styles.textstyle}>{title ? title : 'Upload file'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Loader   /> */}
      {/* <Header title={'Employee Registration Form'} /> */}
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={{paddingBottom: verticalScale(40),paddingTop:45}}>
          <Formik
            enableReinitialize
            initialValues={INITIAL_DATA}
            validationSchema={validationSchema}
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
              <View style={styles.content}>
                {/* <Section_Header title={'Personal Details'} /> */}
                <View style={styles.section}>
                  <View style={styles.flexRowWithSpace}>
                    <View style={{width: '49%'}}>
                      <InputComponent
                        title={'Form Number'}
                        placeholder={'Form Number'}
                        editable={false}
                        value={String(values.form_no)}
                        onChangeText={handleChange('form_no')}
                        error={errors.form_no}
                      />
                    </View>
                    <View style={{width: '49%', gap: 5}}>
                      <Text style={styles.inputTitle}>
                        {'Registration Date'}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setRegDatePickerVisible(true);
                        }}
                        style={[styles.inputView, styles.flexRowWithSpace]}>
                        <Text style={styles.text}>
                          {values?.registration_date
                            ? values?.registration_date
                            : 'Select Date'}
                        </Text>
                        <Icon
                          name={'calendar'}
                          color={colors.black}
                          size={20}
                        />
                      </TouchableOpacity>
                      <DateTimePicker
                        isVisible={regDatePickerVisible}
                        mode="date"
                        maximumDate={new Date()}
                        onConfirm={date => {
                          const formatDate = moment(date).format('YYYY-MM-DD');
                          setValues({...values, registration_date: formatDate});
                          setRegDatePickerVisible(false);
                        }}
                        onCancel={() => setRegDatePickerVisible(false)}
                      />
                      {errors.registration_date && touched.registration_date ? (
                        <Text style={styles.error}>
                          {errors.registration_date}
                        </Text>
                      ) : null}
                      {/* <InputComponent
                              title={'Registration Date'}
                              placeholder={'Registration Date'}
                              value={values.registration_date}
                              onChangeText={handleChange('registration_date')}
                              error={errors.registration_date}
                            /> */}
                    </View>
                  </View>
                </View>
                <Section_Header title={'Personal Details'} />
                <View style={styles.section}>
                  <InputComponent
                    title={'Name'}
                    placeholder={'Name'}
                    onChangeText={handleChange('candidate_name')}
                    value={values.candidate_name}
                    error={errors.candidate_name}
                  />
                  <InputComponent
                    title={'Email'}
                    placeholder={'Email'}
                    onChangeText={handleChange('email')}
                    value={values.email}
                    error={errors.email}
                  />
                  <InputComponent
                    title={'Mobile'}
                    placeholder={'Mobile'}
                    value={values.mobile}
                    onChangeText={handleChange('mobile')}
                    keyboardType={'numeric'}
                    maxLength={10}
                    error={errors.mobile}
                  />
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Date Of Birth'}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(true);
                      }}
                      style={[styles.inputView, styles.flexRowWithSpace]}>
                      <Text style={styles.text}>
                        {values?.dob ? values?.dob : 'Select Date'}
                      </Text>
                      <Icon name={'calendar'} color={colors.black} size={20} />
                    </TouchableOpacity>
                    <DateTimePicker
                      isVisible={isDatePickerVisible}
                      mode="date"
                      maximumDate={new Date()}
                      onConfirm={date => {
                        const formatDate = moment(date).format('YYYY-MM-DD');
                        setValues({...values, dob: formatDate});
                        setIsDatePickerVisible(false);
                      }}
                      onCancel={() => setIsDatePickerVisible(false)}
                    />
                    {errors.dob && touched.dob ? (
                      <Text style={styles.error}>{errors.dob}</Text>
                    ) : null}
                  </View>

                  <InputComponent
                    title={'Aadhar No'}
                    placeholder={'Aadhar No'}
                    value={values.aadharcard_no}
                    onChangeText={handleChange('aadharcard_no')}
                    error={errors.aadharcard_no}
                    maxLength={12}
                    keyboardType={'numeric'}
                  />
                  <InputComponent
                    title={'Select Blood Group'}
                    placeholder={'Select Blood Group'}
                    value={values.blood_group}
                    onChangeText={handleChange('blood_group')}
                    error={errors.blood_group}
                  />
                  <InputComponent
                    title={'Father Name'}
                    placeholder={'Father Name'}
                    value={values.father_name}
                    onChangeText={handleChange('father_name')}
                    error={errors.father_name}
                  />
                  <InputComponent
                    title={'Current Address'}
                    placeholder={'Current Address'}
                    value={values.current_address}
                    onChangeText={handleChange('current_address')}
                    error={errors.current_address}
                  />
                  <View style={styles.flexRowWithSpace}>
                    <View style={{width: '49%'}}>
                      <InputComponent
                        title={'State'}
                        placeholder={'State'}
                        value={values.current_state}
                        onChangeText={handleChange('current_state')}
                        error={errors.current_state}
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <InputComponent
                        title={'Pincode'}
                        placeholder={'Pincode'}
                        value={String(values.current_pincode)}
                        onChangeText={handleChange('current_pincode')}
                        error={errors.current_pincode}
                        keyboardType={'numeric'}
                        maxLength={6}
                      />
                    </View>
                  </View>

                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>
                      Any Health Issue (If you have not then No)
                    </Text>
                    <View style={[styles.flexRowWithSpace, {width: '50%'}]}>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.checkBtn}
                          onPress={() =>
                            setValues({...values, helth_issue: 'yes'})
                          }>
                          {String(values?.helth_issue).toLowerCase() ===
                          'yes' ? (
                            <Icon
                              name={'check'}
                              size={15}
                              color={colors.black}
                            />
                          ) : null}
                        </TouchableOpacity>
                        <Text style={styles.text}>Yes</Text>
                      </View>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.checkBtn}
                          onPress={() =>
                            setValues({...values, helth_issue: 'no'})
                          }>
                          {String(values.helth_issue).toLowerCase() === 'no' ? (
                            <Icon
                              name={'check'}
                              size={15}
                              color={colors.black}
                            />
                          ) : null}
                        </TouchableOpacity>
                        <Text style={styles.text}>No</Text>
                      </View>
                    </View>
                  </View>
                  {values.helth_issue === 'yes' && (
                    <InputComponent
                      title={'Health Issue Desctiption'}
                      placeholder={'Health Issue Desctiption'}
                      value={values.helth_description}
                      onChangeText={handleChange('helth_description')}
                      error={errors.helth_description}
                    />
                  )}
                  <View style={{gap: verticalScale(5)}}>
                    <Text style={styles.inputTitle}>Have any vehicles</Text>
                    <View style={[styles.flexRowWithSpace, {width: '50%'}]}>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.checkBtn}
                          onPress={() =>
                            setValues({...values, vehical_check: 'yes'})
                          }>
                          {String(values.vehical_check).toLowerCase() ===
                          'yes' ? (
                            <Icon
                              name={'check'}
                              size={15}
                              color={colors.black}
                            />
                          ) : null}
                        </TouchableOpacity>
                        <Text style={styles.text}>Yes</Text>
                      </View>
                      <View style={styles.flexRowWithGap}>
                        <TouchableOpacity
                          style={styles.checkBtn}
                          onPress={() =>
                            setValues({...values, vehical_check: 'no'})
                          }>
                          {String(values.vehical_check).toLowerCase() ===
                          'no' ? (
                            <Icon
                              name={'check'}
                              size={15}
                              color={colors.black}
                            />
                          ) : null}
                        </TouchableOpacity>
                        <Text style={styles.text}>No</Text>
                      </View>
                    </View>
                  </View>
                  {values.vehical_check === 'Yes' && (
                    <InputComponent
                      title={'Vehicle Number'}
                      placeholder={'Vehicle Number'}
                      value={values.vehical_no}
                      onChangeText={handleChange('vehical_no')}
                      error={errors.vehical_no}
                    />
                  )}
                  <InputComponent
                    title={'Permanent Address'}
                    placeholder={'Permanent Address'}
                    value={values.parmanent_address}
                    onChangeText={handleChange('parmanent_address')}
                    error={errors.parmanent_address}
                  />
                  <View style={styles.flexRowWithSpace}>
                    <View style={{width: '49%'}}>
                      <InputComponent
                        title={'State'}
                        placeholder={'State'}
                        value={values.parmanent_state}
                        onChangeText={handleChange('parmanent_state')}
                        error={errors.parmanent_state}
                      />
                    </View>
                    <View style={{width: '49%'}}>
                      <InputComponent
                        title={'Pincode'}
                        placeholder={'Pincode'}
                        value={String(values.parmanent_pincode)}
                        onChangeText={handleChange('parmanent_pincode')}
                        error={errors.parmanent_pincode}
                        keyboardType={'numeric'}
                        maxLength={6}
                      />
                    </View>
                  </View>
                </View>
                <Section_Header title={'Work Experience Details'} />
                <View style={styles.section}>
                  {values.companyDetails?.map((fie, i) => (
                    <View key={i}>
                      <InputComponent
                        title={'Company Name'}
                        placeholder={'Company Name'}
                        value={values.companyDetails[i].companyName}
                        onChangeText={text => {
                          updateCompanyNameAtIndex(
                            i,
                            text,
                            'companyName',
                            values,
                            setValues,
                          );
                        }}
                        // error={errors.companyDetails[i].companyName}
                      />
                      <View style={styles.flexRowWithSpace}>
                        <View style={{width: '49%'}}>
                          <InputComponent
                            title={'Designation'}
                            placeholder={'Designation'}
                            value={values.companyDetails[i].designation}
                            onChangeText={text => {
                              updateCompanyNameAtIndex(
                                i,
                                text,
                                'designation',
                                values,
                                setValues,
                              );
                            }}
                            // error={errors.designation}
                          />
                        </View>
                        <View style={{width: '49%'}}>
                          <InputComponent
                            title={'Contact No'}
                            placeholder={'Contact No'}
                            value={values.companyDetails[i].contectNo}
                            onChangeText={text => {
                              updateCompanyNameAtIndex(
                                i,
                                text,
                                'contectNo',
                                values,
                                setValues,
                              );
                            }}
                            keyboardType={'numeric'}
                            maxLength={10}
                            // error={errors.contectNo}
                          />
                        </View>
                      </View>
                      <View style={styles.flexRowWithSpace}>
                        <View style={{width: '49%', gap: 5}}>
                          <Text style={styles.inputTitle}>{'Start Date'}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setStartDatePickerVisible(true);
                            }}
                            style={[styles.inputView, styles.flexRowWithSpace]}>
                            <Text style={styles.text}>
                              {values?.companyDetails[i].startDate
                                ? values?.companyDetails[i].startDate
                                : 'Select Date'}
                            </Text>
                            <Icon
                              name={'calendar'}
                              color={colors.black}
                              size={20}
                            />
                          </TouchableOpacity>
                          <DateTimePicker
                            isVisible={startDatePickerVisible}
                            mode="date"
                            maximumDate={new Date()}
                            onConfirm={date => {
                              const formatDate =
                                moment(date).format('YYYY-MM-DD');
                              updateCompanyNameAtIndex(
                                i,
                                formatDate,
                                'startDate',
                                values,
                                setValues,
                              );
                              setStartDatePickerVisible(false);
                            }}
                            onCancel={() => setStartDatePickerVisible(false)}
                          />
                          {/* {errors.dob && touched.dob ? (
                                  <Text style={styles.error}>{errors.dob}</Text>
                                ) : null} */}
                        </View>
                        <View style={{width: '49%', gap: 5}}>
                          <Text style={styles.inputTitle}>{'End Date'}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setEndDatePickerVisible(true);
                            }}
                            style={[styles.inputView, styles.flexRowWithSpace]}>
                            <Text style={styles.text}>
                              {values?.companyDetails[i].endDate
                                ? values?.companyDetails[i].endDate
                                : 'Select Date'}
                            </Text>
                            <Icon
                              name={'calendar'}
                              color={colors.black}
                              size={20}
                            />
                          </TouchableOpacity>
                          <DateTimePicker
                            isVisible={endDatePickerVisible}
                            mode="date"
                            maximumDate={new Date()}
                            onConfirm={date => {
                              const formatDate =
                                moment(date).format('YYYY-MM-DD');
                              updateCompanyNameAtIndex(
                                i,
                                formatDate,
                                'endDate',
                                values,
                                setValues,
                              );
                              setEndDatePickerVisible(false);
                            }}
                            onCancel={() => setEndDatePickerVisible(false)}
                          />
                          {/* {errors.dob && touched.dob ? (
                                  <Text style={styles.error}>{errors.dob}</Text>
                                ) : null} */}
                        </View>
                      </View>
                      {values.companyDetails.length > 1 && (
                        <TouchableOpacity
                          onPress={() => {
                            setValues({
                              ...values,
                              companyDetails: values.companyDetails.filter(
                                (item, id) => i !== id,
                              ),
                            });
                          }}
                          style={[
                            styles.button,
                            {
                              backgroundColor: colors.red,
                              alignSelf: 'flex-end',
                            },
                          ]}>
                          <Text style={[styles.text, {color: colors.white}]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() =>
                      setValues({
                        ...values,
                        companyDetails: [
                          ...values.companyDetails,
                          {
                            companyName: '',
                            contectNo: '',
                            designation: '',
                            startDate: '',
                            endDate: '',
                          },
                        ],
                      })
                    }
                    style={[
                      styles.button,
                      {
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.AppDefaultColor,
                      },
                    ]}>
                    <Icon
                      name={'plus'}
                      color={colors.AppDefaultColor}
                      size={15}
                    />
                  </TouchableOpacity>
                </View>
                <Section_Header title={'Bank Details'} />
                <View style={styles.section}>
                  <InputComponent
                    title={'Bank Name'}
                    placeholder={'Bank Name'}
                    value={values.bank_name}
                    onChangeText={handleChange('bank_name')}
                    error={errors.bank_name}
                  />
                  <InputComponent
                    title={'Account Holder Name'}
                    placeholder={'Account Holder Name'}
                    value={values.holder_name}
                    onChangeText={handleChange('holder_name')}
                    error={errors.holder_name}
                  />
                  <InputComponent
                    title={'IFSC Code'}
                    placeholder={'IFSC Code'}
                    value={values.Ifcs_code}
                    onChangeText={handleChange('Ifcs_code')}
                    error={errors.Ifcs_code}
                  />
                  <InputComponent
                    title={'Bank Account No'}
                    placeholder={'Bank Account No'}
                    value={values.account_no}
                    onChangeText={handleChange('account_no')}
                    error={errors.account_no}
                  />
                </View>
                <Section_Header title={'Upload Documents'} />
                <View style={styles.section}>
                  <View style={styles.flexRowWithSpace}>
                    <RenderImageCard
                      imageUrl={values.aadhar_front}
                      title={'Candidate Aadhar Front'}
                      setImageUrl={url => {
                        setValues({...values, aadhar_front: url});
                      }}
                      //   editable={isEditable}
                    />
                    <RenderImageCard
                      imageUrl={values.aadhar_back}
                      title={'Candidate Aadhar Back'}
                      setImageUrl={url => {
                        setValues({...values, aadhar_back: url});
                      }}
                    />
                  </View>
                  <View style={styles.flexRowWithSpace}>
                    <RenderImageCard
                      imageUrl={values.candidate_signature}
                      title={'Signature'}
                      setImageUrl={url => {
                        setValues({...values, candidate_signature: url});
                      }}
                      //   editable={isEditable}
                    />
                    <RenderImageCard
                      imageUrl={values.candidate_photo}
                      title={'Image'}
                      setImageUrl={url => {
                        setValues({...values, candidate_photo: url});
                      }}
                    />
                  </View>
                  <View style={styles.flexRowWithSpace}>
                    <RenderImageCard
                      imageUrl={values.experienceLatter}
                      title={'Experiece latter'}
                      setImageUrl={url => {
                        setValues({...values, experienceLatter: url});
                      }}
                      //   editable={isEditable}
                    />
                    <RenderImageCard
                      imageUrl={values.bankDetailPdf}
                      setImageUrl={url => {
                        setValues({...values, bankDetailPdf: url});
                      }}
                      title={'Bank Detail'}
                    />
                  </View>
                  <View style={styles.flexRowWithSpace}>
                    <RenderImageCard
                      imageUrl={values.otherDocumets}
                      title={'Other'}
                      setImageUrl={url => {
                        setValues({...values, otherDocumets: url});
                      }}
                      //   editable={isEditable}
                    />
                  </View>
                </View>
                <Section_Header title={'Designation Details'} />
                <View style={styles.section}>
                  <InputComponent
                    title={'Designation'}
                    placeholder={'Designation'}
                    value={values.current_designation}
                    onChangeText={handleChange('current_designation')}
                    error={errors.current_designation}
                  />
                  <InputComponent
                    title={'Department'}
                    placeholder={'Department'}
                    value={values.current_department}
                    onChangeText={handleChange('current_department')}
                    error={errors.current_department}
                  />

                  {/* <InputComponent
                    title={'Salary(per month)'}
                    placeholder={'Salary(per month)'}
                    value={String(values.current_salary)}
                    onChangeText={handleChange('current_salary')}
                    error={errors.current_salary}
                  /> */}
                  <View style={{gap: 5}}>
                    <Text style={styles.inputTitle}>{'Salary(per month)'}</Text>

                    <DropDownPicker
                      open={openPaymentPcr}
                      value={value}
                      items={data?.payment_setup_data?.map(item => ({
                        label: item?.monthly_payment,
                        value: item?.monthly_payment,
                      }))}
                      placeholder="Salary(per month)"
                      textStyle={styles.text}
                      scrollViewProps={{nestedScrollEnabled: true}}
                      setOpen={setOpenPaymentPcr}
                      // setValue={setValue}
                      style={styles.inputView}
                      // setItems={setItems}
                      key={(item, i) => String(i).toString}
                      containerStyle={{}}
                    />
                  </View>
                </View>

                <Section_Header title={'Disclaimer'} />
                <View style={styles.section}>
                  <View
                    style={[styles.flexRowWithGap, {alignItems: 'flex-start'}]}>
                    <Text style={[styles.text]}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsDeclare(!isDeclare);
                        }}
                        style={[
                          styles.checkBtn,
                          {
                            backgroundColor: isDeclare
                              ? `${colors.navy}90`
                              : colors.white,
                          },
                        ]}>
                        {isDeclare === true ? (
                          <Icon name={'check'} size={15} color={colors.white} />
                        ) : null}
                      </TouchableOpacity>{' '}
                      I DECLARE THAT THE INFORMATION GIVEN ABOVE IS TRUE TO THE
                      BEST OF MY KNOWLEDGE. I AGREE THAT IF ANY INFORMATION
                      FURNISHED ABOVE FOUND INCORRECT MY ADMISSION IS LIABLE TO
                      BE CANCELLED. I HAVE READ AND ACCEPTED ALL TERMS &
                      CONDITIONS.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  disabled={!isDeclare}
                  onPress={handleSubmit}
                  style={[styles.button, {width: '95%', alignSelf: 'center'}]}>
                  <Text style={styles.textstyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default UpdateEmpReg_Screen;

const styles = StyleSheet.create({
  container: {flex: 1},

  wrapper: {height: verticalScale(800)},
  content: {
    // padding: verticalScale(12),
    gap: verticalScale(12),
  },
  section: {
    padding: horizontalScale(12),
    gap: verticalScale(6),
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    gap: horizontalScale(6),
    alignItems: 'center',
  },
  sectionHeader: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#999966',
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.black,
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Regular',
  },
  text: {
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
  }, 
  checkBtn: {
    height: verticalScale(20),
    width: verticalScale(20),
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.lightygrey,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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
  textstyle: {
    fontSize: moderateScale(14),
    color: colors.white,
    fontFamily: 'Roboto-Medium',
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(20),
  },
  error: {
    color: colors.red,
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Medium',
  },
});
