import React, { useState, useRef, useEffect } from 'react';
import { FadeUp } from '../../components/FadeUp';
import { Fonts } from '../../assets/fonts/Fonts';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalImages } from '../../assets/images/images_file/All_Images';
import { useUser } from '../../user/screens/auth/user_context/UserContext';
import { timeAgo, getInitials, avatarColors } from '../../components/TimeAgo';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { deleteComment, fetchComments, postComment } from '../../user/screens/home/homebackend/HomeBackend';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, Animated, StyleSheet, ActivityIndicator, Keyboard, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

// ─── Comment Row ───────────────────────────────────────────────────────────
const CommentRow = ({ item, index, currentUserId, onDelete }) => {
  const { theme: COLOURS } = useTheme()
  const color = avatarColors[index % avatarColors.length]
  const isOwner = item.userId?._id === currentUserId
  const isTemp = item._id?.startsWith('temp_')

  const content = (
    <View style={styles.commentRow}>
      <View style={[styles.avatar, { backgroundColor: color.bg, borderColor: COLOURS.primary }]}>
        {!item.userId?.profilePicture ? <Text style={[styles.avatarText, { color: color.text }]}>{getInitials(item.userId?.name || item.user || 'U')}</Text> : <Image source={{ uri: item?.userId?.profilePicture }} style={styles.avatar} />}
      </View>
      <View style={styles.commentContent}>
        <View style={[styles.commentBubble, { backgroundColor: COLOURS.light_primary }]}>
          <Text style={[styles.commentUser, { color: COLOURS.black }]}>{item?.userId?.name || item.user || 'User'}</Text>
          <Text style={[styles.commentText, { color: COLOURS.light_black }]}>{item?.text}</Text>
        </View>
        <Text style={[styles.commentTime, { color: COLOURS.grey }]}>{timeAgo(item?.createdAt)}</Text>
      </View>
      {isOwner && (
        <TouchableOpacity onPress={() => onDelete(item._id || item.id)} activeOpacity={0.7} style={{ top: responsiveWidth(4), backgroundColor: COLOURS.primary, height: responsiveWidth(7), width: responsiveWidth(7), borderRadius: responsiveWidth(100), justifyContent: 'center', alignItems: 'center' }}>
          <Image source={globalImages.trash} style={{ width: responsiveWidth(4), height: responsiveWidth(4) }} tintColor={COLOURS.white} />
        </TouchableOpacity>
      )}
    </View>
  )
  return isTemp ? <FadeUp>{content}</FadeUp> : content
}

// ─── BottomSheet with Comments ─────────────────────────────────────────────
const BottomSheet = ({ translateY, opacity, panResponder, postId, onCommentAdded, onCommentDeleted, onClose }) => {
  const { theme: COLOURS } = useTheme()
  const { userData } = useUser()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [currentUserName, setCurrentUserName] = useState('')
  const [userIdLoaded, setUserIdLoaded] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height))
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0))
    return () => { show.remove(); hide.remove() }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        const payload = token.split('.')[1]
        const decoded = JSON.parse(atob(payload))
        setCurrentUserId(decoded._id || decoded.id || decoded.userId)
        setCurrentUserName(decoded.name || decoded.userName || '')
      }
      setUserIdLoaded(true)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (postId) loadComments()
  }, [postId])

  const loadComments = async () => {
    if (!postId) return
    setLoading(true)
    try {
      const res = await fetchComments(postId)
      if (res.success) setComments(res.data || [])
    } catch (e) { console.log('Fetch comments error:', e) }
    finally { setLoading(false) }
  }

  const handlePostComment = async () => {
    if (!comment.trim() || posting) return
    const text = comment.trim()
    setComment('')
    requestAnimationFrame(() => { inputRef.current?.focus() })
    setPosting(true)
    const tempId = 'temp_' + Date.now()
    const tempComment = { _id: tempId, text, userId: { _id: currentUserId, name: userData?.name || currentUserName || '', profilePicture: userData?.profilePicture || null }, createdAt: new Date().toISOString() }
    setComments(prev => [tempComment, ...prev])
    try {
      const res = await postComment(postId, text)
      if (res.success) { setComments(prev => prev.map(c => c._id === tempId ? { ...tempComment, _id: res.data?._id || tempId } : c)); onCommentAdded?.() }
      else setComments(prev => prev.filter(c => c._id !== tempId))
    } catch (e) { setComments(prev => prev.filter(c => c._id !== tempId)) }
    finally { setPosting(false) }
  }

  const handleDelete = async (commentId) => {
    setComments(prev => prev.filter(c => (c._id || c.id) !== commentId))
    onCommentDeleted?.()
    try { await deleteComment(commentId) }
    catch (e) { console.log('Delete error:', e); loadComments() }
  }

  return (
    <Modal visible={true} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>

      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', opacity }} />
      </TouchableWithoutFeedback>

      {/* SHEET — panHandlers poori sheet pe */}
      {/* SHEET */}
      <Animated.View {...panResponder.panHandlers} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '85%', backgroundColor: '#0e2c57', borderTopLeftRadius: 25, borderTopRightRadius: 25, transform: [{ translateY }], display: 'flex', flexDirection: 'column' }}>

        {/* DRAG HANDLE */}
        <View style={{ height: 45, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 50, height: 5, backgroundColor: 'white', borderRadius: 10 }} />
        </View>

        {/* HEADER */}
        <View style={[styles.sheetHeader, { borderBottomColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={[styles.sheetTitle, { color: 'white' }]}>Comments</Text>
          <Text style={[styles.commentCount, { color: 'rgba(255,255,255,0.6)' }]}>{comments?.length}</Text>
        </View>

        {/* COMMENTS LIST — flex:1 sirf yahan */}
        <View style={{ flex: 1 }}>
          {loading || !userIdLoaded ? (
            <ActivityIndicator color={COLOURS.primary} style={{ marginTop: responsiveWidth(10) }} />
          ) : (
            <FlatList data={comments} keyExtractor={(item) => (item._id || item.id).toString()} keyboardShouldPersistTaps="handled" renderItem={({ item, index }) => <CommentRow item={item} index={index} currentUserId={currentUserId} onDelete={handleDelete} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: responsiveWidth(10), fontFamily: Fonts.Regular }}>No comments yet. Be the first!</Text>} />
          )}
        </View>

        {/* INPUT BAR — hamesha bottom pe */}
        {!loading && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.inputBar, { borderTopColor: 'rgba(255,255,255,0.2)', backgroundColor: '#0e2c57' }]}>
              {userData?.profilePicture ? <Image source={{ uri: userData.profilePicture }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: '#FFF3EB' }]}><Text style={[styles.avatarText, { color: COLOURS.primary }]}>ME</Text></View>}
              <TextInput blurOnSubmit={false} ref={inputRef} style={[styles.input, { color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }]} placeholder="Write a comment..." placeholderTextColor="rgba(255,255,255,0.4)" value={comment} onChangeText={setComment} multiline />
              <TouchableOpacity onPressIn={handlePostComment} disabled={!comment.trim() || posting} style={[styles.sendBtn, (!comment.trim() || posting) && { opacity: 0.4 }]} activeOpacity={0.7}>
                <Image source={globalImages.send_icon} style={{ width: responsiveWidth(5), height: responsiveWidth(5) }} tintColor={COLOURS.primary} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

      </Animated.View>
    </Modal>
  )
}

export default BottomSheet

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

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
    borderWidth: responsiveWidth(.3),
  },
  avatarText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: Fonts.Medium,
    top: responsiveWidth(.4),
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
    backgroundColor: '#FFF3EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});