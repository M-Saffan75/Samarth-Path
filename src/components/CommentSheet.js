import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, Image, FlatList, TextInput,
    TouchableOpacity, KeyboardAvoidingView,
    Platform, StyleSheet, Animated, PanResponder,
    Dimensions, Modal, TouchableWithoutFeedback,
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { COLOURS } from '../assets/theme/Theme';
import { Fonts } from '../assets/fonts/Fonts';
import { globalImages } from '../assets/images/images_file/All_Images';
import { FadeDown } from './FadeDown';
import { FadeUp } from './FadeUp';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

// ─── Mock Comments ─────────────────────────────────────────────────────────
const mockComments = [
    { id: 1, user: 'Rahul Kumar', initials: 'RK', time: '2h ago', text: 'Bahut accha content hai! Roz padhta hoon.' },
    { id: 2, user: 'Priya Sharma', initials: 'PS', time: '3h ago', text: 'Yeh quiz aaj bahut tough tha but loved it!' },
    { id: 3, user: 'Meera Verma', initials: 'MV', time: '5h ago', text: 'Samarth Path ne meri zindagi badal di.' },
    { id: 4, user: 'Vikram Rao', initials: 'VR', time: '6h ago', text: 'Amazing wisdom today. Keep it up!' },
    { id: 5, user: 'Anita Nair', initials: 'AN', time: '8h ago', text: 'Roz ka quiz mera favorite part hai.' },
    { id: 6, user: 'Karan Mehta', initials: 'KM', time: '9h ago', text: 'Best app for daily motivation!' },
    { id: 7, user: 'Divya Patel', initials: 'DP', time: '10h ago', text: 'Har roz kuch naya seekhne ko milta.' },
];

const avatarColors = [
    { bg: '#FFF3EB', text: '#E8935C' },
    { bg: '#EAF3DE', text: '#3B6D11' },
    { bg: '#E6F1FB', text: '#185FA5' },
    { bg: '#FBEAF0', text: '#993556' },
    { bg: '#EEEDFE', text: '#534AB7' },
];

// ─── Comment Row ───────────────────────────────────────────────────────────
const CommentRow = ({ item, index }) => {
    const color = avatarColors[index % avatarColors.length];
    return (
        <FadeUp>
            <View style={styles.commentRow}>
                <View style={[styles.avatar, { backgroundColor: color.bg }]}>
                    <Text style={[styles.avatarText, { color: color.text }]}>{item.initials}</Text>
                </View>
                <View style={styles.commentContent}>
                    <View style={styles.commentBubble}>
                        <Text style={styles.commentUser}>{item.user}</Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                    <Text style={styles.commentTime}>{item.time}</Text>
                </View>
            </View>
        </FadeUp>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────
const CommentSheet = ({ isOpen, onClose, postId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(mockComments);

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const listScrollOffset = useRef(0); // list kitni scroll hui hai

    // ─── Open / Close Animation ──────────────────────────────
    useEffect(() => {
        if (isOpen) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: SHEET_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);

    // ─── PanResponder — Sirf Handle bar pe drag ──────────────
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Sirf neeche drag aur list top pe ho tab
                return gestureState.dy > 5 && listScrollOffset.current <= 0;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > SHEET_HEIGHT * 0.25) {
                    // 25% se zyada drag → close
                    Animated.timing(translateY, {
                        toValue: SHEET_HEIGHT,
                        duration: 250,
                        useNativeDriver: true,
                    }).start(onClose);
                } else {
                    // Wapas upar
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 4,
                    }).start();
                }
            },
        })
    ).current;

    // ─── Post Comment ─────────────────────────────────────────
    const handlePostComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now(),
            user: 'You',
            initials: 'ME',
            time: 'Just now',
            text: comment.trim(),
        };
        setComments([newComment, ...comments]);
        setComment('');
    };

    if (!isOpen) return null;

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            {/* Sheet */}
            <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>

                {/* ── Drag Handle — sirf yahan se drag hoga ── */}
                <View {...panResponder.panHandlers} style={styles.dragArea}>
                    <View style={styles.indicator} />
                </View>

                {/* Header */}
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Comments</Text>
                    <Text style={styles.commentCount}>{comments.length}</Text>
                </View>

                {/* Comments List — freely scroll hogi, drag nahi hogi */}
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <CommentRow item={item} index={index} />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={(e) => {
                        listScrollOffset.current = e.nativeEvent.contentOffset.y;
                    }}
                    scrollEventThrottle={16}
                    style={styles.list}
                />

                {/* Input Bar */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.inputBar}>
                        <View style={[styles.avatar, { backgroundColor: '#FFF3EB' }]}>
                            <Text style={[styles.avatarText, { color: COLOURS.primary }]}>ME</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Write a comment..."
                            placeholderTextColor={COLOURS.grey}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handlePostComment}
                            disabled={!comment.trim()}
                            style={[styles.sendBtn, !comment.trim() && { opacity: 0.4 }]}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={globalImages.send_icon}
                                style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                                tintColor={COLOURS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

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