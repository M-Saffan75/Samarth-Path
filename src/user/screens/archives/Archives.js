import Header from '../../../components/Header';
import { Calendar } from 'react-native-calendars';
import Collapsible from 'react-native-collapsible';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { View, Text, StyleSheet, StatusBar, ScrollView, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { fetchArchive } from '../mypath/mypathbackend/MyPathBackend';
import { useFocusEffect } from '@react-navigation/native';
import ImageCard from '../../../components/ImageCard';
import VideoCard from '../../../components/VideoCard';
import QuizCard from '../../../components/QuizCard';
import { Pulse } from '../../../components/Pulse';
import LottieView from 'lottie-react-native';
import { Fonts } from '../../../assets/fonts/Fonts';
import { FadeUp } from '../../../components/FadeUp';
import Button from '../../../components/Button';
import UserRoutes from '../../user_routes/UserRoutes';

const Archives = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const [calendarVisible, setCalendarVisible] = useState(true);
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false)
    
    useEffect(() => {
        getArchiveData(selectedDate);
    }, [selectedDate]);


    // ✅ date param added so it works for both focus & date-select calls
    const getArchiveData = async (date, isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const res = await fetchArchive(date);

            if (res?.success) {
                const items = res?.data?.data || [];

                // ✅ Home jaisi normalization
                const normalized = items.map((item) => {
                    if (!item) return null;
                    return {
                        id: item?._id,
                        type: item?.contentType === 'text' ? 'image' : item?.contentType,
                        // Video
                        video: item?.videoContent?.videoUrl || null,
                        thumbnail: item?.videoContent?.thumbnail || null,
                        isAutoMute: item?.videoContent?.isAutoMute ?? true,
                        hasListenOnlyMode: item?.videoContent?.hasListenOnlyMode ?? false,

                        // Text/Image
                        image: item?.textContent?.image || null,
                        title: item?.textContent?.title || null,
                        description: item?.textContent?.description || null,
                        label: item?.textContent?.label || null,

                        schedule: item?.videoContent?.title || item?.textContent?.title || item?.quizContent?.title || '',
                        title: item?.videoContent?.title || item?.textContent?.title || item?.quizContent?.title || '',
                        description: item?.videoContent?.description || item?.textContent?.description || '',

                        // Quiz
                        question: item?.quizContent?.question || null,
                        options: item?.quizContent?.options || [],
                        correctOptionId: item?.quizContent?.correctOptionId || null,
                        timerSeconds: item?.quizContent?.timerSeconds || 180,
                        explanation: item?.quizContent?.explanation || '',
                        quizAttempt: item?.quizAttempt || null,
                        // Common
                        likesCount: item?.likesCount || 0,
                        commentsCount: item?.commentsCount || 0,
                        isLiked: item?.isLiked || false,
                        isBookmarked: item?.isBookmarked || false,
                        isUnlocked: item?.isUnlocked || false,
                        unlocksAt: item?.unlocksAt || null,
                        contentType: item?.contentType,
                    };
                }).filter(Boolean);

                if (normalized.length > 0) {
                    setContentList(normalized); // ✅ yeh add karo — missing tha!
                    setIsCollapsed(true);
                } else {
                    setContentList([]); // ✅ yeh bhi
                    setIsCollapsed(false);
                }

            } else {
                setContentList([]);
            }

        } catch (err) {
            console.log('Archive error:', err);
            setContentList([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ✅ Moved out of handleDateSelect
    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        getArchiveData(day.dateString);
    };

    // ✅ Moved out of handleDateSelect
    const onRefresh = () => {
        getArchiveData(selectedDate, true);
    };

    // ✅ Moved out of handleDateSelect
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day); // ✅ local timezone
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    // ✅ Moved out of handleDateSelect
    const renderItem = ({ item }) => {
        if (item?.contentType === 'video') return <VideoCard
            navigation={navigation}
            item={item}
            activeVideoId={activeVideoId}
            setActiveVideoId={setActiveVideoId}
            onUnbookmark={(id) => setVideos(prev => prev.filter(v => v.id !== id))}
        />;
        if (item?.contentType === 'text') return <ImageCard navigation={navigation} item={item} />;
        // if (item?.contentType === 'quiz') return <QuizCard item={item} navigation={navigation} />;
        if (item?.contentType === 'quiz')
            return (
                <FadeUp>
                    <View style={[styles.quiz_card, { backgroundColor: COLOURS.light_primary, marginTop: responsiveWidth(3) }]}>
                        <View style={styles.row_quiz}>
                            <View style={[styles.quiz_bg, { backgroundColor: COLOURS.light_grey }]} >
                                <Image source={globalImages.quiz_icon} style={styles.quiz_img} tintColor={COLOURS.primary} />
                            </View>
                            <Text style={[styles.title_quiz, { color: COLOURS.black }]}>Afternoon Quiz</Text>
                        </View>
                        <Text style={[styles.info_quiz, { color: COLOURS.black }]}>Test your understanding of mindfulness, Inner peace,
                            and personal growth with a quick Quiz.</Text>

                        <View style={styles.row_cards}>

                            <View style={[styles.card_here]}>
                                <View style={[styles.card_here_mini]}>
                                    <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                        <Image source={globalImages.clock_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                                    </View>
                                    <Text style={[styles.icon_text, { color: COLOURS.black }]}>3 Minutes</Text>
                                </View>
                                <View style={{
                                    borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                                    height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                                }} />
                            </View>

                            <View style={[styles.card_here]}>
                                <View style={[styles.card_here_mini]}>
                                    <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                        <Image source={globalImages.question_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                                    </View>
                                    <Text style={[styles.icon_text, { color: COLOURS.black }]}>1 Question</Text>
                                </View>
                                <View style={{
                                    borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                                    height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                                }} />
                            </View>

                            <View style={[styles.card_here]}>
                                <View style={[styles.card_here_mini]}>
                                    <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                        <Image source={globalImages.options_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                                    </View>
                                    <Text style={[styles.icon_text, { color: COLOURS.black }]}>4 Options</Text>
                                </View>
                                <View style={{
                                    borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                                    height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                                }} />
                            </View>

                            <View style={[styles.card_here]}>
                                <View style={[styles.card_here_mini]}>
                                    <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                        <Image source={globalImages.win_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                                    </View>
                                    <Text style={[styles.icon_text, { color: COLOURS.black }]}>Instant Result</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.bottom_line, { backgroundColor: COLOURS.grey }]} navigation={navigation} />
                        <Button label={'start quiz  ➞'}
                            onPress={() => navigation.navigate(UserRoutes.QuizCard, {
                                item, onAttemptComplete: (attemptData) => updateQuizAttempt(item.id, attemptData)
                            })}
                            width={responsiveWidth(80)}
                            paddingVertical={responsiveWidth(3)} alignSelf={'center'} />
                    </View>
                </FadeUp>
            )
        return null;
    };


    const updateQuizAttempt = (itemId, attemptData) => {
        setContentList(prev => prev.map(content =>
            content.id === itemId
                ? { ...content, quizAttempt: attemptData }
                : content
        ));
    };

    return (

        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>
                    <Header title={'Archives'} />
                    {/* Calendar — collapse hoga jab data aaye */}

                    <TouchableOpacity
                        onPress={() => setIsCollapsed(prev => !prev)}
                        activeOpacity={0.8}
                        style={[styles.calendar_toggle,
                        { borderBottomColor: COLOURS.light_grey, backgroundColor: COLOURS.light_grey }

                        ]}
                    >
                        <Text style={[styles.selected_date, { color: COLOURS.black }]}>
                            {formatDisplayDate(selectedDate)}
                        </Text>
                        {isCollapsed ? <LottieView source={globalImages.arrow_icon}
                            style={{ width: responsiveWidth(6), height: responsiveWidth(6) }} autoPlay />
                            :
                            <LottieView source={globalImages.arrow_icon}
                                style={{ width: responsiveWidth(6), height: responsiveWidth(6) }} autoPlay />

                        }
                    </TouchableOpacity>


                    <Collapsible collapsed={isCollapsed}>
                        <View style={[styles.calendar_box, { backgroundColor: COLOURS.white }]}>
                            <Calendar
                                key={isDark ? 'dark' : 'light'}
                                current={today}
                                onDayPress={handleDateSelect}
                                renderArrow={(direction) => (
                                    <Text style={[styles.arrow, { color: COLOURS.primary }]}>
                                        {direction === 'left' ? '‹' : '›'}
                                    </Text>
                                )}
                                markedDates={{
                                    [selectedDate]: {
                                        selected: true,
                                        selectedColor: COLOURS.primary,
                                    },
                                }}
                                theme={{
                                    calendarBackground: COLOURS.white,
                                    textSectionTitleColor: COLOURS.light_black,
                                    selectedDayBackgroundColor: COLOURS.primary,
                                    selectedDayTextColor: COLOURS.white,
                                    todayTextColor: COLOURS.primary,
                                    dayTextColor: COLOURS.black,
                                    textDisabledColor: COLOURS.light_grey,
                                    monthTextColor: COLOURS.black,
                                    textDayFontFamily: 'Poppins-Medium',
                                    textMonthFontFamily: 'Poppins-Bold',
                                    textDayHeaderFontFamily: 'Poppins-Medium',
                                    textDayFontSize: responsiveFontSize(1.8),
                                    textMonthFontSize: responsiveFontSize(2),
                                    textDayHeaderFontSize: responsiveFontSize(1.6),
                                }}
                            />
                        </View>

                    </Collapsible>

                    {loading ? (
                        <View style={[styles.center, { marginTop: responsiveWidth(3) }]}>
                            <ActivityIndicator size="large" color={COLOURS.primary} />
                        </View>
                    ) : contentList.length === 0 ? (
                        <View style={[styles.center, { marginTop: responsiveWidth(5) }]}>
                            <Pulse>
                                <Text style={[styles.empty_icon, { color: COLOURS.primary }]}>𝌮</Text>
                            </Pulse>
                            <Text style={[styles.empty_text, { color: COLOURS.primary }]}>
                                No content available for this date
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={contentList}
                            keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
                            // keyExtractor={(item) => item?._id?.toString() ?? Math.random().toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            onScrollBeginDrag={() => setActiveVideoId(null)}
                            contentContainerStyle={{ paddingBottom: responsiveWidth(15) }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[COLOURS.primary]}
                                    tintColor={COLOURS.primary}
                                    progressBackgroundColor={COLOURS.light_primary}
                                />
                            }
                        />
                    )}
                </View>
            </SafeAreaView >
        </>
    );
};

export default Archives;

const styles = StyleSheet.create({

    bottom_line: {
        width: '94%',
        left: responsiveWidth(2),
        marginTop: responsiveWidth(3),
        height: responsiveWidth(.1),
    },

    row_cards: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: responsiveWidth(3),
    },

    main_icon_bg: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(8),
        height: responsiveWidth(8),
        borderRadius: responsiveWidth(100),
    },

    icon_bg: {
        height: responsiveWidth(5),
        width: responsiveWidth(5),
    },

    card_here: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: responsiveWidth(3),
    },


    card_here_mini: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon_text: {
        fontFamily: Fonts.Medium,
        paddingTop: responsiveWidth(1),
        fontSize: responsiveFontSize(1.4),
    },

    row_quiz: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    quiz_card: {
        borderRadius: responsiveWidth(4),
        marginHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(4),
        paddingHorizontal: responsiveWidth(3),
    },

    info_quiz: {
        // backgroundColor:'red'  ,
        textTransform: 'none',
        fontFamily: Fonts.Medium,
        marginTop: responsiveWidth(2),
        fontSize: responsiveFontSize(1.6),
    },

    title_quiz: {
        width: responsiveWidth(50),
        fontFamily: Fonts.Medium,
        marginLeft: responsiveWidth(3),
        fontSize: responsiveFontSize(2),
    },

    quiz_bg: {
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(100),
    },

    quiz_img: {
        height: responsiveWidth(6),
        width: responsiveWidth(6),
    },

    // 

    container: {
        height: '100%',
        width: '100%',
    },

    calendar_box: {
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(4),
        marginBottom: responsiveWidth(2),
        borderRadius: responsiveWidth(5),
        overflow: 'hidden',

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
    },
    selected_date: {
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
        fontSize: responsiveFontSize(2),
        marginTop: responsiveWidth(6),
    },
    empty_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(8),
    },
    arrow: {
        justifyContent: 'center',
        // backgroundColor:'red',
        fontSize: responsiveFontSize(3),
        // paddingHorizontal: responsiveWidth(2),
    },
    calendar_toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 0.5,
    },
    toggle_arrow: {
        fontSize: responsiveFontSize(2.4),
        fontFamily: 'Poppins-Bold',
    },
    selected_date: {
        marginTop: responsiveWidth(2),
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.8),

    },
    empty_icon: {
        alignSelf: 'center',
        fontSize: responsiveFontSize(5),
        marginBottom: responsiveWidth(3),
    },
    empty_text: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center',
    },
});