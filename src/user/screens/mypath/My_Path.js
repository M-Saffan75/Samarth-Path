import React, { useRef, useState } from 'react';
import Text_Here from './Text_Here';
import Quiz_Here from './Quiz_Here';
import Videos_Here from './Videos_Here';
import Header from '../../../components/Header';
import { ZoomIn } from '../../../components/ZoomIn';
import { COLOURS } from '../../../assets/theme/Theme';
import Select_Text from '../../../components/Select_Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView, StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import { FadeUp } from '../../../components/FadeUp';
import { useTheme } from '../../../assets/themecontext/ThemeContext';


const My_Path = () => {

    const { theme: COLOURS, isDark } = useTheme();
    const { width } = Dimensions.get('window');
    const [activeTab, setActiveTab] = useState('Text');
    const scrollRef = useRef(null);
    const tabs = ['Text', 'Quiz', 'Videos'];


    const handleTabPress = (tab) => {
        setActiveTab(tab);
        scrollRef.current?.scrollTo({
            x: tabs.indexOf(tab) * width,
            animated: true,
        });
    };


    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <Header title={'My Path'} />

                    <View style={[styles.row_select]}>

                        <ZoomIn delay={400}>
                            <Select_Text
                                label={'Text'}
                                onPress={() => handleTabPress('Text')}
                                borderBottomColor={activeTab === 'Text' ? COLOURS.primary : COLOURS.transparent}
                                color={activeTab === 'Text' ? COLOURS.primary : COLOURS.black}
                                countColor={activeTab === 'Text' ? COLOURS.white : COLOURS.light_black}
                                backgroundColor={activeTab === 'Text' ? COLOURS.primary : COLOURS.light_grey}
                            />
                        </ZoomIn>
                        <ZoomIn delay={500}>
                            <Select_Text
                                label={'Quiz'}
                                onPress={() => handleTabPress('Quiz')}
                                borderBottomColor={activeTab === 'Quiz' ? COLOURS.primary : COLOURS.transparent}
                                color={activeTab === 'Quiz' ? COLOURS.primary : COLOURS.black}
                                countColor={activeTab === 'Quiz' ? COLOURS.white : COLOURS.light_black}
                                backgroundColor={activeTab === 'Quiz' ? COLOURS.primary : COLOURS.light_grey}
                            />
                        </ZoomIn>

                        <ZoomIn delay={600}>
                            <Select_Text
                                label={'Videos'}
                                onPress={() => handleTabPress('Videos')}
                                borderBottomColor={activeTab === 'Videos' ? COLOURS.primary : COLOURS.transparent}
                                color={activeTab === 'Videos' ? COLOURS.primary : COLOURS.black}
                                countColor={activeTab === 'Videos' ? COLOURS.white : COLOURS.light_black}
                                backgroundColor={activeTab === 'Videos' ? COLOURS.primary : COLOURS.light_grey}
                            />
                        </ZoomIn>

                    </View>

                    {/* Active tab according display */}
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setActiveTab(tabs[index]);
                        }}
                        style={{ flex: 1 }}
                    >
                        <View style={{ width }}><Text_Here /></View>
                        <View style={{ width }}><Quiz_Here /></View>
                        <View style={{ width }}><Videos_Here /></View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}

export default My_Path

const styles = StyleSheet.create({
    row_select: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: responsiveWidth(3),
        marginTop: responsiveWidth(4),
    },
    container: {
        height: '100%',
        width: '100%',
    },
})