import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useMemo} from 'react';
import {fontSize} from '../../Utils/Size';
import {colors} from '../../Utils/Colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';

const InputCard = ({
  title,
  name,
  value,
  placeholder,
  placeholderStyle,
  inputMode,
  secureTextEntry,
  updateFields,
  onBlur,
  keyboardType,
  maxLength,
  editable,
  multiline,
  error,
  onPincodeComplete,
  autoCapitalize
}) => {

  return useMemo(
    () => (
      <View
        style={[
          styles.inputcard,
          // {height: error ? verticalScale(105) : verticalScale(85)},
        ]}>
        {title && <Text style={styles.inptitle}>{title}</Text>}
        <View
          style={[
            styles.inputView,
            {height: multiline ? 'auto' : verticalScale(50)},
          ]}>
          <TextInput
            name={name && name}
            inputMode={inputMode && inputMode}
            value={value && value}
            placeholder={placeholder && placeholder}
            placeholderTextColor={ colors.grey }
            multiline={multiline && multiline}
            secureTextEntry={secureTextEntry && secureTextEntry}
            style={styles.inputStyle}
            onChangeText={text => {
              updateFields && updateFields({ [name]: text });
            
              if (text.length === 6 && (name === 'pincode' || name === 'guardianAddressPincode'|| name === 'guardianPincode')) {
                onPincodeComplete && onPincodeComplete(text); // Pass the current text instead of relying on values.pincode
              }
            }}
            autoCapitalize={autoCapitalize && autoCapitalize}
            onBlur={onBlur && onBlur}
            maxLength={maxLength && maxLength}
            keyboardType={keyboardType ? keyboardType : 'default'}
            editable={editable}
          />
        </View>
        {error && <Text style={styles.error}>{error} </Text>}
      </View>
    ),
    [title, name, placeholder, secureTextEntry, updateFields,value],
  );
};

export default InputCard;

const styles = StyleSheet.create({
  inputcard: {
    gap: verticalScale(3),
  },
  inptitle: {
    fontSize: fontSize.lable,
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  inputView: {
    width: '100%',
    height: 50,
    borderWidth: 0.5,
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
    height:50,
  },
  inputStyle: {
    color: colors.txtgrey,
    fontSize: moderateScale(14),
    width: '100%',
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.white,
    
  },

  textstyle: {
    fontSize: fontSize.lable,
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
