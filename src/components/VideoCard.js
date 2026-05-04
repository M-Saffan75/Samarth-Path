import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Reaction from './Reaction';
import { FadeUp } from './FadeUp';
import { Fonts } from '../assets/fonts/Fonts';
import CommentSheet from '../components/CommentSheet';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { globalImages } from '../assets/images/images_file/All_Images'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';



const VideoCard = ({ item, activeVideoId, setActiveVideoId, onPress, onUnbookmark }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(item?.commentsCount);

    useEffect(() => {
        setCommentsCount(item?.commentsCount);
    }, [item?.commentsCount]); // ← item change hone pe update

    if (!item?.video) {
        return (
            <View style={[styles.fallback, { backgroundColor: COLOURS.light_primary, }]}>
                <Text style={[styles.fallback_text, { color: COLOURS.grey, }]}>🎬 Video Coming Soon...</Text>
            </View>
        );
    }


    return (
        <FadeUp>
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
                        }}>{item.schedule}</Text>
                    </View>

                    <View>
                        <Text style={{
                            paddingLeft: responsiveWidth(1),
                            textTransform: 'uppercase', fontFamily: 'Poppins-Medium',
                            top: responsiveWidth(.5), color: COLOURS.grey
                        }}>{item.type}</Text>
                    </View>

                </View>

                <View>

                    {/* ---- Image ya Video ---- */}
                    <VideoPlayer
                        uri={item.video}
                        videoId={item.id}
                        activeVideoId={activeVideoId}
                        setActiveVideoId={setActiveVideoId}
                        style={{
                            width: responsiveWidth(83),
                            height: responsiveWidth(50),
                            borderRadius: responsiveWidth(4),
                            marginTop: responsiveWidth(5),
                            alignSelf: 'center',
                            overflow: 'hidden',
                        }}
                    />


                    < Text numberOfLines={1} ellipsizeMode='tail' style={{
                        paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(3),
                        textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                        top: responsiveWidth(.5), color: COLOURS.black, fontSize: responsiveFontSize(2)
                    }}>{item.title}</Text>

                    <Text numberOfLines={5} ellipsizeMode='tail' style={{
                        paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(2),
                        textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                        top: responsiveWidth(.5), color: COLOURS.grey, fontSize: responsiveFontSize(1.7)
                    }}>
                        {item.description}
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
                            isLiked={item.isLiked}  // ← yeh sahi hai?
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

                {/* Comment Sheet */}
                <CommentSheet
                    isOpen={showComments}
                    onClose={() => setShowComments(false)}
                    postId={item?.id}
                    onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                    onCommentDeleted={() => setCommentsCount(prev => prev - 1)}
                />

            </TouchableOpacity>
        </FadeUp>
    )
}

export default VideoCard

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
