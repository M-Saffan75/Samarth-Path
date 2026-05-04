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
import { useLoader } from '../../../loading/LoaderContext';
import { resetPassword } from './auth_backend/Auth_Backend';
import { showError, showSuccess } from '../../../helper/Helper';
import { useTheme } from '../../../assets/themecontext/ThemeContext';

const Reset_Password = ({ navigation, route }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { setLoading } = useLoader();
    const { phone } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (password) => {
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character';
        return null;
    };

    const handleReset = () => {
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
            const data = await resetPassword({ phone, newPassword: password });
            showSuccess(data?.message || 'reset password successfully!');
            setLoading(false)
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.Login }],
            });
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
                            <Back_Arrow label={'reset password'} />

                            <Title_Here title={'Enter a new password to secure your \naccount'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(8)}
                                marginTop={responsiveWidth(5)}
                            />

                            <Title_Here title={'password'} color={COLOURS.black} marginTop={responsiveWidth(5)} />
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

                            <Title_Here title={'confirm password'} color={COLOURS.black} marginTop={responsiveWidth(5)} />
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
                                <Button label={'confirm'} onPress={handleReset}
                                />
                            </View>


                        </View>

                    </ImageBackground>

                </View>
            </SafeAreaView>
        </>
    )
}

export default Reset_Password


const styles = StyleSheet.create({


    forgot_text: {
        width: '36%',
        alignItems: 'flex-end',
        top: responsiveWidth(3),
        alignSelf: 'flex-end',
        left: responsiveWidth(-6)
    },

    btn_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(5),
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