import React from 'react';
import { Fonts } from '../assets/fonts/Fonts';
import { COLOURS } from '../assets/theme/Theme';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';


const Subscription_Card = ({ Price, Trial_Days }) => {
    return (
        <>
            <View style={{
                borderWidth: responsiveWidth(.3), borderColor: COLOURS.primary,
                backgroundColor: COLOURS.light_grey, borderRadius: responsiveWidth(10),
                marginHorizontal: responsiveWidth(4), alignItems: 'center', paddingVertical: responsiveWidth(5)
            }}>
                <Text style={{ fontFamily: Fonts.Medium, fontSize: responsiveFontSize(1.8), textTransform: 'uppercase', color: COLOURS.light_black, paddingTop: responsiveWidth(2) }}>{Trial_Days}</Text>
                <Text style={{ fontFamily: Fonts.Bold, fontSize: responsiveFontSize(1.8), textTransform: 'uppercase', color: COLOURS.primary, paddingTop: responsiveWidth(2) }}>{Price}</Text>
                <Text style={{ fontFamily: Fonts.Medium, fontSize: responsiveFontSize(1.8), textTransform: 'uppercase', color: COLOURS.light_black, paddingTop: responsiveWidth(2) }}>one time payment</Text>

            </View>
        </>
    )
}

export default Subscription_Card

const styles = StyleSheet.create({})