import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
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
import { Pulse } from '../../../components/Pulse';

// ─── Constants ──────────────────────────────────────────────────────────────

const DAILY_NOTE = 'Updates as users attempt quizzes. Final winner announced today.';
const WEEKLY_NOTE = 'Updates as users attempt quizzes. Final winner announced on Monday.';

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

const formatDateTag = (dateStr) => {
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
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

const WinnerRow = ({ item, index, isLast, showTrophy, scoreTotal = 7, hideScore = false }) => {
    const { theme: COLOURS } = useTheme();
    const rank = item.rank ?? index + 1;
    const medal = getMedalEmoji(rank);
    const color = avatarColors[index % avatarColors.length];

    const firstLetter = item.userName ? item.userName.charAt(0).toUpperCase() : '?';
    const hasImage = item.profilePicture && item.profilePicture.trim() !== '';

    const scoreValue = item.score ?? item.correctAnswers;
    const subLabel = scoreValue !== undefined ? `${scoreValue} correct answers` : item.email;

    return (
        <FadeUp>
            <View style={[styles.winnerRow, isLast && { borderBottomWidth: 0 }]}>
                <View style={styles.rankBox}>
                    {medal ? (
                        <Text style={styles.medalEmoji}>{medal}</Text>
                    ) : (
                        <Text style={[styles.rankText, { color: COLOURS.grey }]}>{rank}</Text>
                    )}
                </View>

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

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(1.5) }}>
                        <Text style={[styles.winnerName, { color: COLOURS.black }]}>{item.userName || item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.winnerSub, { color: COLOURS.grey }]} numberOfLines={1}>{subLabel}</Text>
                        {showTrophy &&
                            <Pulse>
                                <Text style={{ fontSize: responsiveFontSize(2) }}>
                                    🏆
                                </Text>
                            </Pulse>
                        }
                    </View>
                </View>

                {!hideScore && scoreValue !== undefined && (
                    <Text style={[styles.winnerScore, { color: COLOURS.primary }]}>{scoreValue}{`/${scoreTotal}`}</Text>
                )}

            </View>
        </FadeUp>
    );
};

// ─── Leaderboard Card ──────────────────────────────────────────────────────

