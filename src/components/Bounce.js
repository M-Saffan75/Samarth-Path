import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const Bounce = ({ children, style, delay = 0 }) => {
    const translateY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -6,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: -3,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start()
        }, delay)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <Animated.View style={[{ transform: [{ translateY }] }, style]}>
            {children}
        </Animated.View>
    )
}