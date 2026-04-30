import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Reaction from './Reaction';
import { Fonts } from '../assets/fonts/Fonts';
import { COLOURS } from '../assets/theme/Theme';
import { globalImages } from '../assets/images/images_file/All_Images';
import UserRoutes from '../user/user_routes/UserRoutes';

const QUIZ_STORAGE_KEY = 'quiz_state_';
const QuizCard = ({ item, onPress, navigation }) => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [loading, setLoading] = useState(true); // pehle load karo

    const timerRef = useRef(null);
    const storageKey = QUIZ_STORAGE_KEY + item?.id; // har quiz ka alag key
    const todayDate = new Date().toDateString(); //
    const question = item?.question;
    const options = item?.options;
    const correct_id = item?.correct_id;
    const schedule = item?.schedule || 'afternoon';

    // ─── App open hone par saved state load karo ───────────────
    useEffect(() => {
        const loadSavedState = async () => {
            try {
                const saved = await AsyncStorage.getItem(storageKey);
                if (saved) {
                    const parsed = JSON.parse(saved);

                    // Check karo — aaj ka hai ya purana?
                    if (parsed.date === todayDate) {
                        // Aaj ka saved state → restore karo
                        setSelectedOption(parsed.selectedOption);
                        setSubmitted(parsed.submitted);
                        setTimeLeft(parsed.timeLeft ?? 0);
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
        if (loading) return;       // load hone tak wait karo
        if (submitted) return;     // submit ho gaya → timer band
        if (timeLeft <= 0) {       // time khatam → auto submit
            handleSubmit();
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                // Har second AsyncStorage update karo
                saveState(selectedOption, false, newTime);
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [loading, submitted, timeLeft]);

    // ─── State save karo AsyncStorage mein ────────────────────
    const saveState = async (option, isSubmitted, time) => {
        try {
            const stateToSave = {
                date: todayDate,
                selectedOption: option,
                submitted: isSubmitted,
                timeLeft: time,
            };
            await AsyncStorage.setItem(storageKey, JSON.stringify(stateToSave));
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
    const handleSubmit = async () => {
        clearInterval(timerRef.current);
        setSubmitted(true);
        await saveState(selectedOption, true, 0); // submit save karo
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
            <View style={styles.fallback}>
                <Text style={styles.fallback_text}>📝 Quiz is Coming Soon...</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>

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
                            source={selectedOption === option.id ? globalImages.select : globalImages.unselect}
                            style={{ height: responsiveWidth(5), width: responsiveWidth(5) }}
                            tintColor={getOptionColor(option.id)}
                        />
                        <Text style={{
                            paddingLeft: responsiveWidth(3),
                            fontSize: responsiveFontSize(1.6),
                            textTransform: 'capitalize',
                            fontFamily: selectedOption === option.id ? Fonts.Regular : Fonts.Medium,
                            color: getOptionColor(option.id),
                        }}>
                            {option.text.slice(0, 50)}
                        </Text>
                    </View>

                    {/* Right side icon after submit */}
                    {submitted && option.id === correct_id && (
                        <Text style={{ fontSize: responsiveFontSize(2) }}>✅</Text>
                    )}
                    {submitted && option.id === selectedOption && selectedOption !== correct_id && (
                        <Text style={{ fontSize: responsiveFontSize(2) }}>❌</Text>
                    )}
                </TouchableOpacity>
            ))}

            {/* Submit Button — sirf tab dikhe jab option select ho aur submit na hua ho */}
            {selectedOption && !submitted && (
                <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.submit_btn}
                >
                    <Text style={styles.submit_text}>Submit Answer</Text>
                </TouchableOpacity>
            )}

            {/* Divider + Reactions */}
            <View style={{ width: '91%', height: responsiveWidth(.2), backgroundColor: COLOURS.grey, marginTop: responsiveWidth(3), alignSelf: 'center' }} />

            <View style={{
                marginLeft: responsiveWidth(4), marginTop: responsiveWidth(2.5), flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Reaction source={globalImages.heart_filled} count={22} tintColor={COLOURS.red} />
                    <Reaction source={globalImages.comment} count={12} />
                    <Reaction source={globalImages.save_icon} count={2} />
                </View>

                <View>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate(UserRoutes.Weekly_Winners)} style={{
                        backgroundColor: COLOURS.light_green, padding: responsiveWidth(1),
                        paddingHorizontal: responsiveWidth(2), borderRadius: responsiveWidth(20)
                    }}>
                        <Text style={{
                            fontSize: responsiveFontSize(1.5), fontFamily: Fonts.Medium, textTransform: 'capitalize', color: COLOURS.white,
                            top: responsiveWidth(.4)
                        }}>
                            weekly winners
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

        </TouchableOpacity>
    );
};

export default QuizCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLOURS.light_primary,
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
        backgroundColor: COLOURS.primary,
        marginTop: responsiveWidth(4),
        marginHorizontal: responsiveWidth(2),
        paddingVertical: responsiveWidth(3),
        borderRadius: responsiveWidth(2),
        alignItems: 'center',
    },
    submit_text: {
        color: COLOURS.white,
        fontFamily: Fonts.Medium,
        fontSize: responsiveFontSize(1.8),
    },
    fallback: {
        backgroundColor: COLOURS.light_primary,
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
        color: COLOURS.grey,
    },
});