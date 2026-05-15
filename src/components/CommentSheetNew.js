import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, Modal, Animated, Keyboard,
    Image,
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { fetchComments, postComment, deleteComment } from '../user/screens/home/homebackend/HomeBackend';

import { useUser } from '../user/screens/auth/user_context/UserContext';
import { globalImages } from '../assets/images/images_file/All_Images';


// ── Single Comment Card ────────────────────────────────────
const CommentItem = ({ item, currentUserId, onDelete, COLOURS }) => {

    const { userData } = useUser();
    const isOwn = item?.userId?._id === currentUserId || item?.userId === currentUserId;
    const name = item?.userId?.name || item?.userName || 'User';
    const firstLetter = name?.charAt(0)?.toUpperCase();
    const profilePic = item?.userId?.profilePicture || null;
    const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <View style={[styles.comment_card, { backgroundColor: COLOURS.light_primary }]}>
            {/* Avatar */}
        
            <View style={[styles.avatar, { backgroundColor: COLOURS.primary }]}>
                <Text style={[styles.avatar_letter, { color: COLOURS.white, top: responsiveWidth(.5) }]}>
                    {firstLetter}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.comment_body}>
                <View style={styles.comment_top}>
                    <Text style={[styles.comment_name, { color: COLOURS.black }]}>
                        {name} {isOwn && <Text style={{ color: COLOURS.primary, fontSize: responsiveFontSize(1.2) }}>(You)</Text>}
                    </Text>

                    {isOwn && (
                        <TouchableOpacity onPress={() => onDelete(item?._id)} activeOpacity={0.7} style={{backgroundColor:COLOURS.white,
                            height:responsiveWidth(8), width:responsiveWidth(8), borderRadius:responsiveWidth(100),
                            aliugnItems:'center', justifyContent:'center',
                        }}>
                            <Image
                                source={globalImages.trash}
                                style={{ width: responsiveWidth(4), height: responsiveWidth(4), alignSelf:'center'}}
                                tintColor={COLOURS.red}
                            />
                        </TouchableOpacity>
                    )}

                </View>
                <Text style={[styles.comment_text, { color: COLOURS.black }]}>
                    {item?.text}
                </Text>
                <Text style={[styles.comment_time, { color: COLOURS.grey }]}>
                    {timeAgo(item?.createdAt)}
                </Text>
                {/* Delete — sirf apna comment */}

            </View>
        </View>
    );
};

// ── Main Comment Sheet ─────────────────────────────────────// CommentSheet props mein add karo

