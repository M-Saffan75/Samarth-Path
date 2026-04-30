import React, { useState } from 'react'
import { COLOURS } from '../../../assets/theme/Theme';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageBackground, StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import Back_Arrow from '../../../components/Back_Arrow';
import Wait_Modal from '../../../components/Wait_Modal';
import Input_Field from '../../../components/Input_Field';
import { SafeAreaView } from 'react-native-safe-area-context';
import Number_Select from '../../../components/Number_Select';

import { useLoader } from '../../../loading/LoaderContext';
import { showError, showSuccess } from '../../../helper/Helper';
import { registerUser, resendOtp } from '../../../user/screens/auth/auth_backend/Auth_Backend';

const Register = ({ navigation }) => {


    const { setLoading } = useLoader();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rateLimitModal, setRateLimitModal] = useState(false);
    const [rateLimitMessage, setRateLimitMessage] = useState('');



    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character';
        return null;
    };

    const handleRegister = () => {
        // Name
        if (!phone) {
            showError('Phone number is required');
            return;
        }
        if (!name.trim()) {
            showError('Name is required');
            return;
        }
        // Email
        if (!email.trim()) {
            showError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        // Password
        if (!password.trim()) {
            showError('Password is required');
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            showError(passwordError);
            return;
        }
        // Confirm Password
        if (!confirmPassword.trim()) {
            showError('Confirm password is required');
            return;
        }
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        handleApiCall();
    };

    const handleApiCall = async () => {
        try {
            setLoading(true);
            const data = await registerUser({ name, phone, email, password });
            navigation.replace(UserRoutes.Verify_Email, {
                phone: data?.data?.phone,
            });
            showSuccess(data?.message || 'Registration successful');
        } catch (error) {
            if (error.code === 408) {
                try {
                    setLoading(true);
                    const resendData = await resendOtp({ phone });
                    showSuccess(resendData?.message || 'OTP sent successfully');
                    navigation.replace(UserRoutes.Verify_Email, {
                        phone: data?.data?.phone,
                    });
                } catch (resendError) {
                    if (resendError.code === 429) {
                        setRateLimitMessage('wait 1 minute before requesting another OTP');
                        setRateLimitModal(true);
                        console.log('429 error:', resendError.message);
                    } else {
                        console.log(resendError.message || 'Something went wrong. Try again!');
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                showError(error.message || 'Something went wrong. Try again!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLOURS.white} />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.white }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='handled'
                        >

                            <View style={[styles.login_area]}>
                                <Back_Arrow label={'sign up'} />

                                <Title_Here title={'create account'}
                                    color={COLOURS.black}
                                    textAlign={'center'}
                                    marginTop={responsiveWidth(10)}
                                    marginBottom={responsiveWidth(2)}
                                    fontSize={responsiveFontSize(2.5)}
                                />

                                <Title_Here title={'being your spiritual energy with samarth path'}
                                    color={COLOURS.black}
                                    textAlign={'center'}
                                    marginTop={responsiveWidth(1)}
                                    marginBottom={responsiveWidth(8)}
                                    fontSize={responsiveFontSize(1.7)}
                                />

                                <Title_Here title={'mobile number'} color={COLOURS.black} />
                                <Number_Select value={phone} onChangeText={setPhone} />


                                <Title_Here title={'name'} color={COLOURS.black} marginTop={responsiveWidth(2)} />
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'Your name'}
                                    first_inpt_Img={globalImages.user_filled}
                                    tintColor={COLOURS.grey}
                                    value={name}
                                    onChangeText={setName}
                                />

                                <Title_Here title={'email'} color={COLOURS.black} marginTop={0} />
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'Your email'}
                                    first_inpt_Img={globalImages.envelope_filled}
                                    tintColor={COLOURS.grey}
                                    value={email}
                                    onChangeText={setEmail}
                                />

                                <Title_Here title={'password'} color={COLOURS.black} marginTop={0} />
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'Password'}
                                    first_inpt_Img={globalImages.pswd_key}
                                    Second_inpt_Img={globalImages.eye}
                                    tintColor={COLOURS.grey}
                                    width={responsiveWidth(4.5)}
                                    height={responsiveWidth(4.5)}
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Title_Here title={'confirm password'} color={COLOURS.black} marginTop={0} />
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'Confirm Password'}
                                    first_inpt_Img={globalImages.pswd_key}
                                    Second_inpt_Img={globalImages.eye}
                                    tintColor={COLOURS.grey}
                                    width={responsiveWidth(4.5)}
                                    height={responsiveWidth(4.5)}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />



                                <View style={styles.btn_area}>
                                    <Button label={'Send OTP'} onPress={handleRegister}
                                    />
                                </View>


                                <View style={styles.dont_accnt}>
                                    <Text style={[styles.dont_text_1, { color: COLOURS.black }]}>Already have an account ?</Text>
                                    <TouchableOpacity activeOpacity={0.6}
                                        onPress={() => navigation.replace(UserRoutes.Login)}
                                    >
                                        <Text style={[styles.dont_text_2, { color: COLOURS.primary }]}> sign In</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </ScrollView>
                    </View>
                    <Wait_Modal
                        visible={rateLimitModal}
                        message={rateLimitMessage}
                        onClose={() => setRateLimitModal(false)}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default Register


const styles = StyleSheet.create({

    /*  */

    dont_text_2: {
        fontFamily: 'Inter-Bold',
        fontSize: responsiveFontSize(1.7),
        textTransform: 'capitalize',
    },

    dont_text_1: {
        fontFamily: 'Inter-Medium',
        fontSize: responsiveFontSize(1.7),
    },

    dont_accnt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: responsiveWidth(10)
    },

    /*  */

    btn_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(2),
        marginBottom: responsiveWidth(-4),
    },

    login_area: {
        // marginTop: '-14%'
        // backgroundColor: 'red'
    },

    login_img: {
        width: '100%',
        height: '100%',
    },

    container: {
        height: '100%',
        width: '100%',
    },

})