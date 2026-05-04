import React, { useState } from 'react'
import { COLOURS } from '../../../assets/theme/Theme';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageBackground, StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';

import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import Back_Arrow from '../../../components/Back_Arrow';
import Number_Select from '../../../components/Number_Select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';


import { useLoader } from '../../../loading/LoaderContext';
import { forgotPassword } from './auth_backend/Auth_Backend';
import { showError, showSuccess } from '../../../helper/Helper';

const Forgot_Password = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { setLoading } = useLoader();
    const [phone, setPhone] = useState('');


    const handleForgotPassword = () => {
        if (!phone.trim()) {
            showError('Phone is required');
            return;
        }
        handleApiCall();
    };

    const handleApiCall = async () => {
        try {
            setLoading(true);
            const data = await forgotPassword({ phone });
            showSuccess(data?.message || 'OTP sent successfully!');
            setLoading(false)
            navigation.navigate(UserRoutes.Otp_Here, { phone });
        } catch (error) {
            showError(error.message || 'Something went wrong. Try again!');
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
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.white }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={[styles.login_area]}>
                            <Back_Arrow label={'forgot password'} />

                            <Title_Here title={'Enter your phone to reset your password'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(8)}
                                marginTop={responsiveWidth(5)}
                            />

                            <Title_Here title={'mobile number'} color={COLOURS.black} marginBottom={responsiveWidth(4)} />
                            <Number_Select value={phone} onChangeText={setPhone} />

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
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.7),
        textTransform: 'capitalize',
    },

    dont_text_1: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.7),
    },

    dont_accnt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: responsiveWidth(15)
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