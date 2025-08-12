import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import React from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
const StockCategoryList = ({bottomSheetRef, snapPoints, onPress}) => {
  const {stockCategory} = useSelector(state => state.root.stockManagement);
  const ActionButton = ({title, onPress}) => {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttontext}>{title ? title : `Press Me`}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  };
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      style={styles.shadow}>
      <Text style={[styles.title]}>Actions</Text>
      <Divider />
      <BottomSheetView style={styles.contentContainer}>
        {stockCategory?.response?.category?.map((item, index) => (
          <ActionButton
            key={index}
            title={item?.category_name ? item.category_name : 'Add Item'}
            onPress={()=>onPress(item.id)}
          />
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default StockCategoryList;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    borderTopColor: 'black',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    marginBottom: 10,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  buttontext: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
});
