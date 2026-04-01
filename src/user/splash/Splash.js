import { useEffect } from 'react';
import { COLOURS } from '../../assets/theme/Theme';
import UserRoutes from '../user_routes/UserRoutes';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Image, View, StatusBar, Text, } from 'react-native';
import { globalImages } from '../../assets/images/images_file/All_Images';


const Splash = () => {

  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(UserRoutes.OnBoard)
    }, 2000);
  }, [navigation])



  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={COLOURS.primary} />
      <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.primary }]}>
        <View style={[styles.container, { backgroundColor: COLOURS.primary }]}>
          <Image source={globalImages.app_logo} style={styles.splash_img} resizeMode='contain' />
        </View>
      </SafeAreaView>
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