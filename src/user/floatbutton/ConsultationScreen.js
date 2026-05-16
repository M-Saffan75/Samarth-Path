import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet,
    TextInput, ScrollView, ActivityIndicator, Keyboard,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    RefreshControl
} from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { useUser } from '../screens/auth/user_context/UserContext';
import { globalImages } from '../../assets/images/images_file/All_Images';
import Profile from '../../components/Profile';
import Title_Here from '../../components/Title_Here';
import {
    fetchConsultantMessages,
    sendConsultantMessage,
    formatChatTime,
    formatOptimisticTime,
} from './consultationbackend/CounsultationBackend';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExplanationModal from '../../components/ExplanationModal';
import Button from '../../components/Button';
import { Bounce } from '../../components/Bounce';
import { FadeLeft } from '../../components/FadeLeft';
import { FadeRight } from '../../components/FadeRight';
import { FadeIn } from '../../components/FadeIn';

const MessageBubble = ({ msg }) => {

    const { theme: COLOURS } = useTheme();
    const isUser = msg.sender === 'user';
    const isOptimistic = msg._id?.startsWith('temp_');
    const timeLabel = isOptimistic ? formatOptimisticTime(msg.createdAt) : formatChatTime(msg.createdAt);

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginTop: responsiveWidth(3),
            paddingHorizontal: responsiveWidth(2),
        }}>
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
                    <Text style={[styles.bubble_text, { color: isUser ? COLOURS.white : COLOURS.black }]}>
                        {msg.message}
                    </Text>
                </View>
                <Text style={[styles.time_text, { color: COLOURS.grey }]}>{timeLabel}</Text>
            </View>
            {isUser && (
                <View style={{ marginLeft: responsiveWidth(2) }}>
                    <Profile height={responsiveWidth(8)} width={responsiveWidth(8)} />
                </View>
            )}
        </View>
    );
};

