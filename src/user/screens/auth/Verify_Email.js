import React, { useEffect, useRef, useState } from 'react';
import { COLOURS } from '../../../assets/theme/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { StatusBar, TextInput, View, StyleSheet, ImageBackground } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import Back_Arrow from '../../../components/Back_Arrow';
import Outline_Text from '../../../components/Outline_Text';
import Modal_Verify from '../../../components/Modal_Verify';

import { useLoader } from '../../../loading/LoaderContext';
import { resendOtp, verifyOtp } from './auth_backend/Auth_Backend';
import { showError, showSuccess } from '../../../helper/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wait_Modal from '../../../components/Wait_Modal';


const Verify_Email = ({ navigation, route }) => {

    const { setLoading } = useLoader();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEmail, setModalEmail] = useState('');
    const [modalLoading, setModalLoading] = useState(false);


    const [rateLimitModal, setRateLimitModal] = useState(false);
    const [rateLimitMessage, setRateLimitMessage] = useState('');

    const { email } = route.params;
    useEffect(() => {
        setModalEmail(email);
    }, [email]);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const et1 = useRef();
    const et2 = useRef();
    const et3 = useRef();
    const et4 = useRef();
    const et5 = useRef();
    const et6 = useRef();

    const handleOtpChange = (txt, index) => {
        const newOtp = [...otp];
        newOtp[index] = txt;
        setOtp(newOtp);
    };

    const handleSubmit = () => {
        if (otp.some(digit => digit === '')) {
            showError('Please enter complete OTP');
            return;
        }
        handleApiCall();
    };

    const handleApiCall = async () => {
        try {
            setLoading(true);
            const otpString = otp.join('');
            const data = await verifyOtp({ email, otp: otpString });
            showSuccess(data?.message || 'OTP verified!');
            await AsyncStorage.setItem('token', data?.data?.token);
            console.log('verify_token', data?.data?.token)
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.Bottom_Navigation }],
            });
        } catch (error) {
            console.log('error.code', error.code)
            if (error.code === 410) { // OTP expired => modal open
                setModalEmail(email); // email already 
                setModalVisible(true);
            } else {
                showError(error.message || 'Invalid OTP. Try again!');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleModalSubmit = async () => {
        if (!modalEmail) {
            showError('Please enter your email');
            return;
        }
        try {
            setLoading(true);
            setModalLoading(true);
            const data = await resendOtp({ email: modalEmail });
            showSuccess(data?.message || 'OTP sent successfully');
            setModalVisible(false);
            setOtp(['', '', '', '', '', '']); // ✅ old OTP clear
        } catch (error) {
            if (error.code === 429) {
                setModalVisible(false);
                setRateLimitMessage('please wait 1 minute before requesting another OTP');
                setRateLimitModal(true);
            } else {
                console.log(error.message || 'Something went wrong. Try again!');
            }
            console.log(error.message || 'Something went wrong. Try again!');
        } finally {
            setLoading(false);
            setModalLoading(false);
        }
    };

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.transparent}
            />
            <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: COLOURS.white }}>
                <View>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={styles.short_container}>

                            <Back_Arrow label={'OTP'} />

                            <Title_Here title={'verify mobile number'}
                                color={COLOURS.black}
                                textAlign={'center'}
                                marginTop={responsiveWidth(10)}
                                marginBottom={responsiveWidth(2)}
                                fontSize={responsiveFontSize(2.5)}
                            />

                            <Title_Here title={'enter 6 digit code sent to your email...'}
                                color={COLOURS.black}
                                textAlign={'center'}
                                marginTop={responsiveWidth(1)}
                                marginBottom={responsiveWidth(8)}
                                fontSize={responsiveFontSize(1.7)}
                            />

                            <View style={styles.otp_Container}>
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[0] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et1} maxLength={1} value={otp[0]}
                                    onChangeText={txt => { handleOtpChange(txt, 0); if (txt.length >= 1) et2.current.focus(); }}
                                />
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[1] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et2} maxLength={1} value={otp[1]}
                                    onChangeText={txt => { handleOtpChange(txt, 1); if (txt.length >= 1) et3.current.focus(); else et1.current.focus(); }}
                                />
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[2] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et3} maxLength={1} value={otp[2]}
                                    onChangeText={txt => { handleOtpChange(txt, 2); if (txt.length >= 1) et4.current.focus(); else et2.current.focus(); }}
                                />
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[3] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et4} maxLength={1} value={otp[3]}
                                    onChangeText={txt => { handleOtpChange(txt, 3); if (txt.length >= 1) et5.current.focus(); else et3.current.focus(); }}
                                />
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[4] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et5} maxLength={1} value={otp[4]}
                                    onChangeText={txt => { handleOtpChange(txt, 4); if (txt.length >= 1) et6.current.focus(); else et4.current.focus(); }}
                                />
                                <TextInput
                                    style={[styles.name_inpt, {
                                        backgroundColor: COLOURS.transparent,
                                        borderColor: otp[5] === '' ? COLOURS.light_black : COLOURS.green,
                                        borderWidth: 1, color: COLOURS.black
                                    }]}
                                    keyboardType='numeric' ref={et6} maxLength={1} value={otp[5]}
                                    onChangeText={txt => { handleOtpChange(txt, 5); if (txt.length < 1) et5.current.focus(); }}
                                />
                            </View>

                            <View style={styles.btn_area}>
                                <Button label={'Submit'} onPress={handleSubmit}
                                // onPress={() => navigation.navigate(routeName.Bottom_Nav)}
                                />
                            </View>

                            <View>
                                <Outline_Text text={'resend OTP'} width={responsiveWidth(22)} onPress={() => setModalVisible(true)} />
                            </View>

                        </View>
                        <Modal_Verify
                            modalVisible={modalVisible}
                            setModalVisible={setModalVisible}
                            modalEmail={modalEmail}
                            setModalEmail={setModalEmail}
                            handleModalSubmit={handleModalSubmit}
                            loading={modalLoading}
                        />
                        <Wait_Modal
                            visible={rateLimitModal}
                            message={rateLimitMessage}
                            onClose={() => setRateLimitModal(false)}
                        />
                    </ImageBackground>
                </View >
            </SafeAreaView >
        </>
    )
}

export default Verify_Email


const styles = StyleSheet.create({

    container: {
        height: '100%',
        width: '100%',
    },

    login_img: {
        width: '100%',
        height: '100%',
    },

    short_container: {
        // marginTop: '22%',
        marginHorizontal: responsiveWidth(2),
    },

    otp_Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    name_inpt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        // fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(2.5),
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(1),
        marginHorizontal: responsiveWidth(2),
    },

    btn_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(2),
        // marginBottom: responsiveWidth(-4),
    },


})
