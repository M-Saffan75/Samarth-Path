import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const FadeDown = ({ children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(-20)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    return (
        <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
            {children}
        </Animated.View>
    )
}