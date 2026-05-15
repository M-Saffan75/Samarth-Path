import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../../assets/themecontext/ThemeContext';

const FloatingActionButton = ({ image, onModalOpen, onModalClose }) => {

    const { theme: COLOURS } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
        onModalOpen?.();
    };

    const closeModal = () => {
        setModalVisible(false);
        onModalClose?.();
    };

    return (
        <>
            {/* Floating Circle Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: COLOURS.primary }]}
                onPress={openModal}
                activeOpacity={0.85}
            >
                <Image
                    source={image}
                    style={styles.fab_image}
                    tintColor={COLOURS.white}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
                statusBarTranslucent
            >
                {/* Backdrop — press to close */}
                <Pressable style={styles.backdrop} onPress={closeModal}>
                    {/* Modal Card — press through nahi hoga */}
                    <Pressable
                        style={[styles.modal_card, { backgroundColor: COLOURS.white }]}
                        onPress={() => { }}
                    >
                        {/* Close button */}
                        <TouchableOpacity style={styles.close_btn} onPress={closeModal} hitSlop={10}>
                            <Text style={[styles.close_text, { color: COLOURS.grey }]}>✕</Text>
                        </TouchableOpacity>

                        {/* --- Apna modal content yahan dalo --- */}
                        <Text style={[styles.modal_title, { color: COLOURS.black }]}>
                            Title Here
                        </Text>
                        <Text style={[styles.modal_desc, { color: COLOURS.grey }]}>
                            Yahan apna content aayega...
                        </Text>

                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: responsiveWidth(30),
        right: responsiveWidth(5),
        width: responsiveWidth(13),
        height: responsiveWidth(13),
        borderRadius: responsiveWidth(13),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 99,
    },
    fab_image: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(6),
    },
    modal_card: {
        width: '100%',
        borderRadius: responsiveWidth(5),
        padding: responsiveWidth(6),
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    close_btn: {
        alignSelf: 'flex-end',
        marginBottom: responsiveWidth(2),
    },
    close_text: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Poppins-Medium',
    },
    modal_title: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(2.2),
        marginBottom: responsiveWidth(2),
    },
    modal_desc: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.8),
        lineHeight: responsiveWidth(6),
    },
});