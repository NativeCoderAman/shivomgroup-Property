import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  ToastAndroid,
  Animated,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {colors} from '../../Utils/Colors';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {
  addNewUserRollThunkAPI,
  generateUniqueEmpFormNoThunkAPI,
  getEmployesThunkAPI,
} from '../../Service/api/thunks';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';

const validationSchema = Yup.object().shape({
  candidate_name: Yup.string().required('Name field is required'),
  email: Yup.string().email().required('Email field is required'),
  mobile: Yup.number().required('Mobile Number is required'),
  user_roll: Yup.string().required('User Role is required'),
  permissions: Yup.array().required('Permission is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one digit')
    .matches(
      /[@$&#]/,
      'Password must contain at least one special character (@, $, &, #)',
    ),
  password_confirmation: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const AddUserRole_Screen = ({navigation}) => {
  const {generateUniqueEmpFormNoResponse, getAllPermissionResponse} =
    useSelector(state => state?.root?.employeeData);

  const [formNumber, setFormNumber] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const animatedHeightValues = useRef([]).current;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(generateUniqueEmpFormNoThunkAPI());
  }, [dispatch]);

  useEffect(() => {
    setFormNumber(generateUniqueEmpFormNoResponse.response.formNumber);
  }, [generateUniqueEmpFormNoResponse]);

  useFocusEffect(
    useCallback(() => {
      if (getAllPermissionResponse?.response) {
        const permission = Object.keys(getAllPermissionResponse.response).map(
          key => {
            return {
              key: key,
              value: getAllPermissionResponse.response[key],
            };
          },
        );
        setPermissions(permission);
        setSelectedPermissions(Array(permission.length).fill(false));
        permission.forEach((_, index) => {
          animatedHeightValues[index] = new Animated.Value(0); // Initially collapsed
        });
      }
    }, [getAllPermissionResponse]),
  );

  const INITIAL_DATA = {
    form_no: formNumber || null, // Use the form number from state
    candidate_name: null,
    email: null,
    mobile: null,
    user_roll: null,
    permissions: [],
    password: null,
    password_confirmation: null,
  };

  const [user, setUser] = useState(INITIAL_DATA);
  const inputRef1 = useRef(null);

  const handleSubmit = values => {
    const data = {
      form_no: generateUniqueEmpFormNoResponse.response.formNumber,
      candidate_name: values.candidate_name,
      email: values.email,
      mobile: values.mobile,
      user_roll: values.user_roll,
      permissions: selectedPermissions,
      password: values.password,
      password_confirmation: values.password_confirmation,
    };


    // dispatch(addNewUserRollThunkAPI(data))
    //   .then(res => {
    //     if (res?.payload?.status === true) {
    //       ToastAndroid.show(res?.payload?.message, 5000, 50);
    //       dispatch(getEmployesThunkAPI());
    //       dispatch(generateUniqueEmpFormNoThunkAPI());
    //       bottomSheetRef?.current?.dismiss();
    //     } else {
    //       ToastAndroid.show('Something went wrong!', 5000);
    //       inputRef1.current.focus();
    //     }
    //   })
    //   .catch(err => {
    //     ToastAndroid.show('Something went wrong!' + err, 5000);
    //   });
  };

  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleRadioButton = index => {
    // Toggle the expanded state first to decide on animation
    // const updatedExpandedItems = [...expandedItems];
    // updatedExpandedItems[index] = !expandedItems[index];
    // setExpandedItems(updatedExpandedItems);

    // Toggle the selected radio button value
    const updatedPermissions = [...selectedPermissions];
    updatedPermissions[index] = !selectedPermissions[index]; // Toggle selection state
    setSelectedPermissions(updatedPermissions);

    // Check if we are expanding or collapsing
    const isExpanding = !selectedPermissions[index];

    // Animate the height of the view based on expanded/collapsed state
    Animated.timing(animatedHeightValues[index], {
      toValue: isExpanding ? 150 : 0, // Expand to 150 height or collapse to 0
      duration: 1000, // Duration for smooth transition
      useNativeDriver: false,
    }).start();

    // Animate the inner circle's position based on the new selection state
    Animated.timing(animatedValue, {
      toValue: updatedPermissions[index] ? 1 : 0, // Move circle right if selected, else left
      duration: 3000, // Duration for smooth transition
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[1]}
        keyExtractor={item => item.toString()}
        renderItem={() => {
          return (
            <View style={styles.content}>
              <Formik
                initialValues={user}
                validationSchema={validationSchema}
                enableReinitialize={true}
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
                  <>
                    <View style={{gap: 5}}>
                      <View style={[styles.inputView, {display: 'none'}]}>
                        <TextInput
                          placeholder="Form Number"
                          placeholderTextColor={colors.grey}
                          editable={false}
                          value={generateUniqueEmpFormNoResponse?.response?.formNumber?.toString()}
                          style={styles.black}
                        />
                      </View>
                      {errors.form_no && touched.form_no ? (
                        <Text style={styles.error}>{errors.form_no}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>Name</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Enter name"
                          ref={inputRef1}
                          placeholderTextColor={colors.grey}
                          value={values.candidate_name}
                          onChangeText={handleChange('candidate_name')}
                          returnKeyType="next"
                          style={styles.black}
                        />
                      </View>
                      {errors.candidate_name && touched.candidate_name ? (
                        <Text style={styles.error}>
                          {errors.candidate_name}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>Email</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Enter Email"
                          placeholderTextColor={colors.grey}
                          value={values.email}
                          onChangeText={handleChange('email')}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          returnKeyType="next"
                          style={styles.black}
                        />
                      </View>
                      {errors.email && touched.email ? (
                        <Text style={styles.error}>{errors.email}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>Mobile</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Enter mobile"
                          placeholderTextColor={colors.grey}
                          value={values.mobile}
                          onChangeText={handleChange('mobile')}
                          maxLength={10}
                          keyboardType="numeric"
                          returnKeyType="next"
                          style={styles.black}
                        />
                      </View>
                      {errors.mobile && touched.mobile ? (
                        <Text style={styles.error}>{errors.mobile}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>User Type</Text>
                      <View style={[styles.inputView, {paddingHorizontal: 0}]}>
                        <Picker
                          dropdownIconColor={colors.grey}
                          style={{
                            color: colors.txtgrey,
                            fontSize: moderateScale(10),
                            marginTop: verticalScale(-5),
                          }}
                          selectedValue={values.user_roll}
                          onValueChange={itemValue => {
                            setValues({...values, user_roll: itemValue});
                          }}>
                          <Picker.Item label="Select Role" value="" />
                          <Picker.Item label="Manager" value="Manager" />
                          <Picker.Item label="Warden" value="Warden" />
                          <Picker.Item
                            label={'Kitchen Master'}
                            value={'KitchenMaster'}
                          />
                        </Picker>
                      </View>
                      {errors.user_roll && touched.user_roll ? (
                        <Text style={styles.error}>{errors.user_roll}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>Permissions</Text>
                      <View style={styles.permissionsSection}>
                        <FlatList
                          data={permissions}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item, index}) => (
                            <View style={{marginBottom: 10}}>
                              <View style={styles.permissionList}>
                                <Text
                                  numberOfLines={1}
                                  style={[
                                    styles.textLabel,
                                    {flexWrap: 'wrap'},
                                  ]}>
                                  {index + 1}. {item?.key}
                                </Text>
                                <Pressable
                                  style={styles.radioContainer}
                                  onPress={() => toggleRadioButton(index)}>
                                  <View
                                    style={[
                                      styles.outerCircle,
                                      {
                                        backgroundColor: selectedPermissions[
                                          index
                                        ]
                                          ? colors.orange
                                          : '#E0E0E0',
                                      },
                                    ]}>
                                    <Animated.View
                                      style={[
                                        styles.innerCircle,
                                        {
                                          // Move the inner circle based on the selected state
                                          transform: [
                                            {
                                              translateX: selectedPermissions[
                                                index
                                              ]
                                                ? 20
                                                : 0,
                                            },
                                          ],
                                        },
                                      ]}
                                    />
                                  </View>
                                </Pressable>
                              </View>
                              {item.value !== '1' && (
                                <Animated.View
                                  style={[
                                    styles.detailsContainer,
                                    {
                                      height: animatedHeightValues[index], // Bind height to the animated value
                                      overflow: 'hidden', // Ensures content hides when collapsed
                                    },
                                  ]}>
                                  <TouchableOpacity>
                                    <Icon
                                      name="check"
                                      size={20}
                                      color={colors.black}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    style={
                                      styles.detailsText
                                    }>{`${item.value}`}</Text>
                                </Animated.View>
                              )}
                            </View>
                          )}
                        />
                      </View>
                      {errors.permissions && touched.permissions ? (
                        <Text style={styles.error}>{errors.permissions}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>{'Password'}</Text>
                      <View style={styles.inputView}>
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor={colors.grey}
                          value={values.password}
                          onChangeText={handleChange('password')}
                          style={styles.black}
                        />
                      </View>
                      {errors.password && touched.password ? (
                        <Text style={styles.error}>{errors.password}</Text>
                      ) : null}
                    </View>
                    <View style={{gap: 5}}>
                      <Text style={styles.inputTitle}>
                        {'Confirm Password'}
                      </Text>
                      <View
                        style={[
                          styles.inputView,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <TextInput
                          placeholder="Confirm Password"
                          placeholderTextColor={colors.grey}
                          value={values.password_confirmation}
                          onChangeText={handleChange('password_confirmation')}
                          style={styles.black}
                          secureTextEntry={showPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={{
                            height: verticalScale(30),
                            width: verticalScale(30),
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={15}
                            color={colors.black}
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password_confirmation &&
                      touched.password_confirmation ? (
                        <Text style={styles.error}>
                          {errors.password_confirmation}
                        </Text>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={handleSubmit}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: moderateScale(16),
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Formik>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AddUserRole_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: colors.white,
  },
  modalContainer: {
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    top: verticalScale(20),
    paddingHorizontal: horizontalScale(40),
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    gap: verticalScale(6),
    marginBottom: 65,
    paddingHorizontal: '5%',
  },
  button: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(20),
    elevation: 5,
  },
  buttonClose: {
    position: 'absolute',
    top: verticalScale(12),
    right: horizontalScale(12),
    height: verticalScale(30),
    width: verticalScale(30),
    borderRadius: horizontalScale(20),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(5),
    paddingHorizontal: horizontalScale(12),
  },
  permissionsSection: {
    width: '100%',
  },
  inputTitle: {
    color: colors.black,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Medium',
  },
  textLabel: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  checkBox: {
    height: verticalScale(20),
    width: verticalScale(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  black: {
    color: colors.black,
  },
  // custom radio button css
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    position: 'absolute',
  },
  // permissions List
  permissionList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  // expand view css
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
  },
});
