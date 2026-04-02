import React, { useEffect, useRef } from 'react';
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


const Otp_Here = ({ navigation }) => {

    const et1 = useRef();
    const et2 = useRef();
    const et3 = useRef();
    const et4 = useRef();
    const et5 = useRef();
    const et6 = useRef();

    const click = () => {
        navigation.navigate(UserRoutes.Reset_Password)
        console.log('sssss')
        console.log({
            et1: et1.current,
            et2: et2.current,
            et3: et3.current,
            et4: et4.current,
        });
    }

    useEffect(() => {
        console.log("Test console");
    }, []);

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

                            <Title_Here title={'enter 6 digit code sent to +92 312876245'}
                                color={COLOURS.black}
                                textAlign={'center'}
                                marginTop={responsiveWidth(1)}
                                marginBottom={responsiveWidth(8)}
                                fontSize={responsiveFontSize(1.7)}
                            />

                            <View style={styles.otp_Container}>
                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et1} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et2.current.focus();
                                        else et1.current.focus();
                                    }} />

                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et2} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et3.current.focus();
                                        else et1.current.focus();
                                    }} />

                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et3} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et4.current.focus();
                                        else et2.current.focus();
                                    }} />

                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et4} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et5.current.focus();
                                        else et3.current.focus();
                                    }} />

                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et5} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et6.current.focus();
                                        else et4.current.focus();
                                    }} />

                                <TextInput style={[styles.name_inpt, {
                                    backgroundColor: COLOURS.transparent, borderColor: COLOURS.light_black, borderWidth: 1, color: COLOURS.black
                                }]} keyboardType='numeric' ref={et6} maxLength={1}
                                    onChangeText={txt => {
                                        if (txt.length >= 1) et6.current.focus();
                                        else et5.current.focus();
                                    }} />
                            </View>

                            <View style={styles.btn_area}>
                                <Button label={'Submit'} onPress={click}
                                // onPress={() => navigation.navigate(routeName.Bottom_Nav)}
                                />
                            </View>

                            <View>
                                <Outline_Text text={'resend OTP'} width={responsiveWidth(22)} />
                            </View>

                        </View>

                    </ImageBackground>
                </View >
            </SafeAreaView >
        </>
    )
}

export default Otp_Here


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
