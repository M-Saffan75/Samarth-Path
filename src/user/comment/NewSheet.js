import React from 'react'
import { View } from 'react-native'
import BottomSheet from './BottomSheet'
import { useBottomSheet } from './useBottomSheet'

const NewSheet = ({ navigation }) => {

  const { translateY, opacity, panResponder } = useBottomSheet(navigation)

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <BottomSheet
        translateY={translateY}
        opacity={opacity}
        panResponder={panResponder}
      />
    </View>
  )
}

export default NewSheet