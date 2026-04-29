import React from 'react'
import { COLOURS } from '../assets/theme/Theme';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { globalImages } from '../assets/images/images_file/All_Images';
import { useUser } from '../user/screens/auth/user_context/UserContext';

const Profile = ({ alignSelf, marginBottom, marginTop, edit }) => {

    const { userData } = useUser();

    return (
        <>
            <View style={{ alignSelf: alignSelf, marginBottom: marginBottom, marginTop: marginTop }}>
                <Image source={globalImages.profile} style={[styles.profile_here,]} tintColor={'contain'} />
                {edit === true ? < TouchableOpacity style={styles.edit_icon} activeOpacity={0.9}>
                    <Image source={globalImages.edit_pencil} style={styles.profile_edit} resizeMode='contain' tintColor={COLOURS.white}></Image>
                </TouchableOpacity> : ""}
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