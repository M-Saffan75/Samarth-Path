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
import { loginUser, resendOtp } from './auth_backend/Auth_Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logiin = ({ navigation }) => {



    const { setLoading } = useLoader();

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rateLimitModal, setRateLimitModal] = useState(false);
    const [rateLimitMessage, setRateLimitMessage] = useState('');

    const handleLogin = () => {
        // Name
        if (!email.trim()) {
            showError('Email is required');
            return;
        }
        // Password
        if (!password.trim()) {
            showError('Password is required');
            return;
        }
        handleApiCall();
    };

    const handleApiCall = async () => {
        try {
            setLoading(true);
            const data = await loginUser({ email, password });
            console.log('logindata:', data);
            await AsyncStorage.setItem('token', data?.data?.token);
            showSuccess(data?.message || 'Login successful');
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.Bottom_Navigation }],
            });
        } catch (error) {
            if (error.code === 403) {
                try {
                    setLoading(true);
                    const resendData = await resendOtp({ email });
                    showSuccess(resendData?.message || 'OTP sent successfully');
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: UserRoutes.Verify_Email,
                            params: { email },
                        }],
                    });
                } catch (resendError) {
                    if (resendError.code === 429) {
                        setRateLimitMessage('please wait 1 minute before requesting another OTP');
                        setRateLimitModal(true);
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
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.white}
            />
            <SafeAreaView>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={[styles.login_area]}>
                            <Back_Arrow label={'sign In'} />

                            <Title_Here title={'welcome back'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(2.5)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(2)}
                                marginTop={responsiveWidth(10)}
                            />

                            <Title_Here title={'being your spiritual energy with samarth path'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(8)}
                                marginTop={responsiveWidth(1)}
                            />

                            {/* <Title_Here title={'mobile number'} color={COLOURS.black} />
                            <Number_Select value={phone} onChangeText={setPhone} /> */}
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

                            <TouchableOpacity activeOpacity={0.7} style={styles.forgot_text} onPress={() => navigation.navigate(UserRoutes.Forgot_Password)}>
                                <Title_Here title={'forgot password ?'} color={COLOURS.primary} fontSize={responsiveFontSize(1.6)}
                                    marginTop={0} marginRight={0} />
                            </TouchableOpacity>

                            <View style={styles.btn_area}>
                                <Button label={'sign in'} onPress={handleLogin}
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
                    <Wait_Modal
                        visible={rateLimitModal}
                        message={rateLimitMessage}
                        onClose={() => setRateLimitModal(false)}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

export default Logiin


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