import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { COLOURS } from '../assets/theme/Theme';
import { StyleSheet, Text, View, Image, } from 'react-native'
import { globalImages } from '../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Subscription_Offer = ({ detail, source }) => {
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: responsiveWidth(4), marginBottom: responsiveWidth(3.5) }}>
                <View style={{
                    backgroundColor: COLOURS.light_grey, borderRadius: responsiveWidth(2),
                    height: responsiveWidth(10), width: responsiveWidth(10), alignItems: 'center', justifyContent: 'center'
                }}>
                    <Image source={source} style={{ height: responsiveWidth(4), width: responsiveWidth(4) }} tintColor={COLOURS.green} />
                </View>
                <Text style={{
                    fontFamily: Fonts.Medium, textTransform: 'capitalize', fontSize: responsiveFontSize(1.7),
                    color: COLOURS.black, top: responsiveWidth(.4), paddingHorizontal: responsiveWidth(3), letterSpacing:responsiveWidth(.1)
                }}>{detail}</Text>
            </View>

        </>
    )
}

export default Subscription_Offer

const styles = StyleSheet.create({})