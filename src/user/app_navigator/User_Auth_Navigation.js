import React from 'react';

import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import Otp_Here from '../screens/auth/Otp_Here';
import Register from '../screens/auth/Register';
import Verify_Email from '../screens/auth/Verify_Email';
import Reset_Password from '../screens/auth/Reset_Password';
import Forgot_Password from '../screens/auth/Forgot_Password';
import Change_Password from '../screens/auth/Change_Password';

import UserRoutes from '../user_routes/UserRoutes'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const User_Auth_Navigation = () => {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.OnBoard}>
            <Stack.Screen name={UserRoutes.Login} component={Login} />
            <Stack.Screen name={UserRoutes.Register} component={Register}
                options={{ animation: 'fade' }} />
            <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
            <Stack.Screen name={UserRoutes.Verify_Email} component={Verify_Email}
                options={{ animation: 'fade' }} />
            <Stack.Screen name={UserRoutes.Otp_Here} component={Otp_Here}
                options={{ animation: 'fade' }} />
            <Stack.Screen name={UserRoutes.Forgot_Password} component={Forgot_Password} />
            <Stack.Screen name={UserRoutes.Reset_Password} component={Reset_Password} />
            <Stack.Screen name={UserRoutes.Change_Password} component={Change_Password}
                options={{ animation: 'fade' }} />

        </Stack.Navigator>
    );
};

export default User_Auth_Navigation;