import React from 'react'
import { Fonts } from '../assets/fonts/Fonts';
import { StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../assets/themecontext/ThemeContext';


import { useUser } from '../user/screens/auth/user_context/UserContext';

const Trial_Text = ({ backgroundColor, width, alignSelf }) => {

    const { theme: COLOURS } = useTheme();
    const { userData } = useUser();

    return (
        <View style={{
            backgroundColor: backgroundColor ?? COLOURS.white, padding: responsiveWidth(2),
            borderRadius: responsiveWidth(100), width: width ?? responsiveWidth(50),
            alignSelf: alignSelf
        }}>
            <Text style={{
                fontFamily: Fonts.Medium, color: COLOURS.primary, top: responsiveWidth(.4),
                fontSize: responsiveFontSize(1.8), textTransform: 'capitalize', textAlign: 'center'
            }}>{userData?.subscription?.status === 'trial' ? 'trial' + ': ' + '3 days remaining' : 'trial' + ': ' + '1 month Access'}</Text>
        </View>
    )
}

export default Trial_Text

const styles = StyleSheet.create({})