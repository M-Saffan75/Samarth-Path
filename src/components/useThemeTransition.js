// hooks/useThemeTransition.js
import { useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../assets/themecontext/ThemeContext';

const useThemeTransition = () => {
    const { isDark, changeTheme } = useTheme();
    const progress = useRef(new Animated.Value(0)).current;

    const handleThemeChange = (value) => {
        changeTheme(value);
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false, // false — colors animate honge
        }).start();
    };

    return { progress, handleThemeChange, isDark };
};

export default useThemeTransition;