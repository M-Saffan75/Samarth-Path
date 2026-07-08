import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { View, Text, Image, TouchableOpacity, AppState, StyleSheet, StatusBar, ScrollView } from 'react-native';

import { Fonts } from '../assets/fonts/Fonts';
import { PlayLottie } from '../components/PlayLottie';
import UserRoutes from '../user/user_routes/UserRoutes';
import ExplanationModal from '../components/ExplanationModal';
import { useTheme } from '../assets/themecontext/ThemeContext';
import { globalImages } from '../assets/images/images_file/All_Images';
import { submitQuizAnswer } from '../user/screens/home/homebackend/HomeBackend';

import { FadeDown } from './FadeDown';
import Title_Here from './Title_Here';
import Back_Arrow from './Back_Arrow';
import { FadeIn } from './FadeIn';
import { FadeRight } from './FadeRight';
import { FadeLeft } from './FadeLeft';
import { Pulse } from './Pulse';
import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import Prize_Modal from './Prize_Modal';

const TIMER_KEY = 'quiz_timer_';

const QuizCard = ({ route, onPress, navigation }) => {

    const { item, onAttemptComplete, quizprize } = route?.params || {};
    // console.log('itemsssssss:', quizprize)

    const todayprize = quizprize?.prize
    const weeklyprize = quizprize?.weeklyPrize

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
    const [prizeModal, setPrizeModal] = useState({ visible: false, prize: null, label: '' });
    const [prizeToggle, setPrizeToggle] = useState(false);

    const currentDisplayPrize = !prizeToggle
        ? (todayprize || weeklyprize)
        : (weeklyprize || todayprize);

    const handlePrizePress = () => {
        const showDaily = !prizeToggle;
        const prize = showDaily
            ? (todayprize || weeklyprize)
            : (weeklyprize || todayprize);
        const label = showDaily
            ? (todayprize ? "TODAY'S PRIZE" : "WEEKLY PRIZE")
            : (weeklyprize ? "WEEKLY PRIZE" : "TODAY'S PRIZE");
        setPrizeToggle(showDaily);
        setPrizeModal({ visible: true, prize, label });
    };

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
                    <ScrollView alwaysBounceVertical showsVerticalScrollIndicator={false}>
                        <FadeDown>
                            <Title_Here title={'• Every microsecond matters. Stay sharp & take the quiz.'} fontSize={responsiveFontSize(1.45)} marginTop={responsiveWidth(5)} />
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
                                    <TouchableOpacity style={styles.row_prize_here} activeOpacity={0.7}
                                        onPress={handlePrizePress}
                                    >
                                        <Image
                                            source={currentDisplayPrize?.imageUrl ? { uri: currentDisplayPrize.imageUrl } : globalImages.winner}
                                            style={[styles.prize_img_small, { height: responsiveWidth(7), width: responsiveWidth(7) }]}
                                            resizeMode='contain'
                                        />
                                        <Text numberOfLines={1} ellipsizeMode="tail"
                                            style={[styles.header_text, { width: responsiveWidth(20), color: COLOURS.grey, fontSize: responsiveFontSize(1.2) }]}>
                                            {currentDisplayPrize?.title || ''}
                                        </Text>
                                    </TouchableOpacity>
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
                                {options?.map((option) => (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        key={option?._id}                          // ✅ _id
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

                        {/* <View style={styles.row_card}>

                            <View style={[styles.announce_card, { backgroundColor: '#e8945c2c', borderColor: COLOURS.primary, borderTopRightRadius: responsiveWidth(0), }]}>
                                <Text style={[styles.text_title, { fontSize: responsiveFontSize(4), top: responsiveWidth(3) }]}>🎁</Text>
                                <Text style={[styles.text_title, { color: COLOURS.black }]}>Daily Winner</Text>
                                <Button label='see prize ⟹' width={responsiveWidth(25)} paddingVertical={responsiveWidth(1)}
                                    alignSelf={'center'} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(4)}
                                    onPress={() => setPrizeModal({ visible: true, prize: todayprize, label: "TODAY'S PRIZE" })} />
                            </View>
                            <View style={[styles.announce_card, { backgroundColor: '#e8945c2c', borderColor: COLOURS.primary, borderTopRightRadius: responsiveWidth(0), }]}>
                                <Text style={[styles.text_title, { fontSize: responsiveFontSize(4), top: responsiveWidth(3) }]}>🎁</Text>
                                <Text style={[styles.text_title, { color: COLOURS.black }]}>weekly Winner</Text>
                                <Button label='see prize ⟹' width={responsiveWidth(25)} paddingVertical={responsiveWidth(1)}
                                    alignSelf={'center'} fontSize={responsiveFontSize(1.5)} marginTop={responsiveWidth(4)}
                                    onPress={() => setPrizeModal({ visible: true, prize: weeklyprize, label: 'WEEKLY PRIZE' })} />
                            </View>
                        </View> */}

                        <Prize_Modal
                            visible={prizeModal.visible}
                            onClose={() => setPrizeModal({ visible: false, prize: null, label: '' })}
                            prize={prizeModal.prize}
                            label={prizeModal.label}
                        />


                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
};

export default QuizCard;

const styles = StyleSheet.create({

    row_prize_here: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    arrow_img: {
        height: responsiveWidth(10),
        width: responsiveWidth(10),
        alignSelf: 'center',
        top: responsiveWidth(2)
    },

    text_title: {
        top: responsiveWidth(2),
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(2.1),
    },

    row_card: {
        marginTop: responsiveWidth(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    // 

    announce_card: {
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: responsiveWidth(4),
        borderWidth: responsiveWidth(.5),
    },


    prize_label: {
        textAlign: 'center',
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.2),
        color: '#C9A84C',
        letterSpacing: 2,
        marginBottom: responsiveWidth(2),
    },

    date: {
        textAlign: 'center',
        fontSize: responsiveFontSize(1.3),
        color: '#9E9E9E',
        marginTop: responsiveWidth(1),
        fontFamily: Fonts.Regular,
    },

    title: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontFamily: 'Poppins-Medium',
        paddingTop: responsiveWidth(3),
        fontSize: responsiveFontSize(1.8),
    },

    prize_img: {
        height: responsiveWidth(13),
        width: responsiveWidth(13),
    },

    bg_img: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsiveWidth(1),
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius: responsiveWidth(100),
        borderWidth: 1.5,
    },

    prize_card: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: responsiveWidth(80),
        height: responsiveWidth(50),
        marginTop: responsiveWidth(7),
        borderRadius: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderWidth: 1,
        overflow: 'hidden',
    },

    // 

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
        fontSize: responsiveFontSize(1.8),
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