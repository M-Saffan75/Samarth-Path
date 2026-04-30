import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    Platform, Linking, Alert, BackHandler, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOURS } from '../../../assets/theme/Theme';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Suspended = ({ navigation }) => {

    const handleCloseApp = () => {
        BackHandler.exitApp();
    };

    const handleContactSupport = () => {
        const email = 'support@yourapp.com';
        const subject = 'Account Suspension Appeal';
        const body = 'Hello, I would like to appeal my account suspension.';

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    'Contact Support',
                    `Please email us at: ${email}`,
                    [{ text: 'OK' }]
                );
            }
        });
    };

    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLOURS.light_primary} />
            <SafeAreaView style={styles.container}>

                {/* Decor circles — same as Network screen */}
                <View style={styles.circle_lg} />
                <View style={styles.circle_sm} />

                <View style={styles.content}>

                    {/* Icon Area */}
                    <View style={styles.icon_wrapper}>
                        <View style={styles.icon_ring_outer}>
                            <View style={styles.icon_ring_inner}>
                                {/* Lock / Ban icon using views */}
                                <View style={styles.ban_icon}>
                                    <View style={styles.ban_circle} />
                                    <View style={styles.ban_slash} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Badge */}
                    <View style={styles.badge}>
                        <Text style={styles.badge_text}>Account Suspended</Text>
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>Your Account{'\n'}Has Been Suspended</Text>
                    <Text style={styles.subtitle}>
                        Your access has been temporarily restricted.{'\n'}
                        Please contact support for more details.
                    </Text>

                    {/* Buttons */}
                    <View style={styles.btn_area}>

                        <TouchableOpacity
                            style={styles.btn_primary}
                            onPress={handleContactSupport}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.btn_primary_text}>Contact Support</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn_outline}
                            onPress={handleCloseApp}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.btn_outline_text}>Close App</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </SafeAreaView>
        </>
    );
};

export default Suspended;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLOURS.light_primary,
    },

    // Decor — same style as Network screen
    circle_lg: {
        position: 'absolute',
        top: -responsiveWidth(20),
        right: -responsiveWidth(20),
        width: responsiveWidth(70),
        height: responsiveWidth(70),
        borderRadius: responsiveWidth(35),
        backgroundColor: COLOURS.primary,
        opacity: 0.08,
    },
    circle_sm: {
        position: 'absolute',
        bottom: responsiveWidth(20),
        left: -responsiveWidth(15),
        width: responsiveWidth(50),
        height: responsiveWidth(50),
        borderRadius: responsiveWidth(25),
        backgroundColor: COLOURS.primary,
        opacity: 0.06,
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(8),
    },

    // Icon
    icon_wrapper: {
        marginBottom: responsiveWidth(5),
    },
    icon_ring_outer: {
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: responsiveWidth(20),
        backgroundColor: COLOURS.primary,
        opacity: 0.12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon_ring_inner: {
        width: responsiveWidth(28),
        height: responsiveWidth(28),
        borderRadius: responsiveWidth(14),
        backgroundColor: COLOURS.primary,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },

    // Ban icon (circle with slash)
    ban_icon: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    ban_circle: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        borderWidth: responsiveWidth(0.9),
        borderColor: COLOURS.white,
        position: 'absolute',
    },
    ban_slash: {
        width: responsiveWidth(0.8),
        height: responsiveWidth(11),
        backgroundColor: COLOURS.white,
        borderRadius: responsiveWidth(1),
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
    },

    // Badge
    badge: {
        backgroundColor: COLOURS.primary,
        opacity: 0.85,
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(1.2),
        borderRadius: responsiveWidth(10),
        marginBottom: responsiveWidth(4),
    },
    badge_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.4),
        color: COLOURS.white,
        letterSpacing: 0.5,
    },

    // Text
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(3.2),
        color: COLOURS.black,
        textAlign: 'center',
        lineHeight: responsiveFontSize(4.5),
        marginBottom: responsiveWidth(3),
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.7),
        color: COLOURS.grey,
        textAlign: 'center',
        lineHeight: responsiveFontSize(3),
        marginBottom: responsiveWidth(10),
    },

    // Buttons
    btn_area: {
        width: '100%',
        gap: responsiveWidth(3),
    },
    btn_primary: {
        backgroundColor: COLOURS.primary,
        paddingVertical: responsiveWidth(4),
        borderRadius: responsiveWidth(4),
        alignItems: 'center',
    },
    btn_primary_text: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.9),
        color: COLOURS.white,
    },
    btn_outline: {
        paddingVertical: responsiveWidth(4),
        borderRadius: responsiveWidth(4),
        alignItems: 'center',
        borderWidth: responsiveWidth(0.3),
        borderColor: COLOURS.primary,
    },
    btn_outline_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.9),
        color: COLOURS.primary,
    },
});