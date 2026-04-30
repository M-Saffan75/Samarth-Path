import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import { COLOURS } from '../assets/theme/Theme'

const Reaction = ({ source, count, tintColor, onPress }) => {
    return (
        <>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', width: responsiveWidth(14), marginRight: responsiveWidth(4) }}>
                <Image source={source} style={styles.react_img} tintColor={tintColor ? tintColor : COLOURS.grey} />
                <Text style={{ left: responsiveWidth(.5), top: responsiveWidth(.1) }}>{count}</Text>
            </TouchableOpacity>
        </>
    )
}

export default Reaction

const styles = StyleSheet.create({

    react_img: {
        height: responsiveWidth(5.8),
        width: responsiveWidth(5.8),
    },

})