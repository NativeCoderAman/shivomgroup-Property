import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  Linking,
  Image,
  Platform,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../Utils/Colors';
import {
  PAYTM_IC,
  PHONEPAY_IC,
  GOOGLEPAY_IC,
  WHATSAPP_IC,
} from '../../../Utils/Icons';
// import { studentDetailsThunkAPI } from '../../../Service/api/thunks';
import {TOTAL_DUE_IC} from '../../../Utils/Icons';
import BASE_URL from '../../../Utils/config';
import moment from 'moment';

const PaySheet = ({visible, onClose, paymentDetails}) => {

  console.log(paymentDetails);
  // State hooks for managing payment details and UI visibility
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [remark, setRemark] = useState(null);
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [payNowVisible, setPayNowVisible] = useState(false);
  const [directPaidVisible, setDirectPaidVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [otp, setOtp] = useState('');

  const permission = false;

  const {token} = useSelector(
    state => state.root?.clientAuth?.clientSessionData,
  );

  const {tenantStudentSalesDetailsResponse} = useSelector(
    state => state.root?.clientProfileData,
  );

  // Effect to update amount when paymentDetails change
  useEffect(() => {
    if (paymentDetails && paymentDetails.amount) {
      setAmount(paymentDetails.amount.toString());
    }
  }, [paymentDetails]);

  // Effect to reset state when modal visibility changes
  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  // Effect to handle OTP timer
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!otpSent) {
      setTimer(60);
      setResendEnabled(false);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Function to reset all states
  const resetState = () => {
    setAmount('');
    setError('');
    setRemark(null);
    setActivePaymentMethod(null);
    setIsEditVisible(false);
    setPayNowVisible(false);
    setDirectPaidVisible(false);
    setSelectedOption(null);
    setOtpSent(false);
    setOtp('');
    setRemark(null);
  };

  // Validate amount input
  const validateAmount = text => {
    const num = parseFloat(text);
    if (isNaN(num) || num < 1 || num > parseFloat(paymentDetails.amount)) {
      setError(`Amount must be between ₹1 and ₹${paymentDetails.amount}`);
      return false;
    }
    setError('');
    return true;
  };

  // Handle amount change with immediate feedback
  const handleAmountChange = text => {
    setAmount(text);
    validateAmount(text);
  };

  // Handle blur event for amount input
  const handleBlur = () => {
    if (amount === '' || !validateAmount(amount)) {
      setAmount(paymentDetails.amount.toString());
    }
  };

  // Handle opening of payment apps
  const openApp = async appName => {
    const urls = {
      'Google Pay': Platform.select({
        ios: 'googlepay://',
        android: 'com.google.android.apps.nbu.paisa.user',
      }),
      Paytm: 'paytm://',
      PhonePe: 'phonepe://',
      WhatsApp: 'whatsapp://',
    };

    const url = urls[appName];

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'App not installed',
          `You don't have ${appName} installed.`,
        );
      }
    } catch (err) {
      console.error('An error occurred', err);
    }
  };

  // Payment option component
  const PaymentOption = ({type, fields}) => (
    <View style={styles.methodContainer}>
      {type !== 'UPI Payment' &&
        fields.map((field, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor={colors.grey}
            keyboardType={field.keyboardType || 'default'}
          />
        ))}
      {type === 'UPI Payment' && (
        <View style={styles.upiIconsContainer}>
          {['Google Pay', 'Paytm', 'PhonePe', 'WhatsApp'].map(appName => (
            <TouchableOpacity
              key={appName}
              onPress={() => openApp(appName)}
              style={styles.payment}>
              <Image
                source={
                  appName === 'Google Pay'
                    ? GOOGLEPAY_IC
                    : appName === 'Paytm'
                    ? PAYTM_IC
                    : appName === 'PhonePe'
                    ? PHONEPAY_IC
                    : WHATSAPP_IC
                }
                style={styles.paymentIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {type !== 'UPI Payment' && (
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>
            Pay ₹{amount || paymentDetails.amount}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Payment method toggle component
  const PaymentMethodToggle = ({name, icon, fields}) => (
    <>
      <TouchableOpacity
        style={styles.paymentMethodBtn}
        onPress={() =>
          setActivePaymentMethod(activePaymentMethod === name ? null : name)
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name={icon} size={25} color="#000" />
          <Text style={styles.paymentMethodText}>{name}</Text>
        </View>
        <MaterialCommunityIcons
          name={activePaymentMethod === name ? 'chevron-up' : 'chevron-down'}
          size={30}
          color="#000"
        />
      </TouchableOpacity>
      {activePaymentMethod === name && (
        <PaymentOption type={name} fields={fields} />
      )}
      <View style={styles.divider} />
    </>
  );

  // Radio button component
  const RadioButton = ({label, selected, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.radioButtonContainer}>
      <View style={styles.radioButton}>
        {selected && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  // Handle option selection
  const handleSelectOption = option => {
    setSelectedOption(option);
    setOtpSent(false);
  };

  // Handle OTP sending
  const handleSendOtp = async () => {
    try {
      if (!selectedOption) {
        showMessage({
          message: 'Selection Required',
          description: 'Please select Cash or Online.',
          type: 'warning',
          icon: 'warning',
          duration: 5000,
        });
        return;
      }

      // Provide immediate feedback to the user
      setOtpSent(true);

      const saleType = (() => {
        if (paymentDetails.title === 'Current Due') return 'currentDue';
        if (paymentDetails.title === 'Total Due') return 'totalDue';
        return 'mainSale';
      })();

      // Directly use paymentDetails.invoiceNo assuming it's already a string
      const invoiceNoString = paymentDetails.invoiceNo || '';

      const data = {
        studentId:
          tenantStudentSalesDetailsResponse?.response.studentDetails?.studentId,
        mobileNo: '9516760054',
        amount: amount,
        type: selectedOption,
        saleType: saleType,
        invoiceNo: invoiceNoString,
      };

      const response = await axios.post(`${BASE_URL}saleOptShare`, data, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.statusCode === 200) {
        showMessage({
          message: 'Success',
          description: 'OTP sent successfully.',
          type: 'success',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'success',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
      } else {
        showMessage({
          message: 'OTP failed',
          description: 'Failed to send OTP.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
        setOtpSent(false); // Reset state if OTP sending fails
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.response) {
        showMessage({
          message: 'Error',
          description: 'An error occurred while sending OTP.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
        setOtpSent(false);
      }

      // Reset state in case of error
    }
  };

  const handleResendOtp = async () => {
    try {
      if (!selectedOption) {
        showMessage({
          message: 'Selection Required',
          description: 'Please select Cash or Online.',
          type: 'warning',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'warning',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
        return;
      }

      // Provide immediate feedback to the user
      setOtpSent(true);

      const saleType = (() => {
        if (paymentDetails.title === 'Current Due') return 'currentDue';
        if (paymentDetails.title === 'Total Due') return 'totalDue';
        return 'mainSale';
      })();

      // Directly use paymentDetails.invoiceNo assuming it's already a string
      const invoiceNoString = paymentDetails.invoiceNo || '';

      const data = {
        studentId:
          tenantStudentSalesDetailsResponse?.response.studentDetails?.studentId,
        mobileNo: '9516760054',
        amount: amount,
        type: selectedOption,
        saleType: saleType,
        invoiceNo: invoiceNoString,
      };

      const response = await axios.post(`${BASE_URL}saleOptShare`, data, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.statusCode === 200) {
        showMessage({
          message: 'OTP Resent',
          description: 'A new OTP has been sent to your mobile number.',
          type: 'success',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'success',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });

        // Reset timer and disable resend button
        setTimer(60); // Example: 60 seconds timer
        setResendEnabled(false);
      } else {
        showMessage({
          message: 'Error',
          description: 'Failed to resend OTP.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
        setOtpSent(false); // Reset state if OTP resending fails
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      if (error.response) {
        showMessage({
          message: 'Error',
          description: 'An error occurred while resending OTP.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
        setOtpSent(false);
      }

      // Reset state in case of error
    }
  };

  // Data to be sent for OTP verification
  const handleSubmit = async () => {
    try {
      const saleType = (() => {
        if (paymentDetails.title === 'Current Due') return 'currentDue';
        if (paymentDetails.title === 'Total Due') return 'totalDue';
        return 'mainSale';
      })();

      const otpData = {
        studentId:
          tenantStudentSalesDetailsResponse?.response.studentDetails?.studentId,
        saleType: saleType,
        otp: otp,
        paymentType: selectedOption,
        amount: amount,
        remark: remark,
      };

      const response = await axios.post(
        `${BASE_URL}verifyOtpAndCreateSales`,
        otpData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.statusCode === 200) {
        showMessage({
          message: 'Success',
          description: 'OTP verification successful.',
          type: 'success',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'success',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });

        // Reset the states here
        setOtp('');
        setSelectedOption(null);
        setAmount('');
        setRemark(null);
      } else {
        throw new Error('Unexpected status code');
      }
    } catch (error) {
      if (error.response && error.response.data.statusCode === 400) {
        showMessage({
          message: 'Sale Verification Failed',
          description: 'OTP verification failed.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
      } else {
        showMessage({
          message: 'Failed',
          description: 'Something went wrong.',
          type: 'danger',
          backgroundColor: '#dc3545', // Custom background color
          color: '#fff', // Custom text color
          icon: 'danger',
          duration: 3000, // 3 seconds
          floating: true,
          position: 'top',
        });
      }
    }
  };

  const titles = paymentDetails.title
    ? paymentDetails.title.split(',')
    : ['Total dues'];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* payment sheet header with title and close icon */}
          <View style={styles.header}>
            <Text style={styles.title}>Payment</Text>
            <MaterialCommunityIcons
              name="window-close"
              size={30}
              color="#000"
              onPress={onClose}
            />
          </View>

          <ScrollView style={{width: '100%'}}>
            {/* Payment payment Details  */}
            <View style={styles.paymentDtls}>
              {/* Icon , title , date and amount row */}
              <View style={styles.flexView}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '80%',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      paymentDetails.icon ? paymentDetails.icon : TOTAL_DUE_IC
                    }
                    style={{
                      width: 42,
                      height: 42,
                      marginRight: 15,
                    }}
                  />
                  <View>
                    {titles.map((title, index) => (
                      <Text key={index} style={styles.title}>
                        {title.trim()}
                      </Text>
                    ))}
                    <Text style={{color: 'black', fontSize: 12}}>
                      Due on {paymentDetails?.dueDate || moment().format('DD-MM-YYYY')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.amount}>₹{paymentDetails.amount}</Text>
              </View>

              {/* rentpass or cashback row */}
              <View style={styles.flexView}>
                <Text style={styles.text}>RentPass Cashback</Text>
                <Text style={styles.amount}>-₹0</Text>
              </View>

              {/* i am paying or editable amount row */}
              <View style={styles.flexView}>
                <Text style={styles.text}>I am paying</Text>
                <Text style={styles.amount}>
                  ₹{amount || paymentDetails.amount}
                </Text>
              </View>

              {/* showing edit amount option when title is current dues */}
              {paymentDetails.title !== 'Total Due' && (
                <>
                  <TouchableOpacity
                    style={styles.displayRight}
                    onPress={() => setIsEditVisible(!isEditVisible)}>
                    <Text style={styles.editAmount}>
                      {isEditVisible ? 'Cancel Edit' : 'Edit Amount'}
                    </Text>
                  </TouchableOpacity>
                  {isEditVisible && (
                    <>
                      <TextInput
                        style={[
                          styles.editInputBox,
                          error ? styles.errorInput : null,
                        ]}
                        placeholder="Enter Amount"
                        placeholderTextColor={colors.grey}
                        value={amount}
                        onChangeText={handleAmountChange}
                        onBlur={handleBlur}
                        keyboardType="numeric"
                      />
                      {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                      ) : null}
                      <TouchableOpacity
                        style={styles.editButtonView}
                        onPress={() => setIsEditVisible(false)}>
                        <Text style={styles.editButtonText}>Save</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </View>

            {/* remark box for payment */}
            <View style={styles.remarkview}>
              <TextInput
                placeholder="Remark"
                placeholderTextColor={colors.grey}
                style={styles.remarktext}
                value={remark}
                onChangeText={text => setRemark(text)}
              />
            </View>

            {/*Pay now with payment method optionns */}
            {payNowVisible ? (
              <>
                <TouchableOpacity
                  style={[styles.paymentHeader, styles.payNowBtn]}
                  onPress={() => setPayNowVisible(false)}>
                  <Text style={styles.payNowBtnText}>Pay Now</Text>
                  <MaterialCommunityIcons
                    name={'chevron-up'}
                    style={styles.payNowArrow}
                  />
                </TouchableOpacity>
                <View style={styles.paymentMethod}>
                  <Text style={styles.title}>Payment Method</Text>
                  <View style={styles.divider} />

                  <PaymentMethodToggle
                    name="UPI Payment"
                    icon="cash"
                    fields={[{placeholder: 'Cash or Online'}]}
                  />

                  <PaymentMethodToggle
                    name="Net Banking"
                    icon="bank"
                    fields={[{placeholder: 'Bank Name'}]}
                  />

                  <PaymentMethodToggle
                    name="Credit / Debit / ATM Card"
                    icon="credit-card-outline"
                    fields={[
                      {placeholder: 'Card Number', keyboardType: 'numeric'},
                      {
                        placeholder: 'Valid Thru (MM/YY)',
                        keyboardType: 'numeric',
                      },
                      {placeholder: 'CVV', keyboardType: 'numeric'},
                    ]}
                  />
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.paymentHeader, styles.payNowBtn]}
                onPress={() => {
                  permission
                    ? setPayNowVisible(true)
                    : alert(`Your admin package don't have this permission`);
                }}>
                <Text style={styles.payNowBtnText}>Pay Now</Text>
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  style={styles.payNowArrow}
                />
              </TouchableOpacity>
            )}

            {/* Direct paid with cash and online optionns */}
            {directPaidVisible ? (
              <>
                <TouchableOpacity
                  style={[styles.paymentHeader, styles.directPaidBtn]}
                  onPress={() => setDirectPaidVisible(false)}>
                  <Text style={styles.payNowBtnText}>Direct Paid</Text>
                  <MaterialCommunityIcons
                    name={'chevron-up'}
                    style={styles.payNowArrow}
                  />
                </TouchableOpacity>

                {otpSent ? (
                  <View style={styles.directpaidview}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      keyboardType="numeric"
                      value={otp}
                      onChangeText={text => setOtp(text)}
                    />
                    <TouchableOpacity
                      style={styles.paidBtn}
                      onPress={handleSubmit}>
                      <Text style={styles.paidBtnText}>Submit</Text>
                    </TouchableOpacity>
                    {resendEnabled && (
                      <TouchableOpacity
                        style={styles.resendBtn}
                        onPress={handleResendOtp}>
                        <Text style={styles.resendBtnText}>Resend OTP</Text>
                      </TouchableOpacity>
                    )}
                    {timer > 0 && (
                      <Text style={styles.timerText}>
                        Resend in {Math.floor(timer / 60)}:
                        {String(timer % 60).padStart(2, '0')}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.directpaidview}>
                    <View style={styles.flexView}>
                      <Text style={styles.title}>Direct paid amount :</Text>
                      <Text style={styles.text}>
                        ₹{amount || paymentDetails.amount}
                      </Text>
                    </View>
                    <RadioButton
                      label="Cash"
                      selected={selectedOption === 'cash'}
                      onPress={() => handleSelectOption('cash')}
                    />
                    <RadioButton
                      label="Online"
                      selected={selectedOption === 'online'}
                      onPress={() => handleSelectOption('online')}
                    />
                    <TouchableOpacity
                      style={[
                        styles.paidBtn,
                        !selectedOption && {backgroundColor: 'gray'},
                      ]}
                      onPress={handleSendOtp}
                      disabled={!selectedOption}>
                      <Text style={styles.paidBtnText}>Send OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={[styles.paymentHeader, styles.directPaidBtn]}
                onPress={() => {
                  permission
                    ? setDirectPaidVisible(true)
                    : alert(`Your admin package don't have this permission`);
                }}>
                <Text style={styles.payNowBtnText}>Direct Paid</Text>
                <MaterialCommunityIcons
                  name={'chevron-down'}
                  style={styles.payNowArrow}
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PaySheet;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  paymentDtls: {
    backgroundColor: colors.lightgrey,
    width: '100%',
    marginBottom: 20,
    padding: 10,
    paddingTop: 20,
    borderRadius: 5,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  text: {
    fontSize: 16,
    color: colors.black,
  },
  displayRight: {
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editAmount: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  editInputBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.grey,
    fontSize: 16,
    paddingHorizontal: 10,
    color: colors.black,
    height: 40,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  editButtonView: {
    width: '100%',
    backgroundColor: colors.orange,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    height: 40,
  },
  editButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.white,
  },
  paymentMethod: {
    backgroundColor: colors.lightgrey,
    width: '100%',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  paymentMethodBtn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  paymentMethodText: {
    color: colors.black,
    fontSize: 16,
    marginLeft: 10,
  },
  methodContainer: {
    width: '100%',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
  },
  divider: {
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    marginTop: 10,
  },
  upiIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  upiIconText: {
    textAlign: 'center',
    marginTop: 5,
    color: colors.black,
  },
  payment: {
    backgroundColor: colors.white,
    padding: 5,
    width: 60,
    height: 45,
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
    borderRadius: 10,
  },
  paymentIcon: {
    width: '100%', // Adjust width to fit within the view
    height: '100%', // Adjust height to fit within the view
    resizeMode: 'contain', // Maintain aspect ratio without stretching
  },

  paymentHeader: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  payNowBtn: {
    backgroundColor: colors.orange,
  },
  payNowBtnText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  payNowArrow: {
    color: colors.white,
    fontSize: 30,
    position: 'absolute',
    right: 10,
  },
  directPaidBtn: {
    backgroundColor: colors.grey,
  },

  // DIRECT PAID VIEW

  directpaidview: {
    backgroundColor: colors.lightgrey,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioButtonText: {
    fontSize: 16,
    color: colors.black,
  },
  paidBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.btn,
    height: 40,
  },
  paidBtnText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  // Add other styles here
  resendBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.orange,
    borderRadius: 5,
    alignItems: 'center',
  },
  resendBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  timerText: {
    marginTop: 10,
    color: '#ff0000',
    fontSize: 14,
  },
  // remark css
  remarkview: {
    width: '100%',
    backgroundColor: colors.lightgrey,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  remarktext: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.btn,
    borderRadius: 5,
    padding: 10,
    height: 40,
    color: colors.darkgrey
  },
});
