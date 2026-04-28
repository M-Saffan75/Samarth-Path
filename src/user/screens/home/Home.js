import React, { useEffect, useState } from 'react'
import Card_info from '../../../data/Data'
import Card from '../../../components/Card'
import Header from '../../../components/Header'
import { COLOURS } from '../../../assets/theme/Theme'
import Title_Here from '../../../components/Title_Here'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalImages } from '../../../assets/images/images_file/All_Images'
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions'
import { AppState, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'

const Home = () => {

  const [activeVideoId, setActiveVideoId] = useState(null)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setActiveVideoId(null)
      }
    })
    return () => subscription.remove()
  }, [])

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={COLOURS.light_primary}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary }}>
        <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

          {/*  */}

          <Header title={'samarth path'} />

          {/*  */}

          <Title_Here title={'today on samarth path'} textAlign={'center'} marginBottom={0} fontSize={responsiveFontSize(2.5)} />
          <Title_Here title={'you showed up today'} textAlign={'center'} color={COLOURS.primary} marginTop={responsiveWidth(1)} />

          {/*  */}

          <View style={styles.card_area}>
            {Card_info.length > 0 ? (

              <FlatList
                data={Card_info}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
                renderItem={({ item }) => (
                  <Card
                    item={item}
                    activeVideoId={activeVideoId}
                    setActiveVideoId={setActiveVideoId}
                    onScrollBeginDrag={() => setActiveVideoId(null)} 
                  // onPress={() => navigation.navigate(UserRoutes.Detail, { item })}
                  />
                )}
              />

            ) : (

              // If Data now show 
              <View style={styles.empty}>
                <Text style={styles.empty_icon}>𝌮</Text>
                <Text style={styles.empty_text}>No content available for today</Text>
              </View>

            )}
          </View>

          <View style={{ marginBottom: responsiveWidth(12) }} />

          {/*  */}

        </View>
      </SafeAreaView>
    </>
  )
}

export default Home

const styles = StyleSheet.create({

  card_area: {
    flex: 1,
    backgroundColor: COLOURS.white,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty_icon: {
    fontSize: responsiveFontSize(5),
    color: COLOURS.light_grey,
    marginBottom: responsiveWidth(3),
  },
  empty_text: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(1.8),
    color: COLOURS.light_grey,
    textAlign: 'center',
  },

  container: {
    height: '100%',
    width: '100%',
  },
})