const ConsultationScreen = ({ navigation }) => {
    const { theme: COLOURS, isDark } = useTheme();
    const { userData } = useUser();

    const [messages, setMessages] = useState([]);
    const [allowedMessages, setAllowedMessages] = useState('');
    const [inputText, setInputText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [sending, setSending] = useState(false);

    const scrollRef = useRef(null);

    const buildChat = (senderMessages = [], adminReplies = []) =>
        [...senderMessages, ...adminReplies].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

    const loadMessages = useCallback(async (isPullRefresh = false) => {
        if (isPullRefresh) setRefreshing(true);
        else setFetching(true);
        try {
            const res = await fetchConsultantMessages();
            if (res?.success) {
                setMessages(buildChat(res.data?.senderMessages, res.data?.adminReplies));
            }
        } catch (e) {
            console.log('loadMessages error:', e);
        } finally {
            if (isPullRefresh) setRefreshing(false);
            else setFetching(false);
        }
    }, []);

    useEffect(() => { loadMessages(); }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || sending) return;

        const tempId = `temp_${Date.now()}`;
        const optimistic = {
            _id: tempId, sender: 'user',
            message: text, createdAt: new Date().toISOString(),
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
                Keyboard.dismiss();
            } else {
                setMessages(prev => prev.filter(m => m._id !== tempId));
                setInputText(text);
                Keyboard.dismiss();
            }
        } catch (e) {
            setMessages(prev => prev.filter(m => m._id !== tempId));
            setInputText(text);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.white }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>

                        {/* Bahar tap karo toh close */}
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill}
                            onPress={() => navigation.goBack()}
                        />

                        {/* Card */}
                        <View style={[styles.card, { backgroundColor: COLOURS.white }]}>

                            {/* Close button */}
                            <TouchableOpacity
                                style={[styles.close_btn, { backgroundColor: COLOURS.primary }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={{ color: COLOURS.white, fontSize: responsiveFontSize(2) }}>𝘟</Text>
                            </TouchableOpacity>

                            {/* User header */}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Bounce>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <Profile height={responsiveWidth(13)} width={responsiveWidth(13)} />
                                        <View style={{ marginLeft: responsiveWidth(2), marginTop: responsiveWidth(1.5) }}>
                                            <Title_Here title={userData?.name} marginLeft={0} marginRight={0} marginTop={0} fontSize={responsiveFontSize(1.6)} />
                                            <Title_Here title={userData?.email} marginLeft={0} marginRight={0} marginTop={0} fontSize={responsiveFontSize(1.5)} color={COLOURS.black} />
                                        </View>
                                    </View>
                                </Bounce>
                                <FadeRight>
                                    <Button label={'⟲' + ' ' + 'refresh'} onPress={() => loadMessages(true)} width={responsiveWidth(22)} borderWidth={responsiveWidth(0.3)}
                                        paddingVertical={responsiveWidth(1)} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(0)} backgroundColor={COLOURS.light_primary}
                                        borderColor={COLOURS.primary} color={COLOURS.primary} />
                                </FadeRight>
                            </View>

                            <View style={[styles.divider, { backgroundColor: COLOURS.grey }]} />

                            {/* Info — sirf jab messages nahi */}
                            {messages.length === 0 && !fetching && (
                                <Text style={{ textAlign: 'center', color: COLOURS.grey, fontSize: responsiveFontSize(1.5), lineHeight: responsiveWidth(4.5), marginVertical: responsiveWidth(2) }}>
                                    You can send messages to the admin up to 3 times per month.
                                </Text>
                            )}

                            {/* Messages */}
                            {fetching ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={COLOURS.primary} />
                                </View>
                            ) : (
                                <ScrollView
                                    ref={scrollRef}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ paddingBottom: responsiveWidth(4) }}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={() => loadMessages(true)}
                                            colors={[COLOURS.primary]}
                                            tintColor={COLOURS.primary}
                                            progressBackgroundColor={COLOURS.white}
                                        />
                                    }
                                >
                                    {messages.length === 0 ? (
                                        <FadeIn>
                                            <Text style={[styles.empty_chat, { color: COLOURS.grey }]}>
                                                No messages yet. Say hello! 👋
                                            </Text>
                                        </FadeIn>
                                    ) : (
                                        messages.map(item => (
                                            <MessageBubble key={item._id?.toString()} msg={item} COLOURS={COLOURS} />
                                        ))
                                    )}
                                </ScrollView>
                            )}

                            {/* Input */}
                            <View style={[styles.input_row, { borderTopColor: COLOURS.light_primary }]}>
                                <Profile height={responsiveWidth(9)} width={responsiveWidth(9)} />
                                <TextInput
                                    placeholder="Write your message..."
                                    placeholderTextColor={COLOURS.grey}
                                    style={[styles.input, { color: COLOURS.black, borderColor: COLOURS.grey }]}
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                    maxLength={500}
                                />
                                <TouchableOpacity
                                    style={[styles.send_btn, { backgroundColor: COLOURS.light_primary }]}
                                    onPress={handleSend}
                                    disabled={sending}
                                    activeOpacity={0.8}
                                >
                                    {sending
                                        ? <ActivityIndicator size="small" color={COLOURS.primary} />
                                        : <Image source={globalImages.send_icon} style={{ width: responsiveWidth(5), height: responsiveWidth(5) }} tintColor={COLOURS.primary} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <ExplanationModal
                    visible={showModal}
                    explanation={'You can send messages to the admin `up to 3 times` per month. Each message allows you to ask any questions or discuss your concerns freely.'}
                    onClose={() => setShowModal(false)}
                    title={allowedMessages}
                />
            </SafeAreaView >
        </>
    );
};

export default ConsultationScreen;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderTopLeftRadius: responsiveWidth(5),
        borderTopRightRadius: responsiveWidth(5),
        padding: responsiveWidth(4),
        flexDirection: 'column',
    },
    close_btn: {
        alignSelf: 'flex-end',
        height: responsiveWidth(10),
        width: responsiveWidth(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsiveWidth(100),
        marginBottom: responsiveWidth(2),
    },
    divider: {
        height: 1,
        marginVertical: responsiveWidth(2),
        opacity: 0.4,
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
    },
    bubble_user: { borderBottomRightRadius: responsiveWidth(0.5) },
    bubble_admin: { borderBottomLeftRadius: responsiveWidth(0.5) },
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
    input_row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: responsiveWidth(2.5),
        borderTopWidth: 1,
        gap: responsiveWidth(2),
        marginTop: responsiveWidth(1),
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: responsiveWidth(5),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(2),
        fontSize: responsiveFontSize(1.5),
        maxHeight: responsiveWidth(24),
    },
    send_btn: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
});