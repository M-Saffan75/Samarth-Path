import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Reaction from './Reaction';
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

const QUIZ_STORAGE_KEY = 'quiz_state_';

const QuizCard = ({ item, onPress, navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(item?.commentsCount);

    useEffect(() => {
        setCommentsCount(item?.commentsCount);
    }, [item?.commentsCount]); // ← item change hone pe update


    const [selectedOption, setSelectedOption] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [loading, setLoading] = useState(true); // pehle load karo

    const [correctOptionId, setCorrectOptionId] = useState(null);
    const [explanation, setExplanation] = useState('');
    const [showModal, setShowModal] = useState(false);
    const startTimeRef = useRef(Date.now());

    const timerRef = useRef(null);
    const storageKey = QUIZ_STORAGE_KEY + item?.id; // har quiz ka alag key
    const todayDate = new Date().toDateString(); //
    const [submitting, setSubmitting] = useState(false)
    const question = item?.question;
    const options = item?.options;
    const correct_id = correctOptionId?.toString();
    const schedule = item?.schedule || 'afternoon';

    // ─── App open hone par saved state load karo ───────────────
    useEffect(() => {
        const loadSavedState = async () => {
            try {
                const saved = await AsyncStorage.getItem(storageKey);
                console.log('Saved Quiz State:', saved);
                if (saved) {
                    const parsed = JSON.parse(saved);

                    // Check karo — aaj ka hai ya purana?
                    if (parsed.date === todayDate) {
                        setSelectedOption(parsed.selectedOption);
                        setSubmitted(parsed.submitted);
                        setTimeLeft(parsed.timeLeft ?? 0);
                        setCorrectOptionId(parsed.correctOptionId); // ← add karo
                    } else {
                        // Naya din → purana data clear karo
                        await AsyncStorage.removeItem(storageKey);
                    }
                }
            } catch (e) {
                console.log('Quiz load error:', e);
            } finally {
                setLoading(false);
            }
        };

        loadSavedState();
    }, []);

    // ─── Timer ─────────────────────────────────────────────────
    useEffect(() => {
        if (loading) return;
        if (submitted) return;
        if (timeLeft <= 0) {
            // Auto select — agar koi option select nahi hua toh pehla option select karo
            const autoSelected = selectedOption ?? options[0]?.id;
            setSelectedOption(autoSelected);
            handleSubmit(autoSelected);
            return;
        }
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                if (!submitted) saveState(selectedOption, false, newTime, null); // ← submitted check
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [loading, submitted, timeLeft]);

    // ─── State save karo AsyncStorage mein ────────────────────
    const saveState = async (option, isSubmitted, time, correct = null) => {
        try {
            await AsyncStorage.setItem(storageKey, JSON.stringify({
                date: todayDate,
                selectedOption: option,
                submitted: isSubmitted,
                timeLeft: time,
                correctOptionId: correct,
            }));
        } catch (e) {
            console.log('Quiz save error:', e);
        }
    };

    // ─── Option select ─────────────────────────────────────────
    const handleSelectOption = (optionId) => {
        setSelectedOption(optionId);
        saveState(optionId, false, timeLeft); // select hote hi save
    };

    // ─── Submit ────────────────────────────────────────────────
    const handleSubmit = async (forcedOption = null) => {
        if (submitting) return;
        setSubmitting(true);
        clearInterval(timerRef.current); // ← timer band karo sabse pehle

        const finalOption = forcedOption ?? selectedOption;
        const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

        try {
            const res = await submitQuizAnswer({
                contentId: item.id,
                selectedOptionId: finalOption,
                timeTakenSeconds: timeTaken,
            });

            console.log('Quiz API Response:', JSON.stringify(res));

            if (res.success) {
                const correct = res.data.correctOptionId;
                setCorrectOptionId(correct);
                setExplanation(res.data.explanation || '');
                setSubmitted(true);
                await saveState(finalOption, true, 0, correct); // ← correct save ho raha hai

                if (!res.data.isCorrect) {
                    setShowModal(true); // ← modal bhi open hoga
                }
                showSuccess(res.data.isCorrect ? 'Correct Answer! ✅' : 'Wrong Answer ❌');

            } else if (res.code === 400 && res.message.includes('already submitted')) {
                // correctOptionId already AsyncStorage mein hoga pehli baar ka
                const saved = await AsyncStorage.getItem(storageKey);
                const parsed = saved ? JSON.parse(saved) : null;
                const correct = parsed?.correctOptionId;

                if (correct) {
                    setCorrectOptionId(correct);
                    setSubmitted(true);
                    // wrong tha tab modal open karo
                    if (finalOption?.toString() !== correct?.toString()) {
                        setShowModal(true);
                    }
                } else {
                    setSubmitted(true);
                }
            }


        } catch (e) {
            console.log('Quiz submit error:', e);
            showError('Network error — please try again');
        } finally {
            setSubmitting(false);
        }
    };

    // Timer format → 2:30
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Timer color
    const timerColor = timeLeft <= 30 ? 'red' : timeLeft <= 60 ? 'orange' : COLOURS.primary;

    // Option color after submit
    const getOptionColor = (optionId) => {
        if (!submitted) return selectedOption === optionId ? COLOURS.primary : COLOURS.black;
        if (optionId === correct_id) return 'green';
        if (optionId === selectedOption) return 'red';
        return COLOURS.black;
    };

    // Fallback
    if (!question || !options || options.length === 0) {
        return (
            <View style={[styles.fallback, { backgroundColor: COLOURS.light_primary, }]}>
                <Text style={[styles.fallback_text, { color: COLOURS.grey }]}>📝 Quiz is Coming Soon...</Text>
            </View>
        );
    }

    return (
        <FadeDown>
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, { backgroundColor: COLOURS.light_primary, }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={globalImages.app_logo}
                            style={{ height: responsiveWidth(6), width: responsiveWidth(6) }}
                            tintColor={COLOURS.primary} />
                        <Text style={[styles.header_text, { color: COLOURS.primary }]}>
                            {schedule}
                        </Text>
                    </View>
                    <Text style={[styles.header_text, { color: COLOURS.grey }]}>Quiz</Text>
                </View>

                {/* Timer */}
                <View style={styles.timer_row}>
                    <Text style={[styles.timer_text, { color: timerColor }]}>
                        ⏱ {formatTime(timeLeft)}
                    </Text>
                    {submitted && (
                        <Text style={{
                            fontFamily: Fonts.Medium,
                            fontSize: responsiveFontSize(1.6),
                            color: selectedOption === correct_id ? 'green' : 'red',
                        }}>
                            {selectedOption === correct_id ? 'Correct!' : 'Wrong Answer!'}
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
                        {question.slice(0, 120)}
                    </Text>
                </View>

                {/* Options */}
                {options.map((option) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        key={option.id}
                        disabled={submitted} // lock after submit
                        onPress={() => handleSelectOption(option.id)}
                        style={styles.option_row}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={
                                    submitted
                                        ? (option.id === correct_id || option.id === selectedOption)
                                            ? globalImages.select
                                            : globalImages.unselect
                                        : selectedOption === option.id
                                            ? globalImages.select
                                            : globalImages.unselect
                                }
                                style={{ height: responsiveWidth(5), width: responsiveWidth(5) }}
                                tintColor={getOptionColor(option.id)}
                            />
                            <Text style={{
                                paddingLeft: responsiveWidth(3),
                                fontSize: responsiveFontSize(1.6),
                                width: '87%',
                                textTransform: 'capitalize',
                                fontFamily: selectedOption === option.id ? Fonts.Regular : Fonts.Medium,
                                color: getOptionColor(option.id),
                            }}>
                                {option.text.slice(0, 50)}
                            </Text>
                        </View>

                        {/* Right side icon after submit */}
                        {submitted && option.id.toString() === correct_id && (
                            <PlayLottie source={globalImages.check_icon_json} size={responsiveWidth(6)} />
                        )}

                        {submitted && option.id.toString() === selectedOption?.toString() && selectedOption?.toString() !== correct_id && (
                            <PlayLottie source={globalImages.cross_icon} size={responsiveWidth(6)} />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Submit Button — sirf tab dikhe jab option select ho aur submit na hua ho */}
                {selectedOption && !submitted && (
                    <TouchableOpacity
                        onPress={() => handleSubmit()}
                        disabled={submitting}
                        style={[[styles.submit_btn, { backgroundColor: COLOURS.primary, }], submitting && { opacity: 0.6 }]}
                    >
                        <Text style={[styles.submit_text,{color: COLOURS.white,}]}>
                            {submitting ? 'Submitting...' : 'Submit Answer'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Divider + Reactions */}
                <View style={{ width: '91%', height: responsiveWidth(.2), backgroundColor: COLOURS.grey, marginTop: responsiveWidth(3), alignSelf: 'center' }} />

                <View style={{
                    marginLeft: responsiveWidth(4), marginTop: responsiveWidth(2.5), flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Reaction
                            isHeart
                            contentId={item.id}
                            isLiked={item.isLiked}
                            count={item.likesCount}
                        />
                        <Reaction source={globalImages.comment} count={commentsCount} onPress={() => setShowComments(true)} />

                        <Reaction
                            isBookmark
                            contentId={item.id}
                            initialBookmarked={item.isArchived}
                        />
                    </View>

                    <View>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate(UserRoutes.Weekly_Winners)} style={{
                            backgroundColor: COLOURS.light_green, padding: responsiveWidth(1),
                            paddingHorizontal: responsiveWidth(2), borderRadius: responsiveWidth(20)
                        }}>
                            <Text style={{
                                fontSize: responsiveFontSize(1.5), fontFamily: Fonts.Medium, textTransform: 'capitalize', color: COLOURS.black,
                                top: responsiveWidth(.4)
                            }}>
                                weekly winners
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <ExplanationModal
                    visible={showModal}
                    explanation={explanation}
                    onClose={() => setShowModal(false)}
                />
                <CommentSheet
                    isOpen={showComments}
                    onClose={() => setShowComments(false)}
                    postId={item?.id}
                    onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                    onCommentDeleted={() => setCommentsCount(prev => prev - 1)}
                />
            </TouchableOpacity>
        </FadeDown>
    );
};

export default QuizCard;

const styles = StyleSheet.create({
    card: {
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
});