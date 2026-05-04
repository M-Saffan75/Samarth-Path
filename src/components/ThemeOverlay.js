// components/ThemeOverlay.js
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

const { height } = Dimensions.get('window');

export const ThemeOverlay = ({ animating, isDark }) => {
    const translateY = useRef(new Animated.Value(-height)).current;

    useEffect(() => {
        if (animating) {
            translateY.setValue(-height);

            Animated.sequence([
                // Slide down — smooth
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 450,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                // Thodi der ruko — theme already change ho chuki hai
                Animated.delay(80),
                // Slide up — smooth
                Animated.timing(translateY, {
                    toValue: -height,
                    duration: 450,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [animating]);

    return (
        <Animated.View
            pointerEvents="none"
            style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: height,
                backgroundColor: isDark ? '#1A1A1A' : '#FAF9F5',
                transform: [{ translateY }],
                // Soft bottom shadow — premium feel
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 10,
            }}
        />
    );
};