const CommentSheetNew = ({ visible, onClose, contentId, initialCount, onCountChange }) => {
    const [commentsCount, setCommentsCount] = useState(initialCount || 0);

    useEffect(() => {
        onCountChange?.(commentsCount);
    }, [commentsCount]);

    const { theme: COLOURS } = useTheme();
    const { userData } = useUser(); // current user
    const currentUserId = userData?._id || userData?.id;

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [posting, setPosting] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef(null);

    // ── Animate in/out ─────────────────────────────────────
    useEffect(() => {
        if (visible) {
            loadComments();
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // ── Fetch comments ──────────────────────────────────────
    const loadComments = async () => {
        try {
            setLoading(true);
            const res = await fetchComments(contentId);
            if (res?.success) {
                setComments(res?.data?.comments || res?.data || []);
            }
        } catch (e) {
            console.log('Fetch comments error:', e);
        } finally {
            setLoading(false);
        }
    };

    // ── Post comment ────────────────────────────────────────
    const handlePost = async () => {
        if (!text.trim()) return;
        try {
            setPosting(true);
            Keyboard.dismiss();
            const res = await postComment(contentId, text.trim());
            if (res?.success) {
                setText('');
                setComments(prev => [res?.data, ...prev]); // ✅ list mein add
                setCommentsCount(prev => prev + 1);         // ✅ count +1
            } else {
                showToast('error', 'Error', res?.message || 'Comment post nahi hua');
            }
        } catch (e) {
            showToast('error', 'Error', 'Network error');
        } finally {
            setPosting(false);
        }
    };

    // ── Delete comment ──────────────────────────────────────
    const handleDelete = async (commentId) => {
        try {
            const res = await deleteComment(commentId);
            if (res?.success) {
                setComments(prev => prev.filter(c => c._id !== commentId)); // ✅ list se remove
                setCommentsCount(prev => Math.max(0, prev - 1));             // ✅ count -1
            } else {
                showToast('error', 'Error', 'Delete nahi hua');
            }
        } catch (e) {
            showToast('error', 'Error', 'Network error');
        }
    };

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>

            {/* Backdrop */}
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />

            <Animated.View style={[
                styles.sheet,
                { backgroundColor: COLOURS.white, transform: [{ translateY }] }
            ]}>
                {/* Handle */}
                <View style={[styles.handle, { backgroundColor: COLOURS.light_grey }]} />

                {/* Header */}
                <View style={styles.sheet_header}>
                    <Text style={[styles.sheet_title, { color: COLOURS.black }]}>
                        Comments  {comments.length > 0 && `${comments.length}`}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={[styles.close_btn, { color: COLOURS.grey }]}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Comments list */}
                {loading ? (
                    <View style={styles.loader}>
                        <ActivityIndicator size="small" color={COLOURS.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item?._id?.toString()}
                        renderItem={({ item }) => (
                            <CommentItem
                                item={item}
                                currentUserId={currentUserId}
                                onDelete={handleDelete}
                                COLOURS={COLOURS}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.list_content}
                        ListEmptyComponent={
                            <Text style={[styles.empty, { color: COLOURS.grey }]}>
                                be the first to comment — no comments yet!
                            </Text>
                        }
                    />
                )}

                {/* Input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={10}
                >
                    <View style={[styles.input_row, {
                        backgroundColor: COLOURS.white,
                        borderTopColor: COLOURS.light_grey,
                    }]}>
                        {/* Avatar */}
                        <View style={[styles.avatar_sm, { backgroundColor: COLOURS.primary }]}>
                            <Text style={[styles.avatar_letter, { color: COLOURS.white }]}>
                                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>

                        <TextInput
                            ref={inputRef}
                            value={text}
                            onChangeText={setText}
                            placeholder="Type Comment..."
                            placeholderTextColor={COLOURS.grey}
                            style={[styles.input, {
                                backgroundColor: COLOURS.light_primary,
                                color: COLOURS.black,
                            }]}
                            multiline
                            maxLength={300}
                        />

                        <TouchableOpacity
                            onPress={handlePost}
                            disabled={posting || !text.trim()}
                            style={[styles.post_btn, {
                                backgroundColor: text.trim() ? COLOURS.primary : COLOURS.light_grey,
                            }]}
                            activeOpacity={0.8}
                        >
                            {posting ? (
                                <ActivityIndicator size="small" color={COLOURS.white} />
                            ) : (
                                <Text style={[styles.post_text, { color: COLOURS.white }]}>↑</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </Animated.View>
        </Modal>
    );
};

export default CommentSheetNew;

const styles = StyleSheet.create({

    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
        borderTopLeftRadius: responsiveWidth(6),
        borderTopRightRadius: responsiveWidth(6),
        paddingBottom: Platform.OS === 'ios' ? responsiveWidth(6) : responsiveWidth(3),
    },

    handle: {
        width: responsiveWidth(10),
        height: responsiveWidth(1),
        borderRadius: responsiveWidth(1),
        alignSelf: 'center',
        marginTop: responsiveWidth(3),
        marginBottom: responsiveWidth(1),
    },

    sheet_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(3),
    },

    sheet_title: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.9),
    },

    close_btn: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Poppins-Medium',
        paddingHorizontal: responsiveWidth(2),
    },

    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    list_content: {
        paddingHorizontal: responsiveWidth(4),
        paddingBottom: responsiveWidth(4),
        flexGrow: 1,
    },

    empty: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.6),
        textAlign: 'center',
        marginTop: responsiveWidth(10),
    },

    // Comment card
    comment_card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: responsiveWidth(3),
        padding: responsiveWidth(3),
        borderRadius: responsiveWidth(3),
        marginBottom: responsiveWidth(2),
    },

    avatar: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    avatar_letter: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.8),
    },

    comment_body: {
        flex: 1,
    },

    comment_top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsiveWidth(0.5),
    },

    comment_name: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.5),
    },

    comment_time: {
        top: responsiveWidth(2),
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.3),
    },

    comment_text: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.5),
        lineHeight: responsiveWidth(5),
    },

    delete_btn: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.3),
        marginTop: responsiveWidth(1),
    },

    // Input row
    input_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderTopWidth: 0.5,
    },

    avatar_sm: {
        width: responsiveWidth(8),
        height: responsiveWidth(8),
        borderRadius: responsiveWidth(4),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    input: {
        flex: 1,
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.5),
        maxHeight: responsiveWidth(25),
    },

    post_btn: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    post_text: {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Poppins-Bold',
    },
});