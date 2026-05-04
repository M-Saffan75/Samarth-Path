// components/ExplanationModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { COLOURS } from '../assets/theme/Theme';
import { Fonts } from '../assets/fonts/Fonts';

const ExplanationModal = ({ visible, explanation, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center', alignItems: 'center',
                paddingHorizontal: responsiveWidth(6)
            }}>
                <View style={{
                    backgroundColor: COLOURS.white, borderRadius: responsiveWidth(4),
                    padding: responsiveWidth(5), width: '100%'
                }}>
                    <Text style={{
                        fontFamily: Fonts.Medium, fontSize: responsiveFontSize(2),
                        color: COLOURS.black, marginBottom: responsiveWidth(3)
                    }}>
                        💡 Explanation
                    </Text>
                    <Text style={{
                        fontFamily: Fonts.Regular, fontSize: responsiveFontSize(1.7),
                        color: COLOURS.grey, lineHeight: responsiveWidth(5.5)
                    }}>
                        {explanation}
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            marginTop: responsiveWidth(4), backgroundColor: COLOURS.primary,
                            borderRadius: responsiveWidth(20), padding: responsiveWidth(2.5),
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{
                            color: COLOURS.white, fontFamily: Fonts.Medium,
                            fontSize: responsiveFontSize(1.8)
                        }}>
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ExplanationModal;