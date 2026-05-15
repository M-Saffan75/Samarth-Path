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
    edit,
    onPress,
    selectedImage,
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

                setGradientIndex((prev) =>
                    prev === gradients.length - 1
                        ? 0
                        : prev + 1
                );

            }, 600);

        }, 2500);

        return () => clearInterval(interval);

    }, []);

    const firstLetter = userData?.name
        ? userData.name.charAt(0).toUpperCase()
        : '?';

    const imageUri =
        selectedImage?.uri ||
        userData?.profilePicture ||
        null;

    return (
        <View style={{ alignSelf, marginBottom, marginTop }}>

            {imageUri ? (

                <Image
                    source={{ uri: imageUri }}
                    style={[styles.profile_here,{borderWidth:responsiveWidth(.4), borderColor: COLOURS.primary}]}
                    resizeMode="cover"
                />

            ) : (

                <Animated.View
                    style={{
                        opacity: fadeAnim,
                    }}
                >

                    <LinearGradient
                        colors={gradients[gradientIndex]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.profile_here,
                            styles.letter_container,
                        ]}
                    >

                        <View style={styles.glossy_effect} />

                        <Text style={styles.letter}>
                            {firstLetter}
                        </Text>

                    </LinearGradient>

                </Animated.View>
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
        fontSize: responsiveFontSize(4),
        color: '#fff',
        fontFamily: Fonts.Bold,
        letterSpacing: 1.5,

        // textShadowColor: 'rgba(0,0,0,0.25)',
        // textShadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // textShadowRadius: 4,
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

        height: responsiveWidth(25),
        width: responsiveWidth(25),

        borderRadius: responsiveWidth(100),

        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 5,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 8,
        // elevation: 8,
    },

});