import React from 'react';
import UserRoutes from '../user_routes/UserRoutes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../splash/Splash';
import Home from '../screens/home/Home';
import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import My_Path from '../screens/mypath/My_Path';
import Otp_Here from '../screens/auth/Otp_Here';
import Register from '../screens/auth/Register';
import PayWall from '../screens/paywall/PayWall';
import Archives from '../screens/archives/Archives';
import User_Profile from '../screens/profile/User_Profile';


const User_Navigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.Splash_Here}>
                <Stack.Screen name={UserRoutes.Home} component={Home} />
                <Stack.Screen name={UserRoutes.Login} component={Login} />
                <Stack.Screen name={UserRoutes.Archives} component={Archives} />
                <Stack.Screen name={UserRoutes.Otp} component={Otp_Here} />
                <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
                <Stack.Screen name={UserRoutes.PayWall} component={PayWall} />
                <Stack.Screen name={UserRoutes.Register} component={Register} />
                <Stack.Screen name={UserRoutes.My_Path} component={My_Path} />
                <Stack.Screen name={UserRoutes.Splash_Here} component={Splash} />
                <Stack.Screen name={UserRoutes.User_Profile} component={User_Profile} />
            </Stack.Navigator>
        </>
    );
};

export default User_Navigator;