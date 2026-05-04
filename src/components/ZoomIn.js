import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const ZoomIn = ({ children, style, delay = 0, duration = 1000 }) => {
    const scale = useRef(new Animated.Value(0)).current
    const opacity = useRef(new Animated.Value(0)).current

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
                friction: 6,
                tension: 50,
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