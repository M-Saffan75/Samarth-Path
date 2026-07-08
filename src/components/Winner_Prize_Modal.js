import React from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Modal, ScrollView,
} from 'react-native';
import { Fonts } from '../assets/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Winner_Prize_Modal = ({ visible, onClose, prize }) => {
    const { theme: COLOURS } = useTheme();
    const prizeInfo = prize;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={[styles.card, { backgroundColor: COLOURS.white }]}>

                    {/* Golden header */}
                    {/* <LinearGradient colors={['#FFD700', '#F59E0B', '#D97706']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Text style={styles.header_emoji}>🏆</Text>
                        <Text style={styles.header_title}>WINNER'S PRIZE</Text>
                    </LinearGradient> */}

                    {/* Prize image */}
                    {prizeInfo?.imageUrl ? (
                        <Image
                            source={{ uri: prizeInfo.imageUrl }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={[styles.image_placeholder, { backgroundColor: COLOURS.light_primary }]}>
                            <Text style={{ fontSize: responsiveFontSize(6) }}>🎁</Text>
                        </View>
                    )}

                    {/* Prize info */}
                    <ScrollView
                        style={{ maxHeight: responsiveWidth(32) }}
                        contentContainerStyle={styles.info}
                        showsVerticalScrollIndicator={false}
                    >
                        {prizeInfo?.title ? (
                            <Text style={[styles.title, { color: COLOURS.black }]}>{prizeInfo.title}</Text>
                        ) : null}
                        <Text style={[styles.description, { color: COLOURS.grey }]}>
                            {prizeInfo?.description || 'Win this exclusive prize by topping the leaderboard. Attempt the quiz and give it your best shot!'}
                        </Text>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.close_btn, { backgroundColor: COLOURS.primary }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.close_text, { color: COLOURS.white }]}>Got it</Text>
                    </TouchableOpacity>

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default Winner_Prize_Modal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(6),
    },
    card: {
        width: '100%',
        borderRadius: responsiveWidth(4),
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: responsiveWidth(2),
        paddingVertical: responsiveWidth(3.5),
    },
    header_emoji: {
        fontSize: responsiveFontSize(2.2),
    },
    header_title: {
        color: '#fff',
        fontSize: responsiveFontSize(1.8),
        fontFamily: Fonts.Medium,
        letterSpacing: 1.5,
    },
    image: {
        width: '100%',
        height: responsiveWidth(52),
    },
    image_placeholder: {
        width: '100%',
        height: responsiveWidth(52),
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveWidth(4),
        paddingBottom: responsiveWidth(2),
    },
    title: {
        fontSize: responsiveFontSize(2),
        fontFamily: Fonts.Medium,
        textTransform: 'capitalize',
        marginBottom: responsiveWidth(2),
    },
    description: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Regular,
        lineHeight: responsiveWidth(5),
    },
    close_btn: {
        margin: responsiveWidth(5),
        marginTop: responsiveWidth(3),
        paddingVertical: responsiveWidth(3),
        borderRadius: responsiveWidth(3),
        alignItems: 'center',
    },
    close_text: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: Fonts.Medium,
    },
});
