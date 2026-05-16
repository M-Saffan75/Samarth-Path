import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Modal,
    TextInput,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ScrollView,
} from 'react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Profile from '../../components/Profile';
import { Bounce } from '../../components/Bounce';
import { ZoomIn } from '../../components/ZoomIn';
import Title_Here from '../../components/Title_Here';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { useUser } from '../screens/auth/user_context/UserContext';
import { globalImages } from '../../assets/images/images_file/All_Images';
import {
    fetchConsultantMessages,
    sendConsultantMessage,
    formatChatTime,
    formatOptimisticTime,
} from './consultationbackend/CounsultationBackend';
import ExplanationModal from '../../components/ExplanationModal';
import { FadeDown } from '../../components/FadeDown';

// ─── Single message bubble ────────────────────────────────────────────────────


const MessageBubble = ({ msg, COLOURS }) => {

    const isUser = msg.sender === 'user';
    const isOptimistic = msg._id?.startsWith('temp_');
    const timeLabel = isOptimistic
        ? formatOptimisticTime(msg.createdAt)
        : formatChatTime(msg.createdAt);

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginTop: responsiveWidth(3),
            paddingHorizontal: responsiveWidth(2),
        }}>
            {/* Admin avatar — left */}
            {!isUser && (
                <Image
                    source={globalImages.admin_icon}
                    style={[styles.admin_img, { borderColor: COLOURS.grey }]}
                    tintColor={COLOURS.grey}
                />
            )}

            <View style={{ maxWidth: '72%', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <View style={[
                    styles.bubble,
                    isUser
                        ? [styles.bubble_user, { backgroundColor: COLOURS.primary }]
                        : [styles.bubble_admin, { backgroundColor: COLOURS.light_primary }],
                ]}>
                    <Text style={[
                        styles.bubble_text,
                        { color: isUser ? COLOURS.white : COLOURS.black }
                    ]}>
                        {msg.message}
                    </Text>
                </View>

                {/* Time */}
                <Text style={[styles.time_text, { color: COLOURS.grey }]}>
                    {timeLabel}
                </Text>
            </View>

            {/* User avatar — right */}
            {isUser && (
                <View style={{ marginLeft: responsiveWidth(2) }}>
                    <Profile height={responsiveWidth(8)} width={responsiveWidth(8)} />
                </View>
            )}
        </View>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FloatingActionButton = ({ image, onModalOpen, onModalClose }) => {

    const { theme: COLOURS } = useTheme();
    const { userData } = useUser();

    const [modalVisible, setModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [allowedMessages, setAllowedMessages] = useState('');
    const [inputText, setInputText] = useState('');
    const [fetching, setFetching] = useState(false);
    const [sending, setSending] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const flatListRef = useRef(null);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => { show.remove(); hide.remove(); };
    }, []);

    // merge user + admin messages, sort by createdAt
    const buildChat = (senderMessages = [], adminReplies = []) =>
        [...senderMessages, ...adminReplies].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

    const loadMessages = useCallback(async (silent = false) => {
        if (!silent) setFetching(true);
        try {
            const res = await fetchConsultantMessages();

            if (res?.success) {
                setMessages(buildChat(res.data?.senderMessages, res.data?.adminReplies));
                console.log('fetchConsultantMessages res:', messages);
            }
        } catch (e) {
            console.log('loadMessages error:', e);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (modalVisible) loadMessages();
    }, [modalVisible]);

    // scroll to bottom on new messages

    useEffect(() => {
        if (messages.length > 0) {
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            });
        }
    }, [messages]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || sending) return;

        // optimistic message
        const tempId = `temp_${Date.now()}`;
        const optimistic = {
            _id: tempId,
            sender: 'user',
            message: text,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, optimistic]);
        setInputText('');
        setSending(true);

        try {
            const res = await sendConsultantMessage(text);
            if (res?.success) {
                setMessages(prev => prev.map(m => m._id === tempId ? { ...res.data } : m));
            } else if (res?.code === 400) {
                setAllowedMessages(res?.message);
                setMessages(prev => prev.filter(m => m._id !== tempId));
                setShowModal(true);
            } else {
                setMessages(prev => prev.filter(m => m._id !== tempId));
                setInputText(text);
            }
        } catch (e) {
            setMessages(prev => prev.filter(m => m._id !== tempId));
            console.log('e', e);
            setInputText(text);
        } finally {
            setSending(false);
        }
    };

    const openModal = () => { setModalVisible(true); onModalOpen?.(); };
    const closeModal = () => { setModalVisible(false); onModalClose?.(); };

    return (
        <>
            {/* FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: COLOURS.primary }]}
                onPress={openModal}
                activeOpacity={0.85}
            >
                <Image
                    source={image}
                    style={styles.fab_image}
                    tintColor={COLOURS.white}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
                statusBarTranslucent
            >
                {/*
                 * KeyboardAvoidingView wraps the whole modal backdrop.
                 * - iOS: 'padding' shifts the content up by keyboard height.
                 * - Android: 'height' shrinks the available height so the
                 *   card + input stay visible above the keyboard.
                 */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={0}
                >
                    <Pressable style={styles.backdrop} onPress={closeModal}>
                        {/* Stop press propagation so tapping inside card doesn't close */}
                        <Pressable
                            style={[styles.modal_card, { backgroundColor: COLOURS.white }]}
                            onPress={() => { }}
                        >
                            {/* Close */}
                            <FadeDown>
                                <TouchableOpacity style={[styles.close_btn, { backgroundColor: COLOURS.primary }]} onPress={closeModal} hitSlop={10}>
                                    <Text style={[styles.close_text, { color: COLOURS.black }]}>𝘟</Text>
                                </TouchableOpacity>
                            </FadeDown>

                            {/* User header */}
                            <Bounce delay={200}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: responsiveWidth(3) }}>
                                    <Profile height={responsiveWidth(13)} width={responsiveWidth(13)} />
                                    <View style={{ marginLeft: responsiveWidth(2), marginTop: responsiveWidth(1.5) }}>
                                        <Title_Here
                                            title={userData?.name}
                                            marginLeft={0} marginRight={0} marginTop={0}
                                            fontSize={responsiveFontSize(1.6)}
                                        />
                                        <Title_Here
                                            title={userData?.email}
                                            marginLeft={0} marginRight={0} marginTop={0}
                                            fontSize={responsiveFontSize(1.5)}
                                            color={COLOURS.black}
                                        />
                                    </View>
                                </View>
                            </Bounce>

                            <View style={[styles.divider, { backgroundColor: COLOURS.grey }]} />

                            {/* Info — show only when no messages */}
                            {messages.length === 0 && !fetching ? (
                                <>
                                    <ZoomIn>
                                        <Title_Here
                                            textAlign={'center'}
                                            color={COLOURS.grey}
                                            fontSize={responsiveFontSize(1.5)}
                                            lineHeight={responsiveWidth(4.5)}
                                            title={
                                                'You can send messages to the admin up to 3 times per month. Each message allows you to ask any questions or discuss your concerns freely.'
                                            }
                                        />
                                    </ZoomIn>
                                    <View style={[styles.divider, { backgroundColor: COLOURS.grey, marginTop: responsiveWidth(2) }]} />
                                </>
                            ) : null}

                            {/* Chat list — flex:1 makes it fill remaining space and scroll */}
                            {fetching ? (
                                <View style={styles.loader_container}>
                                    <ActivityIndicator size="small" color={COLOURS.primary} />
                                </View>
                            ) : (
                                <ScrollView
                                    ref={flatListRef}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ paddingBottom: responsiveWidth(4) }}
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                                >
                                    {messages.length === 0 ? (
                                        <Text style={[styles.empty_chat, { color: COLOURS.grey }]}>
                                            No consultation messages yet. Say hello! 👋
                                        </Text>
                                    ) : (
                                        messages.map(item => (
                                            <MessageBubble key={item._id?.toString()} msg={item} COLOURS={COLOURS} />
                                        ))
                                    )}
                                </ScrollView>
                            )}
                            {/* Input row — always pinned at bottom */}
                            <View style={[styles.input_bottom, { borderTopColor: COLOURS.light_primary }]}>
                                <Profile height={responsiveWidth(9)} width={responsiveWidth(9)} />
                                <TextInput
                                    placeholder="Write your message..."
                                    placeholderTextColor={COLOURS.grey}
                                    style={[styles.inpt_message, { color: COLOURS.black, borderColor: COLOURS.grey }]}
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                    maxLength={500}
                                />
                                <TouchableOpacity
                                    activeOpacity={sending ? 1 : 0.8}
                                    style={[styles.sendbg, { backgroundColor: COLOURS.light_primary }]}
                                    onPress={handleSend}
                                    disabled={sending}
                                >
                                    {sending
                                        ? <ActivityIndicator size="small" color={COLOURS.primary} />
                                        : <Image
                                            source={globalImages.send_icon}
                                            style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                                            tintColor={COLOURS.primary}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>

                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>

                <ExplanationModal
                    visible={showModal}
                    explanation={'You can send messages to the admin `up to 3 times` per month. Each message allows you to ask any questions or discuss your concerns freely.'}
                    onClose={() => setShowModal(false)}
                    title={allowedMessages}
                />
            </Modal>
        </>
    );
};

