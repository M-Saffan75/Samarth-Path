import React from 'react'
import Title_Here from '../components/Title_Here';
import { StyleSheet, Switch, Text, View } from 'react-native'
import { COLOURS } from '../assets/theme/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';

const SwitchHere = ({ title, value, onValueChange }) => {
    return (
        <>
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingHorizontal: responsiveWidth(2), borderBottomWidth: responsiveWidth(.2),
                marginVertical: responsiveWidth(2), borderBottomColor: COLOURS.grey
            }}>
                <Title_Here fontFamily={'Poppins-Medium'} marginTop={responsiveWidth(2)} title={title} marginLeft={0} />
                <Switch value={value} onValueChange={onValueChange}
                    trackColor={{
                        false: COLOURS.grey,   // OFF background
                        true: COLOURS.primary,    // ON background
                    }}
                    thumbColor={"#ffffff"}
                />


            </View>
        </>
    )
}

export default SwitchHere

const styles = StyleSheet.create({})