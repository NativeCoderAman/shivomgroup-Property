import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import alertMessage from '../../../Utils/alert';

const Response_View_Modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  desc,
}) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View style={styles.modalContainer}>
          <Text
            style={[
              styles.title,
              {color: desc?.action == 1 ? colors.red : colors.green},
            ]}>
            Response - {desc?.action == 1 ? 'Rejected' : 'Accepted'}
          </Text> 
          <View style={styles.detailsContainer}>
            <Text style={styles.text}>{desc?.desc}</Text>
          </View>

          <TouchableOpacity
            onPress={() => bottomSheetRef?.current?.dismiss()}
            style={styles.button}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default Response_View_Modal;

const styles = StyleSheet.create({
  Container: {
    // flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: horizontalScale(20),
    backgroundColor: '#000000aa',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: verticalScale(300),
    width: '95%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    padding: horizontalScale(12),
  },
  detailsContainer: {
    padding: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(5),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    marginTop: verticalScale(20),
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
  text: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
