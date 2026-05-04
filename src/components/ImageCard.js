import React, { useEffect, useState } from 'react';
import Reaction from '../components/Reaction';
import { Fonts } from '../assets/fonts/Fonts';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { globalImages } from '../assets/images/images_file/All_Images'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { FadeDown } from './FadeDown';
import CommentSheet from './CommentSheet';

const ImageCard = ({ item, onPress, onUnbookmark }) => {

    const { theme: COLOURS, isDark } = useTheme();

    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(item?.commentsCount);
    useEffect(() => {
        setCommentsCount(item?.commentsCount);
    }, [item?.commentsCount]);

    return (
        <FadeDown>
            {
                item?.image ? (
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

                            <Image source={{ uri: item?.image }} style={{
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
                                <Reaction
                                    isHeart
                                    contentId={item.id}
                                    isLiked={item.isLiked}
                                    count={item.likesCount}
                                />
                                <Reaction source={globalImages.comment} count={commentsCount} onPress={() => setShowComments(true)} />

                                <Reaction
                                    isBookmark
                                    contentId={item.id}
                                    initialBookmarked={item.isArchived}
                                    onUnbookmark={() => onUnbookmark?.(item.id)}
                                />
                            </View>

                        </View>

                    </TouchableOpacity>

                ) : (
                    <View style={[styles.fallback, { backgroundColor: COLOURS.light_primary, }]}>
                        <Text style={[styles.fallback_text, { color: COLOURS.grey, }]}>🖼️ Image Post Coming Soon...</Text>
                    </View>
                )
            }
            <CommentSheet
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                postId={item?.id}
                onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                onCommentDeleted={() => setCommentsCount(prev => prev - 1)}
            />
        </FadeDown >
    )
}

export default ImageCard


const styles = StyleSheet.create({
    fallback: {
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
    },
});
