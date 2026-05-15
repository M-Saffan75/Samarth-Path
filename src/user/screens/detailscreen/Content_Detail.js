import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { ZoomIn } from '../../../components/ZoomIn';
import Reaction from '../../../components/Reaction';
import { Fonts } from '../../../assets/fonts/Fonts';
import Title_Here from '../../../components/Title_Here';
import { FadeLeft } from '../../../components/FadeLeft';
import VideoPlayer from '../../../components/VideoPlayer';
import { FadeRight } from '../../../components/FadeRight';
import { useUser } from '../auth/user_context/UserContext';
import CommentSheet from '../../../components/CommentSheet'
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchComments } from '../home/homebackend/HomeBackend';
import CommentSheetNew from '../../../components/CommentSheetNew';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { avatarColors, getInitials, timeAgo } from '../../../components/TimeAgo';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView, StatusBar, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';


const Content_Detail = ({ route, }) => {

    const { item } = route?.params;
    console.log('item?.commentsCount ><><><><,',item?.commentsCount )
    const [activeVideoId, setActiveVideoId] = useState(null);
    const { theme: COLOURS, isDark } = useTheme();
    const { userData } = useUser();
    const [commentsCount, setCommentsCount] = useState(item?.commentsCount || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);

    // ── Fetch comments for inline preview ──────────────────
    const loadInlineComments = async () => {
        try {
            const res = await fetchComments(item?.id);
            if (res?.success) {
                setComments(res?.data || []);
                setCommentsLoaded(true);
            }
        } catch (e) {
            console.log('inline comments error:', e);
        }
    };

    // Sheet close hone pe inline refresh karo
   

    useEffect(() => {
        loadInlineComments();
    });

    useEffect(() => {
        setCommentsCount(item?.commentsCount);
    }, [item?.commentsCount]); 


    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                    <ScrollView>
                        <Header title={item?.title} />
                        <ZoomIn delay={600}>
                            {item?.video ? <VideoPlayer
                                fullscreen={true}
                                uri={item.video}
                                videoId={item.id}
                                activeVideoId={activeVideoId}
                                setActiveVideoId={setActiveVideoId}
                                style={{
                                    width: responsiveWidth(82),
                                    height: responsiveWidth(52),
                                    borderRadius: responsiveWidth(4),
                                    marginTop: responsiveWidth(5),
                                    alignSelf: 'center',
                                    overflow: 'hidden',
                                }}
                            /> :
                                <Image source={{ uri: item?.image }} style={{
                                    height: responsiveWidth(60), width: responsiveWidth(90),
                                    borderRadius: responsiveWidth(4), marginTop: responsiveWidth(5), alignSelf: 'center'
                                }} />
                            }
                        </ZoomIn>
                        <FadeLeft>

                            <Text numberOfLines={2} ellipsizeMode='tail' style={{
                                paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(3),
                                textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                                top: responsiveWidth(.5), color: COLOURS.black, fontSize: responsiveFontSize(2.2)
                            }}>{item?.title}</Text>
                        </FadeLeft>
                        <FadeRight>
                            <Text numberOfLines={10} ellipsizeMode='tail' style={{
                                paddingLeft: responsiveWidth(4), marginTop: responsiveWidth(2),
                                textTransform: 'capitalize', fontFamily: 'Poppins-Medium',
                                top: responsiveWidth(.5), color: COLOURS.grey, fontSize: responsiveFontSize(1.8),
                                lineHeight: responsiveWidth(6)
                            }}>
                                {item?.description}
                            </Text>
                        </FadeRight>

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
                                contentId={item?.id}
                                isLiked={item?.isLiked}
                                count={item?.likesCount}
                            />
                            <Reaction
                                source={globalImages.comment}
                                count={commentsCount}                          // ✅ state se
                                onPress={() => setShowComments(true)}
                            />
                            <Reaction
                                isBookmark
                                contentId={item?.id}
                                initialBookmarked={item?.isBookmarked}
                                onUnbookmark={() => onUnbookmark?.(item.id)}
                            />
                        </View>

                        <Title_Here title={'comments'} />
                        {/* ── Fake input — tap pe sheet open ── */}
                        <TouchableOpacity
                            onPress={() => setShowComments(true)}
                            activeOpacity={0.8}
                            style={[styles.fake_input_row, { borderTopColor: COLOURS.light_grey }]}
                        >
                            {/* User avatar */}
                            {userData?.profilePicture ? (
                                <Image
                                    source={{ uri: userData?.profilePicture }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: '#FFF3EB' }]}>
                                    <Text style={[styles.avatar_text, { color: COLOURS.primary }]}>
                                        {getInitials(userData?.name || 'U')}
                                    </Text>
                                </View>
                            )}
                            <View style={[styles.fake_input, { backgroundColor: COLOURS.light_primary }]}>
                                <Text style={[styles.fake_placeholder, { color: COLOURS.grey }]}>
                                    Write a comment...
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* ── Inline comments list ── */}
                        {comments?.length > 0 && (
                            <View style={{ paddingHorizontal: responsiveWidth(4), marginTop: responsiveWidth(2) }}>
                                {comments?.map((comment, index) => {
                                    const color = avatarColors[index % avatarColors.length];
                                    const isOwner = comment?.userId?._id === userData?._id;
                                    return (
                                        <View key={comment?._id} style={styles.comment_row}>
                                            {/* Avatar */}
                                            {comment?.userId?.profilePicture ? (
                                                <Image
                                                    source={{ uri: comment?.userId?.profilePicture }}
                                                    style={styles.avatar}
                                                />
                                            ) : (
                                                <View style={[styles.avatar, { backgroundColor: color.bg }]}>
                                                    <Text style={[styles.avatar_text, { color: color.text }]}>
                                                        {getInitials(comment?.userId?.name || 'U')}
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Bubble */}
                                            <View style={styles.comment_content}>
                                                <View style={[styles.comment_bubble, { backgroundColor: COLOURS.light_primary }]}>
                                                    <Text style={[styles.comment_user, { color: COLOURS.black }]}>
                                                        {comment?.userId?.name || 'User'}
                                                        {isOwner && (
                                                            <Text style={{ color: COLOURS.primary, fontSize: responsiveFontSize(1.2) }}>
                                                                {' '}(You)
                                                            </Text>
                                                        )}
                                                    </Text>
                                                    <Text style={[styles.comment_text, { color: COLOURS.light_black }]}>
                                                        {comment?.text}
                                                    </Text>
                                                </View>
                                                <Text style={[styles.comment_time, { color: COLOURS.grey }]}>
                                                    {timeAgo(comment?.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}

                                {/* See all — agar zyada comments hain */}
                                {commentsCount > comments.length && (
                                    <TouchableOpacity
                                        onPress={() => setShowComments(true)}
                                        activeOpacity={0.7}
                                        style={{ alignItems: 'center', marginTop: responsiveWidth(2) }}
                                    >
                                        <Text style={{ color: COLOURS.primary, fontFamily: Fonts.Medium, fontSize: responsiveFontSize(1.5) }}>
                                            View all {commentsCount} comments
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <CommentSheet
                            isOpen={showComments}
                            onClose={() => setShowComments(false)}
                            postId={item?.id}
                            onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                            onCommentDeleted={() => setCommentsCount(prev => prev - 1)}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>

        </>
    )
}

export default Content_Detail

const styles = StyleSheet.create({

    fake_input_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2.5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderTopWidth: 0.5,
        marginTop: responsiveWidth(1),
    },
    fake_input: {
        flex: 1,
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
    },
    fake_placeholder: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.5),
    },
    avatar: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatar_text: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: 'Poppins-Medium',
        top: responsiveWidth(.4),
    },
    comment_row: {
        flexDirection: 'row',
        gap: responsiveWidth(3),
        marginBottom: responsiveWidth(3),
    },
    comment_content: {
        flex: 1,
    },
    comment_bubble: {
        borderRadius: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2),
    },
    comment_user: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: 'Poppins-SemiBold',
        marginBottom: responsiveWidth(0.5),
    },
    comment_text: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: 'Poppins-Regular',
        lineHeight: responsiveWidth(4.5),
    },
    comment_time: {
        fontSize: responsiveFontSize(1.2),
        fontFamily: 'Poppins-Regular',
        marginTop: responsiveWidth(1),
        marginLeft: responsiveWidth(2),
    },

    container: {
        height: '100%',
        width: '100%',
    },

})