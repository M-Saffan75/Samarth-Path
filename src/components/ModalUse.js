import React from 'react'
import Button from './Button'

import { useTheme } from '../assets/themecontext/ThemeContext'
import { globalImages } from '../assets/images/images_file/All_Images'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { Bounce } from './Bounce'
import { FadeUp } from './FadeUp'
import { FadeIn } from './FadeIn'
import { FadeDown } from './FadeDown'

const Modal_Here = ({ modalVisible, setModalVisible, onPress, modal_text_one, disabled,
    modal_text_two, label_1, label_2, source, height, width, label_2_color, marginTop,
    backgroundColor, one_backgroundColor, tintColor, borderColor, label_2_onPress, show }) => {

    const { theme: COLOURS, isDark } = useTheme();

    return (
        <>
            <View style={[styles.container, { backgroundColor: COLOURS.light_primary, }]}>
                <Modal visible={modalVisible} animationType="fade" transparent={true}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modal, { backgroundColor: backgroundColor || COLOURS.white }]}>

                                <View style={{ alignItems: 'center' }}>
                                    <Bounce delay={300}>
                                        <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(false)}>
                                            <Image source={source ?? globalImages.red_cross}
                                                style={{ height: height ?? responsiveWidth(15), width: width ?? responsiveWidth(15), marginBottom: responsiveWidth(2) }} tintColor={tintColor} />
                                        </TouchableOpacity>
                                    </Bounce>

                                    <FadeDown delay={100}>
                                        <Text style={[styles.head_name, {
                                            color: COLOURS.black, fontFamily: 'Poppins-Bold',
                                            fontSize: responsiveFontSize(2)
                                        }]}>
                                            {modal_text_one}

                                        </Text>
                                    </FadeDown>
                                    <FadeUp delay={100}>
                                        <Text style={[styles.text_name, {
                                            color: COLOURS.black, fontFamily: 'Poppins-Medium',
                                            fontSize: responsiveFontSize(1.45),
                                            marginTop: marginTop,
                                            textAlign: 'center'
                                        }]}>

                                            {modal_text_two}
                                        </Text>
                                    </FadeUp>
                                </View>

                                <FadeIn delay={500}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Button label={label_1} backgroundColor={one_backgroundColor} width={responsiveWidth(65)} paddingVertical={responsiveWidth(2.8)} marginTop={responsiveWidth(4)}
                                            onPress={onPress} fontSize={responsiveFontSize(1.7)}
                                            disabled={disabled}
                                        />

                                        {show !== false ? <Button label={label_2} width={responsiveWidth(65)} paddingVertical={responsiveWidth(2.8)}
                                            fontSize={responsiveFontSize(1.6)}
                                            marginTop={responsiveWidth(3)} marginBottom={responsiveWidth(2)} borderColor={borderColor ?? COLOURS.primary}
                                            backgroundColor={COLOURS.transparent} color={label_2_color ?? COLOURS.primary} borderWidth={responsiveWidth(.4)}
                                            disabled={disabled}
                                            onPress={() => label_2_onPress ? label_2_onPress() : setModalVisible(false)}
                                        /> : ''}
                                    </View>
                                </FadeIn>

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </>
    )
}

export default Modal_Here

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    modal: {
        width: '78%',
        padding: responsiveWidth(5),
        borderRadius:responsiveWidth(4),
        paddingVertical: responsiveWidth(5),
    },

    // Modal Here End 
})