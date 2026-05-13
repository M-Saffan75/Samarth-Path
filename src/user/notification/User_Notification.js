import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, StatusBar, ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { fetchNotifications } from '../screens/auth/auth_backend/Auth_Backend';
import Back_Arrow from '../../components/Back_Arrow';
import { FadeDown } from '../../components/FadeDown';
import { COLOURS } from '../../assets/theme/Theme';

// ── Icon & style config — newStatus ke hisaab se ──────────

const STATUS_CONFIG = {
    approved: {
        icon: '✅',
        iconBg: '#EAF3DE',
        badgeBg: '#EAF3DE',
        badgeColor: '#3B6D11',
        label: 'Approved',
    },
    suspended: {
        icon: '⛔',
        iconBg: '#FCEBEB',
        badgeBg: '#FCEBEB',
        badgeColor: '#A32D2D',
        label: 'Suspended',
    },
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
    subscription: {
        icon: '👑',
        iconBg: '#EAF3DE',
        badgeBg: '#EAF3DE',
        badgeColor: '#3B6D11',
        label: 'Subscribed',
    },
    expired: {
        icon: '⌛',
        iconBg: '#FAEEDA',
        badgeBg: '#FAEEDA',
        badgeColor: '#854F0B',
        label: 'Expired',
    },
    message: {
        icon: '💬',
        iconBg: '#E8F0FE',
        badgeBg: '#E8F0FE',
        badgeColor: '#1A56DB',
        label: 'Message',
    },
    // content_published — status field se
    info: {
        icon: '📅',
        iconBg: '#E8F0FE',
        badgeBg: '#E8F0FE',
        badgeColor: '#1A56DB',
        label: 'Info',
    },
    warning: {
        icon: '⚠️',
        iconBg: '#FAEEDA',
        badgeBg: '#FAEEDA',
        badgeColor: '#854F0B',
        label: 'Warning',
    },
    success: {
        icon: '✅',
        iconBg: '#EAF3DE',
        badgeBg: '#EAF3DE',
        badgeColor: '#3B6D11',
        label: 'Success',
    },
};

// ── Config resolve karo — newStatus pehle, phir status ────

const getConfig = (item) => {
    const newStatus = item?.data?.newStatus; // "approved", "suspended" etc
    const status = item?.status;             // "success", "warning", "info"
    return STATUS_CONFIG[newStatus] || STATUS_CONFIG[status] || {
        icon: '🔔',
        iconBg: '#F0F0F0',
        badgeBg: '#F0F0F0',
        badgeColor: '#555',
        label: 'Notification',
    };
};

// ── Date format ────────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// ──────────────────────────────────────────────────────────
const User_Notification = () => {

    const { theme: COLOURS, isDark } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    const loadNotifications = async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            const res = await fetchNotifications();
            if (res?.success) {
                setNotifications(res?.data?.data || []);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.log('Notification load error:', err);
            setNotifications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const renderItem = ({ item }) => {
        const config = getConfig(item);
        return (
            <FadeDown>
                <View style={[
                    styles.card,
                    { backgroundColor: COLOURS.light_primary },
                    !item.isRead && [styles.card_unread, { borderLeftColor: COLOURS.primary }]
                ]}>
                    {/* Icon */}
                    <View style={[styles.icon_box, { backgroundColor: config.iconBg }]}>
                        <Text style={styles.icon}>{config.icon}</Text>
                    </View>

                    {/* Body */}
                    <View style={styles.body}>
                        <View style={styles.top_row}>
                            <Text
                                style={[styles.title, { color: COLOURS.black }]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {item.title}
                            </Text>
                            <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
                                <Text style={[styles.badge_text, { color: config.badgeColor }]}>
                                    {config.label}
                                </Text>
                            </View>
                        </View>

                        <Text
                            style={[styles.message, { color: COLOURS.grey }]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.body}
                        </Text>

                        <Text style={[styles.date, { color: COLOURS.grey }]}>
                            {formatDate(item.sentAt)}
                        </Text>
                    </View>
                </View>
            </FadeDown>
        );
    };

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.white }]}>

                <View style={[styles.circle_lg, { backgroundColor: COLOURS.primary }]} />
                <View style={[styles.circle_sm, { backgroundColor: COLOURS.primary }]} />

                <Back_Arrow label={'notifications'} />

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={COLOURS.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => loadNotifications(true)}
                                colors={[COLOURS.primary]}
                                tintColor={COLOURS.primary}
                                progressBackgroundColor={COLOURS.light_primary}
                            />
                        }
                        ListEmptyComponent={
                            <Text style={[styles.empty, { color: COLOURS.grey }]}>
                                No notifications yet
                            </Text>
                        }
                    />
                )}

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