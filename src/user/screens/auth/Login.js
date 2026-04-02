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

const Logiin = ({ navigation }) => {

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

                            <Title_Here title={'mobile number'} color={COLOURS.black} />
                            <Number_Select />

                            <View style={styles.btn_area}>
                                <Button label={'Send OTP'} /* onPress={handleLogin} */
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

export default Logiin


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