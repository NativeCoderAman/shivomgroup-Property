import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, TextInput, StyleSheet,
  Dimensions, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height } = Dimensions.get('window');
const STORAGE_KEY = 'BANK_DETAIL';

const BankDetailsScreen = () => {
  const [bankDetails, setBankDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setBankDetails(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load:', err);
      }
    };
    loadData();
  }, []);

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this bank detail?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            setBankDetails(null);
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      ]
    );
  };

  const handleEdit = () => setModalVisible(true);

  const handleSubmit = async (values, { resetForm }) => {
    const hasEmpty = Object.values(values).some(val => !val.trim());
    if (hasEmpty) return;

    setBankDetails(values);
    await saveData(values);
    resetForm();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {!bankDetails ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>You don't have any account added</Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Bank Name:  {bankDetails.bankName}</Text>
          <Text style={styles.label}>Account Holder Name:

            {bankDetails.accountHolder}</Text>
          <Text style={styles.label}>Account Number: {bankDetails.accountNumber}</Text>
          <Text style={styles.label}>IFSC Code: {bankDetails.ifscCode}</Text>
          <Text style={styles.label}>Branch Name: {bankDetails.branch}</Text>

          <View style={styles.cardButtonRow}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



      {!bankDetails && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add Bank Details

            </Text>

            <Formik
              initialValues={{
                bankName: bankDetails?.bankName || '',
                accountHolder: bankDetails?.accountHolder || '',
                accountNumber: bankDetails?.accountNumber || '',
                ifscCode: bankDetails?.ifscCode || '',
                branch: bankDetails?.branch || '',
              }}
              enableReinitialize
              onSubmit={handleSubmit}

              validate={(values) => {
                const errors = {};


                if (!values.bankName.trim()) {
                  errors.bankName = 'Bank Name is required';
                } else if (values.bankName.trim().length < 2) {
                  errors.bankName = 'Bank Name must be at least 2 characters';
                } else if (!/^[A-Za-z\s]+$/.test(values.bankName)) {
                  errors.bankName = 'Bank Name must contain only letters';
                }



                if (!values.accountHolder.trim()) {
                  errors.accountHolder = 'Account Holder is required';
                } else if (!/^[A-Za-z\s]+$/.test(values.accountHolder)) {
                  errors.accountHolder = 'Only letters allowed';
                }

                if (!values.accountNumber.trim()) {
                  errors.accountNumber = 'Account Number is required';
                } else if (!/^\d{9,18}$/.test(values.accountNumber)) {
                  errors.accountNumber = 'Must be 9 to 18 digits (numbers only)';
                }

                const trimmedIFSC = values.ifscCode.trim();
                if (!trimmedIFSC) {
                  errors.ifscCode = 'IFSC code is required';
                } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmedIFSC)) {
                  errors.ifscCode = 'Invalid IFSC format';
                }


                if (!values.branch.trim()) {
                  errors.branch = 'Branch Name is required';
                } else if (!/^[A-Za-z\s]+$/.test(values.branch)) {
                  errors.branch = 'Only letters allowed';
                }

                return errors;
              }}

            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  {[
                    { key: 'bankName', label: 'Bank Name' },
                    { key: 'accountHolder', label: 'Account Holder Name' },
                    { key: 'accountNumber', label: 'Account Number' },
                    { key: 'ifscCode', label: 'IFSC Code' },
                    { key: 'branch', label: 'Branch Name' },
                  ].map(({ key, label }) => (
                    <View key={key} style={{ marginBottom: 12 }}>
                   
                      <TextInput
                        placeholder={label}
                        value={values[key]}
                        style={styles.input}


                        onChangeText={(text) =>
                          ['bankName', 'accountHolder', 'branch'].includes(key)
                            ? handleChange(key)(text.replace(/[^A-Za-z\s]/g, ''))
                            : key === 'accountNumber'
                              ? handleChange(key)(text.replace(/[^0-9]/g, ''))
                              : key === 'ifscCode'
                                ? handleChange(key)(text.toUpperCase())
                                : handleChange(key)(text)
                        }

                        onBlur={handleBlur(key)}
                        placeholderTextColor={"#000000"}
                        maxLength={
                          key === 'ifscCode' ? 11 :
                            key === 'accountNumber' ? 18 : undefined
                        }
                        keyboardType={key === 'accountNumber' ? 'numeric' : 'default'}
                      />
                      {errors[key] && touched[key] && (
                        <Text style={styles.errorText}>{errors[key]}</Text>
                      )}

                      {key === 'ifscCode' && (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(values.ifscCode.trim())) && (

                        <Text style={styles.hintText}>
                          Ex: <Text style={{ fontWeight: 'bold' }}>ABCD0EF1234</Text> (4 capital letters + 0 + 6 alphanumeric)
                        </Text>

                      )}
                    </View>
                  ))}

                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>
                      {bankDetails ? 'Update' : 'Add'} Details
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default BankDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffffff',
    elevation: 15,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  cardButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 4,
  },

  editButton: {
    backgroundColor: '#fdbe0fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: '#FFD700',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: height,
    padding: 20,
    backgroundColor: '#fff',

  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#000000"
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#fdbe0fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelText: {
    marginTop: 10,
    color: '#999',
    textAlign: 'center',
  },
});
