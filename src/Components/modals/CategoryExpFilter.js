import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {verticalScale} from '../../Utils/Metrics';
import { colors } from '../../Utils/Colors';

const CategoryExpFilter = props => {
  return (
    <BottomSheetModal
      ref={props.categoryBottomSheetFilter}
      //   index={1}
      snapPoints={props.snapPoints}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetScrollView
        contentContainerStyle={{paddingBottom: verticalScale(100)}}>
        <View>
          {props.categoryArray.length > 0 &&  props.categoryArray.map((item, index) => (
            <TouchableOpacity onPress={()=>props.getCategorys(item.id,item.category_name) } style={{marginHorizontal:10,justifyContent:'center',alignContent:'center',alignItems:'center', marginTop: index=== 0 ? 10 : 0}}>
              <Text style={{color: colors.grey, fontSize:18,backgroundColor:'whitesmoke',elevation:15,textAlign:'center',height:40,width:'100%',justifyContent:'center',alignContent:'center',alignItems:'center',alignSelf:'center',marginVertical:5,borderRadius:10,}}>{item.category_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default CategoryExpFilter;
