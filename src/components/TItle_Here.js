import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import {
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import { COLOURS } from '../assets/theme/Theme';

const Title_Here = ({ title, fontSize, textAlign, marginTop, width, justifyContent, letterSpacing, marginLeft, marginRight, lineHeight, borderRadius, fontStyle,
    backgroundColor, alignItems, marginBottom, color, fontFamily, marginHorizontal, textTransform, alignSelf, style, paddingHorizontal, paddingVertical }) => {
    return (
        <>

            <View>
                <View style={style}>
                    <Text style={[styles.inpt_name,
                    {
                        fontSize: fontSize ?? responsiveFontSize(1.9), color: color ?? COLOURS.black,
                        alignSelf,
                        fontStyle: fontStyle ?? 'italic',
                        fontFamily: fontFamily ?? 'Poppins-Medium',
                        marginHorizontal: marginHorizontal ?? responsiveWidth(5),
                        marginBottom: marginBottom ?? responsiveWidth(1),
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        marginTop: marginTop ?? responsiveWidth(4),
                        textTransform: textTransform ?? 'capitalize',
                        textAlign: textAlign ?? textAlign,
                        alignItems: alignItems ?? 'center', width: width,
                        letterSpacing: letterSpacing,
                        lineHeight,
                        justifyContent: justifyContent ?? 'center', backgroundColor: backgroundColor,
                        paddingHorizontal, paddingVertical, borderRadius
                    }]}>
                        {title}
                    </Text>
                </View>
            </View>
        </>
    )
}

export default Title_Here

const styles = StyleSheet.create({


    inpt_name: {
        textTransform: 'capitalize',
        fontFamily: 'Poppins-Medium',
        //
        marginTop: responsiveWidth(4),
        marginBottom: responsiveWidth(1),
        marginHorizontal: responsiveWidth(5),
    },
})