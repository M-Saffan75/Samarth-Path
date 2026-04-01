import React from 'react';
import { COLOURS } from '../assets/theme/Theme';
import { StyleSheet, TouchableOpacity, Text, } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const Button = ({ backgroundColor, onPress, disabled, marginLeft, marginRight, textTransform, alignSelf, top, fontFamily, opacity,
    fontSize, label, paddingVertical, width, marginTop, borderRadius, borderWidth, borderColor, color, marginBottom }) => {

    return (
        <>
            <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.btn_bg,
            {
                backgroundColor: backgroundColor ?? COLOURS.primary, width: width ?? responsiveWidth(90), alignSelf,
                marginTop: marginTop ?? responsiveWidth(5.5), paddingVertical: paddingVertical ?? responsiveWidth(3.7),
                borderRadius: borderRadius ?? responsiveWidth(2), marginLeft: marginLeft ?? responsiveWidth(0),
                marginRight: marginRight ?? responsiveWidth(0), borderColor: borderColor, borderWidth: borderWidth,
                marginBottom: marginBottom, opacity: opacity

            }]} disabled={disabled}>
                <Text style={[styles.btn_text, {
                    fontSize: fontSize ?? responsiveFontSize(1.8), top: top ?? responsiveWidth(.5), fontFamily: fontFamily ?? 'Poppins-Medium',
                    textTransform: textTransform ?? 'capitalize', width: responsiveWidth(75), color: color ?? COLOURS.white
                }]}>{label}</Text>
            </TouchableOpacity>

        </>
    )
}

export default Button

const styles = StyleSheet.create({

    btn_text: {
        textAlign: 'center',
        letterSpacing: 0.2,
        color: COLOURS.white,
        fontFamily: 'Poppins-Medium',
    },

    btn_bg: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(92),
        marginTop: responsiveWidth(5.5),
        borderRadius: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(2),
    }


})