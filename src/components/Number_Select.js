import React, { useState } from 'react';
import { COLOURS } from '../assets/theme/Theme';
import countries from '../components/Country_Here';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const getFlag = (code) => {
    if (!code) return '🏳️';
    return code
        .toUpperCase()
        .split('')
        .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
        .join('');
};

const Number_Select = ({ value, onChangeText, onChangeFormatted }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const [selected, setSelected] = useState(
        countries.find(c => c.code === 'IN') || countries[0]  // India default
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (country) => {
        setSelected(country);
        setModalVisible(false);
        setSearch('');
        if (onChangeFormatted) onChangeFormatted(country.dial + value);
    };

    const handleNumberChange = (text) => {
        if (onChangeText) onChangeText(text);
        if (onChangeFormatted) onChangeFormatted(selected.dial + text);
    };

    return (
        <View style={styles.wrapper}>

            {/* Input Row */}
            <View style={[styles.container, {
                borderColor: COLOURS.light_black,
                backgroundColor: COLOURS.transparent,
            }]}>

                {/* Flag + Code Button */}
                <TouchableOpacity
                    style={styles.flagBtn}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.flagText}>{getFlag(selected.code)}</Text>
                    <Text style={[styles.dialText, { color: COLOURS.black, }]}>{selected.dial}</Text>
                    <Text style={[styles.arrow, { color: COLOURS.black, }]}>▾</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: COLOURS.light_black, }]} />

                {/* Number Input */}
                <TextInput
                    style={[styles.input, { color: COLOURS.black, }]}
                    placeholder='Mobile Number'
                    placeholderTextColor={COLOURS.grey}
                    keyboardType='phone-pad'
                    value={value}
                    onChangeText={handleNumberChange}
                />
            </View>

            {/* Country Picker Modal */}
            <Modal visible={modalVisible} animationType='fade' transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: COLOURS.white, }]}>

                        <Text style={[styles.modalTitle, { color: COLOURS.black, }]}>Select Country</Text>

                        <TextInput
                            style={[styles.searchInput, { color: COLOURS.black, }]}
                            placeholder='Search country...'
                            placeholderTextColor={COLOURS.grey}
                            value={search}
                            onChangeText={setSearch}
                        />

                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.countryRow, { borderBottomColor: COLOURS.light_black, }]}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.flagText}>{getFlag(item.code)}</Text>
                                    <Text style={[styles.countryName, { color: COLOURS.black, }]}>{item.name}</Text>
                                    <Text style={[styles.countryDial, { color: COLOURS.grey, }]}>{item.dial}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={[styles.closeBtn, { backgroundColor: COLOURS.primary, }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={[styles.closeBtnText, { color: COLOURS.white, }]}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default Number_Select;

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: responsiveWidth(5),
    },
    container: {
        borderWidth: responsiveWidth(.2),
        alignItems: 'center',
        flexDirection: 'row',
        height: responsiveWidth(13),
        borderRadius: responsiveWidth(2),

    },
    flagBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(1),
        top: responsiveWidth(.4),
        paddingHorizontal: responsiveWidth(3),
    },
    flagText: {
        top: responsiveWidth(-.4),
        fontSize: responsiveFontSize(2.5),
    },
    dialText: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Poppins-Medium',
    },
    arrow: {
        top: responsiveWidth(-.5),
        fontSize: responsiveFontSize(1.5),
    },
    divider: {
        width: 1,
        height: '60%',
    },
    input: {
        flex: 1,
        top: responsiveWidth(.5),
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),
        paddingHorizontal: responsiveWidth(3),
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        maxHeight: '80%',
        padding: responsiveWidth(5),

        borderTopLeftRadius: responsiveWidth(5),
        borderTopRightRadius: responsiveWidth(5),
    },
    modalTitle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveWidth(3),
    },
    searchInput: {
        borderWidth: 1,
        fontFamily: 'Poppins-Medium',
        marginBottom: responsiveWidth(3),
        borderColor: COLOURS.light_black,
        borderRadius: responsiveWidth(2),
        fontSize: responsiveFontSize(1.8),
        paddingVertical: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(3),
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        gap: responsiveWidth(3),
        paddingVertical: responsiveWidth(3),
    },
    countryName: {
        flex: 1,

        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),
    },
    countryDial: {

        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),
    },
    closeBtn: {
        alignItems: 'center',
        marginTop: responsiveWidth(3),

        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveWidth(3),
    },
    closeBtnText: {

        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),
    },
});