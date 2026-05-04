import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, Image, FlatList, TextInput,
    TouchableOpacity, KeyboardAvoidingView,
    Platform, StyleSheet, Animated, PanResponder,
    Dimensions, Modal, TouchableWithoutFeedback,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { globalImages } from '../assets/images/images_file/All_Images';
import { COLOURS } from '../assets/theme/Theme';
import { Fonts } from '../assets/fonts/Fonts';
import { FadeUp } from './FadeUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteComment, fetchComments, postComment } from '../user/screens/home/homebackend/HomeBackend';
import { useUser } from '../user/screens/auth/user_context/UserContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.80;
const MAX_SHEET_TOP = SCREEN_HEIGHT * 0.15;

const avatarColors = [
    { bg: '#FFF3EB', text: '#E8935C' },
    { bg: '#EAF3DE', text: '#3B6D11' },
    { bg: '#E6F1FB', text: '#185FA5' },
    { bg: '#FBEAF0', text: '#993556' },
    { bg: '#EEEDFE', text: '#534AB7' },
];

// Name se 2 initials nikalo
const getInitials = (name = '') => {
    const words = name.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

// ─── Comment Row ───────────────────────────────────────────────────────────

const CommentRow = ({ item, index, currentUserId, onDelete }) => {
    const color = avatarColors[index % avatarColors.length];
    const isOwner = item.userId?._id === currentUserId;
    const isTemp = item._id?.startsWith('temp_');
    const content = (
        <View style={styles.commentRow}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: color.bg }]}>
                <Text style={[styles.avatarText, { color: color.text }]}>
                    {getInitials(item.userId?.name || item.user || 'U')}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.commentContent}>
                <View style={styles.commentBubble}>
                    <Text style={styles.commentUser}>
                        {item.userId?.name || item.user || 'User'}
                    </Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                </View>
                <Text style={styles.commentTime}>{item.time || item.createdAt || ''}</Text>
            </View>

            {/* Delete — sirf apne comment pe */}
            {isOwner && (
                <TouchableOpacity
                    onPress={() => onDelete(item._id || item.id)}
                    activeOpacity={0.7}
                    style={{
                        top: responsiveWidth(4), backgroundColor: COLOURS.primary,
                        height: responsiveWidth(7),
                        width: responsiveWidth(7),
                        borderRadius: responsiveWidth(100),
                        justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <Image
                        source={globalImages.trash}
                        style={{ width: responsiveWidth(4), height: responsiveWidth(4) }}
                        tintColor={COLOURS.white}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
    return isTemp ? <FadeUp>{content}</FadeUp> : content;
};


// ─── Main Component ────────────────────────────────────────────────────────
const CommentSheet = ({ isOpen, onClose, postId, onCommentAdded, onCommentDeleted }) => {

    const { userData } = useUser();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const listScrollOffset = useRef(0);

    const [userIdLoaded, setUserIdLoaded] = useState(false);
    const inputRef = useRef(null);

    const [currentUserName, setCurrentUserName] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);


    useEffect(() => {
        const getUser = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                setCurrentUserId(decoded._id || decoded.id || decoded.userId);
                setCurrentUserName(decoded.name || decoded.userName || '');
            }
            setUserIdLoaded(true);
        };
        getUser();
    }, []);

    // Sheet open/close animation
    useEffect(() => {
        if (isOpen) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }).start();
            loadComments();
        } else {
            Animated.timing(translateY, {
                toValue: SHEET_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);

    // Comments fetch
    const loadComments = async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const res = await fetchComments(postId);
            if (res.success) {
                setComments(res.data || []);
            }
        } catch (e) {
            console.log('Fetch comments error:', e);
        } finally {
            setLoading(false);
        }
    };

    // Post comment

    const handlePostComment = async () => {
        if (!comment.trim() || posting) return;
        const text = comment.trim();
        setComment(''); // ← pehle clear
        inputRef.current?.focus();
        setPosting(true);

        const tempId = 'temp_' + Date.now();
        const tempComment = {
            _id: tempId,
            text,
            userId: { _id: currentUserId, name: userData?.name || '' },
            createdAt: 'Just now',
        };
        setComments(prev => [tempComment, ...prev]);

        try {
            const res = await postComment(postId, text);
            if (res.success) {
                // sirf _id update karo — baaki sab temp wala rakho
                setComments(prev =>
                    prev.map(c => c._id === tempId
                        ? { ...tempComment, _id: res.data?._id || tempId }
                        : c
                    )
                );
                onCommentAdded?.();
            } else {
                setComments(prev => prev.filter(c => c._id !== tempId));
            }
        } catch (e) {
            setComments(prev => prev.filter(c => c._id !== tempId));
        } finally {
            setPosting(false);
        }
    };

    // Delete comment
    const handleDelete = async (commentId) => {
        // Optimistic remove
        setComments(prev => prev.filter(c => (c._id || c.id) !== commentId));
        onCommentDeleted?.();
        try {
            await deleteComment(commentId);
        } catch (e) {
            console.log('Delete comment error:', e);
            loadComments(); // fail → reload
        }
    };

    // Pan responder — drag to close
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) translateY.setValue(gesture.dy);
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 150) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, {
                transform: [{ translateY }],
                maxHeight: keyboardHeight > 0
                    ? SCREEN_HEIGHT - keyboardHeight - (SCREEN_HEIGHT * 0.15)
                    : SHEET_HEIGHT,
            }]}>

                {/* Drag Handle */}
                <View {...panResponder.panHandlers} style={styles.dragArea}>
                    <View style={styles.indicator} />
                </View>

                {/* Header */}
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Comments</Text>
                    <Text style={styles.commentCount}>{comments.length}</Text>
                </View>

                {/* List */}
                {loading || !userIdLoaded ? (
                    <ActivityIndicator
                        color={COLOURS.primary}
                        style={{ marginTop: responsiveWidth(10) }}
                    />
                ) : (
                    <FlatList data={comments} keyExtractor={(item) => (item._id || item.id).toString()}
                        renderItem={({ item, index }) => (
                            <CommentRow
                                item={item}
                                index={index}
                                currentUserId={currentUserId}
                                onDelete={handleDelete}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onScroll={(e) => {
                            listScrollOffset.current = e.nativeEvent.contentOffset.y;
                        }}
                        scrollEventThrottle={16}
                        style={styles.list}
                        ListEmptyComponent={
                            <Text style={{
                                textAlign: 'center', color: COLOURS.grey,
                                marginTop: responsiveWidth(10),
                                fontFamily: Fonts.Regular
                            }}>
                                No comments yet. Be the first!
                            </Text>
                        }
                    />
                )}

                {/* Input */}
                {!loading ?
                    <View>
                        <View style={styles.inputBar}>
                            <View style={[styles.avatar, { backgroundColor: '#FFF3EB' }]}>
                                <Text style={[styles.avatarText, { color: COLOURS.primary }]}>ME</Text>
                            </View>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                placeholder="Write a comment..."
                                placeholderTextColor={COLOURS.grey}
                                value={comment}
                                onChangeText={setComment}
                                multiline
                            />
                            <TouchableOpacity
                                onPressIn={handlePostComment}
                                disabled={!comment.trim() || posting}
                                style={[styles.sendBtn, (!comment.trim() || posting) && { opacity: 0.4 }]}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={globalImages.send_icon}
                                    style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                                    tintColor={COLOURS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View> : ''}

            </Animated.View>
        </Modal>
    );
};

export default CommentSheet;

// ─── Styles ────────────────────────────────────────────────────────────────
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
        height: SHEET_HEIGHT,
        backgroundColor: COLOURS.white,
        borderTopLeftRadius: responsiveWidth(5),
        borderTopRightRadius: responsiveWidth(5),
    },
    dragArea: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: responsiveWidth(3),
    },
    indicator: {
        width: responsiveWidth(10),
        height: responsiveWidth(1),
        backgroundColor: COLOURS.light_grey,
        borderRadius: responsiveWidth(1),
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(4),
        paddingBottom: responsiveWidth(3),
        borderBottomWidth: 0.5,
        borderBottomColor: COLOURS.light_grey,
    },
    sheetTitle: {
        fontSize: responsiveFontSize(1.9),
        fontFamily: Fonts.Medium,
        color: COLOURS.black,
    },
    commentCount: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: Fonts.Regular,
        color: COLOURS.grey,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
    },
    commentRow: {
        flexDirection: 'row',
        gap: responsiveWidth(3),
        marginBottom: responsiveWidth(3),
    },
    avatar: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: Fonts.Medium,
    },
    commentContent: {
        flex: 1,
    },
    commentBubble: {
        backgroundColor: COLOURS.light_primary,
        borderRadius: responsiveWidth(3),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2),
    },
    commentUser: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: Fonts.Medium,
        color: COLOURS.black,
        marginBottom: responsiveWidth(0.5),
    },
    commentText: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: Fonts.Regular,
        color: COLOURS.light_black,
        lineHeight: responsiveWidth(4.5),
    },
    commentTime: {
        fontSize: responsiveFontSize(1.2),
        fontFamily: Fonts.Regular,
        color: COLOURS.grey,
        marginTop: responsiveWidth(1),
        marginLeft: responsiveWidth(2),
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(2.5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderTopWidth: 0.5,
        borderTopColor: COLOURS.light_grey,
        backgroundColor: COLOURS.white,
    },
    input: {
        flex: 1,
        backgroundColor: COLOURS.light_primary,
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Regular,
        color: COLOURS.black,
        maxHeight: responsiveWidth(25),
    },
    sendBtn: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        backgroundColor: '#FFF3EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});