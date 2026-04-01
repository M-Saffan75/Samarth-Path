import React from 'react';
import Splash from '../splash/Splash';
import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import UserRoutes from '../user_routes/UserRoutes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const User_Navigator = () => {

    const Stack = createNativeStackNavigator();

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.Splash_Here}>
                <Stack.Screen name={UserRoutes.Splash_Here} component={Splash} />
                <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
                <Stack.Screen name={UserRoutes.Register} component={Register} />
                <Stack.Screen name={UserRoutes.Login} component={Login} />
            </Stack.Navigator>
        </>
    );
};

export default User_Navigator;