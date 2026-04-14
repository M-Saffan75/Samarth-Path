import React, { useState } from 'react';
import { useLoader } from './LoaderContext'; //loader here
import { Fonts } from '../assets/fonts/Fonts';
import { COLOURS } from '../assets/theme/Theme';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Plane, Chase, Bounce, Wave, Pulse, Flow, Swing, Circle, Grid, Fold, Wander } from 'react-native-animated-spinkit';



const Loader = ({ backgroundColor }) => {

    const { loading } = useLoader(); // context 

    return (
        <>
            <View style={styles.container}>

                <Modal visible={loading} animationType="fade" transparent={true}>
                    <View style={[styles.modalContainer, { backgroundColor: backgroundColor ?? 'rgba(0, 0, 0, 0.4)' }]}>
                        <View style={[styles.modal, { backgroundColor: COLOURS.primary }]}>
                            <View style={styles.modal_spin_inside}>
                                <Bounce size={38} color={COLOURS.white} />
                                <Text style={[styles.loding_text, { color: COLOURS.white }]}>Loading, </Text>
                                <Text style={[styles.loding_text, { color: COLOURS.white }]}>please wait.</Text>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </>
    )
}

export default Loader

const styles = StyleSheet.create({

    loding_text: {
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.7),
        left: responsiveWidth(6),
        textTransform: 'capitalize',
    },

    modal_spin_inside: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    // 

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },

    modal: {
        width: '80%',
        backgroundColor: '#fff',
        padding: responsiveWidth(8),
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(4),
    },

})