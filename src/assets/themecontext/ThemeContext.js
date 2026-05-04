// context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOURS, DARK_COLOURS } from '../theme/Theme';

const ThemeContext = createContext();

const THEME_KEY = 'app_theme'; // 'light' | 'dark' | 'system'

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('system');
    const [systemTheme, setSystemTheme] = useState(Appearance.getColorScheme());

    // System theme change listener
    useEffect(() => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });
        return () => sub.remove();
    }, []);

    // AsyncStorage se load karo
    useEffect(() => {
        const load = async () => {
            const saved = await AsyncStorage.getItem(THEME_KEY);
            if (saved) setThemeMode(saved);
        };
        load();
    }, []);

    // Theme mode change karo + save karo
    const changeTheme = async (mode) => { // 'light' | 'dark' | 'system'
        setThemeMode(mode);
        await AsyncStorage.setItem(THEME_KEY, mode);
    };

    // Active theme decide karo
    const isDark =
        themeMode === 'dark' ? true :
        themeMode === 'light' ? false :
        systemTheme === 'dark'; // system

    const theme = isDark ? DARK_COLOURS : COLOURS;

    return (
        <ThemeContext.Provider value={{ theme, isDark, themeMode, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);