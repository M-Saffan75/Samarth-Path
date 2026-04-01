import React from 'react'
import { COLOURS } from '../assets/theme/Theme'
import { useNavigation } from '@react-navigation/native'
import { globalImages } from '../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Back_Arrow = ({ label, show }) => {

    const navigation = useNavigation();

    return (
        <>
            <View style={styles.main_arrow_area}>

                <View style={styles.arrow_area}>
                    <TouchableOpacity activeOpacity={0.9} style={[styles.bg_arrow, { backgroundColor: COLOURS.white, elevation: responsiveWidth(1) }]}
                        onPress={() => navigation.goBack()}>
                        <Image source={globalImages.back_arrow} style={styles.arrow_img} />
                    </TouchableOpacity>
                    {show !== false ? <View style={[styles.bg_arrow_text]}>
                        <Text style={styles.arrow_text}>{label}</Text>
                    </View> :
                        ''
                    }
                </View>

            </View>
        </>

    )
}

export default Back_Arrow

const styles = StyleSheet.create({

    main_arrow_area: {
        marginTop: responsiveWidth(5),
        marginBottom: responsiveWidth(2),
        marginHorizontal: responsiveWidth(4),
    },

    bg_arrow_text: {
        width: '75%',
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(3),
    },

    arrow_text: {
        fontFamily: 'Poppins-Bold',
        textTransform: 'capitalize',
        textAlign: 'center',
        fontSize: responsiveFontSize(2.5)
    },

    bg_arrow: {
        borderRadius: responsiveWidth(2),
        width: responsiveWidth(12),
        alignItems: 'center',
        paddingVertical: responsiveWidth(4),
    },

    arrow_img: {
        height: responsiveWidth(4),
        width: responsiveWidth(4),
    },

    arrow_area: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }

})