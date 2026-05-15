import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '../../../assets/fonts/Fonts';
import { FadeUp } from '../../../components/FadeUp';
import { FadeIn } from '../../../components/FadeIn';
import { FadeDown } from '../../../components/FadeDown';
import Back_Arrow from '../../../components/Back_Arrow';
import Title_Here from '../../../components/Title_Here'; // already built component
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { fetchWeeklyWinners, fetchWeeklyScore } from './weeklybackend/WeeklyBackend'; // <-- separate api file

// ─── Avatar colors cycling ─────────────────────────────────────────────────

const avatarColors = [
    { bg: '#FFF3EB', text: '#E8935C' },
    { bg: '#F0F0F0', text: '#555555' },
    { bg: '#EAF3DE', text: '#3B6D11' },
    { bg: '#E6F1FB', text: '#185FA5' },
    { bg: '#FBEAF0', text: '#993556' },
    { bg: '#EEEDFE', text: '#534AB7' },
    { bg: '#E1F5EE', text: '#0F6E56' },
    { bg: '#FAEEDA', text: '#854F0B' },
];

const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
};

// ─── ScoreBar ──────────────────────────────────────────────────────────────

const ScoreBar = ({ scoreData }) => {
    const { theme: COLOURS } = useTheme();

    if (!scoreData) return null;

    const { totalQuestions, correctAnswers, rank } = scoreData;
    const dots = Array.from({ length: totalQuestions }, (_, i) => i < correctAnswers);

    return (
        <FadeDown>
            <View style={[styles.scoreBar, { backgroundColor: COLOURS.primary }]}>
                <View>
                    <Text style={styles.scoreBarLabel}>Your score this week</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: responsiveWidth(1) }}>
                        <Text style={[styles.scoreValue, { color: COLOURS.white, }]}>{correctAnswers}</Text>
                        <Text style={styles.scoreTotal}>/ {totalQuestions}</Text>
                    </View>
                    <View style={styles.dotsRow}>
                        {dots.map((filled, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    filled
                                        ? [styles.dotFilled, { backgroundColor: COLOURS.white }]
                                        : styles.dotEmpty,
                                ]}
                            />
                        ))}
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.scoreBarLabel}>Rank this week</Text>
                    <Text style={[styles.scoreValue, { color: COLOURS.white, }]}>#{rank}</Text>
                </View>
            </View>
        </FadeDown>
    );
};

// ─── WinnerRow ─────────────────────────────────────────────────────────────

const WinnerRow = ({ item, index, isLast }) => {
    const { theme: COLOURS } = useTheme();
    const rank = item.rank ?? index + 1;
    const medal = getMedalEmoji(rank);
    const color = avatarColors[index % avatarColors.length];

    // Profile: show image if profilePicture exists, else first letter of name
    const firstLetter = item.userName ? item.userName.charAt(0).toUpperCase() : '?';
    const hasImage = item.profilePicture && item.profilePicture.trim() !== '';

    return (
        <FadeUp>
            <View style={[styles.winnerRow, isLast && { borderBottomWidth: 0 }]}>
                {/* Rank */}
                <View style={styles.rankBox}>
                    {medal ? (
                        <Text style={styles.medalEmoji}>{medal}</Text>
                    ) : (
                        <Text style={[styles.rankText, { color: COLOURS.grey }]}>{rank}</Text>
                    )}
                </View>

                {/* Avatar */}
                {hasImage ? (
                    <Image
                        source={{ uri: item.profilePicture }}
                        style={[styles.avatar, { borderRadius: responsiveWidth(5) }]}
                    />
                ) : (
                    <View style={[styles.avatar, { backgroundColor: color.bg }]}>
                        <Text style={[styles.avatarText, { color: color.text }]}>{firstLetter}</Text>
                    </View>
                )}

                {/* Name + sub */}
                <View style={{ flex: 1 }}>
                    <Text style={[styles.winnerName, { color: COLOURS.black }]}>{item.userName}</Text>
                    <Text style={[styles.winnerSub, { color: COLOURS.grey }]}>{item.score} correct answers</Text>
                </View>

                {/* Score */}
                <Text style={[styles.winnerScore, { color: COLOURS.primary }]}>{item.score}{'/7'}</Text>
            </View>
        </FadeUp>
    );
};

// ─── Leaderboard Card ──────────────────────────────────────────────────────

// ─── Leaderboard Card ──────────────────────────────────────────────────────

