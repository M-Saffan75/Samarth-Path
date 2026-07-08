import React from 'react';
import {
    View, Text, Image, TouchableOpacity,
    StyleSheet, Modal,
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { Fonts } from '../assets/fonts/Fonts';
import { Pulse } from './Pulse';

const Winner_Modal = ({ visible, onClose, prize }) => {
    const { theme: COLOURS } = useTheme();
    const prizeInfo = prize?.prizes[0]?.prize;
    // console.log(prizeInfo)

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.card, { backgroundColor: COLOURS.white }]}
                >
                    <Pulse>
                        {prizeInfo?.imageUrl ? (
                            <Image
                                source={{ uri: prizeInfo.imageUrl }}
                                style={styles.image}
                                resizeMode="center"
                            />
                        ) : (
                            <View style={[styles.imagePlaceholder, { backgroundColor: COLOURS.light_primary }]}>
                                <Text style={{ fontSize: responsiveFontSize(6) }}>🏆</Text>
                            </View>
                        )}
                    </Pulse>

                    <View style={styles.content}>
                        {prizeInfo?.title && (
                            <Text style={[styles.title, { color: COLOURS.black }]}>
                                {prizeInfo.title}
                            </Text>
                        )}
                        {prizeInfo?.description && (
                            <Text style={[styles.description, { color: COLOURS.grey }]}>
                                {prizeInfo.description}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.closeBtn, { backgroundColor: COLOURS.primary }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.closeBtnText, { color: COLOURS.white }]}>Close</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal >
    );
};

export default Winner_Modal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(6),
    },
    card: {
        width: '100%',
        borderRadius: responsiveWidth(4),
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        alignSelf:'center',
        height: responsiveWidth(50),
    },
    imagePlaceholder: {
        width: '100%',
        height: responsiveWidth(55),
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveWidth(4),
        paddingBottom: responsiveWidth(2),
    },
    title: {
        fontSize: responsiveFontSize(2),
        fontFamily: Fonts.Medium,
        marginBottom: responsiveWidth(2),
    },
    description: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Regular,
        lineHeight: responsiveWidth(5),
    },
    closeBtn: {
        margin: responsiveWidth(5),
        marginTop: responsiveWidth(3),
        paddingVertical: responsiveWidth(3),
        borderRadius: responsiveWidth(3),
        alignItems: 'center',
    },
    closeBtnText: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: Fonts.Medium,
    },
});
