import React, { useRef, useState } from 'react';
import Text_Here from './Text_Here';
import Quiz_Here from './Quiz_Here';
import Videos_Here from './Videos_Here';
import Header from '../../../components/Header';
import { ZoomIn } from '../../../components/ZoomIn';
import Select_Text from '../../../components/Select_Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { ScrollView, StatusBar, StyleSheet, View, Dimensions } from 'react-native';


const My_Path = ({ navigation }) => {

    const { theme: COLOURS, isDark } = useTheme();
    const { width } = Dimensions.get('window');
    const [activeTab, setActiveTab] = useState('Text');
    const scrollRef = useRef(null);
    const tabs = ['Text', 'Videos'];


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
                        style={{ flex: 1, paddingBottom: responsiveWidth(10) }}
                    >
                        <View style={{ width }}><Text_Here navigation={navigation} /></View>
                        <View style={{ width }}><Videos_Here navigation={navigation} /></View>
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
        justifyContent: 'space-around',
        marginHorizontal: responsiveWidth(3),
        marginTop: responsiveWidth(4),
    },
    container: {
        height: '100%',
        width: '100%',
    },
})