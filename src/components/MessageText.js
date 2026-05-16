import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Title_Here from './Title_Here';

const MessageText = ({ message, marginRight, marginLeft }) => {

    const { theme: COLOURS } = useTheme();

    return (
        <>
            <View style={{
                marginRight: marginRight,
                marginLeft: marginLeft,
                backgroundColor: COLOURS.light_primary, paddingVertical: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(4), borderRadius: responsiveWidth(2)
            }}>
                <Text style={{
                    lineHeight: responsiveWidth(5),
                    color: COLOURS.black, fontSize: responsiveFontSize(1.3), fontFamily: Fonts.Medium,
                    width: responsiveWidth(60),
                }}>{message}</Text>
               
            </View>
        </>
    )
}

export default MessageText

const styles = StyleSheet.create({})