import React, { useEffect, useRef, useState } from 'react';
import { COLOURS } from '../assets/theme/Theme';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {
    responsiveFontSize,
    responsiveWidth,
} from 'react-native-responsive-dimensions';

import { globalImages } from '../assets/images/images_file/All_Images';
import { useUser } from '../user/screens/auth/user_context/UserContext';
import { Fonts } from '../assets/fonts/Fonts';

const gradients = [
    ['#7C3AED', '#A855F7'],
    ['#2563EB', '#7C3AED'],
    ['#EC4899', '#8B5CF6'],
    ['#06B6D4', '#3B82F6'],
    ['#9333EA', '#F43F5E'],
];

const Profile = ({
    alignSelf,
    marginBottom,
    marginTop,
    height,
    width,
    edit,
    fontSize,
    onPress,
    selectedImage,
    Ease,
    onpressName,
}) => {

    const { userData } = useUser();

    const [gradientIndex, setGradientIndex] = useState(0);

    const fadeAnim = useRef(
        new Animated.Value(1)
    ).current;

    useEffect(() => {

        const interval = setInterval(() => {

            Animated.sequence([

                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),

                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),

            ]).start();

            setTimeout(() => {
                setGradientIndex((prev) => prev === gradients.length - 1 ? 0 : prev + 1);
            }, 600);
        }, 2500);

        return () => clearInterval(interval);

    }, []);

    const firstLetter = userData?.name ? userData.name.charAt(0).toUpperCase() : '?';
    const imageUri = selectedImage?.uri || userData?.profilePicture || null;
    const flatColors = gradients.flat();
    const randomColor = useRef(flatColors[Math.floor(Math.random() * flatColors.length)]).current;

    return (
        <View style={{ alignSelf, marginBottom, marginTop }}>

            {imageUri ? (
                <Image source={{ uri: imageUri }} style={[styles.profile_here, { borderWidth: responsiveWidth(.4), height: height || responsiveWidth(25), width: width || responsiveWidth(25), borderColor: COLOURS.primary }]} resizeMode="cover" />
            ) : !Ease ? (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <LinearGradient colors={gradients[gradientIndex]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.profile_here, styles.letter_container, { height: height || responsiveWidth(25), width: width || responsiveWidth(25) }]}>
                        <View style={styles.glossy_effect} />
                        <Text style={[styles.letter, { fontSize: fontSize || responsiveFontSize(2.5) }]}>{firstLetter}</Text>
                    </LinearGradient>
                </Animated.View>
            ) : (
                <TouchableOpacity onPress={onpressName} activeOpacity={0.7}>
                    <View style={{
                        backgroundColor: randomColor, borderRadius: 999,
                        height: height || responsiveWidth(25), width: width || responsiveWidth(25),
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Text style={[styles.letter, { fontSize: fontSize || responsiveFontSize(2.5) }]}>
                            {firstLetter}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {edit === true && (
                <TouchableOpacity
                    style={styles.edit_icon}
                    activeOpacity={0.8}
                    onPress={onPress}
                >
                    <Image
                        source={globalImages.edit_pencil}
                        style={styles.profile_edit}
                        resizeMode="contain"
                        tintColor={COLOURS.white}
                    />
                </TouchableOpacity>
            )}

        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({

    letter_container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    glossy_effect: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '45%',
        backgroundColor: 'rgba(255,255,255,0.12)',
    },

    letter: {
        fontSize: responsiveFontSize(2.5),
        color: '#fff',
        top: responsiveWidth(.3),
        fontFamily: Fonts.Bold,
        letterSpacing: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },

    edit_icon: {
        position: 'absolute',
        right: 0,
        bottom: responsiveWidth(2),
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        borderWidth: responsiveWidth(.4),
        borderColor: COLOURS.white,
        backgroundColor: COLOURS.primary,
        borderRadius: responsiveWidth(100),
    },

    profile_edit: {
        width: responsiveWidth(3),
        height: responsiveWidth(3),
    },

    profile_here: {
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: responsiveWidth(.4),
        borderRadius: responsiveWidth(100),
    },

});