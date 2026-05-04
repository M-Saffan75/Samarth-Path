import React from 'react';
import { COLOURS } from '../assets/theme/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';


const App_Logo = ({ alignItems, width, borderRadius, backgroundColor, height, source, marginTop, resizeMode, tintColor }) => {
  return (
    <>

      <View style={[styles.container, { backgroundColor: backgroundColor }]}>

        <View style={[styles.app_Logo_img_area, { marginTop }]}>
          <Image source={source}
            style={[styles.app_Logo_img,
            {
              borderRadius: borderRadius,
              width: width ?? '30%',
              height: height ?? responsiveWidth(30),
              // backgroundColor:'green',
              alignItems: alignItems ?? 'center',
            }
            ]}
            tintColor={tintColor}
            resizeMode={resizeMode ?? 'contain'}
             />
        </View>

      </View>
    </>
  )
}

export default App_Logo


const styles = StyleSheet.create({

  app_Logo_img_area: {
    // width: '100%',
    alignItems: 'center',
  },

  app_Logo_img: {
    // height: '10%',
    // width: '20%',
    // backgroundColor:'red'
  },

  container: {
    // height: '100%',
    // width: '100%',
  },

})