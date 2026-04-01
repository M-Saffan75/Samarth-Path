import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions'
import { COLOURS } from '../assets/theme/Theme';
import { globalImages } from '../assets/images/images_file/All_Images';

const Input_Field = ({
    Placeholder, Second_inpt_Img, first_inpt_Img, textAlignVertical, display, borderWidth, borderColor, height, width, color,
    secureTextEntry, tintColor, onChangeText, keyboardType, maxLength, third_inpt_Img, left, backgroundColor, marginTop,
    numberOfLines, pointerEvents, defaultValue, textTransform, editable, multiline, onValueChange, borderRadius, onPress }) => {

    const [isPasswordVisible, setPasswordVisible] = useState(secureTextEntry);

    const toggleSecureTextEntry = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <>
            <View style={styles.align_body}>
                <View style={[styles.inpt_area, {
                    backgroundColor: backgroundColor ?? COLOURS.grey,
                    borderWidth, borderColor,
                    display: display, borderRadius: responsiveWidth(10) ?? borderRadius
                }]}>
                    {first_inpt_Img ? <Image source={first_inpt_Img} style={[styles.inpt_icon, {
                        marginTop: marginTop ?? responsiveWidth(.5),
                        height: height ?? responsiveWidth(6.5), width: width ?? responsiveWidth(6.5)
                    }]}
                        resizeMode='contain' tintColor={tintColor} /> : ''}
                    <TextInput placeholder={Placeholder} placeholderTextColor={'grey'} onChangeText={onChangeText} onValueChange={onValueChange}
                        style={[styles.inpt_text, { width: responsiveWidth(Second_inpt_Img ? 72 : 82), color: color ?? COLOURS.white }]}
                        secureTextEntry={isPasswordVisible} maxLength={maxLength} numberOfLines={numberOfLines}
                        textAlignVertical={textAlignVertical}
                        defaultValue={defaultValue}
                        multiline={multiline}
                        editable={editable}
                        keyboardType={keyboardType}
                        textTransform={textTransform}
                    />
                    {Second_inpt_Img ?
                        <TouchableOpacity onPress={toggleSecureTextEntry}>
                            <Image source={isPasswordVisible ? globalImages.eye_slash : Second_inpt_Img} resizeMode='contain'
                                tintColor={tintColor} style={[styles.inpt_icon, { left: responsiveWidth(-2) }]} />
                        </TouchableOpacity>
                        : ''}
                    {third_inpt_Img ?
                        <TouchableOpacity onPress={onPress}>
                            <Image source={third_inpt_Img} resizeMode='contain' pointerEvents={pointerEvents}
                                tintColor={tintColor} style={[styles.inpt_icon, { left: left }]} />
                        </TouchableOpacity>
                        : ''}
                </View>
            </View>
        </>
    )
}

export default Input_Field

const styles = StyleSheet.create({


    /*  */


    dont_text_2: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.7),
        textTransform: 'capitalize',
    },

    dont_text_1: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.7),
        textTransform: 'capitalize',
    },

    dont_accnt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: responsiveWidth(5)
    },

    /*  */

    align_body: {
        alignSelf: 'center'
    },

    inpt_area: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: responsiveWidth(2),
        marginTop: responsiveWidth(1.5),
        paddingVertical: responsiveWidth(1.2),
        marginHorizontal: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(3),

        borderRadius: responsiveWidth(20),
        width: responsiveWidth(90)

    },

    inpt_icon: {
        height: responsiveWidth(6.5),
        width: responsiveWidth(6.5),
        // backgroundColor:'red'
    },

    inpt_text: {
        fontFamily: 'Inter-Medium',
        width: responsiveWidth(72),
        top: 1,
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(2.5),
        paddingHorizontal: responsiveWidth(2),
        fontSize: responsiveFontSize(1.7),
        textTransform: 'capitalize',

    },

})