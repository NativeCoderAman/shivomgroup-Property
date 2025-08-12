import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
} from '../../Utils/Metrics';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../Utils/Colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import alertMessage from '../../Utils/alert';
import {
  addAttendanceThunkAPI,
  getEmpAttendaceThunkAPI,
  getEmpTotalAttendaceThunkAPI,
  updateEmpAttendaceThunkAPI,
} from '../../Service/api/thunks';

const UpdateAttendance_Modal = ({isVisible, onClose, data}) => {
  const validationSchema = Yup.object().shape({
    status: Yup.string().required('Selection is required'),
  });
  const dispatch = useDispatch();
  const INITIAL_DATA = {status: data?.status ? data.status : null};
  const [openPicker, setOpenPicker] = useState(false);
  const handleSubmit = values => {
    if (data?.id) {
      dispatch(updateEmpAttendaceThunkAPI({id: data?.id, data: values}))
        .then(res => {
          
          if (res?.payload?.status === true) {
            alertMessage(res?.payload?.message);
            dispatch(getEmpTotalAttendaceThunkAPI(data?.emp_id));
            dispatch(getEmpAttendaceThunkAPI(data?.emp_id));
            onClose();
          } else {
            alertMessage('Something went wrong!');
          }
        })
        .catch(err => {
          alertMessage('Something went wrong!');
        });
    } else {
      dispatch(
        addAttendanceThunkAPI({
          id: data?.emp_id,
          data: {date: data?.date, status: values?.status},
        }),
      )
        .then(res => {
          
          if (res?.payload?.status === true) {
            alertMessage(res?.payload?.message);
            dispatch(getEmpTotalAttendaceThunkAPI(data?.emp_id));
            dispatch(getEmpAttendaceThunkAPI(data?.emp_id));
            onClose();
          } else {
            alertMessage('Something went wrong!');
          }
        })
        .catch(err => {
          alertMessage('Something went wrong!');
        });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={() => {
        onClose();
      }}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Attendance</Text>
        <View style={styles.content}>
          <Formik
            enableReinitialize={true}
            initialValues={INITIAL_DATA}
            validationSchema={validationSchema}
            onSubmit={values => handleSubmit(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setValues,
              errors,
              touched,
            }) => (
              <>
                <View style={{gap: 5}}>
                  <Text style={styles.inputTitle}>{'What Do You Want?'}</Text>
                  <DropDownPicker
                    open={openPicker}
                    value={values.status}
                    items={[
                      {value: 'P', lebel: 'Present'},
                      {value: 'A', lebel: 'Absent'},
                      {value: 'L', lebel: 'Leave'},
                      {value: 'H', lebel: 'Half Day'},
                    ]?.map((item, i) => ({
                      value: item.value,
                      label: item.lebel,
                    }))}
                    onSelectItem={item => setValues({status: item?.value})}
                    placeholder="What Do You Want?"
                    textStyle={styles.text}
                    scrollViewProps={{nestedScrollEnabled: true}}
                    autoScroll={true}
                    setOpen={setOpenPicker}
                    style={styles.inputView}
                    itemKey="value"
                    // keyExtractor={item => item.value.toString()} // Ensure each item has a unique key
                  />
                  {errors.status && touched.status ? (
                    <Text style={styles.error}>{errors.status}</Text>
                  ) : null}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={[styles.text, {color: colors.white}]}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>

        <TouchableOpacity
          onPress={() => {
            onClose();
          }}
          style={styles.closeButton}>
          <Icon name={'xmark'} size={15} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default UpdateAttendance_Modal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  modalContainer: {
    width: '100%',
    borderRadius: horizontalScale(10),
    backgroundColor: colors.white,
    alignSelf: 'center',
    top: verticalScale(20),
    padding: horizontalScale(20),
  },
  flexRowWithSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    color: colors.black,
    alignSelf: 'center',
  },
  content: {
    paddingTop: verticalScale(40),
    gap: verticalScale(20),
  },
  button: {
    height: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    backgroundColor: colors.AppDefaultColor,
    borderRadius: horizontalScale(5),
    // marginTop: verticalScale(20),
  },
  inputView: {
    width: '100%',
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  inputTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Roboto-Medium',
    color: colors.black,
  },
  text: {
    fontSize: moderateScale(12),
    fontFamily: 'Roboto-Regular',
    color: colors.grey,
  },
  closeButton: {
    height: verticalScale(25),
    width: verticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: horizontalScale(30),
    backgroundColor: colors.red,
    position: 'absolute',
    right: verticalScale(5),
    top: verticalScale(8),
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