const LeaderboardCard = ({ title, weekData, show, fallbackMessage = 'No top 3 yet.', topTrophy = false, scoreTotal = 7, hideTopScore = false }) => {
    const { theme: COLOURS } = useTheme();

    if (!weekData) return null;

    const { week, year, date, top3, allParticipants, winner } = weekData;

    // currentWeek -> week is a flat number (25), year is flat (2026).
    // weekly/weeklyWinner -> week is an object { weekNumber, year, start, end }.
    const weekNum = typeof week === 'object' ? week?.weekNumber : week;
    const weekYear = typeof week === 'object' ? week?.year : year;

    const tagLabel = weekNum && weekYear
        ? `Week ${weekNum}, ${weekYear}`
        : date
            ? formatDateTag(date)
            : '';

    // currentWeek/last10Days send a top3 array.
    // daily/weekly winner endpoints send a single `winner` object (or null) -> wrap as a 1-item list.
    const topList = top3 ?? (winner ? [{ ...winner, rank: 1 }] : []);

    return (
        <>
            {/* ── Top Card ── */}
            {show !== false ? (<FadeIn delay={300}>
                <View style={[styles.card, { marginTop: responsiveWidth(3), borderColor: COLOURS.grey }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Title_Here title={title} marginTop={0} />
                        <View style={[styles.cardHeader, { borderBottomColor: COLOURS.light_grey }]}>
                            <View style={[styles.weekTag, { borderColor: COLOURS.grey, backgroundColor: COLOURS.light_primary }]}>
                                <Text style={[styles.weekTagText, { color: COLOURS.grey }]}>
                                    {tagLabel}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {topList?.length > 0 ? (
                        topList.map((item, index) => (
                            <WinnerRow
                                key={`top-${item.userId}-${index}`}
                                item={item}
                                index={index}
                                isLast={index === topList.length - 1}
                                showTrophy={topTrophy}
                                scoreTotal={scoreTotal}
                                hideScore={hideTopScore}
                            />
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: COLOURS.grey, paddingHorizontal: responsiveWidth(4), paddingBottom: responsiveWidth(3) }]}>{fallbackMessage}</Text>
                    )}
                </View>
            </FadeIn>) : ''}

            {/* ── All Participants Card ── */}
            <FadeIn delay={450}>
                <View style={[styles.card, { marginTop: responsiveWidth(3), borderColor: COLOURS.grey }]}>
                    <View style={[styles.cardHeader, { borderBottomColor: COLOURS.light_grey }]}>
                        <Text style={[styles.leaderboardTitle, { color: COLOURS.black }]}>All Participants</Text>
                        <View style={[styles.weekTag, { borderColor: COLOURS.grey, backgroundColor: COLOURS.light_primary }]}>
                            <Text style={[styles.weekTagText, { color: COLOURS.grey }]}>
                                {tagLabel}
                            </Text>
                        </View>
                    </View>
                    {allParticipants?.length > 0 ? (
                        allParticipants?.map((item, index) => (
                            <WinnerRow
                                key={`all-${item.userId}-${index}`}
                                item={item}
                                index={index}
                                isLast={index === allParticipants?.length - 1}
                                scoreTotal={scoreTotal}
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
    const [selectedTab, setSelectedTab] = useState('all'); // 'all' | 'daily' | 'dailyWinner' | 'weekly' | 'weeklyWinner' | 'last10'

    useEffect(() => {
        loadData('all');
    }, []);

    const loadData = async (tab) => {
        setLoading(true);

        let winnersCall;
        switch (tab) {
            case 'last10':
                winnersCall = fetchWeeklyWinners({ days: 10 });
                break;
            case 'daily':
                winnersCall = fetchWeeklyWinners({ daily: true });
                break;
            case 'dailyWinner':
                winnersCall = fetchWeeklyWinners({ daily: true, winner: true });
                break;
            case 'weekly':
                winnersCall = fetchWeeklyWinners({ weekly: true });
                break;
            case 'weeklyWinner':
                winnersCall = fetchWeeklyWinners({ weekly: true, winner: true });
                break;
            default:
                winnersCall = fetchWeeklyWinners(); // 'all'
        }

        const [scoreRes, winnersRes] = await Promise.all([
            fetchWeeklyScore(),
            winnersCall,
        ]);

        if (scoreRes.success) setScoreData(scoreRes.data);
        if (winnersRes.success) setWinnersData(winnersRes.data);
        setLoading(false);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        loadData(tab);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: COLOURS.light_primary }]}>
            <Back_Arrow label={'Past winners'} />

            <ScoreBar scoreData={scoreData} />
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
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                        <View style={styles.row_filters}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('all')}
                                style={[styles.row_status, {
                                    width: responsiveWidth(12),
                                    borderColor: selectedTab === 'all' ? COLOURS.primary : COLOURS.grey,
                                    backgroundColor: selectedTab === 'all' ? COLOURS.primary : 'transparent',
                                }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'all' ? COLOURS.white : COLOURS.black }]}>
                                    All
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('daily')}
                                style={[styles.row_status, {
                                    width: responsiveWidth(15),
                                    marginLeft: responsiveWidth(3),
                                    borderColor: selectedTab === 'daily' ? COLOURS.primary : COLOURS.grey,
                                    backgroundColor: selectedTab === 'daily' ? COLOURS.primary : 'transparent',
                                }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'daily' ? COLOURS.white : COLOURS.black }]}>
                                    Daily
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('dailyWinner')}
                                style={[styles.row_status, {
                                    width: responsiveWidth(24),
                                    marginLeft: responsiveWidth(3),
                                    borderColor: selectedTab === 'dailyWinner' ? COLOURS.primary : COLOURS.grey,
                                    backgroundColor: selectedTab === 'dailyWinner' ? COLOURS.primary : 'transparent',
                                }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'dailyWinner' ? COLOURS.white : COLOURS.black }]}>
                                    Daily winner
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('weekly')}
                                style={[styles.row_status, {
                                    width: responsiveWidth(18),
                                    marginLeft: responsiveWidth(3),
                                    borderColor: selectedTab === 'weekly' ? COLOURS.primary : COLOURS.grey,
                                    backgroundColor: selectedTab === 'weekly' ? COLOURS.primary : 'transparent',
                                }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'weekly' ? COLOURS.white : COLOURS.black }]}>
                                    weekly
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('weeklyWinner')}
                                style={[styles.row_status, {
                                    width: responsiveWidth(28),
                                    marginLeft: responsiveWidth(3),
                                    borderColor: selectedTab === 'weeklyWinner' ? COLOURS.primary : COLOURS.grey,
                                    backgroundColor: selectedTab === 'weeklyWinner' ? COLOURS.primary : 'transparent',
                                }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'weeklyWinner' ? COLOURS.white : COLOURS.black }]}>
                                    Weekly winner
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleTabChange('last10')} style={[styles.row_status, {
                                marginLeft: responsiveWidth(3),
                                width: responsiveWidth(24),
                                borderColor: selectedTab === 'last10' ? COLOURS.primary : COLOURS.grey,
                                backgroundColor: selectedTab === 'last10' ? COLOURS.primary : 'transparent',
                            }]}>
                                <Text style={[styles.text_here, { color: selectedTab === 'last10' ? COLOURS.white : COLOURS.black }]}>
                                    Past 10 Days
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Leaderboard */}
                    {selectedTab === 'all' ? (
                        <>
                            <LeaderboardCard
                                title="This week"
                                weekData={winnersData?.currentWeek}
                            />
                            <LeaderboardCard
                                title="Last 10 Days"
                                weekData={winnersData?.last10Days}
                            />
                        </>
                    ) : selectedTab === 'daily' ? (
                        <LeaderboardCard
                            title="Today"
                            weekData={winnersData?.daily}
                            show={false}
                            scoreTotal={1}
                        />
                    ) : selectedTab === 'dailyWinner' ? (
                        <LeaderboardCard
                            title="Today's Winner"
                            weekData={winnersData?.daily}
                            fallbackMessage={DAILY_NOTE}
                            topTrophy
                            scoreTotal={1}
                            hideTopScore
                        />

                    ) : selectedTab === 'weekly' ? (
                        <LeaderboardCard
                            title="Weekly Participants"
                            weekData={winnersData?.weekly}
                            show={false}
                        />
                    ) : selectedTab === 'weeklyWinner' ? (
                        <LeaderboardCard
                            title="Weekly Winner"
                            weekData={winnersData?.weekly}
                            fallbackMessage={WEEKLY_NOTE}
                            topTrophy
                            hideTopScore
                        />
                    ) : (
                        <LeaderboardCard
                            title="Last 10 Days"
                            weekData={winnersData?.last10Days}
                            show={false}
                        />
                    )}
                </ScrollView>
            )
            }
        </SafeAreaView>
    );
};

export default Weekly_Winners;

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    loaderContainer: {
        marginTop: responsiveWidth(5),
    },

    row_filters: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: responsiveWidth(5),
        marginLeft: responsiveWidth(5),
        marginRight: responsiveWidth(3),
    },

    row_status: {
        borderWidth: responsiveWidth(.4),
        height: responsiveWidth(7),
        width: responsiveWidth(15),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsiveWidth(2),
    },

    text_here: {
        textAlign: 'center',
        fontSize: responsiveFontSize(1.5),
    },

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