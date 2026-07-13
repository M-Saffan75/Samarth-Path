import React from 'react';
import Button from '../../../components/Button';
import App_Logo from '../../../components/App_Logo';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import Subscription_Card from '../../../components/Subscription_Card';
import Subscription_Offer from '../../../components/Subscription_Offer';
import { StatusBar, Image, StyleSheet, Text, View } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { Pulse } from '../../../components/Pulse';
import { FadeIn } from '../../../components/FadeIn';
import { FadeUp } from '../../../components/FadeUp';
import { Bounce } from '../../../components/Bounce';
import { FadeLeft } from '../../../components/FadeLeft';
import { useUser } from '../auth/user_context/UserContext';

const PayWall = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { userData } = useUser();

    console.log('userData', userData)

    const handleSubscription = () => {
        navigation.reset({
            index: 1,
            routes: [
                { name: UserRoutes.Bottom_Navigation },
                { name: UserRoutes.Subscription },
            ],
        });
    }

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>

                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <View style={[styles.logo_bg, { backgroundColor: COLOURS.light_grey, }]}>
                        <App_Logo source={globalImages.app_logo} resizeMode={'cover'} height={responsiveWidth(12)} width={responsiveWidth(12)} tintColor={COLOURS.primary} />
                    </View>

                    {/*  */}

                    <FadeIn>
                        <Title_Here title={'begin your spiritual journey'}
                            color={COLOURS.black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(10)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(2.6)}
                        />
                    </FadeIn>

                    <FadeUp>
                        <Title_Here title={'start with a 3-day trial to experience the full power of samarth path'}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            fontFamily={'Poppins-Regular'}
                            marginTop={responsiveWidth(.1)}
                            marginBottom={responsiveWidth(8)}
                            fontSize={responsiveFontSize(1.7)}
                        />
                    </FadeUp>

                    {/*  */}

                    <Pulse>
                        <Subscription_Card Price={'₹' + '200'} Trial_Days={'3-days trial'} />
                    </Pulse>

                    {/*  */}

                    <FadeIn>
                        <Title_Here title={'what you will get'}
                            color={COLOURS.black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(3)}
                            fontSize={responsiveFontSize(2)}
                        />
                    </FadeIn>

                    {/*  */}
                    <FadeLeft>
                        <Subscription_Offer detail={'full access to daily content'} source={globalImages.access_icon} />
                    </FadeLeft>
                    <FadeLeft>
                        <Subscription_Offer detail={'complete archives access'} source={globalImages.archive_icon} />
                    </FadeLeft>
                    <FadeLeft>
                        <Subscription_Offer detail={'3 free guidance messages'} source={globalImages.signpost_icon} />
                    </FadeLeft>
                    <FadeLeft>
                        <Subscription_Offer detail={'daily wisdom notifications'} source={globalImages.calender_icon} />
                    </FadeLeft>

                    {/*  */}
                    <FadeIn>
                        <View style={styles.btn_area}>
                            <Button label={'start 3 day trial or buy subscription'} onPress={handleSubscription}
                            />
                        </View>
                    </FadeIn>

                    {/*  */}

                    <Bounce>
                        <Title_Here title={'by starting the trial, you agree to our terms of services.'}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            fontFamily={'Poppins-Regular'}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.4)}
                        />
                    </Bounce>

                </View>

            </SafeAreaView >

        </>
    )
}

export default PayWall

const styles = StyleSheet.create({

    logo_bg: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        marginTop: responsiveWidth(5),
        borderRadius: responsiveWidth(4),

    },

    btn_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(2),
    },

    container: {
        height: '100%',
        width: '100%',
    },

})