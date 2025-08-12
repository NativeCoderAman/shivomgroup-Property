import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../Utils/Metrics';
import DocumentPicker from 'react-native-document-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  getBusinessProfileDocumetsThunkAPI,
  uploadDocumetsThunkAPI,
} from '../../Service/api/thunks';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';
import {colors} from '../../Utils/Colors';
import Header from '../../Components/headers/Header';

const DocumentUploadScreen = ({navigation}) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    rules: {name: null, file: null},
    stamp: {name: null, file: null},
    pancard: {name: null, file: null},
    businessReg: {name: null, file: null},
  });
  const [selected, setSelected] = useState('bussinessDoc');
  const dispatch = useDispatch();
  const {getBusinessProfileDocumetsResponse, uploadDocumetsResponse} =
    useSelector(state => state.root.bussinessData);
  const fetchData = useCallback(() => {
    dispatch(getBusinessProfileDocumetsThunkAPI())
      .then(res => {
        if (res.payload.status === true) {
          const data = res.payload.data;
          setUploadedFiles({
            rules: {
              id: data[0]?.id,
              name: data[0]?.upload_name,
              file: data[0]?.documents,
            },
            stamp: {
              id: data[1]?.id,
              name: data[1]?.upload_name,
              file: data[1]?.documents,
            },
            pancard: {
              id: data[2]?.id,
              name: data[2]?.upload_name,
              file: data[2]?.documents,
            },
            businessReg: {
              id: data[3]?.id,
              name: data[3]?.upload_name,
              file: data[3]?.documents,
            },
          });
        } else {
          alertMessage('Something went wrong');
        }
      })
      .catch(e => {
        alertMessage('Something went wrong');
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [dispatch]);


  const handleFilePick = async (id, key) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const data = new FormData();
      data.append('documents', {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      });
      dispatch(uploadDocumetsThunkAPI({id: id, data}))
        .then(res => {
          
          fetchData();
        })
        .catch(e => {
        });
      setUploadedFiles({...uploadedFiles, key: result});
    } catch (error) {
    }
  };

  const renderUploadButton = (file, key) => {
    return (
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => handleFilePick(file?.id, key)}>
        <Icon name="cloud-upload" size={24} color="#5B5B5B" />
        <Text style={styles.uploadButtonText}>{'Upload File'}</Text>
      </TouchableOpacity>
    );
  };

  const renderUploadedFile = (file, key) => {
    const name = file?.file?.split('/');
    return (
      <View style={[styles.fileContainer, {justifyContent: 'space-between'}]}>
        <TouchableOpacity
          onPress={() => alertMessage('File not Found!')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {name && (
            <Icon
              name="insert-drive-file"
              size={24}
              color={`${colors.green}`}
            />
          )}
          <Text style={styles.fileName}>{name && name[name?.length - 1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilePick(file?.id, key)}>
          {name && (
            <Icon
              name="cloud-upload"
              size={24}
              color={colors.AppDefaultColor}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Loader
        loading={
          getBusinessProfileDocumetsResponse?.loading ||
          uploadDocumetsResponse?.loading
        }
      />
      <View style={[styles.wrapper,{paddingTop : verticalScale(50)}]}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: verticalScale(50),
            backgroundColor: colors.white,
          }}>
          <TouchableOpacity
            onPress={() => setSelected('bussinessDoc')}
            style={{
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 4,
              borderBottomColor:
                selected == 'bussinessDoc'
                  ? colors.AppDefaultColor
                  : colors.white,
            }}>
            <Text style={styles.title}>Bussiness Docs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected('termsCond')}
            style={{
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottomWidth: 4,
              borderBottomColor:
                selected == 'termsCond' ? colors.AppDefaultColor : colors.white,
            }}>
            <Text style={styles.title}>T&C</Text>
          </TouchableOpacity>
        </View>
        {selected === 'bussinessDoc' ? (
          <View style={styles.content}>
            {/* <Text style={styles.label}>Rules & Regulations</Text>
            {uploadedFiles.rules.file
              ? renderUploadedFile(uploadedFiles.rules, 'rules')
              : renderUploadButton(uploadedFiles.rules, 'rules')} */}

            <Text style={styles.label}>Stamp With Signature</Text>
            {uploadedFiles.stamp.file
              ? renderUploadedFile(uploadedFiles.stamp, 'stamp')
              : renderUploadButton(uploadedFiles.stamp, 'stamp')}

            <Text style={styles.label}>Pancard</Text>
            {uploadedFiles.pancard.file
              ? renderUploadedFile(uploadedFiles.pancard, 'pancard')
              : renderUploadButton(uploadedFiles.pancard, 'pancard')}

            <Text style={styles.label}>Business Registration Certificate</Text>
            {uploadedFiles.businessReg.file
              ? renderUploadedFile(uploadedFiles.businessReg, 'businessReg')
              : renderUploadButton(uploadedFiles.businessReg, 'businessReg')}
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.label}>Rules & Regulations</Text>
            {uploadedFiles.rules.file
              ? renderUploadedFile(uploadedFiles.rules, 'rules')
              : renderUploadButton(uploadedFiles.rules, 'rules')}
            <Text style={styles.label}>Employee T&C</Text>
            {uploadedFiles.rules.file
              ? renderUploadedFile(uploadedFiles.rules, 'employee')
              : renderUploadButton(uploadedFiles.rules, 'employee')}
            <Text style={styles.label}>Sales T&C</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditionsScreen');
              }}
              style={styles.button}>
              <Text style={styles.title}>Sales T&C</Text>
              <Icon name="chevron-right" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.label}>Custom Sales T&C</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.title}>Custom Sales T&C</Text>
              <Icon name="chevron-right" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  wrapper: {
    width: '100%',
  },
  header: {
    padding: horizontalScale(20),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    padding: horizontalScale(20),
    // paddingTop: verticalScale(62),
  },
  label: {
    fontSize: moderateScale(14),
    color: colors.black,
    marginBottom: 10,
    fontFamily: 'Roboto-Medium',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: horizontalScale(15),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    backgroundColor: colors.white,
    marginBottom: verticalScale(20),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: horizontalScale(15),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(20),
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: moderateScale(12),
    color: colors.grey,
    fontFamily: 'Roboto-Medium',
  },
  title: {
    fontSize: moderateScale(14),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: horizontalScale(15),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  fileName: {
    marginLeft: horizontalScale(10),
    fontSize: moderateScale(12),
    color: colors.black,
    fontFamily: 'Roboto-Medium',
  },
});

export default DocumentUploadScreen;
