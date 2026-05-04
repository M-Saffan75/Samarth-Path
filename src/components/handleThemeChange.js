import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useTheme } from '../assets/themecontext/ThemeContext';

const fadeAnim = useRef(new Animated.Value(0)).current;
const { theme: COLOURS, isDark, themeMode } = useTheme();

const handleThemeChange = (value) => {
    changeTheme(value);
    // Flash overlay
    Animated.sequence([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }),
    ]).start();
};