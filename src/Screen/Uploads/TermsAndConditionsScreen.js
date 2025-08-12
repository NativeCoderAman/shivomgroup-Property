import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../Components/headers/Header';
import {colors} from '../../Utils/Colors';
import {moderateScale} from '../../Utils/Metrics';
import {useDispatch, useSelector} from 'react-redux';
import {
  addTermsAndConditionsThunkAPI,
  deleteTermsAndConditionsThunkAPI,
  getInvoiceTermsAndCondtionsThunkAPI,
} from '../../Service/api/thunks';
import Loader from '../../Utils/Loader';
import alertMessage from '../../Utils/alert';

const TermsAndConditionsScreen = () => {
  const dispatch = useDispatch();
  const {
    getInvoiceTermsAndCondtionsResponse,
    addTermsAndConditionsResponse,
    deleteTermsAndConditionsResponse,
  } = useSelector(state => state.root.bussinessData);
  const [terms, setTerms] = useState({termsandconditions: ''});

  useEffect(() => {
    dispatch(getInvoiceTermsAndCondtionsThunkAPI());
  }, [dispatch]);

  const handleDelete = id => {
    Alert.alert('Delete', 'Do you want to Delete Terms and Conditions ?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          dispatch(deleteTermsAndConditionsThunkAPI(id))
            .then(res => {
              
              if (res?.payload?.status === true) {
                dispatch(getInvoiceTermsAndCondtionsThunkAPI());
                Alert.alert('Success', res.payload.message);
              } else {
                Alert.alert('Error', 'Something Went wrong!');
              }
            })
            .catch(err => {
              alertMessage('Something went wrong');
              
            }),
      },
    ]);
  };
  const handleSubmit = () => {
    if (terms.termsandconditions) {
      dispatch(addTermsAndConditionsThunkAPI(terms))
        .then(res => {
          
          if (res?.payload?.status === true) {
            setTerms({termsandconditions: null});

            Alert.alert(res.payload.message);
            dispatch(getInvoiceTermsAndCondtionsThunkAPI());
          } else {
            Alert.alert('Error', 'Something Went wrong!');
          }
        })
        .catch(err => {
          alertMessage('Something went wrong');
          
        });
    } else {
      alertMessage('Field is required');
    }
  };

  const renderItem = ({item}, i) => (
    <View style={styles.listItem}>
      <Text style={styles.text}>{i}</Text>
      <Text style={styles.listItemText}>{item.termsandconditions}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Icon name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Header title={'Sales T&C'} /> */}
      <Loader
        loading={
          getInvoiceTermsAndCondtionsResponse?.loading ||
          addTermsAndConditionsResponse?.loading ||
          deleteTermsAndConditionsResponse
        }
      />
      <View style={styles.inputContainer}>
        {/* <TextInput placeholder="S.No" style={styles.input} /> */}
        <TextInput
          placeholder="Insert Text"
          value={terms?.termsandconditions}
          onChangeText={text => {
            setTerms({termsandconditions: text});
          }}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={terms ? false : true}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: '87%'}}>
        <FlatList
          data={getInvoiceTermsAndCondtionsResponse?.response}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text style={[styles.text, {fontSize: moderateScale(16)}]}>
                No Data Found
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    flex: 1,
    marginRight: 8,
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 10,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: 'Roboto-Regular',
  },
  list: {
    margin: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
  },
  listItemText: {
    // flex: 1,
    width: '85%',
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    textTransform: 'capitalize',
  },
  text: {
    // flex: 1,
    color: colors.black,
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Regular',
  },
});

export default TermsAndConditionsScreen;
