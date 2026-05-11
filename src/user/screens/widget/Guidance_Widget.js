import React from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import Back_Arrow from '../../../components/Back_Arrow';
import { Pulse } from '../../../components/Pulse';
import { FadeUp } from '../../../components/FadeUp';
import { FadeIn } from '../../../components/FadeIn';

// ─── Single instruction card ───────────────────────────────────────────────
const InstructionCard = ({ iconBg, iconColor, icon, title, children, pill, pillBg, pillColor, extra }) => {

    const { theme: COLOURS, isDark } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: COLOURS.white }]}>
            <View style={styles.card_row}>
                <View style={[styles.icon_box, { backgroundColor: iconBg }]}>
                    <Text style={[styles.icon_text, { color: iconColor }]}>{icon}</Text>
                </View>
                <View style={styles.card_body}>
                    <Text style={[styles.card_title, { color: COLOURS.black }]}>{title}</Text>
                    <Text style={[styles.card_text, { color: COLOURS.grey }]}>{children}</Text>
                    {pill ? (
                        <View style={[styles.pill, { backgroundColor: pillBg }]}>
                            <Text style={[styles.pill_text, { color: pillColor }]}>{pill}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            {extra ? extra : null}
        </View>
    );
};

// ─── Section heading ───────────────────────────────────────────────────────
const SectionHead = ({ label }) => (
    <Text style={styles.section_head}>{label}</Text>
);
// ─── Main Screen ───────────────────────────────────────────────────────────
const Guidance_Widget = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />

            <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.light_primary }]}>

                {/* Decor circles — same as Network screen */}
                <View style={[styles.circle_lg, { backgroundColor: COLOURS.primary }]} />
                <View style={[styles.circle_sm, { backgroundColor: COLOURS.primary }]} />

                {/* Header */}

                <View style={styles.topbar}>
                    <Back_Arrow label={'guidance widget'} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll_content}
                >

                    {/* ── Daily Content ── */}
                    <SectionHead label="DAILY CONTENT" />

                    <FadeIn delay={300}>
                        <InstructionCard
                            iconBg="#fff8e6"
                            iconColor="#c9a227"
                            icon="☀️"
                            title="Morning — Daily Read"
                            pill="8:00 AM"
                            pillBg="#fff3cc"
                            pillColor="#7a5c00"
                        >
                            <Text style={styles.card_text}>
                                Every morning a{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>motivational or educational text post</Text>
                                {' '}is published. You can also save/bookmark it.
                            </Text>
                        </InstructionCard>
                    </FadeIn>
                    <FadeIn delay={500}>
                        <InstructionCard
                            iconBg="#eaf2ff"
                            iconColor="#2563eb"
                            icon="❓"
                            title="Afternoon — Daily Quiz"
                            pill="2:00 PM"
                            pillBg="#dbeafe"
                            pillColor="#1e40af"
                        >
                            <Text style={styles.card_text}>
                                In the afternoon a{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>4-option quiz question</Text>
                                {' '}appears. You get{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>180 seconds</Text>
                                {' '}to answer. Correct answer shows green, wrong shows red. Score is tracked weekly.
                            </Text>
                        </InstructionCard>
                    </FadeIn>
                    <FadeIn delay={700}>
                        <InstructionCard
                            iconBg="#f3f0ff"
                            iconColor="#7c3aed"
                            icon="▶️"
                            title="Evening — Daily Video"
                            pill="7:00 PM"
                            pillBg="#f3f0ff"
                            pillColor="#7c3aed"
                        >
                            <Text style={styles.card_text}>
                                In the evening a{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>short video (max 7 min)</Text>
                                {' '}is uploaded. It is auto-muted — play it when you want.{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>Listen Only mode</Text>
                                {' '}is also available.
                            </Text>
                        </InstructionCard>
                    </FadeIn>
                    {/* ── Features ── */}

                    <SectionHead label="FEATURES" />

                    <FadeUp>
                        <View style={styles.card}>
                            <View style={styles.card_row}>
                                <View style={[styles.icon_box, { backgroundColor: '#e6faf6' }]}>
                                    <Text style={[styles.icon_text, { color: '#0d9488' }]}>📅</Text>
                                </View>
                                <View style={styles.card_body}>
                                    <Text style={styles.card_title}>Archive — Past Content</Text>
                                    <Text style={styles.card_text}>
                                        At the bottom of the home screen there is{' '}
                                        <Text style={[styles.bold, { color: COLOURS.grey }]}>Archive tab</Text>
                                        {' '}Tap it → Calendar opens → Select date → Content of that day is loaded.
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.divider_line]} />
                            <View style={styles.chip_row}>
                                <View style={styles.sub_chip}>
                                    <Text style={styles.sub_chip_val}>3 Days</Text>
                                    <Text style={styles.sub_chip_lbl}>Trial users</Text>
                                </View>
                                <View style={styles.sub_chip}>
                                    <Text style={styles.sub_chip_val}>Full Access</Text>
                                    <Text style={styles.sub_chip_lbl}>Paid users</Text>
                                </View>
                            </View>
                        </View>


                        <InstructionCard
                            iconBg="#eaf7ef"
                            iconColor="#16a34a"
                            icon="❤️"
                            title="Like, Comment & Save"
                        >
                            <Text style={styles.card_text}>
                                On every post you can{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>like</Text>
                                {' '} (count is shown), write{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>comments</Text>
                                {' '}and{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>save/bookmark</Text>
                                {' '}to My Path.
                            </Text>
                        </InstructionCard>

                        <InstructionCard
                            iconBg="#fff0f0"
                            iconColor="#dc2626"
                            icon="💬"
                            title="Personal Guidance"
                        >
                            <Text style={styles.card_text}>
                                You get{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>3 free messages per month</Text>
                                {' '}to send directly to mentor. Reply comes in 24–48 hours.
                            </Text>
                        </InstructionCard>

                        <InstructionCard
                            iconBg="#fff8e6"
                            iconColor="#c9a227"
                            icon="🏆"
                            title="Weekly Quiz Winners"
                        >
                            <Text style={styles.card_text}>
                                In quiz screen there is{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>Weekly Winners tab</Text>
                                {' '}You can see weekly prize and find your name in winners list.
                            </Text>
                        </InstructionCard>

                        {/* ── Account ── */}
                        <SectionHead label="ACCOUNT" />

                        <InstructionCard
                            iconBg="#eaf2ff"
                            iconColor="#2563eb"
                            icon="👤"
                            title="Profile & Settings"
                        >
                            <Text style={styles.card_text}>
                                You can edit{' '}
                                <Text style={[styles.bold, { color: COLOURS.grey }]}>Name, Username, Gender, Date Of Birth</Text>.
                                {' '}<Text style={[styles.bold, { color: COLOURS.grey }]}>But Phone number and Email cannot be changed.</Text>
                                {'\n'}Password change and Forgot Password options are available.
                            </Text>
                        </InstructionCard>
                    </FadeUp>
                    
                    <Pulse>
                        <View style={styles.note_box}>
                            <Text style={styles.note_icon}>🔒</Text>
                            <Text style={styles.note_text}>
                                Screenshot and screen recording are{' '}
                                <Text style={styles.bold_note}>not allowed in this app.</Text>
                                {' '}Content is only for you — please do not share it.
                            </Text>
                        </View>
                    </Pulse>

                    <View style={styles.bottom_space} />

                </ScrollView>

            </SafeAreaView >
        </>
    );
};

export default Guidance_Widget;

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    // Decor — matches Network screen exactly
    circle_lg: {
        position: 'absolute',
        top: -responsiveWidth(20),
        right: -responsiveWidth(20),
        width: responsiveWidth(70),
        height: responsiveWidth(70),
        borderRadius: responsiveWidth(35),
        opacity: 0.08,
    },
    circle_sm: {
        position: 'absolute',
        bottom: responsiveWidth(20),
        left: -responsiveWidth(15),
        width: responsiveWidth(50),
        height: responsiveWidth(50),
        borderRadius: responsiveWidth(25),
        opacity: 0.06,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveWidth(3.5),
        borderBottomWidth: 0.5,
        gap: responsiveWidth(3),
        zIndex: 1,
    },
    back_btn: {
        width: responsiveWidth(9),
        height: responsiveWidth(9),
        borderRadius: responsiveWidth(4.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    back_icon: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: 'Poppins-SemiBold',
    },
    header_title: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(2),
    },
    header_sub: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.4),
        marginTop: responsiveWidth(0.3),
    },

    // Scroll
    scroll_content: {
        paddingHorizontal: responsiveWidth(4.5),
        paddingTop: responsiveWidth(4),
    },

    // Section heading
    section_head: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.25),
        color: '#c9a227',
        letterSpacing: 1,
        marginTop: responsiveWidth(2),
        marginBottom: responsiveWidth(2.5),
    },

    // Card
    card: {
        borderRadius: responsiveWidth(4),
        borderWidth: 0.5,
        borderColor: '#ebebeb',
        padding: responsiveWidth(3.5),
        marginBottom: responsiveWidth(3),
    },
    card_row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: responsiveWidth(3),
    },
    icon_box: {
        width: responsiveWidth(10),
        height: responsiveWidth(10),
        borderRadius: responsiveWidth(3),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    icon_text: {
        fontSize: responsiveFontSize(2.2),
    },
    card_body: {
        flex: 1,
    },
    card_title: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.65),
        marginBottom: responsiveWidth(0.8),
    },
    card_text: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.45),
        color: '#666666',
        lineHeight: responsiveFontSize(2.3),
    },
    bold: {
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
    },

    // Time pill
    pill: {
        alignSelf: 'flex-start',
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveWidth(0.6),
        borderRadius: responsiveWidth(3),
        marginTop: responsiveWidth(1.5),
    },
    pill_text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: responsiveFontSize(1.2),
    },

    // Archive chips
    divider_line: {
        height: 0.5,
        backgroundColor: '#f0f0f0',
        marginVertical: responsiveWidth(3),
    },
    chip_row: {
        flexDirection: 'row',
        gap: responsiveWidth(2),
    },
    sub_chip: {
        flex: 1,
        backgroundColor: '#fafafa',
        borderWidth: 0.5,
        borderColor: '#ebebeb',
        borderRadius: responsiveWidth(2.5),
        padding: responsiveWidth(2.5),
        alignItems: 'center',
    },
    sub_chip_val: {
        fontFamily: 'Poppins-Bold',
        fontSize: responsiveFontSize(1.5),
        color: '#1a1a1a',
    },
    sub_chip_lbl: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.2),
        color: '#999',
        marginTop: responsiveWidth(0.3),
    },

    // Note box
    note_box: {
        backgroundColor: '#fff8e6',
        borderRadius: responsiveWidth(3.5),
        borderWidth: 1,
        borderColor: '#f5e2a0',
        padding: responsiveWidth(3.5),
        flexDirection: 'row',
        gap: responsiveWidth(2.5),
        marginTop: responsiveWidth(1),
    },
    note_icon: {
        fontSize: responsiveFontSize(2.2),
        flexShrink: 0,
    },
    note_text: {
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.45),
        color: '#7a5c00',
        lineHeight: responsiveFontSize(2.3),
        flex: 1,
    },
    bold_note: {
        fontFamily: 'Poppins-SemiBold',
        color: '#5a3e00',
    },

    bottom_space: {
        height: responsiveWidth(8),
    },
});