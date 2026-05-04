import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal } from 'react-native'; // ← sirf react-native ka
// react-native-modal wala hatao
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { Fonts } from '../assets/fonts/Fonts';

const options = [
    { label: 'Light', icon: '☀️', value: 'light', desc: 'Classic bright interface' },
    { label: 'Dark', icon: '🌙', value: 'dark', desc: 'Easy on the eyes' },
    { label: 'System', icon: '🛠️', value: 'system', desc: 'Follows your device' },
];

const ThemeModal = ({ visible, onClose }) => {

    const { theme: COLOURS, themeMode, changeTheme } = useTheme();

    const handleSelect = (value) => {
        changeTheme(value);
        onClose();
    };
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    bounciness: 4,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Content */}
                <Animated.View
                    style={{
                        opacity,
                        transform: [{ scale }],
                        backgroundColor: COLOURS.white,
                        borderRadius: responsiveWidth(5),
                        paddingHorizontal: responsiveWidth(5),
                        paddingVertical: responsiveWidth(5),
                        width: '88%',
                    }}
                >
                    {/* Title */}
                    <Text style={{
                        fontFamily: Fonts.Medium,
                        fontSize: responsiveFontSize(2.2),
                        color: COLOURS.black,
                        marginBottom: responsiveWidth(1),
                    }}>
                        Appearance
                    </Text>
                    <Text style={{
                        fontFamily: Fonts.Regular,
                        fontSize: responsiveFontSize(1.6),
                        color: COLOURS.grey,
                        marginBottom: responsiveWidth(5),
                    }}>
                        Choose how Samarth Path looks to you
                    </Text>

                    {/* Options */}
                    {options.map((option) => {
                        const isSelected = themeMode === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => handleSelect(option.value)}
                                activeOpacity={0.8}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: isSelected ? COLOURS.light_primary : COLOURS.light_grey,
                                    borderRadius: responsiveWidth(3),
                                    padding: responsiveWidth(4),
                                    marginBottom: responsiveWidth(3),
                                    borderWidth: isSelected ? 1.5 : 0,
                                    borderColor: isSelected ? COLOURS.primary : 'transparent',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        width: responsiveWidth(11),
                                        height: responsiveWidth(11),
                                        borderRadius: responsiveWidth(3),
                                        backgroundColor: isSelected ? COLOURS.primary : COLOURS.white,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: responsiveWidth(3),
                                    }}>
                                        <Text style={{ fontSize: responsiveFontSize(2.5) }}>{option.icon}</Text>
                                    </View>
                                    <View>
                                        <Text style={{
                                            fontFamily: Fonts.Medium,
                                            fontSize: responsiveFontSize(1.8),
                                            color: isSelected ? COLOURS.primary : COLOURS.black,
                                        }}>
                                            {option.label}
                                        </Text>
                                        <Text style={{
                                            fontFamily: Fonts.Regular,
                                            fontSize: responsiveFontSize(1.5),
                                            color: COLOURS.grey,
                                            marginTop: responsiveWidth(0.5),
                                        }}>
                                            {option.desc}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{
                                    width: responsiveWidth(5),
                                    height: responsiveWidth(5),
                                    borderRadius: responsiveWidth(10),
                                    borderWidth: 2,
                                    borderColor: isSelected ? COLOURS.primary : COLOURS.grey,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {isSelected && (
                                        <View style={{
                                            width: responsiveWidth(2.5),
                                            height: responsiveWidth(2.5),
                                            borderRadius: responsiveWidth(10),
                                            backgroundColor: COLOURS.primary,
                                        }} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            </TouchableOpacity>
        </Modal>

    );
};

export default ThemeModal;