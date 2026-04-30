import React from 'react';
import VideoPlayer from './VideoPlayer';
import Reaction from '../components/Reaction';
import { COLOURS } from '../assets/theme/Theme';
import { globalImages } from '../assets/images/images_file/All_Images'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../assets/fonts/Fonts';

const ImageCard = ({ item, onPress }) => {

    return (
        <>
            {item?.image ? (
                <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{
                    backgroundColor: COLOURS.light_primary, paddingHorizontal: responsiveWidth(2), paddingTop: responsiveWidth(4),
                    paddingVertical: responsiveWidth(1), borderRadius: responsiveWidth(4), marginHorizontal: responsiveWidth(4),
                    marginTop: responsiveWidth(3), paddingBottom: responsiveWidth(4),
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(2), }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={globalImages.app_logo}
                                style={{ height: responsiveWidth(6), width: responsiveWidth(6) }} tintColor={COLOURS.primary} />
                            <Text style={{
                                paddingLeft: responsiveWidth(1),
                                textTransform: 'uppercase', fontFamily: 'Poppins-Medium',
                                top: responsiveWidth(.5), color: COLOURS.primary
                            }}>{item?.schedule}</Text>
                        </View>

                        <View>
                            <Text style={{
                                paddingLeft: responsiveWidth(1),
                                textTransform: 'uppercase', fontFamily: 'Poppins-Medium',
                                top: responsiveWidth(.5), color: COLOURS.grey
                            }}>{item?.type}</Text>
                        </View>

                    </View>

                    <View>

                        <Image source={item?.image} style={{
                            height: responsiveWidth(50), width: responsiveWidth(83),
                            borderRadius: responsiveWidth(4), marginTop: responsiveWidth(5), alignSelf: 'center'
                        }} />

                        <Text numberOfLines={1} ellipsizeMode='tail' style={{
                            paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(3),
                            textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                            top: responsiveWidth(.5), color: COLOURS.black, fontSize: responsiveFontSize(2)
                        }}>{item?.title}</Text>

                        <Text numberOfLines={5} ellipsizeMode='tail' style={{
                            paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(2),
                            textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                            top: responsiveWidth(.5), color: COLOURS.grey, fontSize: responsiveFontSize(1.7)
                        }}>
                            {item?.description}
                        </Text>

                        <View style={{
                            width: '91%', height: responsiveWidth(.2), backgroundColor: COLOURS.grey,
                            marginTop: responsiveWidth(3), alignSelf: 'center'
                        }} />

                        <View style={{
                            marginHorizontal: responsiveWidth(4), marginTop: responsiveWidth(2.5),
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'
                        }}>
                            <Reaction source={globalImages.heart} count={22} />
                            <Reaction source={globalImages.comment} count={12} />
                            <Reaction source={globalImages.save_icon} count={2} />
                        </View>

                    </View>

                </TouchableOpacity>
            ) : (
                <View style={styles.fallback}>
                    <Text style={styles.fallback_text}>🖼️ Image Post Coming Soon...</Text>
                </View>
            )}
        </>
    )
}

export default ImageCard


const styles = StyleSheet.create({
    fallback: {
        backgroundColor: COLOURS.light_primary,
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(3),
        borderRadius: responsiveWidth(4),
        paddingVertical: responsiveWidth(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallback_text: {
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.8),
        color: COLOURS.grey,
    },
});
