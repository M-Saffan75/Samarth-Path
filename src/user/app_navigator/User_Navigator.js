import React from 'react';
import UserRoutes from '../user_routes/UserRoutes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../splash/Splash';
import Home from '../screens/home/Home';
import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import Otp_Here from '../screens/auth/Otp_Here';
import Register from '../screens/auth/Register';
import PayWall from '../screens/paywall/PayWall';


const User_Navigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.Splash_Here}>
                <Stack.Screen name={UserRoutes.Home} component={Home} />
                <Stack.Screen name={UserRoutes.Login} component={Login} />
                <Stack.Screen name={UserRoutes.Otp} component={Otp_Here} />
                <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
                <Stack.Screen name={UserRoutes.PayWall} component={PayWall} />
                <Stack.Screen name={UserRoutes.Register} component={Register} />
                <Stack.Screen name={UserRoutes.Splash_Here} component={Splash} />
            </Stack.Navigator>
        </>
    );
};

export default User_Navigator;