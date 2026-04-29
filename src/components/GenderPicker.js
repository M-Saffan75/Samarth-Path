import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { COLOURS } from '../assets/theme/Theme';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const OPTIONS = ['Male', 'Female', 'Others'];

const ICONS = {
    Male: '♂',
    Female: '♀',
    Others: '⚧',
};

export const GenderPicker = ({ value, onChange }) => {
    const [show, setShow] = useState(false);

    return (
        <View>
            <TouchableOpacity
                style={[styles.input, value && styles.inputFilled]}
                onPress={() => setShow(true)}
                activeOpacity={0.8}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(2) }}>
                    {value && (
                        <Text style={styles.selectedIcon}>{ICONS[value]}</Text>
                    )}
                    <Text style={value ? styles.valueText : styles.placeholder}>
                        {value || 'Gender'}
                    </Text>
                </View>
                <Text style={[styles.arrow, show && { transform: [{ rotate: '180deg' }] }]}>▾</Text>
            </TouchableOpacity>

            <Modal visible={show} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setShow(false)}
                >
                    <View style={styles.modal}>

                        {/* Handle bar */}
                        <View style={styles.handle} />

                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Gender</Text>
                            <TouchableOpacity onPress={() => setShow(false)} style={styles.closeWrapper}>
                                <Text style={styles.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Options */}
                        <View style={styles.optionsContainer}>
                            {OPTIONS.map((option, index) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.option,
                                        value === option && styles.optionSelected,
                                        index !== OPTIONS.length - 1 && styles.optionBorder,
                                    ]}
                                    onPress={() => {
                                        onChange(option);
                                        setShow(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(3) }}>
                                        <View style={[styles.iconCircle, value === option && styles.iconCircleSelected]}>
                                            <Text style={[styles.optionIcon, value === option && styles.optionIconSelected]}>
                                                {ICONS[option]}
                                            </Text>
                                        </View>
                                        <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>
                                            {option}
                                        </Text>
                                    </View>

                                    {/* Checkmark */}
                                    {value === option && (
                                        <View style={styles.checkCircle}>
                                            <Text style={styles.checkmark}>✓</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({

    input: {
        width: responsiveWidth(42),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(2.5),
        backgroundColor: COLOURS.light_primary,
        paddingHorizontal: responsiveWidth(4),
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    inputFilled: {
        // borderColor: COLOURS.primary,
        // backgroundColor: '#FFF5EE',
    },
    placeholder: {
        color: '#AAAAAA',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Poppins-Regular',
    },
    valueText: {
        color: COLOURS.black,
        top:responsiveWidth(.5),
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Poppins-Medium',
    },
    selectedIcon: {
        fontSize: responsiveFontSize(2),
        color: COLOURS.grey,
    },
    arrow: {
        color: '#AAAAAA',
        fontSize: responsiveFontSize(2),
    },

    // Modal
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: responsiveWidth(6),
        borderTopRightRadius: responsiveWidth(6),
        paddingBottom: responsiveWidth(8),
        paddingHorizontal: responsiveWidth(5),
    },
    handle: {
        width: responsiveWidth(10),
        height: responsiveWidth(1),
        backgroundColor: COLOURS.light_grey,
        borderRadius: responsiveWidth(2),
        alignSelf: 'center',
        marginTop: responsiveWidth(3),
        marginBottom: responsiveWidth(2),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 1,
        borderBottomColor: COLOURS.light_grey,
        marginBottom: responsiveWidth(2),
    },
    modalTitle: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Poppins-SemiBold',
        color: COLOURS.black,
    },
    closeWrapper: {
        backgroundColor: COLOURS.light_grey,
        borderRadius: responsiveWidth(5),
        height: responsiveWidth(7),
        width: responsiveWidth(7),
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtn: {
        fontSize: responsiveFontSize(1.6),
        color: COLOURS.grey,
        fontFamily: 'Poppins-Medium',
    },

    // Options
    optionsContainer: {
        marginTop: responsiveWidth(2),
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: responsiveWidth(3.5),
        paddingHorizontal: responsiveWidth(2),
        borderRadius: responsiveWidth(3),
    },
    optionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLOURS.light_grey,
    },
    optionSelected: {
        backgroundColor: '#FFF5EE',
    },
    iconCircle: {
        height: responsiveWidth(9),
        width: responsiveWidth(9),
        borderRadius: responsiveWidth(5),
        backgroundColor: COLOURS.light_grey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleSelected: {
        backgroundColor: '#FFE5D0',
    },
    optionIcon: {
        fontSize: responsiveFontSize(2.2),
        color: COLOURS.grey,
    },
    optionIconSelected: {
        color: COLOURS.primary,
    },
    optionText: {
        fontSize: responsiveFontSize(1.9),
        fontFamily: 'Poppins-Regular',
        color: COLOURS.black,
    },
    optionTextSelected: {
        color: COLOURS.primary,
        fontFamily: 'Poppins-Bold',
    },
    checkCircle: {
        height: responsiveWidth(6),
        width: responsiveWidth(6),
        borderRadius: responsiveWidth(3),
        backgroundColor: COLOURS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        color: COLOURS.white,
        fontSize: responsiveFontSize(1.4),
        fontFamily: 'Poppins-Bold',
    },
});