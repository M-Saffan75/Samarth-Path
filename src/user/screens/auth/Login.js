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
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserMe, loginUser, resendOtp } from './auth_backend/Auth_Backend';


import { useUser } from './user_context/UserContext';
import { FadeDown } from '../../../components/FadeDown';
import { FadeUp } from '../../../components/FadeUp';
import { FadeIn } from '../../../components/FadeIn';
import { FadeLeft } from '../../../components/FadeLeft';
import { FadeRight } from '../../../components/FadeRight';

const Login = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { setLoading } = useLoader();
    const { updateUser } = useUser();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rateLimitModal, setRateLimitModal] = useState(false);
    const [rateLimitMessage, setRateLimitMessage] = useState('');

    const handleLogin = () => {
        // Name
        if (!phone.trim()) {
            showError('Phone Number is required');
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
            const data = await loginUser({ phone, password });
            const user = await getUserMe(data?.data?.token);
            updateUser(user);
            await AsyncStorage.setItem('token', data?.data?.token);
            showSuccess(data?.message || 'Login successful');
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.Bottom_Navigation }],
            });
        } catch (error) {
            console.log('LOGIN ERROR:', error);
            setLoading(false);

            if (error.code === 403 && error.message?.includes('verify your phone')) {
                await handleUnverifiedUser();
                return;
            }

            if (error.code === 403 && (
                error.message?.includes('suspended') ||
                error.message?.includes('blocked')
            )) {
                navigation.navigate(UserRoutes.Suspended);
                return;
            }

            if (error.code === 403 && (
                error.message?.includes('Trial period expired') ||
                error.message?.includes('Subscription expired')
            )) {
                navigation.navigate(UserRoutes.PayWall);
                return;
            }

            showError(error.message || 'Something went wrong. Try again!');

        } finally {
            setLoading(false);
        }
    };

    // ✅ Resend OTP ka alag clean function
    const handleUnverifiedUser = async () => {
        try {
            setLoading(true);
            await resendOtp({ phone });
            showSuccess('OTP sent successfully');
            navigation.reset({
                index: 0,
                routes: [{
                    name: UserRoutes.Verify_Email,
                    params: { phone },
                }],
            });
        } catch (resendError) {
            console.log('RESEND OTP ERROR:', resendError);
            if (resendError.code === 429) {
                setRateLimitMessage('Please wait 1 minute before requesting another OTP');
                setRateLimitModal(true);
            } else {
                showError(resendError.message || 'Failed to send OTP');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={[styles.login_area]}>
                            <Back_Arrow label={'sign In'} />

                            <FadeDown>
                                <Title_Here title={'welcome back'}
                                    color={COLOURS.black}
                                    fontSize={responsiveFontSize(2.5)}
                                    textAlign={'center'}
                                    marginBottom={responsiveWidth(2)}
                                    marginTop={responsiveWidth(10)}
                                />

                            </FadeDown>

                            <FadeUp>
                                <Title_Here title={'being your spiritual energy with samarth path'}
                                    color={COLOURS.black}
                                    fontSize={responsiveFontSize(1.7)}
                                    textAlign={'center'}
                                    marginBottom={responsiveWidth(8)}
                                    marginTop={responsiveWidth(1)}
                                />
                            </FadeUp>

                            <FadeLeft>
                                <Title_Here title={'mobile number'} color={COLOURS.black} marginBottom={responsiveWidth(3)} />
                            </FadeLeft>
                            <FadeIn delay={300}>
                                <Number_Select value={phone} onChangeText={setPhone} />
                            </FadeIn>

                            <FadeLeft>
                                <Title_Here title={'password'} color={COLOURS.black} marginTop={responsiveWidth(4)} marginBottom={responsiveWidth(2)} />
                            </FadeLeft>

                            <FadeIn delay={400}>
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
                            </FadeIn>

                            <FadeRight>
                                <TouchableOpacity activeOpacity={0.7} style={styles.forgot_text} onPress={() => navigation.navigate(UserRoutes.Forgot_Password)}>
                                    <Title_Here title={'forgot password ?'} color={COLOURS.primary} fontSize={responsiveFontSize(1.6)}
                                        marginTop={0} marginRight={0} />
                                </TouchableOpacity>
                            </FadeRight>

                            <FadeUp>
                                <View style={styles.btn_area}>
                                    <Button label={'sign in'} onPress={handleLogin}
                                    />
                                </View>

                            </FadeUp>
                            <FadeIn delay={500}>
                                <View style={styles.dont_accnt}>
                                    <Text style={[styles.dont_text_1, { color: COLOURS.black }]}>Don't have an account ?</Text>
                                    <TouchableOpacity activeOpacity={0.6}
                                        onPress={() => navigation.replace(UserRoutes.Register)}
                                    >
                                        <Text style={[styles.dont_text_2, { color: COLOURS.primary }]}> sign up</Text>
                                    </TouchableOpacity>
                                </View>
                            </FadeIn>
                        </View>

                    </ImageBackground>
                    <Wait_Modal
                        visible={rateLimitModal}
                        message={rateLimitMessage}
                        onClose={() => setRateLimitModal(false)}
                    />
                </View >
            </SafeAreaView >
        </>
    )
}

export default Login


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