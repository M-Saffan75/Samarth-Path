import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';


import { useUser } from '../user/screens/auth/user_context/UserContext';

const Trial_Text = ({ backgroundColor, width, alignSelf }) => {

    const { theme: COLOURS } = useTheme();
    const { userData } = useUser();
    console.log('userData', userData?.isTrial)

    return (
        <View style={{
            backgroundColor: backgroundColor ?? COLOURS.white, padding: responsiveWidth(2),
            borderRadius: responsiveWidth(100),
            width: userData?.subscription === null || userData?.isSubscribed === false ? width ?? responsiveWidth(50) : width ?? responsiveWidth(60),
            alignSelf: alignSelf
        }}>
            <Text style={{
                fontFamily: Fonts.Medium, color: COLOURS.primary, top: responsiveWidth(.4),
                fontSize: responsiveFontSize(1.8), textTransform: 'capitalize', textAlign: 'center'
            }}>{userData?.subscription === null || userData?.isSubscribed === false || userData?.isTrial === true ? 'Trial : 3 days Trial' : 'Premium : 1 month Access'}</Text>
        </View>
    )
}

export default Trial_Text

const styles = StyleSheet.create({})