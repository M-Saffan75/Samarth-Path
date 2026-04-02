import React from 'react';
import Button from '../../../components/Button';
import App_Logo from '../../../components/App_Logo';
import { COLOURS } from '../../../assets/theme/Theme';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import { SafeAreaView } from 'react-native-safe-area-context';
import Subscription_Card from '../../../components/Subscription_Card';
import Subscription_Offer from '../../../components/Subscription_Offer';
import { StatusBar, Image, StyleSheet, Text, View } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const PayWall = ({ navigation }) => {

    const handleSubscription = () => {
        navigation.navigate(UserRoutes.Home)
    }

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.white}
            />
            <SafeAreaView>

                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <View style={styles.logo_bg}>
                        <App_Logo source={globalImages.icon_new} resizeMode={'cover'} height={responsiveWidth(12)} width={responsiveWidth(12)} />
                    </View>

                    {/*  */}

                    <Title_Here title={'begin your spiritual journey'}
                        color={COLOURS.black}
                        textAlign={'center'}
                        marginTop={responsiveWidth(10)}
                        marginBottom={responsiveWidth(2)}
                        fontSize={responsiveFontSize(2.6)}
                    />

                    <Title_Here title={'start with a 3-day trial to experience the full power of samarth path'}
                        color={COLOURS.light_black}
                        textAlign={'center'}
                        fontFamily={'Poppins-Regular'}
                        marginTop={responsiveWidth(.1)}
                        marginBottom={responsiveWidth(8)}
                        fontSize={responsiveFontSize(1.7)}
                    />

                    {/*  */}

                    <Subscription_Card Price={'₹' + '5'} Trial_Days={'3-days trial'} />

                    {/*  */}

                    <Title_Here title={'what you will get'}
                        color={COLOURS.black}
                        textAlign={'center'}
                        marginTop={responsiveWidth(5)}
                        marginBottom={responsiveWidth(3)}
                        fontSize={responsiveFontSize(2)}
                    />

                    {/*  */}

                    <Subscription_Offer detail={'full access to daily content'} source={globalImages.access_icon} />
                    <Subscription_Offer detail={'complete archives access'} source={globalImages.archive_icon} />
                    <Subscription_Offer detail={'3 free guidance messages'} source={globalImages.signpost_icon} />
                    <Subscription_Offer detail={'daily wisdom notifications'} source={globalImages.calender_icon} />

                    {/*  */}

                    <View style={styles.btn_area}>
                        <Button label={'start 3 day trial'} onPress={handleSubscription}
                        />
                    </View>

                    {/*  */}


                    <Title_Here title={'by starting the trial, you agree to our terms of services.'}
                        color={COLOURS.light_black}
                        textAlign={'center'}
                        fontFamily={'Poppins-Regular'}
                        marginTop={responsiveWidth(5)}
                        marginBottom={responsiveWidth(2)}
                        fontSize={responsiveFontSize(1.4)}
                    />

                </View>

            </SafeAreaView>

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
        backgroundColor: COLOURS.light_grey,
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