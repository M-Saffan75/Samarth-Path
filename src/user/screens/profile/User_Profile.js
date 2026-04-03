import React from 'react'
import Header from '../../../components/Header'
import { Fonts } from '../../../assets/fonts/Fonts'
import { COLOURS } from '../../../assets/theme/Theme'
import Title_Here from '../../../components/Title_Here'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { globalImages } from '../../../assets/images/images_file/All_Images'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'

const User_Profile = () => {
    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView>

                {/*  */}

                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                    <Header title={'profile'} />

                    {/*  */}

                    <View style={[styles.box_profile, {
                        backgroundColor: COLOURS.light_primary,
                        marginTop: responsiveWidth(5), marginHorizontal: responsiveWidth(4),
                        paddingVertical: responsiveWidth(4), alignItems: 'center'
                    }]}>
                        <Image source={globalImages.profile} style={styles.profile_here} tintColor={'contain'} />
                        <Title_Here title={'Aditya'}
                            color={COLOURS.black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(1)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(2)}
                        />
                        <Title_Here title={'+91 234786543'}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(-2)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        <View style={{
                            backgroundColor: COLOURS.white, padding: responsiveWidth(2),
                            borderRadius: responsiveWidth(100),
                        }}>
                            <Text style={{
                                fontFamily: Fonts.Medium,color:COLOURS.primary,top:responsiveWidth(.4),
                                fontSize: responsiveFontSize(1.8), textTransform: 'capitalize'
                            }}>trial : 3 days remaining</Text>
                        </View>
                    </View>
                    {/*  */}
                </View>

            </SafeAreaView>
        </>
    )
}

export default User_Profile

const styles = StyleSheet.create({

    profile_here: {
        height: responsiveWidth(22),
        width: responsiveWidth(22),
        borderRadius: responsiveWidth(100)
    },

    box_profile: {
        borderRadius: responsiveWidth(4),
    },

    container: {
        height: '100%',
        width: '100%',
    },

})