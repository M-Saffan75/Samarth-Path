// components/DemoSheet.js
// Pure React Native — no third party sheet library

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const DemoSheet = forwardRef(
  (
    {
      title = 'Comments',
      placeholder = 'Write something...',
      onSend,
    },
    ref,
  ) => {

    const inputRef        = useRef(null);
    const translateY      = useRef(new Animated.Value(300)).current;

    const [visible, setVisible]   = useState(false);
    const [text, setText]         = useState('');
    const [sending, setSending]   = useState(false);

    const openSheet = () => {
      setVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start(() => {
        // sheet open hone ke baad focus
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    };

    const closeSheet = () => {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    };

    useImperativeHandle(ref, () => ({
      open:  openSheet,
      close: closeSheet,
    }));

    const handleSend = async () => {
      const msg = text.trim();
      if (!msg || sending) return;

      try {
        setSending(true);
        await onSend?.(msg);
        setText('');
        // ✅ keyboard open rehta hai — focus wapas
        inputRef.current?.focus();
      } catch (e) {
        console.log(e);
      } finally {
        setSending(false);
      }
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
        // ✅ Yeh dono milke keyboard dismiss hone se rokte hain
        statusBarTranslucent
      >
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* ✅ KeyboardAvoidingView Modal ke andar — 
            yahan perfectly kaam karta hai kyunki
            Modal apna window context rakhta hai */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kavContainer}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY }] },
            ]}
          >
            {/* Handle */}
            <View style={styles.handleBar} />

            <Text style={styles.title}>{title}</Text>

            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor="#999"
              multiline
              blurOnSubmit={false}
              style={styles.input}
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={sending}
              style={[
                styles.button,
                sending && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.buttonText}>
                {sending ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

export default DemoSheet;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  kavContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  sheet: {
    backgroundColor: '#1A1B1F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#2A2B31',
    backgroundColor: '#23252B',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    fontSize: 15,
  },
  button: {
    marginTop: 14,
    backgroundColor: '#4C8DFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});