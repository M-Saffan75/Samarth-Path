import React, { useState } from 'react'
import { COLOURS } from '../../../assets/theme/Theme';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageBackground, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';

import Button from '../../../components/Button';
import Title_Here from '../../../components/Title_Here';
import Input_Field from '../../../components/Input_Field';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = ({ navigation }) => {

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

                            <Title_Here title={'create account'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(2.5)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(2)}
                                marginTop={responsiveWidth(0)}
                            />

                            <Title_Here title={'being your spiritual energy with samarth path'}
                                color={COLOURS.black}
                                fontSize={responsiveFontSize(1.7)}
                                textAlign={'center'}
                                marginBottom={responsiveWidth(8)}
                                marginTop={responsiveWidth(1)}
                            />


                            <Title_Here title={'username '} color={COLOURS.black} marginTop={0} />
                            <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                borderWidth={1}
                                color={COLOURS.black}
                                Placeholder={'username'}
                                first_inpt_Img={globalImages.envelope}
                                tintColor={COLOURS.grey}
                            />
                            <Title_Here title={'Password'} color={COLOURS.black} />
                            <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_black}
                                borderWidth={1}
                                color={COLOURS.black}
                                Placeholder={'Password'}
                                first_inpt_Img={globalImages.pswd_key}
                                Second_inpt_Img={globalImages.eye}
                                tintColor={COLOURS.grey}
                                width={responsiveWidth(4.5)}
                                height={responsiveWidth(4.5)}
                            />

                            <TouchableOpacity activeOpacity={0.7} /* onPress={() => navigation.navigate(UserRoutes.Forget_Password)} */>
                                <Title_Here title={'forgot password ?'} color={COLOURS.primary} fontSize={responsiveFontSize(1.6)}
                                    marginTop={0} marginRight={0} />
                            </TouchableOpacity>

                            <View style={styles.btn_area}>
                                <Button label={'Sign in'} /* onPress={handleLogin} */
                                />
                            </View>

                            <View style={styles.dont_accnt}>
                                <Text style={[styles.dont_text_1, { color: COLOURS.black }]}>Don't have an account ?</Text>
                                <TouchableOpacity activeOpacity={0.6}
                                /* onPress={() => navigation.navigate(UserRoutes.Register)} */
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

export default Login


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