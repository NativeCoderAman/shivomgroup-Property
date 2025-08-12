import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import React from 'react';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Divider} from 'react-native-paper';
const StockActionSheet = ({
  bottomSheetRef,
  snapPoints,
  addItemHandle,
  addEstimationHandle,
  makeOrderHanlde,
  AddStockHandle,
  downloadReportHandle,
  deleteCategoryItem,
}) => {
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
        {addItemHandle && (
          <ActionButton title="Add Item" onPress={addItemHandle} />
        )}
        {addEstimationHandle && (
          <ActionButton title="Add Estimation" onPress={addEstimationHandle} />
        )}
        {makeOrderHanlde && (
          <ActionButton title="Make Order" onPress={makeOrderHanlde} />
        )}
        {AddStockHandle && (
          <ActionButton title="Add Used Stock" onPress={AddStockHandle} />
        )}
        {deleteCategoryItem && (
          <ActionButton
            title="Delete Category Items"
            onPress={deleteCategoryItem}
          />
        )}
        {downloadReportHandle && (
          <ActionButton
            title="Download Report"
            onPress={downloadReportHandle}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default StockActionSheet;

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
