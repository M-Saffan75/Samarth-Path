import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { COLOURS } from '../../../assets/theme/Theme';
import { Fonts } from '../../../assets/fonts/Fonts';
import Back_Arrow from '../../../components/Back_Arrow';
import { FadeDown } from '../../../components/FadeDown';
import { FadeUp } from '../../../components/FadeUp';
import { FadeIn } from '../../../components/FadeIn';


const weeklyScore = {
    correct: 5,
    total: 7,
    rank: 3,
    rankLabel: 'Top 10%',
};

const prizeOfWeek = {
    image: null, // API se aayegi: { uri: '...' }
    title: '1 Month Free Subscription',
    description: 'Top scorer of the week wins a free month of Samarth Path premium access.',
};

const winners = [
    { id: 1, name: 'Aditya Jajoo', initials: 'AJ', score: 7, total: 7 },
    { id: 2, name: 'Rahul Kumar', initials: 'RK', score: 6, total: 7 },
    { id: 3, name: 'Priya Sharma', initials: 'PS', score: 6, total: 7 },
    { id: 4, name: 'Meera Verma', initials: 'MV', score: 5, total: 7 },
    { id: 5, name: 'Suresh Kapoor', initials: 'SK', score: 5, total: 7 },
    { id: 6, name: 'Anita Nair', initials: 'AN', score: 4, total: 7 },
    { id: 7, name: 'Vikram Rao', initials: 'VR', score: 4, total: 7 },
    { id: 8, name: 'Divya Patel', initials: 'DP', score: 3, total: 7 },
    { id: 9, name: 'Karan Mehta', initials: 'KM', score: 3, total: 7 },
    { id: 10, name: 'Sneha Tiwari', initials: 'ST', score: 2, total: 7 },
];

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

// ─── Sub Components ────────────────────────────────────────────────────────

const ScoreBar = ({ score, total, rank, rankLabel }) => {
    const dots = Array.from({ length: total }, (_, i) => i < score);

    return (
        <FadeDown>
            <View style={styles.scoreBar}>
                <View>
                    <Text style={styles.scoreBarLabel}>Your score this week</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: responsiveWidth(1) }}>
                        <Text style={styles.scoreValue}>{score}</Text>
                        <Text style={styles.scoreTotal}>/ {total}</Text>
                    </View>
                    <View style={styles.dotsRow}>
                        {dots.map((filled, i) => (
                            <View
                                key={i}
                                style={[styles.dot, filled ? styles.dotFilled : styles.dotEmpty]}
                            />
                        ))}
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.scoreBarLabel}>Rank this week</Text>
                    <Text style={styles.scoreValue}>#{rank}</Text>
                    <Text style={styles.rankLabel}>{rankLabel}</Text>
                </View>
            </View>
        </FadeDown>
    );
};

// const PrizeCard = ({ prize }) => (
//     <View style={styles.card}>
//         <View style={styles.cardHeader}>
//             <View style={styles.prizeBadge}>
//                 <Text style={styles.prizeBadgeText}>Prize of the Week</Text>
//             </View>
//         </View>
//         <View style={styles.prizeBody}>
//             {/* Prize Image — API se aayegi */}
//             {prize.image ? (
//                 <Image source={prize.image} style={styles.prizeImage} resizeMode="cover" />
//             ) : (
//                 <View style={styles.prizeImagePlaceholder}>
//                     <Text style={{ fontSize: responsiveFontSize(3.5) }}>🎁</Text>
//                 </View>
//             )}
//             <View style={{ flex: 1 }}>
//                 <Text style={styles.prizeTitle}>{prize.title}</Text>
//                 <Text style={styles.prizeDesc}>{prize.description}</Text>
//             </View>
//         </View>
//     </View>
// );

const WinnerRow = ({ item, index }) => {
    const rank = index + 1;
    const medal = getMedalEmoji(rank);
    const color = avatarColors[index % avatarColors.length];

    return (
        <FadeUp>
            <View style={[styles.winnerRow, index === winners.length - 1 && { borderBottomWidth: 0 }]}>
                {/* Rank */}
                <View style={styles.rankBox}>
                    {medal ? (
                        <Text style={styles.medalEmoji}>{medal}</Text>
                    ) : (
                        <Text style={styles.rankText}>{rank}</Text>
                    )}
                </View>

                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: color.bg }]}>
                    <Text style={[styles.avatarText, { color: color.text }]}>{item.initials}</Text>
                </View>

                {/* Name + sub */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.winnerName}>{item.name}</Text>
                    <Text style={styles.winnerSub}>{item.score} correct answers</Text>
                </View>

                {/* Score */}
                <Text style={styles.winnerScore}>{item.score}/{item.total}</Text>
            </View>
        </FadeUp>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────

