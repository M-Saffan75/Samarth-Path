import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import User_Navigator from '../app_navigator/User_Navigator';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'This method is deprecated',
]);


const User_Main = () => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? true);
        });
        return () => unsubscribe();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <User_Navigator isConnected={isConnected} />
        </View>
    );
};

export default User_Main

const styles = StyleSheet.create({})