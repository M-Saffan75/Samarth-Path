import React, { useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import Button from '../../../components/Button';
import App_Logo from '../../../components/App_Logo';
import UserRoutes from '../../user_routes/UserRoutes';
import Title_Here from '../../../components/Title_Here';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import Subscription_Card from '../../../components/Subscription_Card';
import Subscription_Offer from '../../../components/Subscription_Offer';
import { StatusBar, StyleSheet, View } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { createSubscriptionOrder, verifySubscriptionPayment, buildRazorpayOptions } from '../subscription/subscription_backend/Subs_Backend';
import { showError, showSuccess } from '../../../helper/Helper';
import { getUserMe } from '../auth/auth_backend/Auth_Backend';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Pulse } from '../../../components/Pulse';
import { FadeIn } from '../../../components/FadeIn';
import { FadeUp } from '../../../components/FadeUp';
import { Bounce } from '../../../components/Bounce';
import { FadeLeft } from '../../../components/FadeLeft';
import { useUser } from '../auth/user_context/UserContext';
import { useLoader } from '../../../loading/LoaderContext';

const PayWall = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { userData, updateUser } = useUser();
    const [subsID, setSubsID] = useState('')
    const name = userData?.name;
    const email = userData?.email;
    const phone = userData?.phone;
    const { setLoading } = useLoader();

    const isTrialExpired = userData?.subscription?.status === 'expired';
    const price = isTrialExpired ? '₹199' : '₹5';
    const cardLabel = isTrialExpired ? '30-day subscription' : '3-days trial';
    const btnLabel = isTrialExpired ? 'buy subscription — ₹199/month' : 'start 3-day trial — ₹5';

    const handleTrialPayment = async () => {
        try {
            setLoading(true);
            const { token, orderData } = await createSubscriptionOrder();
            const razorpaySubscriptionId = orderData?.data?.razorpaySubscriptionId;
            setSubsID(razorpaySubscriptionId);
            console.log('orderData', orderData);

            const options = buildRazorpayOptions(orderData, name, email, phone);
            console.log('options', options);
            options.description = '3-Day Trial — ₹5';
            options.prefill.contact = userData?.phone?.replace('+91', '') || '9999999999';
            options.prefill.name = userData?.name || 'User';

            const paymentData = await RazorpayCheckout.open(options);
            console.log('RAW paymentData >>>', JSON.stringify(paymentData));

            const {
                razorpay_payment_id,
                razorpay_subscription_id,
                razorpay_signature,
            } = paymentData;

            console.log('razorpay_payment_id', razorpay_payment_id);
            console.log('razorpay_subscription_id', razorpay_subscription_id);
            console.log('razorpay_signature', razorpay_signature);
            console.log('subsID (from create response)', razorpaySubscriptionId);

            await verifySubscriptionPayment({
                token,
                paymentData,
                subsID: razorpaySubscriptionId,
            });

            const freshToken = await AsyncStorage.getItem('token');
            const freshUser = await getUserMe(freshToken);
            updateUser(freshUser);
            showSuccess('Trial activated! Welcome to Samarth Path.');
            navigation.reset({ index: 0, routes: [{ name: UserRoutes.Bottom_Navigation }] });
        } catch (error) {
            if (error?.code !== 'PAYMENT_CANCELLED') {
                showError(error?.message || 'Payment failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubscription = () => {
        navigation.reset({
            index: 1,
            routes: [
                { name: UserRoutes.Bottom_Navigation },
                { name: UserRoutes.Subscription },
            ],
        });
    };

    const handlePress = isTrialExpired ? handleSubscription : handleTrialPayment;

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>

                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <View style={[styles.logo_bg, { backgroundColor: COLOURS.light_grey }]}>
                        <App_Logo source={globalImages.app_logo} resizeMode={'cover'} height={responsiveWidth(12)} width={responsiveWidth(12)} tintColor={COLOURS.primary} />
                    </View>

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
                        <Title_Here
                            title={isTrialExpired
                                ? 'your trial has ended — continue your journey with a full subscription'
                                : 'start with a 3-day trial to experience the full power of samarth path'}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            fontFamily={'Poppins-Regular'}
                            marginTop={responsiveWidth(.1)}
                            marginBottom={responsiveWidth(8)}
                            fontSize={responsiveFontSize(1.7)}
                        />
                    </FadeUp>

                    <Pulse>
                        <Subscription_Card Price={price} Trial_Days={cardLabel} />
                    </Pulse>

                    <FadeIn>
                        <Title_Here title={'what you will get'}
                            color={COLOURS.black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(3)}
                            fontSize={responsiveFontSize(2)}
                        />
                    </FadeIn>

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

                    <FadeIn>
                        <View style={styles.btn_area}>
                            <Button label={btnLabel} onPress={handlePress} />
                        </View>
                    </FadeIn>

                    <Bounce>
                        <Title_Here title={'by continuing, you agree to our terms of services.'}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            fontFamily={'Poppins-Regular'}
                            marginTop={responsiveWidth(5)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(1.4)}
                        />
                    </Bounce>

                </View>

            </SafeAreaView>
        </>
    );
};

export default PayWall;

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
});
