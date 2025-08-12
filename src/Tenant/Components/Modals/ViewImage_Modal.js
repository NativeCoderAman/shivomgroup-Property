import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import Modal from 'react-native-modal';
import {horizontalScale, verticalScale} from '../../../Utils/Metrics';
import {colors} from '../../../Utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ViewImage_Modal = ({isVisible, onClose, imageURL}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{height: '80%', width: '90%'}}>
        <Image
          source={imageURL ? {uri: imageURL} : null}
          style={{height: '100%', width: '100%', resizeMode: 'contain'}}
        />
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon name={'xmark'} size={15} color={colors.white} />
      </TouchableOpacity>
    </Modal>
  );
};

export default memo(ViewImage_Modal);

const styles = StyleSheet.create({
  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(-5),
    top: verticalScale(-8),
  },
});
