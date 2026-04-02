import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import User_Navigator from './src/user/app_navigator/User_Navigator';

const App = () => {
  return (
    <NavigationContainer>
      <User_Navigator />
    </NavigationContainer>
  )
}

export default App