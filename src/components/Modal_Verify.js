import React from 'react'
import { COLOURS } from '../assets/theme/Theme'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Modal_Verify = ({
    modalVisible,
    setModalVisible,
    modalEmail,
    setModalEmail,
    handleModalSubmit,
    loading
}) => {
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>

                    <Text style={styles.modalTitle}>Already Registered</Text>
                    <Text style={styles.modalSubtitle}>
                        Your account is registered but not verified yet. Enter your email to get OTP.
                    </Text>

                    <TextInput
                        style={styles.modalInput}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        value={modalEmail}
                        onChangeText={setModalEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[styles.modalBtn, loading && { opacity: 0.7 }]}
                        onPress={handleModalSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.modalBtnText}>
                            {loading ? 'Please wait...' : 'confirm'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalCancel}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

export default Modal_Verify

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#333',
        marginBottom: 16,
    },
    modalBtn: {
        width: '100%',
        backgroundColor:COLOURS.primary,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    modalCancel: {
        color: '#999',
        fontSize: 13,
        marginTop: 4,
    },
})