const LeaderboardCard = ({ title, weekData }) => {
    const { theme: COLOURS } = useTheme();

    if (!weekData) return null;

    const { week, year, top3, allParticipants } = weekData;

    return (
        <>
            {/* ── Top 3 Card ── */}
            <FadeIn delay={300}>
                <View style={[styles.card, { marginTop: responsiveWidth(3), borderColor: COLOURS.grey }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Title_Here title={title} marginTop={0}/>
                        <View style={[styles.cardHeader, { borderBottomColor: COLOURS.light_grey }]}>
                            <View style={[styles.weekTag, { borderColor: COLOURS.grey, backgroundColor: COLOURS.light_primary }]}>
                                <Text style={[styles.weekTagText, { color: COLOURS.grey }]}>
                                    Week {week}, {year}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {top3.length > 0 ? (
                        top3.map((item, index) => (
                            <WinnerRow
                                key={`top3-${item.userId}-${index}`}
                                item={item}
                                index={index}
                                isLast={index === top3.length - 1}
                            />
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: COLOURS.grey, paddingHorizontal: responsiveWidth(4), paddingBottom: responsiveWidth(3) }]}>No top 3 yet.</Text>
                    )}
                </View>
            </FadeIn>

            {/* ── All Participants Card ── */}
            <FadeIn delay={450}>
                <View style={[styles.card, { marginTop: responsiveWidth(3), borderColor: COLOURS.grey }]}>
                    <View style={[styles.cardHeader, { borderBottomColor: COLOURS.light_grey }]}>
                        <Text style={[styles.leaderboardTitle, { color: COLOURS.black }]}>All Participants</Text>
                        <View style={[styles.weekTag, { borderColor: COLOURS.grey, backgroundColor: COLOURS.light_primary }]}>
                            <Text style={[styles.weekTagText, { color: COLOURS.grey }]}>
                                Week {week}, {year}
                            </Text>
                        </View>
                    </View>
                    {allParticipants.length > 0 ? (
                        allParticipants.map((item, index) => (
                            <WinnerRow
                                key={`all-${item.userId}-${index}`}
                                item={item}
                                index={index}
                                isLast={index === allParticipants.length - 1}
                            />
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: COLOURS.grey, paddingHorizontal: responsiveWidth(4), paddingBottom: responsiveWidth(3) }]}>No participants yet.</Text>
                    )}
                </View>
            </FadeIn>
        </>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────

const Weekly_Winners = () => {
    const { theme: COLOURS } = useTheme();

    const [scoreData, setScoreData] = useState(null);
    const [winnersData, setWinnersData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [scoreRes, winnersRes] = await Promise.all([
            fetchWeeklyScore(),
            fetchWeeklyWinners(),
        ]);

        if (scoreRes.success) setScoreData(scoreRes.data);
        if (winnersRes.success) setWinnersData(winnersRes.data);
        setLoading(false);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLOURS.light_primary }]}>
            <Back_Arrow label={'weekly winners'} />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLOURS.primary} />
                </View>
            ) : (
                <ScrollView
                    backgroundColor={COLOURS.white}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: responsiveWidth(8) }}
                >
                    {/* Score Bar */}
                    <ScoreBar scoreData={scoreData} />

                    {/* Current Week Leaderboard */}
                    <LeaderboardCard
                        title="This week"
                        weekData={winnersData?.currentWeek}
                    />

                    {/* Last Week Leaderboard */}
                    <LeaderboardCard
                        title="Last week"
                        weekData={winnersData?.lastWeek}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Weekly_Winners;

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),

        borderBottomWidth: 0.5,

    },
    headerTitle: {
        fontSize: responsiveFontSize(1.9),
        fontFamily: Fonts.Medium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Score Bar
    scoreBar: {

        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(4),
        borderRadius: responsiveWidth(4),
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(4),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    scoreBarLabel: {
        fontSize: responsiveFontSize(1.3),
        color: 'rgba(255,255,255,0.8)',
        fontFamily: Fonts.Regular,
        marginBottom: responsiveWidth(1),
    },
    scoreValue: {
        fontSize: responsiveFontSize(4),
        fontFamily: Fonts.Medium,
    },
    scoreTotal: {
        fontSize: responsiveFontSize(2),
        fontFamily: Fonts.Regular,
        color: 'rgba(255,255,255,0.75)',
    },
    rankLabel: {
        fontSize: responsiveFontSize(1.3),
        color: 'rgba(255,255,255,0.75)',
        fontFamily: Fonts.Regular,
        marginTop: responsiveWidth(1),
    },
    dotsRow: {
        flexDirection: 'row',
        gap: responsiveWidth(1.2),
        marginTop: responsiveWidth(2),
    },
    dot: {
        width: responsiveWidth(7),
        height: responsiveWidth(1.5),
        borderRadius: responsiveWidth(1),
    },
    dotFilled: {

    },
    dotEmpty: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    // Card
    card: {

        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(3),
        borderRadius: responsiveWidth(4),
        borderWidth: 0.5,
        // flexDirection:'row',
        // alignItems:'center',
        // justifyContent:'space-between',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 0.5,

    },

    // Prize
    prizeBadge: {
        backgroundColor: '#FFF3EB',
        borderRadius: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(3),
        paddingVertical: responsiveWidth(1),
    },
    prizeBadgeText: {
        fontSize: responsiveFontSize(1.3),
        fontFamily: Fonts.Medium,
    },
    prizeBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(3.5),
        padding: responsiveWidth(4),
    },
    prizeImage: {
        width: responsiveWidth(16),
        height: responsiveWidth(16),
        borderRadius: responsiveWidth(2.5),
    },
    prizeImagePlaceholder: {
        width: responsiveWidth(16),
        height: responsiveWidth(16),
        borderRadius: responsiveWidth(2.5),
        backgroundColor: '#FFF3EB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,

        flexShrink: 0,
    },
    prizeTitle: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: Fonts.Medium,

        marginBottom: responsiveWidth(1),
    },
    prizeDesc: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: Fonts.Regular,
        lineHeight: responsiveWidth(4.5),
    },

    // Leaderboard
    leaderboardTitle: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: Fonts.Medium,

    },
    weekTag: {
        borderRadius: responsiveWidth(1.5),
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(0.8),
        borderWidth: 0.5,

    },
    weekTagText: {
        fontSize: responsiveFontSize(1.3),
        fontFamily: Fonts.Regular,
    },

    // Winner Row
    winnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
        borderBottomWidth: 0.5,
        borderBottomColor: '#dcdad0',
        gap: responsiveWidth(3),
    },
    rankBox: {
        width: responsiveWidth(6),
        alignItems: 'center',
    },
    medalEmoji: {
        fontSize: responsiveFontSize(2),
    },
    rankText: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Medium,

    },
    avatar: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: Fonts.Medium,
    },
    winnerName: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Medium,

    },
    winnerSub: {
        fontSize: responsiveFontSize(1.3),
        fontFamily: Fonts.Regular,

        marginTop: responsiveWidth(0.5),
    },
    winnerScore: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Medium,

        flexShrink: 0,
    },
});