import React, { useState } from 'react';
import Header from '../../../components/Header';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Archives = () => {

    const { theme: COLOURS, isDark } = useTheme();
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const formatDisplayDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        console.log('Selected Date:', day.dateString); // 2026-04-03 format — API 
    };

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    {/*  */}
                    <Header title={'archives'} />

                    {/* Calendar */}
                    <View style={[styles.calendar_box, { backgroundColor: COLOURS.white, }]}>
                        <Calendar
                            current={today}
                            onDayPress={handleDateSelect}
                            renderArrow={(direction) => (
                                <Text style={{ color: COLOURS.primary, fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-Bold' }}>
                                    {direction === 'left' ? '‹' : '›'}
                                </Text>
                            )}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: COLOURS.primary,
                                }
                            }}
                            theme={{
                                backgroundColor: COLOURS.white,
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

                    {/* Selected Date */}
                    <Text style={[styles.selected_date,{color: COLOURS.black,}]}>
                        {formatDisplayDate(selectedDate)}
                    </Text>

                    {/* No Content */}
                    <View style={styles.empty_area}>
                        <Text style={[styles.empty_icon,{color: COLOURS.primary,}]}>𝌮</Text>
                        <Text style={[styles.empty_text, { color: COLOURS.primary, }]}>No content available for this date</Text>
                    </View>

                </View>
            </SafeAreaView>
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
        fontSize: responsiveFontSize(2),
        marginTop: responsiveWidth(6),
    },
    empty_area: {
        alignItems: 'center',
        marginTop: responsiveWidth(8),
    },
    empty_icon: {
        fontSize: responsiveFontSize(5),
        marginBottom: responsiveWidth(3),
    },
    empty_text: {
        fontFamily: 'Poppins-Medium',
        fontSize: responsiveFontSize(1.8),  
        textAlign: 'center',
    },
});