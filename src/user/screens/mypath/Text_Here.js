import React from 'react'
import { COLOURS } from '../../../assets/theme/Theme'
import Title_Here from '../../../components/Title_Here'
import { Image, StyleSheet, Text, View } from 'react-native'
import { globalImages } from '../../../assets/images/images_file/All_Images'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'

const Text_Here = () => {
  return (
    <>
      <View>

        <View style={styles.bg_img}>
          <Image source={globalImages.app_logo} style={styles.logo_img} tintColor={COLOURS.primary}/>
        </View>
        <Title_Here title={'no saved text'} textAlign={'center'} />
        <Title_Here title={'save spiritual text to read them later...'} fontSize={responsiveFontSize(1.7)}
          textAlign={'center'} color={COLOURS.light_black} marginTop={responsiveWidth(1)} />
      </View>
    </>
  )
}

export default Text_Here

const styles = StyleSheet.create({
  
  bg_img: {
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    width:responsiveWidth(20),
    height:responsiveWidth(20),
    marginTop:responsiveWidth(80),
    borderRadius:responsiveWidth(3),
    backgroundColor:COLOURS.light_grey,
  },

  logo_img: {
    alignSelf: 'center',
    width: responsiveWidth(15),
    height: responsiveWidth(15),
  }
})