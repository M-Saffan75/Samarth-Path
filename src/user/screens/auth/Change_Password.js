import React, { useState } from 'react'
import { COLOURS } from '../../../assets/theme/Theme';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { ImageBackground, StyleSheet, Text, View, StatusBar, } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import Back_Arrow from '../../../components/Back_Arrow';
import Input_Field from '../../../components/Input_Field';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLoader } from '../../../loading/LoaderContext';
import { changedpassword } from './auth_backend/Auth_Backend';
import { showError, showSuccess } from '../../../helper/Helper';
import { FadeIn } from '../../../components/FadeIn';
import { FadeUp } from '../../../components/FadeUp';

const Change_Password = ({ navigation }) => {


    const { setLoading } = useLoader();
    const [currentPassword, setCurrentPassword] = useState('');
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

        if (!currentPassword.trim()) {
            showError('Current Password is required');
            return;
        }
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
            const data = await changedpassword({ currentPassword, newPassword: password });
            showSuccess(data?.message || 'reset password successfully!');
            setLoading(false)
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.Bottom_Navigation, params: UserRoutes.User_Profile }],
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
                barStyle={'dark-content'}
                backgroundColor={COLOURS.white}
            />
            <SafeAreaView>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <ImageBackground source={globalImages.bg_auth} style={styles.login_img} resizeMode='cover'>

                        <View style={[styles.login_area]}>
                            <Back_Arrow label={'change password'} />

                            <Title_Here title={'once you submit, your current password will be replaced with the change password'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(10)}
                                marginTop={responsiveWidth(10)}
                            />

                            <FadeIn delay={150}>
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'Your Current Password'}
                                    first_inpt_Img={globalImages.pswd_key}
                                    Second_inpt_Img={globalImages.eye}
                                    tintColor={COLOURS.grey}
                                    width={responsiveWidth(4.5)}
                                    height={responsiveWidth(4.5)}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                />
                            </FadeIn>
                            <FadeIn delay={250}>
                                <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                    borderWidth={1}
                                    color={COLOURS.black}
                                    Placeholder={'New Password'}
                                    first_inpt_Img={globalImages.pswd_key}
                                    Second_inpt_Img={globalImages.eye}
                                    tintColor={COLOURS.grey}
                                    width={responsiveWidth(4.5)}
                                    height={responsiveWidth(4.5)}
                                    value={password}
                                    onChangeText={setPassword}
                                />

                            </FadeIn>

                            <FadeIn delay={350}>
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
                            </FadeIn>

                            <FadeUp>
                                <View style={styles.btn_area}>
                                    <Button label={'Confirm & Update'} onPress={handleReset}
                                    />
                                </View>
                            </FadeUp>


                        </View>

                    </ImageBackground>

                </View >
            </SafeAreaView >
        </>
    )
}

export default Change_Password


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
        marginTop: responsiveWidth(10),
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