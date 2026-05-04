import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { COLOURS } from '../../../assets/theme/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';


import Back_Arrow from '../../../components/Back_Arrow';
import { FadeDown } from '../../../components/FadeDown';
import { FadeUp } from '../../../components/FadeUp';
import { Pulse } from '../../../components/Pulse';

const AboutSamarthPath = () => {

    const { theme: COLOURS, isDark } = useTheme();
    const [appVersion, setAppVersion] = useState('...')

    useEffect(() => {
        const version = DeviceInfo.getVersion()        // e.g. "1.0.0"
        const buildNumber = DeviceInfo.getBuildNumber() // e.g. "10"
        setAppVersion(`v${version} (${buildNumber})`)
    }, [])


    const features = [
        { icon: '📖', title: 'Morning Read', desc: 'Daily text post published at 8:00 AM' },
        { icon: '🧠', title: 'Daily Quiz', desc: 'Test yourself every afternoon at 2:00 PM' },
        { icon: '🎬', title: 'Evening Video', desc: 'Curated video drops at 7:00 PM daily' },
        { icon: '🏆', title: 'Weekly Winners', desc: 'Quiz leaderboard with prizes every week' },
        { icon: '🔖', title: 'My Path', desc: 'Save & bookmark your favourite content' },
        { icon: '💬', title: 'Guidance', desc: '3 free personal consultation messages/month' },
    ];

    const details = [
        { label: 'Platform', value: 'iOS & Android' },
        { label: 'Content Archive', value: 'Full access for paid users' },
        { label: 'Payment Methods', value: 'UPI & Credit Card' },
    ];

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.white, }]}>

                {/* Decor circles */}
                <View style={[styles.circle_lg, { backgroundColor: COLOURS.primary, }]} />
                <View style={[styles.circle_sm, { backgroundColor: COLOURS.primary, }]} />

                {/* Top Bar */}

                <View style={styles.topbar}>
                    <Back_Arrow label={'about app'} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll_content}>

                    {/* Hero */}
                    <FadeDown>


                        <View style={styles.hero}>
                            <View style={[styles.logo_ring, { backgroundColor: COLOURS.white, }]}>
                                <View style={[styles.logo_inner, { backgroundColor: COLOURS.primary, }]}>
                                    <Text style={[styles.logo_text, { color: COLOURS.white, }]}>SP</Text>
                                </View>
                            </View>
                            <Text style={[styles.app_name, { color: COLOURS.black, }]}>Samarth Path</Text>
                            <Text style={[styles.app_tagline, { color: COLOURS.primary, }]}>YOUR DAILY GROWTH COMPANION</Text>
                        </View>

                    </FadeDown>
                    <View style={styles.divider} />

                    <FadeUp>
                        {/* Description */}
                        <View style={styles.section}>
                            <Text style={[styles.section_label, { color: COLOURS.primary, }]}>WHAT IS SAMARTH PATH?</Text>
                            <Text style={[styles.desc_text, { color: COLOURS.grey, }]}>
                                Samarth Path is a subscription-based personal growth app that delivers structured daily content — a morning read, an afternoon quiz, and an evening video — to help you stay consistent on your journey every single day.
                            </Text>
                        </View>

                    </FadeUp>

                    <Pulse>
                        {/* Feature Cards Grid */}
                        <View style={styles.features_grid}>
                            {features.map((item, index) => (
                                <View key={index} style={[styles.feat_card, { backgroundColor: COLOURS.light_primary, }]}>
                                    <View style={[styles.feat_icon_box, { backgroundColor: COLOURS.light_primary, }]}>
                                        <Text style={styles.feat_icon}>{item.icon}</Text>
                                    </View>
                                    <Text style={[styles.feat_title, { color: COLOURS.black, }]}>{item.title}</Text>
                                    <Text style={[styles.feat_desc, { color: COLOURS.grey, }]}>{item.desc}</Text>
                                </View>
                            ))}
                        </View>

                    </Pulse>

                    <View style={styles.divider} />

                    <FadeUp>
                        {/* App Details */}
                        <View style={[styles.section, { paddingBottom: 0 }]}>
                            <Text style={styles.section_label}>APP DETAILS</Text>
                        </View>

                        {details.map((item, index) => (
                            <View key={index} style={[styles.info_row, index === details.length - 1 && { borderBottomWidth: 0 }]}>
                                <Text style={[styles.info_label, { color: COLOURS.grey, }]}>{item.label}</Text>
                                <Text style={[styles.info_value, { color: COLOURS.black, }]}>{item.value}</Text>
                            </View>
                        ))}

                        <View style={styles.info_row}>
                            <Text style={[styles.info_label, { color: COLOURS.grey, }]}>Version</Text>
                            <View style={[styles.info_badge, { backgroundColor: COLOURS.light_primary, }]}>
                                <Text style={[styles.info_badge_text, { color: COLOURS.primary, }]}>{appVersion}</Text>
                            </View>
                        </View>
                    </FadeUp>

                    {/* Price Banner */}
                    <Pulse>
                        <View style={[styles.price_banner, { backgroundColor: COLOURS.light_grey, }]}>
                            <View>
                                <Text style={[styles.price_label,{color:COLOURS.grey}]}>Subscription</Text>
                                <View style={styles.price_row}>
                                    <Text style={[styles.price_amount, { color: COLOURS.primary, }]}>₹199</Text>
                                    <Text style={[styles.price_period, { color: COLOURS.grey }]}> / month</Text>
                                </View>
                                <Text style={[styles.price_sub, { color: COLOURS.grey }]}>Free trial available on signup</Text>
                            </View>
                            <TouchableOpacity style={[styles.price_cta, { backgroundColor: COLOURS.primary, }]} activeOpacity={0.85}>
                                <Text style={[styles.price_cta_text, { color: COLOURS.black, }]}>Subscribe</Text>
                            </TouchableOpacity>
                        </View>
                    </Pulse>

                    {/* Footer */}
                    <Text style={styles.footer_note}>
                        Developed by{' '}
                        <Text style={[styles.footer_highlight, { color: COLOURS.primary, }]}>The Marketing Heroes</Text>
                        {'\n'}All content rights reserved · Samarth Path © 2026
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default AboutSamarthPath;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    // Decor
    circle_lg: {
        position: 'absolute',
        top: -responsiveWidth(20),
        right: -responsiveWidth(20),
        width: responsiveWidth(65),
        height: responsiveWidth(65),
        borderRadius: responsiveWidth(32.5),

        opacity: 0.08,
    },
    circle_sm: {
        position: 'absolute',
        bottom: responsiveWidth(20),
        left: -responsiveWidth(15),
        width: responsiveWidth(45),
        height: responsiveWidth(45),
        borderRadius: responsiveWidth(22.5),
        opacity: 0.06,
    },

    // Topbar
    topbar: {
        flexDirection: 'row',
        // alignItems: 'center',
        // gap: responsiveWidth(3),
        // paddingHorizontal: responsiveWidth(5),
        // paddingVertical: responsiveWidth(4),
    },



    scroll_content: {
        paddingBottom: responsiveWidth(8),
    },

    // Hero
    hero: {
        alignItems: 'center',
        paddingVertical: responsiveWidth(5),
    },
    logo_ring: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius: responsiveWidth(10),
        borderWidth: 1.5,
        borderColor: 'rgba(200,169,110,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(4),
    },
    logo_inner: {
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        borderRadius: responsiveWidth(7),
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo_text: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(2.8),
        letterSpacing: 1,
    },
    app_name: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(3),

        letterSpacing: 0.3,
        marginBottom: responsiveWidth(1),
    },
    app_tagline: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.3),
        letterSpacing: 0.8,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: 'rgba(200,169,110,0.3)',
        marginHorizontal: responsiveWidth(5),
        marginBottom: responsiveWidth(5),
    },

    // Section
    section: {
        paddingHorizontal: responsiveWidth(5),
        paddingBottom: responsiveWidth(5),
    },
    section_label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.2),

        letterSpacing: 1.2,
        marginBottom: responsiveWidth(2.5),
    },
    desc_text: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.6),

        lineHeight: responsiveFontSize(2.8),
    },

    // Feature Grid
    features_grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(5),
        gap: responsiveWidth(2.5),
        marginBottom: responsiveWidth(6),
    },
    feat_card: {
        width: '47.5%',

        borderRadius: responsiveWidth(4),
        borderWidth: 1,
        borderColor: 'rgba(200,169,110,0.2)',
        padding: responsiveWidth(3.5),
    },
    feat_icon_box: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(2.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(2.5),
    },
    feat_icon: {
        fontSize: responsiveFontSize(2),
    },
    feat_title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.5),
        marginBottom: responsiveWidth(1),
    },
    feat_desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.25),
        lineHeight: responsiveFontSize(2),
    },

    // Info Rows
    info_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(3.2),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(30,24,14,0.06)',
    },
    info_label: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.5),

    },
    info_value: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.5),

    },
    info_badge: {
        borderWidth: 1,
        borderColor: 'rgba(200,169,110,0.3)',
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(0.8),
    },
    info_badge_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.3),
    },

    // Price Banner
    price_banner: {
        marginHorizontal: responsiveWidth(5),
        marginTop: responsiveWidth(5),
        marginBottom: responsiveWidth(6),

        borderRadius: responsiveWidth(4),
        padding: responsiveWidth(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price_label: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.3),
        color: 'rgba(255,255,255,0.5)',
        marginBottom: responsiveWidth(1),
    },
    price_row: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price_amount: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(3.5),
    },
    price_period: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    price_sub: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.2),
        marginTop: responsiveWidth(1),
    },
    price_cta: {
        borderRadius: responsiveWidth(2.5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
    },
    price_cta_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.6),
    },

    // Footer
    footer_note: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.25),
        color: '#A0997A',
        textAlign: 'center',
        paddingHorizontal: responsiveWidth(5),
        lineHeight: responsiveFontSize(2.2),
    },
    footer_highlight: {
        fontFamily: 'Poppins-Medium',

    },
});