import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { COLOURS } from '../assets/theme/Theme';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';


const Select_Text = ({ label, count, borderBottomWidth, borderBottomColor,
    color, onPress, countColor, backgroundColor
}) => {
    return (
        <>
            <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                borderBottomColor: borderBottomColor ?? COLOURS.light_black,
                borderBottomWidth: borderBottomWidth ?? responsiveWidth(.5), width: responsiveWidth(25),
                paddingBottom: responsiveWidth(2),
            }}>
                <Text style={{
                    color: color ?? COLOURS.black, fontFamily: Fonts.Medium,
                    top: responsiveWidth(.4), textTransform: 'capitalize',
                    paddingRight: responsiveWidth(1.5), fontSize: responsiveFontSize(1.7)
                }}>{label}</Text>
                {/* <Text style={{
                    backgroundColor: backgroundColor ?? COLOURS.primary, width: responsiveWidth(5),
                    height: responsiveWidth(5), borderRadius: responsiveWidth(100),
                    textAlign: 'center', textAlignVertical: 'center', color: countColor ?? COLOURS.white,

                }}>{count}</Text> */}
            </TouchableOpacity>
        </>
    )
}

export default Select_Text

const styles = StyleSheet.create({})