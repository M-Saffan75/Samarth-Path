import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, Image, FlatList, TextInput,
  TouchableOpacity, StyleSheet, Animated,
  Dimensions, ActivityIndicator, Keyboard,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../assets/fonts/Fonts';
import { useTheme } from '../assets/themecontext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalImages } from '../assets/images/images_file/All_Images';
import { useUser } from '../user/screens/auth/user_context/UserContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { deleteComment, fetchComments, postComment } from '../user/screens/home/homebackend/HomeBackend';
import { FadeUp } from './FadeUp';
import { timeAgo, getInitials, avatarColors } from '../components/TimeAgo';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SNAP_TOP = 0;                          // full screen
const SNAP_BOTTOM = SCREEN_HEIGHT * 0.25;    // 75% visible (initial)
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.55; // drag isse neeche → dismiss

// ─── Comment Row ───────────────────────────────────────────────────────────
const CommentRow = ({ item, index, currentUserId, onDelete }) => {
  const { theme: COLOURS } = useTheme();
  const color = avatarColors[index % avatarColors.length];
  const isOwner = item.userId?._id === currentUserId;
  const isTemp = item._id?.startsWith('temp_');

  const content = (
    <View style={styles.commentRow}>
      <View style={[styles.avatar, { backgroundColor: color.bg }]}>
        {!item.userId?.profilePicture ? (
          <Text style={[styles.avatarText, { color: color.text }]}>
            {getInitials(item.userId?.name || item.user || 'U')}
          </Text>
        ) : (
          <Image source={{ uri: item?.userId?.profilePicture }} style={styles.avatar} />
        )}
      </View>

      <View style={styles.commentContent}>
        <View style={[styles.commentBubble, { backgroundColor: COLOURS.light_primary }]}>
          <Text style={[styles.commentUser, { color: COLOURS.black }]}>
            {item?.userId?.name || item.user || 'User'}
          </Text>
          <Text style={[styles.commentText, { color: COLOURS.light_black }]}>
            {item?.text}
          </Text>
        </View>
        <Text style={[styles.commentTime, { color: COLOURS.grey }]}>
          {timeAgo(item?.createdAt)}
        </Text>
      </View>

      {isOwner && (
        <TouchableOpacity
          onPress={() => onDelete(item._id || item.id)}
          activeOpacity={0.7}
          style={{
            top: responsiveWidth(4),
            backgroundColor: COLOURS.primary,
            height: responsiveWidth(7),
            width: responsiveWidth(7),
            borderRadius: responsiveWidth(100),
            justifyContent: 'center',
            alignItems: 'center',
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

// ─── Main Screen ───────────────────────────────────────────────────────────
const CommentScreen = ({ navigation, route }) => {
  const { postId } = route.params;
  const { theme: COLOURS, isDark } = useTheme();
  const { userData } = useUser();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [userIdLoaded, setUserIdLoaded] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
  const lastSnap = useRef(SNAP_BOTTOM);

  // ── User ID load ──
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

  // ── Slide in on mount ──
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: SNAP_BOTTOM,
      useNativeDriver: true,
      bounciness: 3,
    }).start();
    loadComments();
  }, []);

  // ── Count sync — jab wapas jaayein ──
  useEffect(() => {
    return () => {
      // screen close hone par parent ko updated count bhejo
      navigation.setParams?.({ commentsCount: comments.length });
    };
  }, [comments]);

  // ── Load comments ──
  const loadComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await fetchComments(postId);
      if (res.success) setComments(res.data || []);
    } catch (e) {
      console.log('Fetch comments error:', e);
    } finally {
      setLoading(false);
    }
  };

  // ── Post comment ──
  const handlePostComment = async () => {
    if (!comment.trim() || posting) return;
    const text = comment.trim();
    setComment('');
    requestAnimationFrame(() => inputRef.current?.focus());
    setPosting(true);

    const tempId = 'temp_' + Date.now();
    const tempComment = {
      _id: tempId,
      text,
      userId: {
        _id: currentUserId,
        name: userData?.name || currentUserName || '',
        profilePicture: userData?.profilePicture || null,
      },
      createdAt: new Date().toISOString(),
    };

    setComments(prev => [tempComment, ...prev]);

    try {
      const res = await postComment(postId, text);
      if (res.success) {
        setComments(prev =>
          prev.map(c =>
            c._id === tempId
              ? { ...tempComment, _id: res.data?._id || tempId }
              : c
          )
        );
      } else {
        setComments(prev => prev.filter(c => c._id !== tempId));
      }
    } catch (e) {
      setComments(prev => prev.filter(c => c._id !== tempId));
    } finally {
      setPosting(false);
    }
  };

  // ── Delete comment ──
  const handleDelete = async (commentId) => {
    setComments(prev => prev.filter(c => (c._id || c.id) !== commentId));
    try {
      await deleteComment(commentId);
    } catch (e) {
      console.log('Delete error:', e);
      loadComments();
    }
  };

  // ── Dismiss (slide down + go back) ──
  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 280,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  }, []);

  // ── Drag gesture ──
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
      listener: (e) => {
        // translateY ko lastSnap se relative rakho
        const newVal = lastSnap.current + e.nativeEvent.translationY;
        if (newVal >= SNAP_TOP) translateY.setValue(newVal);
      },
    }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const currentVal = lastSnap.current + nativeEvent.translationY;

      if (currentVal > DISMISS_THRESHOLD) {
        // dismiss
        dismiss();
        return;
      }

      // snap to nearest point
      const snapTo = currentVal < SCREEN_HEIGHT * 0.3 ? SNAP_TOP : SNAP_BOTTOM;
      lastSnap.current = snapTo;

      Animated.spring(translateY, {
        toValue: snapTo,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    }
  };

  return (
    <View style={styles.root}>
      {/* Backdrop — press to dismiss */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={dismiss}
      />

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: COLOURS.white },
          { transform: [{ translateY }] },
        ]}
      >
        {/* Drag Handle */}
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={styles.dragArea}>
            <View style={[styles.indicator, { backgroundColor: COLOURS.grey }]} />
          </Animated.View>
        </PanGestureHandler>

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: COLOURS.light_primary }]}>
          <Text style={[styles.sheetTitle, { color: COLOURS.black }]}>Comments</Text>
          <Text style={[styles.commentCount, { color: COLOURS.grey }]}>
            {comments?.length}
          </Text>
        </View>

        {/* List + Input — KeyboardAvoidingView handles keyboard */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {loading || !userIdLoaded ? (
            <ActivityIndicator
              color={COLOURS.primary}
              style={{ marginTop: responsiveWidth(10) }}
            />
          ) : (
            <FlatList
              ref={listRef}
              data={comments}
              keyExtractor={(item) => (item._id || item.id).toString()}
              keyboardShouldPersistTaps="handled"
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
              style={styles.list}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: COLOURS.grey, marginTop: responsiveWidth(10), fontFamily: Fonts.Regular }}>
                  No comments yet. Be the first! 👋
                </Text>
              }
            />
          )}

          {/* Input Bar */}
          {!loading && (
            <View style={[styles.inputBar, {
              borderTopColor: COLOURS.light_primary,
              backgroundColor: COLOURS.white,
            }]}>
              {userData?.profilePicture ? (
                <Image source={{ uri: userData.profilePicture }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#FFF3EB' }]}>
                  <Text style={[styles.avatarText, { color: COLOURS.primary }]}>ME</Text>
                </View>
              )}

              <TextInput
                ref={inputRef}
                blurOnSubmit={false}
                style={[styles.input, {
                  color: COLOURS.black,
                  backgroundColor: COLOURS.light_primary,
                }]}
                placeholder="Write a comment..."
                placeholderTextColor={COLOURS.grey}
                value={comment}
                onChangeText={setComment}
                multiline
              />

              <TouchableOpacity
                onPress={handlePostComment}
                disabled={!comment.trim() || posting}
                style={[styles.sendBtn, { backgroundColor: COLOURS.light_primary },
                (!comment.trim() || posting) && { opacity: 0.4 }
                ]}
                activeOpacity={0.7}
              >
                {posting ? (
                  <ActivityIndicator size="small" color={COLOURS.primary} />
                ) : (
                  <Image
                    source={globalImages.send_icon}
                    style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                    tintColor={COLOURS.primary}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

export default CommentScreen;

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    overflow: 'hidden',
  },
  dragArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: responsiveWidth(3),
  },
  indicator: {
    width: responsiveWidth(10),
    height: responsiveWidth(1),
    borderRadius: responsiveWidth(1),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveWidth(3),
    borderBottomWidth: 0.5,
  },
  sheetTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: Fonts.Medium,
  },
  commentCount: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.Regular,
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
    top: responsiveWidth(0.4),
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(2),
  },
  commentUser: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.Medium,
    marginBottom: responsiveWidth(0.5),
  },
  commentText: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: Fonts.Regular,
    lineHeight: responsiveWidth(4.5),
  },
  commentTime: {
    fontSize: responsiveFontSize(1.2),
    fontFamily: Fonts.Regular,
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
  },
  input: {
    flex: 1,
    borderRadius: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2.5),
    fontSize: responsiveFontSize(1.6),
    fontFamily: Fonts.Regular,
    maxHeight: responsiveWidth(25),
  },
  sendBtn: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});