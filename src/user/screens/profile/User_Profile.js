import React from 'react';
import Header from '../../../components/Header';
import { Fonts } from '../../../assets/fonts/Fonts';
import UserRoutes from '../../user_routes/UserRoutes';
import { COLOURS } from '../../../assets/theme/Theme';
import Title_Here from '../../../components/Title_Here';
import Profile_Row from '../../../components/Profile_Row';
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const User_Profile = ({ navigation }) => {
    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    {/*  */}
                    <Header title={'profile'} />

                    <ScrollView>

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
                                    fontFamily: Fonts.Medium, color: COLOURS.primary, top: responsiveWidth(.4),
                                    fontSize: responsiveFontSize(1.8), textTransform: 'capitalize'
                                }}>{'trial' + ': ' + '3 days remaining'}</Text>
                            </View>
                        </View>

                        {/*  */}

                        <Title_Here title={'quick access'}
                            color={COLOURS.light_black}
                            textTransform={'uppercase'}
                            letterSpacing={responsiveWidth(.5)}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        {/*  */}

                        <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                            <Profile_Row label={'my path'} source={globalImages.access_icon} />
                            <Profile_Row label={'archives'} source={globalImages.archive_icon} />
                            <Profile_Row label={'guidance'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                source={globalImages.signpost_icon} />
                        </View>

                        {/*  */}

                        <Title_Here title={'settings'}
                            color={COLOURS.light_black}
                            textTransform={'uppercase'}
                            letterSpacing={responsiveWidth(.5)}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        {/*  */}

                        <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                            <Profile_Row label={'notifications'} source={globalImages.calender_icon} />
                            <Profile_Row label={'about samarth path'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                source={globalImages.about_icon} />
                        </View>

                        {/*  */}

                        <Title_Here title={'account'}
                            color={COLOURS.light_black}
                            textTransform={'uppercase'}
                            letterSpacing={responsiveWidth(.5)}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        {/*  */}

                        <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                            <Profile_Row label={'sign out'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                source={globalImages.logout_icon} tintColor={COLOURS.red}
                                backgroundColor={COLOURS.light_red} color={COLOURS.red}
                                onPress={() => navigation.replace(UserRoutes.OnBoard)} />
                        </View>

                        <View style={{ marginBottom: responsiveWidth(15) }} />

                    </ScrollView>

                </View>

            </SafeAreaView>
        </>
    )
}

export default User_Profile

const styles = StyleSheet.create({

    box_profile_new: {
        justifyContent: 'flex-end',
        paddingTop: responsiveWidth(2.5),
        borderRadius: responsiveWidth(4),
        paddingBottom: responsiveWidth(0),
        marginHorizontal: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(2),
    },

    profile_here: {
        height: responsiveWidth(22),
        width: responsiveWidth(22),
        borderRadius: responsiveWidth(100)
    },

    box_profile: {
        borderRadius: responsiveWidth(5),
    },

    container: {
        height: '100%',
        width: '100%',
    },

})