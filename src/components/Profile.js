import React from 'react'
import { COLOURS } from '../assets/theme/Theme';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { globalImages } from '../assets/images/images_file/All_Images';
import { useUser } from '../user/screens/auth/user_context/UserContext';
import { Fonts } from '../assets/fonts/Fonts';

const Profile = ({ alignSelf, marginBottom, marginTop, edit, onPress, selectedImage }) => {

    const { userData } = useUser();
    const firstLetter = userData?.name
        ? userData.name.charAt(0).toUpperCase()
        : '?';

    const imageUri = selectedImage?.uri || userData?.profilePicture || null;

    return (
        <>
            <View style={{ alignSelf, marginBottom, marginTop }}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.profile_here}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.profile_here, { backgroundColor: COLOURS.purple, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: responsiveFontSize(4), color: COLOURS.black, fontFamily: Fonts.Medium }}>
                            {firstLetter}
                        </Text>
                    </View>
                )}

                {edit === true && (
                    <TouchableOpacity style={styles.edit_icon} activeOpacity={0.8} onPress={onPress}>
                        <Image
                            source={globalImages.edit_pencil}
                            style={styles.profile_edit}
                            resizeMode="contain"
                            tintColor={COLOURS.white}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </>
    )
}

export default Profile

const styles = StyleSheet.create({

    edit_icon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        alignItems: 'center',
        borderColor: COLOURS.white,
        bottom: responsiveWidth(2),
        justifyContent: 'center',
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        borderWidth: responsiveWidth(.4),
        backgroundColor: COLOURS.primary,
        borderRadius: responsiveWidth(100),
    },

    profile_edit: {
        width: responsiveWidth(3),
        height: responsiveWidth(3),
    },

    profile_here: {
        borderColor: COLOURS.primary,
        borderWidth: responsiveWidth(.4),
        height: responsiveWidth(25),
        width: responsiveWidth(25),
        borderRadius: responsiveWidth(100)
    },

})