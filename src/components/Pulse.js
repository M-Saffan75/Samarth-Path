import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

export const Pulse = ({ children, style }) => {
    const translateY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    return (
        <Animated.View style={[{ transform: [{ translateY }] }, style]}>
            {children}
        </Animated.View>
    )
}