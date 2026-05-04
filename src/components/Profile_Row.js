import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { globalImages } from '../assets/images/images_file/All_Images';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'
import { useTheme } from '../assets/themecontext/ThemeContext';

const Profile_Row = ({ bordernone, paddingBottom, label, source,
    tintColor, backgroundColor, color, navigation, onPress }) => {
        
        const { theme: COLOURS } = useTheme();
        
    return (
        <>
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                <View style={{
                    marginBottom: responsiveWidth(3),
                    // paddingTop: responsiveWidth(1),
                    paddingBottom: paddingBottom ?? responsiveWidth(2),
                    borderBottomColor: COLOURS.grey,
                    flexDirection: 'row', alignItems: 'center',
                    borderBottomWidth: bordernone ?? responsiveWidth(.1),
                }}>
                    <View style={{
                        backgroundColor: backgroundColor ?? COLOURS.light_grey, borderRadius: responsiveWidth(2),
                        height: responsiveWidth(10), width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Image source={source} style={{ height: responsiveWidth(4), width: responsiveWidth(4) }}
                            tintColor={tintColor ?? COLOURS.light_green} />
                    </View>

                    <Text style={{
                        fontFamily: Fonts.Medium, textTransform: 'capitalize', fontSize: responsiveFontSize(1.7),
                        color: color ?? COLOURS.black, top: responsiveWidth(.4), paddingHorizontal: responsiveWidth(3),
                        letterSpacing: responsiveWidth(.1)
                    }}>{label}
                    </Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

export default Profile_Row

const styles = StyleSheet.create({})