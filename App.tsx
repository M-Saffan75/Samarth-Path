import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import User_Main from './src/user/app_navigator/User_Main';
import SecureOverlay from './src/user/screens/screenshot/SecureOverlay';
import useAppSecurity from './src/user/screens/screenshot/useAppSecurity';

const App = () => {

  const { isSecure } = useAppSecurity();

  return (
    <NavigationContainer>

      <User_Main />

      {isSecure && <SecureOverlay />}

    </NavigationContainer>
  );
};

export default App;