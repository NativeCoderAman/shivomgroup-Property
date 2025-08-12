import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {colors} from '../../Utils/Colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Card from '../cards/Card';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetFormNo,
  GetRoomsListApi,
  deleteSelfStudentThunkAPI,
  getSelfRegisterStudentsThunkAPI,
  handleBasicRegisterDetails,
} from '../../Service/slices/RegisterSlice';
import SelfToMain_Modal from '../modals/SelfToMain_Modal';
import Loader from '../../Utils/Loader';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import RegQueueAdharModal from '../modals/RegQueueAdharModal';
import Footer from '../footer/Footer';

const Queue_Registration = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);
  const [referVerifiedData, setReferVerifiedData] = useState([]);
  const [isAdharModal, setIsAdharModal] = useState(false);
  const handlePress = () => {
    setIsAdharModal(!isAdharModal);
  };

  const {getSelfRegisterStudentsResponse, deleteSelfStudentResponse} =
    useSelector(state => state.root.registerData);

  const loading = useSelector(
    state => state?.root.registerData.getSelfRegisterStudentsResponse.loading,
  );
  const [studentRec, setStudentRec] = useState(null);

  const toggleModal = useCallback(() => {
    setModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const handleDelete = id => {
    Alert.alert('Delete', 'Do you want to Delete Student Data ?', [
      {
        text: 'Cancel',

        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          dispatch(deleteSelfStudentThunkAPI(id))
            .then(res => {
              //
              if (res?.payload?.status === true) {
                Alert.alert('Success', res.payload.message);
                dispatch(handleBasicRegisterDetails());
                dispatch(getSelfRegisterStudentsThunkAPI());
              } else {
                Alert.alert('Error', 'Something Went wrong!');
              }
            })
            .catch(err => {}),
      },
    ]);
  };

  const RenderItem = ({item}) => {
    const navigation = useNavigation();
    return (
      <View
        style={{
          paddingHorizontal: horizontalScale(12),
          paddingVertical: verticalScale(5),
        }}>
        <Card>
          <View style={{}}>
            <View
              style={[
                styles.flexRowWithGap,
                {justifyContent: 'space-between'},
              ]}>
              <View style={{width: '70%'}}>
                <Text style={styles.room_num}>{item?.name}</Text>
                <Text style={{color: colors.grey, fontSize: 14}}>
                  {item?.mobileNumber}
                </Text>
              </View>
            </View>
            <View style={styles.flexRowWithGap}>
              <Text style={{fontSize: 14, color: 'grey'}}>{item?.email}</Text>
            </View>
            <View
              style={[
                styles.flexRowWithGap,
                {
                  justifyContent: 'flex-end',
                  borderTopWidth: 1,
                  gap: horizontalScale(15),
                  borderTopColor: colors.lightygrey,
                  paddingTop: 10,
                  marginTop: 10,
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setStudentRec(item), toggleModal();
                }}>
                <Icon name={'user-plus'} color={colors.black} size={16} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item?.id)}>
                <Icon name={'trash-can'} color={colors.red} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Registarion_View', {
                    studentData: item,
                    mode: 'request',
                  })
                }>
                <Icon name={'eye'} color={colors.black} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Loader
          loading={
            loading ||
            getSelfRegisterStudentsResponse?.loading ||
            deleteSelfStudentResponse?.loading
          }
        />
        {getSelfRegisterStudentsResponse?.response?.length ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, i) => i}
            data={getSelfRegisterStudentsResponse?.response}
            contentContainerStyle={styles.room_section}
            renderItem={({item}) => {
              return <RenderItem item={item} />;
            }}
            ListFooterComponent={<Footer message="no more request data" />}
          />
        ) : (
          <View
            style={[styles.emptyContainer, {marginTop: verticalScale(180)}]}>
            <Text
              style={[
                styles.tagText,
                {fontSize: moderateScale(16), color: colors.black},
              ]}>
              No Records Available
            </Text>
          </View>
        )}
        <SelfToMain_Modal
          isVisible={isModalVisible}
          onClose={toggleModal}
          studentID={studentRec}
          adharNumber={
            getSelfRegisterStudentsResponse?.response[0]?.aadharNumber
          }
          verifidModalRef={handlePress}
          dataReferVerifiedData={data => {
            setReferVerifiedData(data);
          }}
        />
      </View>
      <RegQueueAdharModal
        isAdharModal={isAdharModal}
        data={referVerifiedData}
        onClose={() => setIsAdharModal(!isAdharModal)}
      />
    </BottomSheetModalProvider>
  );
};

export default Queue_Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRowWithGap: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-start',
    gap: 10,
  },
  room_num: {
    fontSize: moderateScale(18),
    color: colors.grey,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  scrollBtn: {
    position: 'absolute',
    verticalAlign: 'middle',
  },

  room_section: {
    paddingBottom: verticalScale(0),
  },
});
