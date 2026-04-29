import React from 'react';

import UserRoutes from '../user_routes/UserRoutes'
import User_Profile from '../../user/screens/profile/User_Profile';
import Edit_Profile from '../../user/screens/profile/Edit_Profile';

import User_Main from '../../user/app_navigator/User_Main';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const User_Profile_Navigation = () => {
    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={UserRoutes.User_Profile} component={User_Profile} />
                <Stack.Screen name={UserRoutes.Edit_Profile} component={Edit_Profile} />
            </Stack.Navigator>
        </>
    );
};

export default User_Profile_Navigation;