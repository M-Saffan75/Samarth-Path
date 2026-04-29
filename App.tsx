import React from 'react';
import User_Main from './src/user/app_navigator/User_Main';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <User_Main />
    </NavigationContainer>
  )
}

export default App