export default FloatingActionButton;

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: responsiveWidth(20),
        right: responsiveWidth(5),
        width: responsiveWidth(14),
        height: responsiveWidth(14),
        borderRadius: responsiveWidth(7),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fab_image: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(3),
        paddingBottom: 0,     // ← KeyboardAvoidingView handles the gap, don't add extra
    },
    modal_card: {
        flex: 1,
        borderRadius: responsiveWidth(4),
        padding: responsiveWidth(4),
        maxHeight: responsiveHeight(60), 
        flexDirection: 'column',
    },

    close_btn: {
        alignSelf: 'flex-end',
        // marginBottom: responsiveWidth(2),
        height: responsiveWidth(10),
        width: responsiveWidth(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsiveWidth(100),
    },
    close_text: {
        fontSize: responsiveFontSize(2),
    },
    divider: {
        height: 1,
        marginVertical: responsiveWidth(1),
        opacity: 0.4,
    },

    // flex:1 is the key — makes FlatList fill available space and scroll

    chat_list: {
        flex: 1,
        marginVertical: responsiveWidth(1),
    },
    loader_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: responsiveWidth(20),
    },
    empty_chat: {
        textAlign: 'center',
        marginTop: responsiveWidth(8),
        fontSize: responsiveFontSize(1.5),
    },
    bubble: {
        paddingHorizontal: responsiveWidth(3.5),
        paddingVertical: responsiveWidth(2),
        borderRadius: responsiveWidth(3),
        maxWidth: '100%',
    },
    bubble_user: {
        borderBottomRightRadius: responsiveWidth(0.5),
    },
    bubble_admin: {
        borderBottomLeftRadius: responsiveWidth(0.5),
    },
    bubble_text: {
        fontSize: responsiveFontSize(1.6),
        lineHeight: responsiveWidth(4.5),
    },
    time_text: {
        fontSize: responsiveFontSize(1.2),
        marginTop: responsiveWidth(0.8),
        marginHorizontal: responsiveWidth(1),
    },
    admin_img: {
        width: responsiveWidth(8),
        height: responsiveWidth(8),
        borderRadius: responsiveWidth(4),
        borderWidth: 1,
        marginRight: responsiveWidth(1.5),
    },
    input_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: responsiveWidth(2.5),
        borderTopWidth: 1,
        gap: responsiveWidth(2),
        marginTop: responsiveWidth(1),
    },
    inpt_message: {
        flex: 1,
        borderWidth: 1,
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2),
        fontSize: responsiveFontSize(1.5),
        maxHeight: responsiveWidth(24),  // ~4 lines before scroll
    },
    sendbg: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
});