import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { Picker } from '@react-native-picker/picker';
import { fontSize } from '../../Utils/Size';
import { moderateScale, verticalScale } from '../../Utils/Metrics';
import { colors } from '../../Utils/Colors';

const PickerCard = ({
  title,
  placeholder,
  value, // Incoming value from the parent
  setValue,
  items,
  editable = true,
  error,
  disabled = false,
}) => {

  return (
    <View
      style={[
        styles.inputcard,
        { height: error ? verticalScale(105) : verticalScale(75) },
      ]}
    >
      <Text style={styles.inptitle}>{title && title}</Text>
      <View style={styles.bax}>
        <Picker
          dropdownIconColor={colors.grey}
          enabled={!disabled && editable}
          style={{
            color: colors.grey,
            fontSize: moderateScale(10),
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: colors.grey,
            fontSize: moderateScale(10),
          }}
          selectedValue={value} 
          onValueChange={(itemValue) => {
            if (!disabled && itemValue !== " ") {
              setValue(itemValue);
            }
          }}
        >
          {!value && <Picker.Item label={placeholder} value=" " />}
          {value && <Picker.Item label={value} value={value} />}
          {items && items.length > 0 ? (
            items.map((item, i) => {
              return item.value !== value ? (
                <Picker.Item
                  key={i}
                  label={item.label}
                  value={item.value}
                />
              ) : null;
            })
          ) : title === 'Seat Number' ? (
            <Picker.Item label={'No seat available'} value=" " />
          ) : (
            <Picker.Item label={'Data not available'} value=" " />
          )}
        </Picker>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default memo(PickerCard, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.items === nextProps.items &&
    prevProps.error === nextProps.error &&
    prevProps.editable === nextProps.editable &&
    prevProps.disabled === nextProps.disabled
  );
});

const styles = StyleSheet.create({
  inputcard: {
    gap: verticalScale(1),
    marginBottom: 5
  },
  inptitle: {
    fontSize: fontSize.lable,
    color: colors.black,
  },
  bax: {
    width: '100%',
    height: 45,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.grey,
    backgroundColor: colors.white,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
