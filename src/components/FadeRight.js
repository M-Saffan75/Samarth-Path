import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const FadeRight = ({ children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current
    const translateX = useRef(new Animated.Value(20)).current  // ← positive 20

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    return (
        <Animated.View style={[{ opacity, transform: [{ translateX }] }, style]}>
            {children}
        </Animated.View>
    )
}