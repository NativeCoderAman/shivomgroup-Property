import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {colors} from '../../../Utils/Colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {useDispatch, useSelector} from 'react-redux';
import {tenantverifyForgetPasswordOtpThunkAPI} from '../../../Service/api/thunks';
import alertMessage from '../../../Utils/alert';

const Verify_OTP_Screen = ({route, navigation}) => {
  const data = route?.params;
  const [code, setCode] = useState('');
  const otpRef = useRef(null);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [otpSent, setOtpSent] = useState(true);

  const handleCodeChanged = newCode => {
    setCode(newCode);
  };

  const handleResetOtp = () => {
    setCode('');
    setOtpSent(true);
    setTimer(60);
    setResendEnabled(false);
  };

  const handleSubmit = () => {
    dispatch(
      tenantverifyForgetPasswordOtpThunkAPI({email: data?.email, otp: code}),
    )
      .then(res => {
        
        if (res?.payload?.status === true) {
          alertMessage(res?.payload?.message);
          navigation.navigate('Reset_Password_Screen', {
            id: res?.payload?.data?.studentId,
          });
        } else {
          alertMessage(res?.payload?.message);
        }
      })
      .catch(err => {
        alertMessage('Something went wrong!');
      });
  };

  // Effect to handle OTP timer
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendEnabled(true);
            setOtpSent(false);
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[{alignItems: 'center'}]}>
        <Text style={[styles.textstyle, {fontSize: moderateScale(14)}]}>
          Enter Code
        </Text>
        <Text style={[styles.textstyle]}>Sent to {data?.email}</Text>
      </View>

      <View style={[{width: '88%'}]}>
        <View
          style={[
            {
              alignItems: 'center',
              width: '100%',
              height: 100,
              overflow: 'hidden',
            },
          ]}>
          <OTPInputView
            ref={otpRef}
            style={[{width: '80%', height: 100}]}
            pinCount={4}
            code={code}
            autoFocus={true}
            codeInputFieldStyle={styles.textInput}
            onCodeChanged={handleCodeChanged}
          />
        </View>

        {resendEnabled && (
          <TouchableOpacity onPress={handleResetOtp}>
            <Text
              style={[
                styles.textstyle,
                {
                  fontSize: 14,
                  alignSelf: 'center',
                  textDecorationLine: 'underline',
                },
              ]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
        {!resendEnabled && timer > 0 && (
          <Text style={styles.timerText}>
            Resend in {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, '0')}
          </Text>
        )}

        <View style={{marginTop: '10%'}}>
          <TouchableOpacity
            disabled={code.length !== 4}
            style={styles.btn}
            onPress={() => handleSubmit()}>
            <Text style={[{color: '#fff', fontSize: 16}]}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Verify_OTP_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: '#ffffff',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: horizontalScale(60),
    height: verticalScale(65),
    color: '#000000',
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    fontSize: 34,
    textAlign: 'center',
  },
  btn: {
    height: verticalScale(50),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.btn,
    borderRadius: 4,
  },
  textstyle: {
    fontSize: moderateScale(12),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  timerText: {
    marginTop: 10,
    color: '#ff0000',
    fontSize: 14,
  },
});