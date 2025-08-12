import React from 'react';
import {Pressable, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Divider, TextInput, Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {colors} from '../../Utils/Colors';
import {createPartyThunkApi} from '../../Service/slices/salePartySlice';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../Utils/Loader';
import {getCustomSalePartyDetailsThunkApi} from '../../Service/api/thunks';

const validationSchema = Yup.object().shape({
  party_name: Yup.string().required('Party Name is required'),
  party_mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile is required'),
  party_email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  party_address: Yup.string().required('Address is required'),
});

const AddNewParty = ({bottomSheetRef, snapPoints}) => {
  const {postPartyData} = useSelector(state => state.root.salePartyData);
  const dispatch = useDispatch();
  
  const handleSubmit = async (values) => {
    try {
        const response = await dispatch(createPartyThunkApi(values));

        if (response?.payload?.status === true) {
            await dispatch(getCustomSalePartyDetailsThunkApi());
            ToastAndroid.show(response?.payload?.message, ToastAndroid.LONG);
            bottomSheetRef.current.dismiss();
        } else {
            ToastAndroid.show(response?.payload?.message, ToastAndroid.LONG);
        }
    } catch (error) {
        console.error("Error: ", error);
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
};


  return (
    <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints}>
      <Loader loading={postPartyData.loading} />
      <Text style={styles.title}>Add New Party</Text>
      <Divider />
      <BottomSheetView style={styles.container}>
        <Formik
          initialValues={{
            party_name: '',
            party_mobile: '',
            party_email: '',
            party_address: '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => handleSubmit(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInput
                style={styles.input}
                label="Party Name"
                placeholder="Party Name"
                mode="outlined"
                value={values.party_name}
                onChangeText={handleChange('party_name')}
                onBlur={handleBlur('party_name')}
                error={touched.party_name && errors.party_name}
                theme={{colors: styles.theme}}
              />
              {touched.party_name && errors.party_name && (
                <Text style={styles.errorText}>{errors.party_name}</Text>
              )}

              <TextInput
                style={styles.input}
                label="Mobile"
                placeholder="Mobile"
                mode="outlined"
                keyboardType="numeric"
                value={values.party_mobile}
                onChangeText={handleChange('party_mobile')}
                onBlur={handleBlur('party_mobile')}
                error={touched.party_mobile && errors.party_mobile}
                maxLength={10}
                theme={{colors: styles.theme}}
              />
              {touched.party_mobile && errors.party_mobile && (
                <Text style={styles.errorText}>{errors.party_mobile}</Text>
              )}

              <TextInput
                style={styles.input}
                label="Email"
                placeholder="Email"
                mode="outlined"
                keyboardType="email-address"
                value={values.party_email}
                onChangeText={handleChange('party_email')}
                onBlur={handleBlur('party_email')}
                error={touched.party_email && errors.party_email}
                theme={{colors: styles.theme}}
              />
              {touched.party_email && errors.party_email && (
                <Text style={styles.errorText}>{errors.party_email}</Text>
              )}

              <TextInput
                style={styles.input}
                label="Address"
                placeholder="Address"
                mode="outlined"
                value={values.party_address}
                onChangeText={handleChange('party_address')}
                onBlur={handleBlur('party_address')}
                error={touched.party_address && errors.party_address}
                theme={{colors: styles.theme}}
              />
              {touched.party_address && errors.party_address && (
                <Text style={styles.errorText}>{errors.party_address}</Text>
              )}

              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>SUBMIT</Text>
              </Pressable>
            </>
          )}
        </Formik>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default AddNewParty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.AppDefaultColor,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.white, // Ensure the text color contrasts with the button background
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 5,
  },
  theme: {
    primary: colors.darkgrey, // Custom border color
    placeholder: 'darkgrey', // Custom placeholder color
    text: colors.black, // Custom text color
  },
});
