import React, { useState } from 'react'
import { COLOURS } from '../../../assets/theme/Theme';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageBackground, StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';

import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import Back_Arrow from '../../../components/Back_Arrow';
import Input_Field from '../../../components/Input_Field';
import Number_Select from '../../../components/Number_Select';
import { SafeAreaView } from 'react-native-safe-area-context';

import Wait_Modal from '../../../components/Wait_Modal';
import { useLoader } from '../../../loading/LoaderContext';
import { showError, showSuccess } from '../../../helper/Helper';
import { forgotPassword, loginUser, resendOtp } from './auth_backend/Auth_Backend';

const Forgot_Password = ({ navigation }) => {


    const { setLoading } = useLoader();
    const [email, setEmail] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleForgotPassword = () => {
        if (!email.trim()) {
            showError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        handleApiCall();
    };

    const handleApiCall = async () => {
        try {
            setLoading(true);
            const data = await forgotPassword({ email });
            showSuccess(data?.message || 'OTP sent successfully!');
            setLoading(false)
            navigation.navigate(UserRoutes.Otp_Here, { email });
        } catch (error) {
            showError(error.message || 'Something went wrong. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.white}
            />
            <SafeAreaView>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={[styles.login_area]}>
                            <Back_Arrow label={'forgot password'} />

                            <Title_Here title={'Enter your email to reset your password'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(8)}
                                marginTop={responsiveWidth(5)}
                            />

                            {/* <Title_Here title={'mobile number'} color={COLOURS.black} />
                            <Number_Select value={phone} onChangeText={setPhone} /> */}
                            <Title_Here title={'email'} color={COLOURS.black} marginTop={responsiveWidth(10)} />
                            <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                borderWidth={1}
                                color={COLOURS.black}
                                Placeholder={'Your email'}
                                first_inpt_Img={globalImages.envelope_filled}
                                tintColor={COLOURS.grey}
                                value={email}
                                onChangeText={setEmail}
                            />

                            <View style={styles.btn_area}>
                                <Button label={'send otp'} onPress={handleForgotPassword}
                                />
                            </View>

                            <View style={styles.dont_accnt}>
                                <Text style={[styles.dont_text_1, { color: COLOURS.black }]}>Don't have an account ?</Text>
                                <TouchableOpacity activeOpacity={0.6}
                                    onPress={() => navigation.replace(UserRoutes.Register)}
                                >
                                    <Text style={[styles.dont_text_2, { color: COLOURS.primary }]}> sign up</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </ImageBackground>

                </View>
            </SafeAreaView>
        </>
    )
}

export default Forgot_Password


const styles = StyleSheet.create({


    forgot_text: {
        width: '36%',
        alignItems: 'flex-end',
        top: responsiveWidth(3),
        alignSelf: 'flex-end',
        left: responsiveWidth(-6)
    },

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