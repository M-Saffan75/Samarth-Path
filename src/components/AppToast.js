import React, { useMemo } from 'react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

export const showToast = (type = 'info', title, message) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000,
    });
};

export const AppToast = () => {
    const { theme: COLOURS, isDark } = useTheme();

    const toastConfig = useMemo(() => ({
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: COLOURS.green,
                    backgroundColor: COLOURS.light_primary,
                    borderRadius: responsiveWidth(3),
                    width: '90%',
                }}
                contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }}
                text1Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.8),
                    color: COLOURS.black,
                }}
                text2Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.4),
                    color: COLOURS.grey,
                }}
            />
        ),
        error: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: COLOURS.red,
                    backgroundColor: COLOURS.light_primary,
                    borderRadius: responsiveWidth(3),
                    width: '90%',
                }}
                contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }}
                text1Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.8),
                    color: COLOURS.black,
                }}
                text2Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.4),
                    color: COLOURS.grey,
                }}
            />
        ),
        info: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: COLOURS.primary,
                    backgroundColor: COLOURS.light_primary,
                    borderRadius: responsiveWidth(3),
                    width: '90%',
                }}
                contentContainerStyle={{ paddingHorizontal: responsiveWidth(3) }}
                text1Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.8),
                    color: COLOURS.black,
                }}
                text2Style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: responsiveFontSize(1.4),
                    color: COLOURS.grey,
                }}
            />
        ),
    }), [COLOURS]); // COLOURS change hone par naya config banega

    // key prop — isDark change hone par Toast force re-mount hoga
    return <Toast key={isDark ? 'dark' : 'light'} config={toastConfig} />;
};