import Header from '../../../components/Header';
import { Calendar } from 'react-native-calendars';
import Collapsible from 'react-native-collapsible';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { View, Text, StyleSheet, StatusBar, ScrollView, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { fetchArchive } from '../mypath/mypathbackend/MyPathBackend';
import { useFocusEffect } from '@react-navigation/native';
import ImageCard from '../../../components/ImageCard';
import VideoCard from '../../../components/VideoCard';
import QuizCard from '../../../components/QuizCard';
import { Pulse } from '../../../components/Pulse';
import LottieView from 'lottie-react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';

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

    useFocusEffect(
        useCallback(() => {
            getArchiveData(selectedDate);
        }, [])
    );


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
        if (item?.contentType === 'video') return <VideoCard item={item} activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />;
        if (item?.contentType === 'text') return <ImageCard item={item} />;
        if (item?.contentType === 'quiz') return <QuizCard item={item} navigation={navigation} />;
        return null;
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
                        <View style={[styles.center,{marginTop:responsiveWidth(5)}]}>
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
                            keyExtractor={(item) => item?._id?.toString() ?? Math.random().toString()}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            onScrollBeginDrag={() => setActiveVideoId(null)}
                            marginBottom={responsiveWidth(15)}
                            contentContainerStyle={styles.list_content}
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
                    <View style={{ marginBottom: responsiveWidth(13) }} />
                </View>
            </SafeAreaView >
        </>
    );
};

export default Archives;

const styles = StyleSheet.create({
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
        justifyContent:'center',
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