import React, { useState } from 'react';
import Text_Here from './Text_Here';
import Videos_Here from './Videos_Here';
import Images_Here from './Images_Here';
import Header from '../../../components/Header';
import { COLOURS } from '../../../assets/theme/Theme';
import Select_Text from '../../../components/Select_Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

const My_Path = () => {

    const [activeTab, setActiveTab] = useState('Text');

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <Header title={'My Path'} />

                    <View style={[styles.row_select]}>

                        <Select_Text
                            label={'Text'} count={0}
                            onPress={() => setActiveTab('Text')}
                            borderBottomColor={activeTab === 'Text' ? COLOURS.primary : COLOURS.transparent}
                            color={activeTab === 'Text' ? COLOURS.primary : COLOURS.black}
                            countColor={activeTab === 'Text' ? COLOURS.white : COLOURS.light_black}
                            backgroundColor={activeTab === 'Text' ? COLOURS.primary : COLOURS.light_grey}
                        />

                        <Select_Text
                            label={'Images'} count={0}
                            onPress={() => setActiveTab('Images')}
                            borderBottomColor={activeTab === 'Images' ? COLOURS.primary : COLOURS.transparent}
                            color={activeTab === 'Images' ? COLOURS.primary : COLOURS.black}
                            countColor={activeTab === 'Images' ? COLOURS.white : COLOURS.light_black}
                            backgroundColor={activeTab === 'Images' ? COLOURS.primary : COLOURS.light_grey}
                        />

                        <Select_Text
                            label={'Videos'} count={0}
                            onPress={() => setActiveTab('Videos')}
                            borderBottomColor={activeTab === 'Videos' ? COLOURS.primary : COLOURS.transparent}
                            color={activeTab === 'Videos' ? COLOURS.primary : COLOURS.black}
                            countColor={activeTab === 'Videos' ? COLOURS.white : COLOURS.light_black}
                            backgroundColor={activeTab === 'Videos' ? COLOURS.primary : COLOURS.light_grey}
                        />

                    </View>

                    {/* Active tab according display */}
                    {activeTab === 'Text' && <Text_Here />}
                    {activeTab === 'Images' && <Images_Here />}
                    {activeTab === 'Videos' && <Videos_Here />}

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