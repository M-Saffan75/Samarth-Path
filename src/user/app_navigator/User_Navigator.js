import React from 'react';
import Toast from 'react-native-toast-message';
import UserRoutes from '../user_routes/UserRoutes';
import { ToastConfig } from '../../helper/ToastConfig';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../splash/Splash';
import Home from '../screens/home/Home';
import Loader from '../../loading/Loader';
import Network from '../../internet/Network';
import My_Path from '../screens/mypath/My_Path';
import PayWall from '../screens/paywall/PayWall';
import Archives from '../screens/archives/Archives';
import { LoaderProvider } from '../../loading/LoaderContext';
import Bottom_Navigation from '../bottom_tabs/Bottom_Navigation';
import User_Notification from '../notification/User_Notification';

import Suspended from '../screens/suspended/Suspended';
import User_Profile from '../screens/profile/User_Profile';
import Edit_Profile from '../screens/profile/Edit_Profile';
import { UserProvider } from '../screens/auth/user_context/UserContext';


import OnBoard from '../onboard/OnBoard';
import Login from '../screens/auth/Login';
import Otp_Here from '../screens/auth/Otp_Here';
import Register from '../screens/auth/Register';
import Verify_Email from '../screens/auth/Verify_Email';
import Reset_Password from '../screens/auth/Reset_Password';
import Forgot_Password from '../screens/auth/Forgot_Password';
import Change_Password from '../screens/auth/Change_Password';
import AboutSamarthPath from '../screens/about_app/AboutSamarthPath';
import Weekly_Winners from '../screens/weekly_winners/Weekly_Winners';

import { ThemeProvider } from '../../assets/themecontext/ThemeContext';
import { StyleSheet, View } from 'react-native';

const User_Navigator = ({ isConnected }) => {

    const Stack = createNativeStackNavigator();

    return (
        <>
            <ThemeProvider>
                <UserProvider>
                    <LoaderProvider>
                        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={UserRoutes.Splash_Here}>

                            <Stack.Screen name={UserRoutes.Home} component={Home} />
                            <Stack.Screen name={UserRoutes.Archives} component={Archives} />
                            <Stack.Screen name={UserRoutes.PayWall} component={PayWall} />
                            <Stack.Screen name={UserRoutes.My_Path} component={My_Path} />
                            <Stack.Screen name={UserRoutes.Splash_Here} component={Splash} />

                            {/* user profile */}
                            <Stack.Screen name={UserRoutes.User_Profile} component={User_Profile} />
                            <Stack.Screen name={UserRoutes.Edit_Profile} component={Edit_Profile} />
                            {/* user profile */}

                            {/* Network */}
                            <Stack.Screen name={UserRoutes.Network} component={Network} />
                            <Stack.Screen name={UserRoutes.Suspended} component={Suspended} />
                            {/* Network */}

                            {/* Notification */}
                            <Stack.Screen name={UserRoutes.User_Notification} component={User_Notification} />
                            {/* Notification */}

                            {/* weekly Winners */}
                            <Stack.Screen name={UserRoutes.Weekly_Winners} component={Weekly_Winners} />
                            {/* weekly Winners */}

                            {/* user auth */}

                            <Stack.Screen name={UserRoutes.Login} component={Login} />
                            <Stack.Screen name={UserRoutes.OnBoard} component={OnBoard} />
                            <Stack.Screen name={UserRoutes.Register} component={Register} />
                            <Stack.Screen name={UserRoutes.Otp_Here} component={Otp_Here} />

                            <Stack.Screen name={UserRoutes.Verify_Email} component={Verify_Email} />
                            <Stack.Screen name={UserRoutes.Reset_Password} component={Reset_Password} />
                            <Stack.Screen name={UserRoutes.Forgot_Password} component={Forgot_Password} />
                            <Stack.Screen name={UserRoutes.Change_Password} component={Change_Password} />
                            <Stack.Screen name={UserRoutes.AboutSamarthPath} component={AboutSamarthPath} />

                            {/* user auth */}

                            {/* bottom navigation */}
                            <Stack.Screen name={UserRoutes.Bottom_Navigation} component={Bottom_Navigation} />
                            {/* bottom navigation */}

                        </Stack.Navigator>
                        <Loader />
                        {!isConnected && (
                            <View style={StyleSheet.absoluteFill}>
                                <Network />
                            </View>
                        )}
                    </LoaderProvider>
                </UserProvider>
            </ThemeProvider>
            <Toast config={ToastConfig} />
        </>
    );
};

export default User_Navigator;