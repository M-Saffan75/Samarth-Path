import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const Wait_Modal = ({ visible, message, onClose }) => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (!visible) return; // ✅ visible nahi to kuch mat karo

        setSeconds(60);
        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        const timeout = setTimeout(() => {
            onClose(); // ✅ interval se bahar karo
        }, 60000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [visible]); // ✅ onClose dependency mat dena

    
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Please Wait</Text>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.timer}>Closing in {seconds}s</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Wait_Modal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    message: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    timer: {
        fontSize: 13,
        color: '#999',
    },
})