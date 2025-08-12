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
} from '../../Utils/Metrics';
import {colors} from '../../Utils/Colors';
import Card from '../cards/Card';
import StarRatigs from '../cards/StarRatigs';

const Verified_Details_Modal = ({
  bottomSheetRef,
  snapPoints,
  handleSheetChanges,
  data,
}) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      // style={{zIndex:999,overflow:'visible'}}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View style={styles.modalContainer}>
          {/* <Text
            style={[
              styles.title,
              {color: desc?.action == 1 ? colors.red : colors.green},
            ]}>
              
          </Text> */}
          {data?.isReferData ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.text}>{`Refer by ${data?.studentName}`}</Text>
              <Text
                style={styles.text}>{`Referred to ${data?.refered_name}`}</Text>
            </View>
          ) : null}

          {data?.isStudentReview && (
            <View style={{gap: verticalScale(12)}}>
              <Text style={[styles.title]}>Candidate Review</Text>
              <Card>
                <Text
                  style={styles.text}>{`Name : ${data?.data[0]?.name}`}</Text>
                <Text
                  style={
                    styles.text
                  }>{`Mobile : ${data?.data[0]?.mobile}`}</Text>
                <Text
                  style={styles.text}>{`Email : ${data?.data[0]?.email}`}</Text>
                <Text
                  style={
                    styles.text
                  }>{`Aadhaar : ${data?.data[0]?.aadhaar}`}</Text>
              </Card>
              {data?.data?.map((item, i) => (
                <View key={i}>
                  <View
                    style={{
                      paddingVertical: verticalScale(12),
                      alignItems: 'center',
                      backgroundColor: colors.darkgrey,
                    }}>
                    <Text
                      style={[
                        styles.text,
                        {fontSize: moderateScale(14), color: colors.white},
                      ]}>
                      {item?.hostelname}
                    </Text>
                  </View>
                  <Card>
                    <Text style={styles.text}>
                      {`Payments Terms : `}{' '}
                      <StarRatigs rating={item?.payment_terms} size={12} />
                    </Text>
                    <Text style={styles.text}>
                      {`Tenant Behavior : `}
                      <StarRatigs rating={item?.tenant_behavior} size={12} />
                    </Text>
                    <Text style={styles.text}>
                      {`Responsibilities : `}
                      <StarRatigs rating={item?.responsibilities} size={12} />
                    </Text>
                  </Card>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            onPress={() => bottomSheetRef?.current?.close()}
            style={styles.button}>
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default Verified_Details_Modal;

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
    // height: verticalScale(300),
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
    fontFamily: 'Roboto-Medium',
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
