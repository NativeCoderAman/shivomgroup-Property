import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Modal from 'react-native-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { getSubscriptionPage } from '../../Service/api/thunks';
import alertMessage from '../../Utils/alert';
import {
    height,
    horizontalScale,
    moderateScale,
    verticalScale,
    width,
} from '../../Utils/Metrics';
import { colors } from '../../Utils/Colors';

const validationSchema = Yup.object().shape({
    wantToupgradeSeats: Yup.string().required('Seats is required'),
});

const UpgradeOptions_Modal = ({
    isVisible,
    onClose,
    data,
    selectedStatus,
    navigation,
}) => {
    const [isAddOnSeat, setIsAddOnSeat] = useState(false);

    const INITIAL_DATA = {
        wantToupgradeSeats: null,
        selectedPlanId: data?.id,
        upgradeType: 'seatUpgrade',
        currentPlanCode: data?.packagecode,
    };

    const dispatch = useDispatch();

    const handleModalClose = () => {
        setIsAddOnSeat(false);
        onClose();
    };

    const handleSubmit = values => {
        dispatch(getSubscriptionPage(values))
            .then(res => {
                if (res?.payload) {
                    setIsAddOnSeat(false);
                    handleModalClose();
                    navigation.navigate('Payment', { data: res.payload });
                } else {
                    alertMessage(res?.payload?.error);
                }
            })
            .catch(() => { });
    };

    return (
        <Modal
            isVisible={isVisible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            onBackdropPress={handleModalClose}
            style={styles.modalWrapper}>

            {/* Default Upgrade Options View */}
            {!isAddOnSeat && (
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Upgrade Options</Text>
                    <View style={styles.content}>
                        <View style={styles.details}>
                            <Text style={[styles.title, { fontSize: moderateScale(14) }]}>Your Plan Details</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Selected Plan:</Text>
                                <Text style={styles.value}>
                                    {`${data?.packageName} (${data?.planDuration}) (${data?.planType})`}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Current Plan:</Text>
                                <Text style={styles.value}>
                                    {`${data?.selectedPlandDetails?.package_type} (1 year) (Mobile)`}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: colors.lightygrey }]}
                                onPress={() => setIsAddOnSeat(true)}>
                                <Text style={styles.text}>Add on Seat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleSubmit({
                                    ...INITIAL_DATA,
                                    wantToupgradeSeats: '0',
                                })}>
                                <Text style={[styles.text, { color: colors.white }]}>Upgrade {selectedStatus ? 'AddOns' : 'Plan'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Close icon only on default view */}
                    <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                        <Icon name="xmark" size={15} color={colors.white} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Add More Seats View */}
            {isAddOnSeat && (
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add More Seats?</Text>

                    <Formik
                        initialValues={{ ...INITIAL_DATA }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({ handleChange, handleSubmit, values, errors, touched }) => (
                            <>

                                <Text style={styles.currentSeats}>
                                    Current Seats: {data?.currentTotalSeats}
                                </Text>
                                {values.wantToupgradeSeats && (
                                    <Text style={styles.currentSeats}>
                                        Updated Seats: {values.wantToupgradeSeats
                                            ? parseInt(data?.currentTotalSeats || 0) + parseInt(values.wantToupgradeSeats || 0)
                                            : data?.currentTotalSeats}
                                    </Text>
                                )}

                                <View style={styles.inputView}>
                                    <TextInput
                                        onChangeText={handleChange('wantToupgradeSeats')}
                                        value={values.wantToupgradeSeats}
                                        placeholder="Enter number of seats"
                                        placeholderTextColor={colors.grey}
                                        style={styles.text}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {errors.wantToupgradeSeats && touched.wantToupgradeSeats && (
                                    <Text style={styles.error}>{errors.wantToupgradeSeats}</Text>
                                )}

                                <View style={styles.actionRow}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleSubmit}>
                                        <Text style={[styles.text, { color: colors.white }]}>Confirm Change</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: colors.lightygrey }]}
                                        onPress={() => setIsAddOnSeat(false)}>
                                        <Text style={styles.text}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            )}
        </Modal>
    );
};

export default UpgradeOptions_Modal;

const styles = StyleSheet.create({
    modalWrapper: { justifyContent: 'center', alignItems: 'center' },
    modalContainer: {
        width: '90%',
        borderRadius: horizontalScale(10),
        backgroundColor: colors.white,
        padding: moderateScale(16),
        alignSelf: 'center',
    },
    title: {
        fontSize: moderateScale(16),
        color: colors.black,
        alignSelf: 'center',
        marginBottom: verticalScale(12),
        fontFamily: 'Roboto-Medium',
    },
    details: { borderWidth: 1, borderColor: colors.black, padding: moderateScale(8), marginBottom: verticalScale(20) },
    row: { flexDirection: 'row', gap: horizontalScale(6), marginTop: verticalScale(4) },
    label: { fontSize: moderateScale(12), fontFamily: 'Roboto-Medium', color: colors.black },
    value: { fontSize: moderateScale(12), fontFamily: 'Roboto-Regular', color: colors.black },
    content: { paddingBottom: verticalScale(20) },
    actionRow: { flexDirection: 'row', justifyContent: 'center', gap: horizontalScale(12), marginTop: verticalScale(10) },
    button: { height: verticalScale(45), justifyContent: 'center', alignItems: 'center', paddingHorizontal: horizontalScale(20), backgroundColor: colors.AppDefaultColor, borderRadius: horizontalScale(5) },
    inputView: { width: '100%', height: verticalScale(50), borderWidth: 1, borderColor: colors.grey, borderRadius: horizontalScale(4), paddingHorizontal: horizontalScale(12), marginBottom: verticalScale(8) },
    text: { fontSize: moderateScale(12), fontFamily: 'Roboto-Medium', color: colors.black },
    currentSeats: { fontSize: moderateScale(14), fontFamily: 'Roboto-Regular', color: colors.black, alignSelf: 'center', marginBottom: verticalScale(12) },
    closeButton: { position: 'absolute', top: -verticalScale(10), right: -horizontalScale(10), height: verticalScale(25), width: verticalScale(25), borderRadius: horizontalScale(30), backgroundColor: colors.red, justifyContent: 'center', alignItems: 'center' },
    error: { color: colors.red, fontSize: moderateScale(12), fontFamily: 'Roboto-Medium', marginBottom: verticalScale(4) },
});