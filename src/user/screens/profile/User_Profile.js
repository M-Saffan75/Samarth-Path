import React from 'react';
import Header from '../../../components/Header';
import { FadeUp } from '../../../components/FadeUp';
import { FadeIn } from '../../../components/FadeIn';
import UserRoutes from '../../user_routes/UserRoutes';
import { COLOURS } from '../../../assets/theme/Theme';
import Title_Here from '../../../components/Title_Here';
import Trial_Text from '../../../components/Trial_Text';
import { FadeDown } from '../../../components/FadeDown';
import Profile_Row from '../../../components/Profile_Row';
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { showError } from '../../../helper/Helper';
import { Pulse } from '../../../components/Pulse';
import Profile from '../../../components/Profile';
import { useUser } from '../auth/user_context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User_Profile = ({ navigation }) => {

    const { userData } = useUser();


    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            navigation.reset({
                index: 0,
                routes: [{ name: UserRoutes.OnBoard }],
            });
        } catch (error) {
            showError('Something went wrong. Try again!');
        }
    };

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

                    {/*  */}

                    <View style={[styles.box_profile, {
                        backgroundColor: COLOURS.light_primary, marginBottom: responsiveWidth(2),
                        marginTop: responsiveWidth(5), marginHorizontal: responsiveWidth(4),
                        paddingVertical: responsiveWidth(4), alignItems: 'center'
                    }]}>

                        <Pulse>
                            <Profile alignSelf={'center'} />
                        </Pulse>

                        <FadeIn delay={150}>
                            <Title_Here title={userData?.name}
                                color={COLOURS.black}
                                textAlign={'center'}
                                marginTop={responsiveWidth(1)}
                                marginBottom={responsiveWidth(2)}
                                fontSize={responsiveFontSize(2)}
                            />
                            <Title_Here title={userData?.phone}
                                color={COLOURS.light_black}
                                textAlign={'center'}
                                marginTop={responsiveWidth(-2)}
                                marginBottom={responsiveWidth(2)}
                                fontSize={responsiveFontSize(1.8)}
                            />

                            <FadeUp>
                                <Trial_Text />
                            </FadeUp>


                        </FadeIn>
                    </View>

                    {/*  */}

                    <ScrollView>

                        <Title_Here title={'quick access'}
                            color={COLOURS.light_black}
                            textTransform={'uppercase'}
                            letterSpacing={responsiveWidth(.5)}
                            marginTop={responsiveWidth(3)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        {/*  */}

                        <FadeDown>
                            <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                                <Profile_Row label={'edit profile'} source={globalImages.user_filled}
                                    onPress={() => navigation.navigate(UserRoutes.Edit_Profile)} />
                                <Profile_Row label={'my path'} source={globalImages.access_icon} />
                                <Profile_Row label={'archives'} source={globalImages.archive_icon} />
                                <Profile_Row label={'guidance'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                    source={globalImages.signpost_icon} />
                            </View>
                        </FadeDown>

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
                        <FadeUp>
                            <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                                <Profile_Row label={'notifications'} source={globalImages.calender_icon}
                                    onPress={() => navigation.navigate(UserRoutes.User_Notification)} />
                                <Profile_Row label={'about samarth path'} source={globalImages.about_icon}
                                    onPress={() => navigation.navigate(UserRoutes.AboutSamarthPath)} />
                                <Profile_Row label={'change password'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                    source={globalImages.lock_icon} onPress={() => navigation.navigate(UserRoutes.Change_Password)} />
                            </View>
                        </FadeUp>

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
                        <FadeDown>
                            <View style={[styles.box_profile_new, { backgroundColor: COLOURS.light_primary }]}>
                                <Profile_Row label={'sign out'} bordernone={false} paddingBottom={responsiveWidth(.1)}
                                    source={globalImages.logout_icon} tintColor={COLOURS.red}
                                    backgroundColor={COLOURS.light_red} color={COLOURS.red}
                                    onPress={handleLogout} />
                            </View>
                        </FadeDown>

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
    box_profile: {
        borderRadius: responsiveWidth(5),
    },

    container: {
        height: '100%',
        width: '100%',
    },

})