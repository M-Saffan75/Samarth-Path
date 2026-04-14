import React from 'react';
import Toast from 'react-native-toast-message';
import UserRoutes from '../user_routes/UserRoutes';
import { ToastConfig } from '../../helper/ToastConfig';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../splash/Splash';
import Home from '../screens/home/Home';
import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import Loader from '../../loading/Loader';
import My_Path from '../screens/mypath/My_Path';
import Register from '../screens/auth/Register';
import Otp_Here from '../screens/auth/Otp_Here';
import PayWall from '../screens/paywall/PayWall';
import Archives from '../screens/archives/Archives';
import Verify_Email from '../screens/auth/Verify_Email';
import User_Profile from '../screens/profile/User_Profile';
import Reset_Password from '../screens/auth/Reset_Password';
import { LoaderProvider } from '../../loading/LoaderContext';
import Forgot_Password from '../screens/auth/Forgot_Password';
import Bottom_Navigation from '../bottom_tabs/Bottom_Navigation';

const User_Navigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <>
            <LoaderProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.Splash_Here}>
                    <Stack.Screen name={UserRoutes.Home} component={Home} />
                    <Stack.Screen name={UserRoutes.Login} component={Login} />
                    <Stack.Screen name={UserRoutes.Otp_Here} component={Otp_Here} />
                    <Stack.Screen name={UserRoutes.Archives} component={Archives} />
                    <Stack.Screen name={UserRoutes.Verify_Email} component={Verify_Email} />
                    <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
                    <Stack.Screen name={UserRoutes.PayWall} component={PayWall} />
                    <Stack.Screen name={UserRoutes.Register} component={Register} />
                    <Stack.Screen name={UserRoutes.My_Path} component={My_Path} />
                    <Stack.Screen name={UserRoutes.Forgot_Password} component={Forgot_Password} />
                    <Stack.Screen name={UserRoutes.Reset_Password} component={Reset_Password} />
                    <Stack.Screen name={UserRoutes.Splash_Here} component={Splash} />
                    <Stack.Screen name={UserRoutes.User_Profile} component={User_Profile} />
                    <Stack.Screen name={UserRoutes.Bottom_Navigation} component={Bottom_Navigation} />
                </Stack.Navigator>
                <Loader />
            </LoaderProvider>
            <Toast config={ToastConfig} />
        </>
    );
};

export default User_Navigator;