import React from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, StatusBar
} from 'react-native';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { COLOURS } from '../../assets/theme/Theme';
import Back_Arrow from '../../components/Back_Arrow';
import { FadeDown } from '../../components/FadeDown';

const NOTIF_CONFIG = {
    blocked: {
        icon: '🚫',
        iconBg: '#FCEBEB',
        badgeBg: '#FCEBEB',
        badgeColor: '#A32D2D',
        label: 'Blocked',
    },
    trial: {
        icon: '⏳',
        iconBg: '#FAEEDA',
        badgeBg: '#FAEEDA',
        badgeColor: '#854F0B',
        label: 'Trial',
    },
    approved: {
        icon: '✅',
        iconBg: '#EAF3DE',
        badgeBg: '#EAF3DE',
        badgeColor: '#3B6D11',
        label: 'Approved',
    },
};

const User_Notification = () => {

    // Replace with real API data
    const { theme: COLOURS, } = useTheme();

    const notifications = [
        {
            id: '1',
            type: 'blocked',
            title: 'Account Blocked',
            message: 'Your account has been temporarily blocked due to a policy violation. Please contact support.',
            date: '04/30/2026',
            isRead: false,
        },
        {
            id: '2',
            type: 'trial',
            title: 'Trial Period Ended',
            message: 'Your 3-day free trial has expired. Subscribe now to continue accessing all content.',
            date: '04/28/2026',
            isRead: false,
        },
        {
            id: '3',
            type: 'approved',
            title: 'Subscription Approved',
            message: 'Your subscription has been activated successfully. Enjoy full access to Samarth Path.',
            date: '04/25/2026',
            isRead: true,
        },
    ];

    const renderItem = ({ item }) => {
        const config = NOTIF_CONFIG[item.type];
        return (
            <FadeDown>
                <View style={[[styles.card, { backgroundColor: COLOURS.light_primary, }], !item.isRead && [styles.card_unread, { borderLeftColor: COLOURS.primary, }]]}>

                    {/* Icon */}
                    <View style={[styles.icon_box, { backgroundColor: config.iconBg }]}>
                        <Text style={styles.icon}>{config.icon}</Text>
                    </View>

                    {/* Body */}
                    <View style={styles.body}>
                        <View style={styles.top_row}>
                            <Text style={[styles.title, { color: COLOURS.black, }]} numberOfLines={1} ellipsizeMode="tail">
                                {item.title}
                            </Text>
                            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
                                <Text style={[styles.badge_text, { color: config.badgeColor }]}>
                                    {config.label}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.message, { color: COLOURS.grey, }]} numberOfLines={2} ellipsizeMode="tail">
                            {item.message}
                        </Text>

                        <Text style={styles.date}>{item.date}</Text>
                    </View>

                </View>
            </FadeDown>
        );
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={COLOURS.light_primary} />
            <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.white, }]}>

                <View style={[styles.circle_lg, { backgroundColor: COLOURS.primary, }]} />
                <View style={[styles.circle_sm, { backgroundColor: COLOURS.primary, }]} />

                {/* Topbar */}
                <Back_Arrow label={'notifications'} />

                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No notifications yet</Text>
                    }
                />

            </SafeAreaView>
        </>
    );
};

export default User_Notification;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    circle_lg: {
        position: 'absolute',
        top: -responsiveWidth(20), right: -responsiveWidth(20),
        width: responsiveWidth(65), height: responsiveWidth(65),
        borderRadius: responsiveWidth(32.5),
        opacity: 0.08,
    },
    circle_sm: {
        position: 'absolute',
        bottom: responsiveWidth(20), left: -responsiveWidth(15),
        width: responsiveWidth(45), height: responsiveWidth(45),
        borderRadius: responsiveWidth(22.5),
        opacity: 0.06,
    },

    list: {
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveWidth(1),
        paddingBottom: responsiveWidth(8),
        gap: responsiveWidth(2.5),
    },

    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: responsiveWidth(3),
        borderRadius: responsiveWidth(4),
        borderWidth: 1,
        borderColor: 'rgba(200,169,110,0.2)',
        padding: responsiveWidth(3.5),
    },
    card_unread: {
        borderLeftWidth: 3,
    },

    icon_box: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(3),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    icon: {
        fontSize: responsiveFontSize(2.2),
    },

    body: {
        flex: 1,
    },
    top_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: responsiveWidth(2),
        marginBottom: responsiveWidth(1),
    },
    title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.55),

        flex: 1,
    },
    badge: {
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(0.5),
        flexShrink: 0,
    },
    badge_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.1),
    },
    message: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.4),

        lineHeight: responsiveFontSize(2.2),
        marginBottom: responsiveWidth(1.5),
    },
    date: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.2),
        color: '#B0A080',
    },

    empty: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.6),
        color: COLOURS.grey,
        textAlign: 'center',
        marginTop: responsiveWidth(20),
    },
});