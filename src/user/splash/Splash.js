import { useEffect, useRef } from 'react';
import { COLOURS } from '../../assets/theme/Theme';
import UserRoutes from '../user_routes/UserRoutes';
import Title_Here from '../../components/Title_Here';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { globalImages } from '../../assets/images/images_file/All_Images';
import { StyleSheet, Image, View, StatusBar, Animated } from 'react-native';


const Splash = () => {

  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(UserRoutes.OnBoard)
    }, 3000);
  }, [navigation])



  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={COLOURS.primary} />
      <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.primary }]}>
        <View style={[styles.container, { backgroundColor: COLOURS.primary }]}>
          <Image source={globalImages.app_logo} style={styles.splash_img} resizeMode='contain' />
          <Animated.View style={{ opacity: fadeAnim }}>
            <Title_Here title={'samarth path'} color={COLOURS.white}
              fontSize={responsiveFontSize(2.5)} textAlign={'center'} />
          </Animated.View>
        </View>
      </SafeAreaView >
    </>
  )
}

export default Splash

const styles = StyleSheet.create({

  splash_img: {
    height: '20%',
    // width: '100%',
  },

  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOURS.white
  },
})