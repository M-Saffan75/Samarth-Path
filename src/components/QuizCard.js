import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, AppState, StyleSheet, StatusBar } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { Fonts } from '../assets/fonts/Fonts';
import { PlayLottie } from '../components/PlayLottie';
import UserRoutes from '../user/user_routes/UserRoutes';
import ExplanationModal from '../components/ExplanationModal';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { globalImages } from '../assets/images/images_file/All_Images';
import { submitQuizAnswer } from '../user/screens/home/homebackend/HomeBackend';
import { showError } from '../helper/Helper';
import CommentSheet from './CommentSheet';
import { FadeDown } from './FadeDown';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title_Here from './Title_Here';
import Header from './Header';
import Back_Arrow from './Back_Arrow';

const TIMER_KEY = 'quiz_timer_';

const QuizCard = ({ route, onPress, navigation }) => {
    const { item, onAttemptComplete } = route?.params || {};
    console.log('items:', item)
    const { theme: COLOURS, isDark } = useTheme();

    // ── Data from API ──────────────────────────────────────────
    const question = item?.question;
    const options = item?.options || [];
    const schedule = item?.schedule || 'afternoon';
    const timerSeconds = item?.timerSeconds || 180;
    const quizAttempt = item?.quizAttempt; // API se already attempt

    // ── Already attempted ──────────────────────────────────────
    const alreadyAttempted = !!quizAttempt;
    const selectedFromApi = quizAttempt?.selectedOptionId; // "3"
    const isCorrectFromApi = quizAttempt?.isCorrect;
    const timeTakenFromApi = quizAttempt?.timeTakenSeconds;
    const correctOptionId = item?.correctOptionId?.toString();
    // ── States ─────────────────────────────────────────────────
    const [selectedOption, setSelectedOption] = useState(
        alreadyAttempted ? selectedFromApi?.toString() : null
    );
    const [submitted, setSubmitted] = useState(alreadyAttempted);  // ✅ seedha
    const [isCorrect, setIsCorrect] = useState(isCorrectFromApi);  // ✅ seedha
    const [timeLeft, setTimeLeft] = useState(timerSeconds);
    const [loading, setLoading] = useState(false); // ✅ already attempted = no loading
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [explanation, setExplanation] = useState(item?.explanation || '');

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const timerKey = TIMER_KEY + item?.id;

    // ── Load saved timer (sirf agar attempt nahi ki) ───────────
    useEffect(() => {
        if (alreadyAttempted) return; // ✅ already attempted = kuch mat karo

        const loadTimer = async () => {
            try {
                const saved = await AsyncStorage.getItem(timerKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    const today = new Date().toDateString();
                    if (parsed.date === today && parsed.timeLeft > 0) {
                        setTimeLeft(parsed.timeLeft);
                    } else {
                        await AsyncStorage.removeItem(timerKey);
                    }
                }
            } catch (e) {
                console.log('Timer load error:', e);
            } finally {
                startTimeRef.current = Date.now(); // ✅ loading ke baad set
                setLoading(false);
            }
        };

        loadTimer();
    }, []);

    // ── AppState — app close hone pe timer band ────────────────
    useEffect(() => {
        if (alreadyAttempted) return;

        const sub = AppState.addEventListener('change', (state) => {
            if (state !== 'active') {
                clearInterval(timerRef.current);
            } else if (!submitted) {
                // App wapas open — timer resume
                startTimer();
            }
        });
        return () => sub.remove();
    }, [submitted, timeLeft]);

    // ── Timer ─────────────────────────────────────────────────
    useEffect(() => {
        if (alreadyAttempted || submitted) return; // ✅ dono cases handle

        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                AsyncStorage.setItem(timerKey, JSON.stringify({
                    date: new Date().toDateString(),
                    timeLeft: newTime,
                }));
                if (newTime <= 0) {
                    clearInterval(timerRef.current);
                    handleAutoSubmit();
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [submitted, alreadyAttempted]);

    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                // Save timer
                AsyncStorage.setItem(timerKey, JSON.stringify({
                    date: new Date().toDateString(),
                    timeLeft: newTime,
                }));
                return newTime;
            });
        }, 1000);
    };

    // ── Auto submit (timer 0) ──────────────────────────────────
    const handleSelectOption = (optionMongoId) => {
        if (submitted) return;
        setSelectedOption(optionMongoId?.toString()); // ✅ sirf _id use karo
    };

    // ── Auto submit ───────────────────────────────────────────
    const handleAutoSubmit = () => {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        const randomId = randomOption?._id?.toString(); // ✅ _id use karo
        setSelectedOption(randomId);
        handleSubmit(randomId);
    };

    // ── Submit ────────────────────────────────────────────────
    const handleSubmit = async (forcedId = null) => {
        if (submitting) return;
        setSubmitting(true);
        clearInterval(timerRef.current);

        const finalId = forcedId ?? selectedOption;
        const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

        try {
            const res = await submitQuizAnswer({
                contentId: item.id,
                selectedOptionId: finalId,
                timeTakenSeconds: timeTaken,
            });

            if (res.success) {
                setIsCorrect(res.data.isCorrect);
                setExplanation(res.data.explanation || '');
                setSubmitted(true);
                await AsyncStorage.removeItem(timerKey); // timer clear
                onAttemptComplete?.({
                    selectedOptionId: finalId,
                    isCorrect: res.data.isCorrect,
                    timeTakenSeconds: timeTaken,
                });

                if (!res.data.isCorrect) setShowModal(true);

                if (!res.data.isCorrect) setShowModal(true);
            } else if (res.code === 400) {
                // Already submitted
                setSubmitted(true);
            }
        } catch (e) {
            // showError('Network error — please try again');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const timerColor = timeLeft <= 30 ? 'red' : timeLeft <= 60 ? 'orange' : COLOURS.primary;

    const getOptionColor = (optionMongoId) => {
        const id = optionMongoId?.toString();
        if (!submitted) return selectedOption === id ? COLOURS.primary : COLOURS.black;
        if (id === correctOptionId) return 'green';
        if (id === selectedOption) return 'red';
        return COLOURS.black;
    };

    // ── Fallback ──────────────────────────────────────────────
    if (!question || !options || options.length === 0) {
        return (
            <View style={[styles.fallback, { backgroundColor: COLOURS.light_primary }]}>
                <Text style={[styles.fallback_text, { color: COLOURS.grey }]}>📝 Quiz is Coming Soon...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                    <Back_Arrow label={'Quiz'} />
                    <FadeDown>
                        <Title_Here title={'• Step into a quick quiz to test your focus & knowledge.'} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(5)} />
                        <Title_Here title={'• Think carefully before choosing each answer.'} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(2)} />
                        <Title_Here title={'• Discover how sharp your thinking really is.'} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(2)} />
                        <TouchableOpacity activeOpacity={0.9} onPress={onPress}
                            style={[styles.card, { backgroundColor: COLOURS.light_primary, borderColor: COLOURS.primary }]}>

                            {/* Header */}
                            <View style={styles.header}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={globalImages.app_logo} style={{ height: responsiveWidth(6), width: responsiveWidth(6) }}
                                        tintColor={COLOURS.primary} />
                                    <Text style={[styles.header_text, { color: COLOURS.primary }]}>{/* schedule */'afternoon quiz'}</Text>
                                </View>
                                <Text style={[styles.header_text, { color: COLOURS.grey }]}>Quiz</Text>
                            </View>

                            {/* Timer ya Time Taken */}
                            <View style={styles.timer_row}>
                                {submitted ? (
                                    <Text style={[styles.timer_text, { color: COLOURS.grey }]}>
                                        ⏱ {formatTime(
                                            alreadyAttempted
                                                ? (timeTakenFromApi ?? 0)           // ✅ API se jo aaya
                                                : timerSeconds - timeLeft            // ✅ live time taken
                                        )}
                                    </Text>
                                ) : (
                                    <Text style={[styles.timer_text, { color: timerColor }]}>
                                        ⏱ {formatTime(timeLeft)}
                                    </Text>
                                )}
                                {submitted && (
                                    <Text style={{
                                        fontFamily: Fonts.Medium,
                                        fontSize: responsiveFontSize(1.6),
                                        color: isCorrect ? 'green' : 'red',
                                    }}>
                                        {isCorrect ? 'Correct' : 'Wrong Answer!'}
                                    </Text>
                                )}
                            </View>

                            {/* Question */}
                            <View style={{ paddingHorizontal: responsiveWidth(1.5), paddingTop: responsiveWidth(2) }}>
                                <Text style={{
                                    fontSize: responsiveFontSize(1.8),
                                    textTransform: 'capitalize',
                                    lineHeight: responsiveWidth(5),
                                    color: COLOURS.black,
                                }} numberOfLines={4}>
                                    {question}
                                </Text>
                            </View>

                            {/* Options */}
                            {options.map((option) => (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    key={option._id}                          // ✅ _id
                                    disabled={submitted}
                                    onPress={() => handleSelectOption(option._id)}  // ✅ _id
                                    style={styles.option_row}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={
                                                submitted
                                                    ? (option._id?.toString() === correctOptionId || option._id?.toString() === selectedOption)
                                                        ? globalImages.select
                                                        : globalImages.unselect
                                                    : selectedOption === option._id?.toString()
                                                        ? globalImages.select
                                                        : globalImages.unselect
                                            }
                                            style={{ height: responsiveWidth(5), width: responsiveWidth(5) }}
                                            tintColor={getOptionColor(option._id)}
                                        />
                                        <Text style={{
                                            paddingLeft: responsiveWidth(3),
                                            fontSize: responsiveFontSize(1.6),
                                            width: '87%',
                                            textTransform: 'capitalize',
                                            fontFamily: selectedOption === option._id?.toString() ? Fonts.Regular : Fonts.Medium,
                                            color: getOptionColor(option._id),
                                        }}>
                                            {option.text}
                                        </Text>
                                    </View>

                                    {/* Lottie icons */}
                                    {submitted && option._id?.toString() === correctOptionId && (
                                        <PlayLottie source={globalImages.check_icon_json} size={responsiveWidth(6)} />
                                    )}
                                    {submitted && option._id?.toString() === selectedOption && option._id?.toString() !== correctOptionId && (
                                        <PlayLottie source={globalImages.cross_icon} size={responsiveWidth(6)} />
                                    )}
                                </TouchableOpacity>
                            ))}

                            {/* Submit Button */}
                            {selectedOption && !submitted && (
                                <TouchableOpacity
                                    onPress={() => handleSubmit()}
                                    disabled={submitting}
                                    style={[styles.submit_btn, { backgroundColor: COLOURS.primary },
                                    submitting && { opacity: 0.6 }]}
                                >
                                    <Text style={[styles.submit_text, { color: COLOURS.white }]}>
                                        {submitting ? 'Submitting...' : 'Submit Answer'}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Divider */}
                            <View style={{
                                width: '91%', height: responsiveWidth(.2),
                                backgroundColor: COLOURS.grey, marginTop: responsiveWidth(3), alignSelf: 'center'
                            }} />

                            {/* Weekly Winners */}
                            <View style={{ marginTop: responsiveWidth(2.5), alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={0.9}
                                    onPress={() => navigation.navigate(UserRoutes.Weekly_Winners)}
                                    style={{
                                        backgroundColor: COLOURS.light_green,
                                        padding: responsiveWidth(2),
                                        width: responsiveWidth(80),
                                        borderRadius: responsiveWidth(2),
                                    }}>
                                    <Text style={{
                                        fontSize: responsiveFontSize(1.5),
                                        fontFamily: Fonts.Medium,
                                        textTransform: 'capitalize',
                                        color: COLOURS.black,
                                        textAlign: 'center',
                                        top: responsiveWidth(.4),
                                    }}>
                                        Past winners
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <ExplanationModal
                                visible={showModal}
                                explanation={explanation}
                                onClose={() => setShowModal(false)}
                                onPress={() => setShowModal(false)}
                            />

                        </TouchableOpacity>
                    </FadeDown>
                </View>
            </SafeAreaView>
        </>
    );
};

export default QuizCard;

const styles = StyleSheet.create({
    card: {
        borderWidth: responsiveWidth(.1),
        paddingHorizontal: responsiveWidth(2),
        paddingTop: responsiveWidth(4),
        paddingBottom: responsiveWidth(4),
        borderRadius: responsiveWidth(4),
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(3),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
    },
    header_text: {
        paddingLeft: responsiveWidth(1),
        textTransform: 'uppercase',
        fontFamily: 'Poppins-Medium',
        top: responsiveWidth(.5),
    },
    timer_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
        marginTop: responsiveWidth(2),
    },
    timer_text: {
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.8),
    },
    option_row: {
        marginLeft: responsiveWidth(1),
        marginTop: responsiveWidth(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    submit_btn: {
        marginTop: responsiveWidth(4),
        marginHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(3),
        borderRadius: responsiveWidth(2),
        alignItems: 'center',
    },
    submit_text: {
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.8),
    },
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
    container: {
        height: '100%',
        width: '100%',
    },
});