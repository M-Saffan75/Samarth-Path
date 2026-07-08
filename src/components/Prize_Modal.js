import React, { useEffect, useRef } from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Modal, ScrollView, Animated,
} from 'react-native';
import { Fonts } from '../assets/fonts/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { globalImages } from '../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Prize_Modal = ({ visible, onClose, prize, label }) => {
    const { theme: COLOURS } = useTheme();

    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const contentY = useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1, duration: 250, useNativeDriver: true,
                }),
                Animated.spring(contentY, {
                    toValue: 0,
                    damping: 18,
                    stiffness: 160,
                    mass: 1,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0, duration: 220, useNativeDriver: true,
            }),
            Animated.timing(contentY, {
                toValue: 400, duration: 250, useNativeDriver: true,
            }),
        ]).start(() => {
            overlayOpacity.setValue(0);
            contentY.setValue(400);
            onClose();
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            {/* Overlay — sirf fade */}
            <Animated.View
                style={[StyleSheet.absoluteFill, styles.overlay_bg, { opacity: overlayOpacity }]}
            >
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />
            </Animated.View>

            {/* Content — slide from bottom */}
            <View style={styles.wrapper} pointerEvents="box-none">
                <Animated.View
                    style={[styles.card, { backgroundColor: COLOURS.white, transform: [{ translateY: contentY }] }]}
                >
                    {/* Image */}
                    <View style={styles.img_wrapper}>
                        <Image
                            source={prize?.imageUrl ? { uri: prize.imageUrl } : globalImages.winner_icon}
                            style={styles.image}
                            resizeMode="center"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.55)']}
                            style={styles.img_gradient}
                        />
                        <View style={styles.badge}>
                            <Text style={styles.badge_text}>{label || 'Accounce soon...'}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={{ maxHeight: responsiveWidth(45) }}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {prize?.title && (
                            <Text style={[styles.title, { color: COLOURS.black }]}>
                                {prize.title || "Prize comming soon check Later...."}
                            </Text>
                        )}
                        <Text style={[styles.description, { color: COLOURS.grey }]}>
                            {prize?.description || 'Win this exclusive prize by topping the leaderboard. Attempt today\'s quiz and give it your best shot!'}
                        </Text>
                    </ScrollView>

                    {/* Close */}
                    <TouchableOpacity
                        style={[styles.close_btn, { backgroundColor: COLOURS.primary }]}
                        onPress={handleClose}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.close_text, { color: COLOURS.white }]}>Got it</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default Prize_Modal;

const styles = StyleSheet.create({
    overlay_bg: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    card: {
        borderTopLeftRadius: responsiveWidth(6),
        borderTopRightRadius: responsiveWidth(6),
        overflow: 'hidden',
        paddingBottom: responsiveWidth(6),
    },
    img_wrapper: {
        width: '100%',
        height: responsiveWidth(65),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    img_gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: responsiveWidth(25),
    },
    badge: {
        position: 'absolute',
        top: responsiveWidth(4),
        left: responsiveWidth(4),
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1),
        borderRadius: responsiveWidth(10),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    badge_text: {
        color: '#fff',
        fontSize: responsiveFontSize(1.2),
        fontFamily: Fonts.Medium,
        letterSpacing: 1.5,
    },
    content: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveWidth(4),
        paddingBottom: responsiveWidth(2),
    },
    title: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: Fonts.Medium,
        textTransform: 'capitalize',
        marginBottom: responsiveWidth(2),
    },
    description: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Regular,
        lineHeight: responsiveWidth(5.2),
    },
    close_btn: {
        marginHorizontal: responsiveWidth(5),
        marginTop: responsiveWidth(4),
        paddingVertical: responsiveWidth(3.5),
        borderRadius: responsiveWidth(3),
        alignItems: 'center',
    },
    close_text: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: Fonts.Medium,
    },
});
