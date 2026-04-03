import React from 'react'
import { Fonts } from '../assets/fonts/Fonts'
import { COLOURS } from '../assets/theme/Theme'
import { StyleSheet, Text, View } from 'react-native'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'

const Header = ({ title }) => {
    return (
        <>
            <View style={{ backgroundColor: COLOURS.light_primary, paddingVertical: responsiveWidth(3) }}>
                <Text style={{
                    fontFamily: Fonts.Medium, textTransform: 'capitalize', fontSize: responsiveFontSize(2.5),
                    color: COLOURS.black, textAlign: 'center', top: responsiveWidth(.4), paddingHorizontal: responsiveWidth(3),
                    letterSpacing: responsiveWidth(.1)
                }}>{title}</Text>
            </View>
        </>
    )
}

export default Header

const styles = StyleSheet.create({})