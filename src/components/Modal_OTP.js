import React, { useState, useRef } from 'react'
import { showError, showSuccess } from '../helper/Helper';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Animated, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

const Modal_OTP = ({
    modalVisible,
    setModalVisible,
    email,
    handleOtpSubmit,
    loading,
    type,
    backgroundColor,
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);   // 4 → 6 empty strings
    const inputs = useRef([]);
    const { theme: COLOURS, isDark } = useTheme();

    const handleChange = (text, index) => {
        if (!/^\d*$/.test(text)) return; // sirf numbers
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // agle box pe jao
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // backspace per pichle box pe jao
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const otpString = otp.join('');
        if (otpString.length < 6 || otp.some(digit => digit === '')) {
            showError('All fields are required!');
            return;
        }
        handleOtpSubmit(otpString);
    };

    const handleClose = () => {
        setOtp(['', '', '', '', '', ''])
        setModalVisible(false);
    };

    const scaleAnim = useRef(new Animated.Value(1)).current

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.90,
            useNativeDriver: true,
        }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start()
    }

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={[styles.modalOverlay, { backgroundColor: backgroundColor || 'rgba(0,0,0,0.5)', }]}>
                <View style={[styles.modalBox, { backgroundColor: COLOURS.white }]}>

                    <Text style={[styles.modalTitle, { color: COLOURS.black }]}>Verify {type === 'phone' ? 'Phone' : 'Email'}</Text>
                    <Text style={[styles.modalSubtitle, { color: COLOURS.grey }]}>
                        check your new {type === 'phone' ? 'phone number' : 'email'} {'\n'}
                        <Text style={[styles.emailText, { color: COLOURS.primary }]}>{email}</Text>
                    </Text>

                    {/* 4 OTP Boxes */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    { borderColor: digit ? COLOURS.primary : '#ddd' },
                                    digit && styles.otpInputFilled,
                                    { color: COLOURS.black }
                                ]}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                textAlign="center"
                                selectTextOnFocus
                            />
                        ))}
                    </View>
                    <TouchableOpacity
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.95}
                        style={[styles.modalBtn, { marginBottom: responsiveWidth(0) }]}
                    >
                        <Animated.View
                            style={[
                                styles.modalBtn,
                                { backgroundColor: COLOURS.dark_primary },
                                loading && { opacity: 0.7 },
                                { transform: [{ scale: scaleAnim }] }
                            ]}
                        >
                            <Text style={[styles.modalBtnText, { color: COLOURS.black }]}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClose}>
                        <Text style={[styles.modalCancel, { color: '#999', }]}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

export default Modal_OTP

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '90%',              // 85 → 90, thoda extra room diya
        borderRadius: 16,
        padding: 20,                // 24 → 20, thoda kam padding
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    emailText: {
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    otpInput: {
        width: responsiveWidth(11),
        height: responsiveWidth(13),
        borderWidth: 1.5,
        borderRadius: 10,
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    otpInputFilled: {},
    modalBtn: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalBtnText: {
        fontSize: 15,
        fontWeight: '600',
    },
    modalCancel: {
        fontSize: 13,
        marginTop: 4,
    },
})