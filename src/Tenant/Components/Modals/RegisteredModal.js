import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../Utils/Colors';
import { useDispatch } from 'react-redux';
import { logoutClient } from '../../../Hooks/useAuth';

const { height, width } = Dimensions.get('window');

const RegisteredModal = ({ navigation }) => {
    const dispatch = useDispatch();
    const handlePress = () => {
        dispatch(logoutClient());
        navigation.replace('SwitchRole');
    };

    return (
        <Modal
            visible={true}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Icon name="shield-account" size={32} color={colors.white} />
                        </View>
                        <Text style={styles.title}>Registration recovery</Text>
                    </View>

                    {/* Body Content */}
                    <View style={styles.modalBody}>
                        <Icon
                            name="account-question"
                            size={42}
                            color={colors.AppDefaultColor}
                            style={styles.mainIcon}
                        />
                        <Text style={styles.primaryText}>
                            Your registration with this business is already exists, but
                        </Text>
                        <Text style={styles.secondaryText}>
                            it is inactive please contact your admin  to re-active you registration account
                        </Text>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.logoutButton,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={handlePress}
                        >
                            <Icon name="logout-variant" size={22} color="white" />
                            <Text style={styles.buttonText}>Confirm Logout</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        backdropFilter: 'blur(2px)', // Works in some React Native implementations
    },
    modalContent: {
        height: height * 0.55,
        backgroundColor: colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
    },
    header: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 16,
        marginBottom: 24,
    },
    iconContainer: {
        backgroundColor: colors.AppDefaultColor,
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -40 }],
        marginBottom: -24,
        elevation: 6,
        shadowColor: colors.AppDefaultColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        letterSpacing: 0.4,
    },
    modalBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: 16,
    },
    mainIcon: {
        marginBottom: 12,
    },
    primaryText: {
        color: '#1f2937',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 26,
        letterSpacing: 0.2,
    },
    secondaryText: {
        color: '#6b7280',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 8,
    },
    footer: {
        marginTop: 24,
    },
    logoutButton: {
        backgroundColor: colors.AppDefaultColor,
        borderRadius: 14,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        elevation: 5,
        shadowColor: colors.AppDefaultColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
});

export default RegisteredModal;