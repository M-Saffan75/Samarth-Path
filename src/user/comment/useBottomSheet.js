import { useRef } from 'react'
import { Animated, Dimensions, PanResponder } from 'react-native'

const { height } = Dimensions.get('window')

const EXPANDED = height * 0.05
const COLLAPSED = height * 0.15
const CLOSED = height

export const useBottomSheet = (navigation, isOpen, onClose) => {

  const translateY = useRef(new Animated.Value(CLOSED)).current
  const opacity = useRef(new Animated.Value(0)).current
  const offset = useRef(CLOSED)

  // isOpen change hone pe open/close animate karo
  const prevIsOpen = useRef(false)
  if (prevIsOpen.current !== isOpen) {
    prevIsOpen.current = isOpen
    if (isOpen) {
      offset.current = COLLAPSED
      Animated.parallel([
        Animated.spring(translateY, { toValue: COLLAPSED, useNativeDriver: true, damping: 18, stiffness: 200 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start()
    } else {
      offset.current = CLOSED
      Animated.parallel([
        Animated.spring(translateY, { toValue: CLOSED, useNativeDriver: true, damping: 18, stiffness: 260, mass: 0.5, overshootClamping: true }),
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start()
    }
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 3,

      onPanResponderGrant: () => { translateY.stopAnimation(v => { offset.current = v }) },

      onPanResponderMove: (_, g) => {
        let next = offset.current + g.dy
        if (next < EXPANDED) next = EXPANDED
        if (next > CLOSED) next = CLOSED
        translateY.setValue(next)
        opacity.setValue((CLOSED - next) / CLOSED)
      },

      onPanResponderRelease: (_, g) => {
        const final = offset.current + g.dy

        if (final > height * 0.6) {
          offset.current = CLOSED
          Animated.parallel([
            Animated.spring(translateY, { toValue: CLOSED, useNativeDriver: true, damping: 18, stiffness: 260, mass: 0.5, overshootClamping: true }),
            Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
          ]).start(() => { onClose?.() })
          return
        }

        if (final < height * 0.2) {
          offset.current = EXPANDED
          Animated.spring(translateY, { toValue: EXPANDED, useNativeDriver: true, damping: 18, stiffness: 200 }).start()
          return
        }

        offset.current = COLLAPSED
        Animated.spring(translateY, { toValue: COLLAPSED, useNativeDriver: true, damping: 18, stiffness: 200 }).start()
      },
    })
  ).current

  return { translateY, opacity, panResponder }
}