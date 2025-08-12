import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { horizontalScale, verticalScale } from '../../Utils/Metrics';
import { colors } from '../../Utils/Colors';
import Modal from 'react-native-modal';
import { IconButton } from 'react-native-paper';
import moment from 'moment';
const RegMultiDate = props => {
  return (
    <Modal
      isVisible={props.isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={props.onClose}
      onDismiss={props.onClose}
      onBackButtonPress={props.onClose}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: '100%',
          borderRadius: horizontalScale(10),
          backgroundColor: colors.white,
          alignSelf: 'center',
          top: verticalScale(20),
          padding: horizontalScale(20),
        }}>
        {props?.multiDate?.length > 0 &&
          props?.multiDate?.map((item, index) => (

            <TouchableOpacity
              key={index}
              style={{
                marginHorizontal: 10,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: index === 0 ? 10 : 0,
                // flexDirection:'row'
                position: 'relative'
              }}>
              <IconButton style={{ position: 'absolute', zIndex: 1, left: horizontalScale(10) }} icon={item.type === "join" ? "arrow-down" : item.type === "switch" ? "refresh" : "arrow-up"} />
              <Text
                style={{
                  color: colors.grey,
                  fontSize: 18,
                  backgroundColor: 'whitesmoke',
                  elevation: 15,
                  textAlign: 'center',
                  height: 40,
                  width: '100%',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginVertical: 5,
                  borderRadius: 10,
                  textAlignVertical: 'center',
                }}>
                {moment(item.date).format('DD-MMM-YYYY')}
              </Text>
            </TouchableOpacity>

          ))}
      </View>
    </Modal>
  );
};

export default RegMultiDate;
