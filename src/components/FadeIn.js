import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const FadeIn = ({ children, style, delay = 0, duration = 1000 }) => {
    const opacity = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0.97)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                delay,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    return (
        <Animated.View style={[{ opacity, transform: [{ scale }] }, style]}>
            {children}
        </Animated.View>
    )
}