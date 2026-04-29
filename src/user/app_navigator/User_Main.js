import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import User_Navigator from '../app_navigator/User_Navigator';
import NetInfo from '@react-native-community/netinfo';
import Network from '../../internet/Network';

const User_Main = () => {

    const [isConnected, setIsConnected] = useState(true)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? true)
        })
        return () => unsubscribe()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <User_Navigator />
            {!isConnected && (
                <View style={StyleSheet.absoluteFill}>
                    <Network />
                </View>
            )}
        </View>
    )
}

export default User_Main

const styles = StyleSheet.create({})