import React from 'react'
import UserRoutes from '../user_routes/UserRoutes';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FloatingButton = ({ navigation, image }) => {

    const { theme: COLOURS } = useTheme();

    const openModal = () => {
        navigation.navigate(UserRoutes.ConsultationScreen);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: COLOURS.primary }]}
                onPress={openModal}
                activeOpacity={0.85}
            >
                <Image
                    source={image}
                    style={styles.fab_image}
                    tintColor={COLOURS.white}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </>
    )
}

export default FloatingButton

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: responsiveWidth(20),
        right: responsiveWidth(5),
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        borderRadius: responsiveWidth(7),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fab_image: {
        width: responsiveWidth(8),
        height: responsiveWidth(8),
    },
})