const Weekly_Winners = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Back_Arrow label={'weekly winners'} />

            {/* Score Bar */}
            <ScrollView
                backgroundColor={COLOURS.white}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: responsiveWidth(8) }}
            >
                <ScoreBar
                    score={weeklyScore.correct}
                    total={weeklyScore.total}
                    rank={weeklyScore.rank}
                    rankLabel={weeklyScore.rankLabel}
                />

                {/* Prize of the Week */}
                {/* <PrizeCard prize={prizeOfWeek} /> */}

                {/* Leaderboard */}
                <FadeIn delay={500}>
                    <View style={[styles.card, { marginTop: responsiveWidth(3) }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                            <View style={styles.weekTag}>
                                <Text style={styles.weekTagText}>Week 18, 2026</Text>
                            </View>
                        </View>

                        {winners.map((item, index) => (
                            <WinnerRow key={item.id} item={item} index={index} />
                        ))}
                    </View>
                </FadeIn>

            </ScrollView>
        </SafeAreaView >
    );
};

export default Weekly_Winners;

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: COLOURS.light_primary,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        backgroundColor: COLOURS.light_primary,
        borderBottomWidth: 0.5,
        borderBottomColor: COLOURS.light_grey,
    },
    headerTitle: {
        fontSize: responsiveFontSize(1.9),
        fontFamily: Fonts.Medium,
        color: COLOURS.black,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    backBtn: {
        width: responsiveWidth(8),
        height: responsiveWidth(8),
        borderRadius: responsiveWidth(4),
        backgroundColor: COLOURS.white,
        borderWidth: 0.5,
        borderColor: COLOURS.light_grey,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Score Bar
    scoreBar: {
        backgroundColor: COLOURS.primary,
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
        color: COLOURS.white,
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
        backgroundColor: COLOURS.white,
    },
    dotEmpty: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    // Card
    card: {
        backgroundColor: COLOURS.light_primary,
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveWidth(3),
        borderRadius: responsiveWidth(4),
        borderWidth: 0.5,
        borderColor: COLOURS.light_grey,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(3),
        borderBottomWidth: 0.5,
        borderBottomColor: COLOURS.light_grey,
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
        color: COLOURS.primary,
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
        borderColor: COLOURS.light_grey,
        flexShrink: 0,
    },
    prizeTitle: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: Fonts.Medium,
        color: COLOURS.black,
        marginBottom: responsiveWidth(1),
    },
    prizeDesc: {
        fontSize: responsiveFontSize(1.4),
        fontFamily: Fonts.Regular,
        color: COLOURS.grey,
        lineHeight: responsiveWidth(4.5),
    },

    // Leaderboard
    leaderboardTitle: {
        fontSize: responsiveFontSize(1.7),
        fontFamily: Fonts.Medium,
        color: COLOURS.black,
    },
    weekTag: {
        backgroundColor: COLOURS.light_primary,
        borderRadius: responsiveWidth(1.5),
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(0.8),
        borderWidth: 0.5,
        borderColor: COLOURS.light_grey,
    },
    weekTagText: {
        fontSize: responsiveFontSize(1.3),
        color: COLOURS.grey,
        fontFamily: Fonts.Regular,
    },

    // Winner Row
    winnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveWidth(2.5),
        borderBottomWidth: 0.5,
        borderBottomColor: '#FAF9F5',
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
        color: COLOURS.grey,
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
        color: COLOURS.black,
    },
    winnerSub: {
        fontSize: responsiveFontSize(1.3),
        fontFamily: Fonts.Regular,
        color: COLOURS.grey,
        marginTop: responsiveWidth(0.5),
    },
    winnerScore: {
        fontSize: responsiveFontSize(1.6),
        fontFamily: Fonts.Medium,
        color: COLOURS.primary,
        flexShrink: 0,
    },
});