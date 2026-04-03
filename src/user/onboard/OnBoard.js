import Button from '../../components/Button';
import { COLOURS } from '../../assets/theme/Theme';
import UserRoutes from '../user_routes/UserRoutes';
import Title_Here from '../../components/Title_Here';
import { globalImages } from '../../assets/images/images_file/All_Images';
import { StyleSheet, View, StatusBar, ImageBackground, Image } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const OnBoard = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={'transparent'}
                translucent={true}
            />
            <ImageBackground
                source={globalImages.bg_here}
                style={styles.bg_img}
                resizeMode='cover'
            >

                <Image source={globalImages.image_1} style={styles.top_img} resizeMode='contain' />

                <Image source={globalImages.app_logo} style={styles.icon_new_img} resizeMode='contain' />

                {/* Samarth path */}

                <Title_Here title={'samarth path'}
                    color={COLOURS.white}
                    textAlign={'center'}
                    fontFamily={'Poppins-Bold'}
                    letterSpacing={responsiveWidth(.2)}
                    fontSize={responsiveFontSize(4)}
                    marginBottom={responsiveWidth(0)}
                    marginTop={responsiveWidth(-12)}
                />

                <Title_Here title={'your daily guide to spiritual growth'}
                    color={COLOURS.light_grey}
                    textAlign={'center'}
                    fontFamily={'Poppins-Medium'}
                    letterSpacing={responsiveWidth(.2)}
                    fontSize={responsiveFontSize(1.7)}
                    marginBottom={responsiveWidth(0)}
                    marginTop={responsiveWidth(1)}
                />

                <Button label={'get started'} borderRadius={responsiveWidth(2)} alignSelf={'center'}
                    marginTop={responsiveWidth(30)} onPress={() => navigation.navigate(UserRoutes.Register)} />

                <Button label={'sign in'} borderRadius={responsiveWidth(2)} alignSelf={'center'} onPress={() => navigation.navigate(UserRoutes.Login)}
                    backgroundColor={COLOURS.light_green} borderColor={COLOURS.white} borderWidth={responsiveWidth(.1)} />

            </ImageBackground>
        </View>
    )
}

export default OnBoard

const styles = StyleSheet.create({


    icon_new_img: {
        width: '25%',
        height: '25%',
        marginTop: '-12%',
        alignSelf: 'center',
    },

    top_img: {
        width: '85%',
        height: '45%',
        // backgroundColor:'red',
        alignSelf: 'center',
    },

    // 

    container: {
        flex: 1,
    },
    bg_img: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
})