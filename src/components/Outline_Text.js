import { COLOURS } from '../assets/theme/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageBackground, StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';

const Outline_Text = ({
    fontSize, color, textTransform, borderBottomColor, borderBottomWidth, onPress,
    alignItems, marginTop, text, width
}) => {

    return (
        <>

            <View style={[styles.container, { backgroundColor: COLOURS.white, height: responsiveWidth(0), }]}>
        
                <View style={[styles.text_area, {
                    alignItems: alignItems ?? 'center',
                    justifyContent: 'flex-start',
                    height: responsiveWidth(7),
                    marginTop: marginTop ?? responsiveWidth(8),
                }]}>

                    <TouchableOpacity activeOpacity={0.7} onPress={onPress}
                        style={[styles.text_opacity, {
                            width: width ?? responsiveWidth(27), alignItems: 'center',
                            borderBottomColor: borderBottomColor ?? COLOURS.primary,
                            borderBottomWidth: borderBottomWidth ?? responsiveWidth(.6),

                        }]}>
                        <Text style={[styles.text_here,
                        {
                            fontSize: fontSize ?? responsiveFontSize(1.8), color: color ?? COLOURS.primary,
                            textTransform: textTransform ?? 'capitalize',
                        }
                        ]}>{text}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </>
    )
}

export default Outline_Text

const styles = StyleSheet.create({
})