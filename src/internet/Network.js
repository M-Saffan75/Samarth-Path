import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, StyleSheet,
    Platform, Linking, Alert, BackHandler, StatusBar, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOURS } from '../assets/theme/Theme';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Network = () => {

    const handleCloseApp = () => {
        BackHandler.exitApp();
    };

    const handleRetry = () => {
        if (Platform.OS === 'android') {
            Linking.sendIntent('android.settings.WIFI_SETTINGS');
        } else {
            Alert.alert(
                'No Internet',
                'Please enable WiFi from Settings manually.',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={COLOURS.light_primary} />
            <SafeAreaView style={styles.container}>

                {/* Top decor circles */}
                <View style={styles.circle_lg} />
                <View style={styles.circle_sm} />

                <View style={styles.content}>

                    {/* Icon Area */}
                    <View style={styles.icon_wrapper}>
                        <View style={styles.icon_ring_outer}>
                            <View style={styles.icon_ring_inner}>
                                {/* Wifi off icon using views */}
                                <View style={styles.wifi_icon}>
                                    <View style={styles.wifi_bar_1} />
                                    <View style={styles.wifi_bar_2} />
                                    <View style={styles.wifi_bar_3} />
                                    <View style={styles.wifi_dot} />
                                    <View style={styles.wifi_slash} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>No Internet{'\n'}Connection</Text>
                    <Text style={styles.subtitle}>
                        Looks like you're offline. Check your{'\n'}connection and try again.
                    </Text>

                    {/* Buttons */}
                    <View style={styles.btn_area}>

                        <TouchableOpacity style={styles.btn_primary} onPress={handleRetry} activeOpacity={0.85}>
                            <Text style={styles.btn_primary_text}>Open WiFi Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn_outline} onPress={handleCloseApp} activeOpacity={0.85}>
                            <Text style={styles.btn_outline_text}>Close App</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </SafeAreaView>
        </>
    );
};

export default Network;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLOURS.light_primary,
    },

    // Decor
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
        marginBottom: responsiveWidth(8),
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

    // Simple wifi icon
    wifi_icon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(12),
        height: responsiveWidth(10),
    },
    wifi_bar_1: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        borderWidth: responsiveWidth(0.8),
        borderColor: COLOURS.white,
        position: 'absolute',
        opacity: 0.3,
    },
    wifi_bar_2: {
        width: responsiveWidth(7),
        height: responsiveWidth(7),
        borderRadius: responsiveWidth(3.5),
        borderWidth: responsiveWidth(0.8),
        borderColor: COLOURS.white,
        position: 'absolute',
        opacity: 0.5,
    },
    wifi_bar_3: {
        width: responsiveWidth(4),
        height: responsiveWidth(4),
        borderRadius: responsiveWidth(2),
        borderWidth: responsiveWidth(0.8),
        borderColor: COLOURS.white,
        position: 'absolute',
        opacity: 0.8,
    },
    wifi_dot: {
        width: responsiveWidth(1.5),
        height: responsiveWidth(1.5),
        borderRadius: responsiveWidth(1),
        backgroundColor: COLOURS.white,
        position: 'absolute',
        bottom: 0,
    },
    wifi_slash: {
        width: responsiveWidth(0.6),
        height: responsiveWidth(12),
        backgroundColor: COLOURS.white,
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
        borderRadius: responsiveWidth(1),
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