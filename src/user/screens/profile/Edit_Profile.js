import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Profile from '../../../components/Profile';
import { COLOURS } from '../../../assets/theme/Theme';
import { DOBPicker } from '../../../components/DOBPicker';
import Input_Field from '../../../components/Input_Field';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { GenderPicker } from '../../../components/GenderPicker';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { StatusBar, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Keyboard, } from 'react-native';

import Button from '../../../components/Button';
import { Pulse } from '../../../components/Pulse';
import { FadeIn } from '../../../components/FadeIn';
import { Fonts } from '../../../assets/fonts/Fonts';
import { FadeUp } from '../../../components/FadeUp';
import Modal_OTP from '../../../components/Modal_OTP';
import Title_Here from '../../../components/Title_Here';
import { FadeDown } from '../../../components/FadeDown';
import Trial_Text from '../../../components/Trial_Text';
import { useUser } from '../auth/user_context/UserContext';
import { showError, showSuccess } from '../../../helper/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserMe, updateProfile, verifyEmailOtp, verifyPhoneOtp } from '../auth/auth_backend/Auth_Backend';
import UserRoutes from '../../user_routes/UserRoutes';

const Edit_Profile = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();

    const { userData, updateUser } = useUser();
    // console.log('check', userData)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [dob, setDob] = useState(userData?.dateOfBirth || '');
    const [gender, setGender] = useState(userData?.gender || '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpType, setOtpType] = useState(null);
    const [loading, setLoading] = useState(false);

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr instanceof Date) return dateStr;
        const date = new Date(dateStr);
        return isNaN(date) ? null : date;
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            setAddress(userData.address || '');
            setGender(capitalizeFirst(userData?.gender) || 'Male');
            setDob(parseDate(userData?.dateOfBirth || userData?.dob));
        }
    }, [userData]);

    // ── Image Picker ───────────────────────────────────────────
    const handlePickImage = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            includeBase64: true, // ← add karo
        }, (response) => {
            if (response.didCancel || response.errorCode) return;
            const asset = response.assets?.[0];
            if (asset) setSelectedImage(asset);
        });
    };

    // ── Check karo kuch badla ya nahi ─────────────────────────
    const hasChanged = () => {
        return (
            name !== (userData?.name || '') ||
            gender !== (userData?.gender || '') ||
            dob !== (userData?.dateOfBirth || '') ||
            address !== (userData?.address || '') ||
            phone !== (userData?.phone || '') ||
            email !== (userData?.email || '') ||
            selectedImage !== null
        );
    };

    // ── Submit ────────────────────────────────────────────────
    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('token');

        if (!hasChanged()) {
            showError('Nothing changed.');
            return;
        }
        setLoading(true);
        try {
            const dobString = dob instanceof Date
                ? dob.toISOString().split('T')[0]
                : dob || '';

            const json = await updateProfile({
                name,
                email,
                phone,
                gender: gender?.toLowerCase(),
                dateOfBirth: dobString,
                address,
                selectedImage
            });
            console.log('jsoncheck', json)
            if (json?.data?.emailVerificationPending) {
                setOtpType('email');
                setOtpModalVisible(true);
            } else if (json?.data?.phoneVerificationPending) {
                setOtpType('phone');
                setOtpModalVisible(true);
            } else if (json?.data?.message) {
                showSuccess(json.data?.message || 'Profile updated!');
                const user = await getUserMe(token);
                updateUser(user);
                navigation.replace(UserRoutes.Bottom_Navigation, {
                    screen: UserRoutes.User_Profile,
                });
            } else if (json.status === false || json.code === 400) {
                showError(json?.message || 'updated error');
            }
            else {
                showSuccess(json?.message || 'profile update');
                const user = await getUserMe(token);
                updateUser(user);
                navigation.replace(UserRoutes.Bottom_Navigation, {
                    screen: UserRoutes.User_Profile,
                });
            }
        } catch (e) {
            console.log('Update error:', e);
            showError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (otpCode) => {
        if (otpCode.length < 4) {
            showError('Please enter 4 digit OTP');
            return;
        }
        try {
            setLoading(true);
            setOtpLoading(true);
            const token = await AsyncStorage.getItem('token');

            const { data } = otpType === 'email'
                ? await verifyEmailOtp(token, otpCode)
                : await verifyPhoneOtp(token, otpCode);

            setOtpModalVisible(false);
            setOtpType(null);

            const user = await getUserMe(token);
            updateUser(user);
            showSuccess(data?.message || `${otpType === 'email' ? 'Email' : 'Phone'} verified successfully!`);
            navigation.goBack();
        } catch (e) {
            showError(e.message || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
            setLoading(false);
        }
    };

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);


    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                {/* ← KeyboardAvoidingView hata do */}
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{
                            paddingBottom: keyboardVisible ? responsiveWidth(40) : responsiveWidth(10)
                        }}

                    >

                        <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Header title={'edit profile'} />

                                <FadeDown>
                                    <Profile
                                        alignSelf={'center'}
                                        marginTop={responsiveWidth(12)}
                                        edit={true}
                                        onPress={handlePickImage}
                                        selectedImage={selectedImage}
                                    />
                                </FadeDown>

                                <FadeUp>

                                    <Title_Here title={userData?.name}
                                        color={COLOURS.black}
                                        textAlign={'center'}
                                        marginTop={responsiveWidth(2)}
                                        marginBottom={responsiveWidth(2)}
                                        fontSize={responsiveFontSize(2)}
                                    />
                                    <Title_Here title={userData?.phone}
                                        color={COLOURS.light_black}
                                        textAlign={'center'}
                                        marginTop={responsiveWidth(-2)}
                                        marginBottom={responsiveWidth(3)}
                                        fontSize={responsiveFontSize(1.8)}
                                    />

                                    <Pulse>
                                        <Trial_Text backgroundColor={COLOURS.light_primary} alignSelf={'center'} />
                                    </Pulse>

                                </FadeUp>
                                <FadeIn delay={150}>

                                    <Input_Field backgroundColor={COLOURS.light_primary} borderColor={COLOURS.transparent}
                                        borderWidth={responsiveWidth(.3)}
                                        Input_marginTop={responsiveWidth(6)}
                                        color={COLOURS.black}
                                        maxLength={20}
                                        Placeholder={'Your name'}
                                        first_inpt_Img={globalImages.user_filled}
                                        tintColor={COLOURS.grey}
                                        defaultValue={name}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </FadeIn>
                                <FadeIn delay={250}>


                                    <Input_Field backgroundColor={COLOURS.light_primary} borderColor={COLOURS.transparent}
                                        borderWidth={responsiveWidth(.3)}
                                        Input_marginTop={responsiveWidth(4)}
                                        color={COLOURS.black}
                                        maxLength={35}
                                        Placeholder={'Your email'}
                                        disabled={true}
                                        defaultValue={email}
                                        third_height={responsiveWidth(4)}
                                        third_width={responsiveWidth(4)}
                                        first_inpt_Img={globalImages.envelope_filled}
                                        left={responsiveWidth(-10)}
                                        tintColor={COLOURS.grey}
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </FadeIn>
                                <FadeIn delay={350}>

                                    <Input_Field backgroundColor={COLOURS.light_primary} borderColor={COLOURS.transparent}
                                        borderWidth={responsiveWidth(.3)}
                                        Input_marginTop={responsiveWidth(4)}
                                        color={COLOURS.black}
                                        keyboardType={'numeric'}
                                        disabled={true}
                                        Placeholder={'Your Phone'}
                                        third_height={responsiveWidth(4)}
                                        third_width={responsiveWidth(4)}
                                        maxLength={40}
                                        defaultValue={phone}
                                        first_inpt_Img={globalImages.phone_filled}
                                        left={responsiveWidth(-10)}
                                        tintColor={COLOURS.grey}
                                        value={phone}
                                        onChangeText={setPhone}
                                    />

                                </FadeIn>
                                <View marginTop={responsiveWidth(3)} />
                                <FadeIn delay={350}>
                                    <Input_Field backgroundColor={COLOURS.light_primary} borderColor={COLOURS.transparent}
                                        borderWidth={1}
                                        textAlignVertical={'top'}
                                        multiline={true}
                                        first_inpt_Img={globalImages.location_icon}
                                        Input_width={responsiveWidth(85)}
                                        Input_height={responsiveWidth(20)}
                                        color={COLOURS.black}
                                        defaultValue={address}
                                        Placeholder={"Enter your full address to receive your prize at your doorstep..."}
                                        Second_inpt_Img={false}
                                        tintColor={COLOURS.grey}
                                        width={responsiveWidth(4.5)}
                                        height={responsiveWidth(4.5)}
                                        value={address}
                                        onChangeText={setAddress}
                                    />

                                </FadeIn>

                                <FadeIn delay={450}>
                                    <View style={styles.row_dob_gen}>
                                        <View style={styles.inpt_view}>
                                            <GenderPicker
                                                value={gender}
                                                onChange={(val) => setGender(val)}
                                            />
                                        </View>

                                        <View style={styles.inpt_view}>
                                            <DOBPicker
                                                value={dob}
                                                onChange={(date) => setDob(date)}
                                            />
                                        </View>
                                    </View>
                                </FadeIn>

                                <FadeUp>
                                    <Button label={loading ? 'update....' : 'update'} alignSelf={'center'}
                                        marginTop={responsiveWidth(10)}
                                        // marginBottom={responsiveWidth(40)}
                                        onPress={handleUpdate} disabled={loading} />
                                </FadeUp>


                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>

                <Modal_OTP
                    modalVisible={otpModalVisible}
                    setModalVisible={setOtpModalVisible}
                    email={otpType === 'email' ? email : phone}
                    handleOtpSubmit={handleOtpSubmit}
                    loading={otpLoading}
                    type={otpType}
                />

            </SafeAreaView>
        </>

    )
}

export default Edit_Profile

const styles = StyleSheet.create({


    row_dob_gen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inpt_view: {
        flexDirection: 'column',
        marginTop: responsiveWidth(6),
        justifyContent: 'space-between',
        marginHorizontal: responsiveWidth(2.5),
    },

    container: {
        // height: '100%',
        // width: '100%',
        flex: 1
    },

})