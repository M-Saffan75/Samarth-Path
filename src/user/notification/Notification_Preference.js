import Toast from 'react-native-root-toast';
import React, { useEffect, useState } from 'react';
import Back_Arrow from '../../components/Back_Arrow';
import Title_Here from '../../components/Title_Here';
import SwitchHere from '../../components/SwitchHere';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../assets/themecontext/ThemeContext';
import { View, Text, StatusBar, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { getNotificationSettings, updateNotificationSetting } from '../../user/screens/auth/auth_backend/Auth_Backend';

const Notification_Preference = () => {

  const { theme: COLOURS, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [textNotif, setTextNotif] = useState(false);
  const [quizNotif, setQuizNotif] = useState(false);
  const [videoNotif, setVideoNotif] = useState(false);

  const handleUpdate = async (type, val, setter) => {
    console.log(type, val, setter)
    // return
    try {
      setter(val);
      const res = await updateNotificationSetting(type, val);
      console.log(res)
      Toast.show(
        `${res?.message}`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
        }
      );
    } catch (error) {
      console.log(error);
      setter(!val); // rollback
    }
  };

  const loadSettings = async () => {
    try {
      const data = await getNotificationSettings();
      setLoading(true)
      console.log(data)
      setTextNotif(data.text);
      setQuizNotif(data.quiz);
      setVideoNotif(data.video);

    } catch (error) {
      setLoading(false)
      console.log('error', error);
    }
  };
  useEffect(() => {
    loadSettings();
  }, []);


  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLOURS.light_primary}
      />

      <SafeAreaView style={[styles.container, { backgroundColor: COLOURS.light_primary }]}>

        {/* Decor circles — same as Network screen */}
        <View style={[styles.circle_lg, { backgroundColor: COLOURS.primary }]} />
        <View style={[styles.circle_sm, { backgroundColor: COLOURS.primary }]} />

        {/* Header */}

        <View style={styles.topbar}>
          <Back_Arrow label={'notification preference'} fontSize={responsiveFontSize(2.2)} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll_content}>
          {loading ? (
            <>
              <SwitchHere
                title={'Morning Text'}
                value={textNotif}
                onValueChange={(val) => handleUpdate('text', val, setTextNotif)}
              />

              <SwitchHere
                title={'Afternoon Quiz'}
                value={quizNotif}
                onValueChange={(val) => handleUpdate('quiz', val, setQuizNotif)}
              />

              <SwitchHere
                title={'Evening Video'}
                value={videoNotif}
                onValueChange={(val) => handleUpdate('video', val, setVideoNotif)}
              />

              <Title_Here fontSize={responsiveFontSize(1.6)} title={'• Turn off notifications for this content type'} marginTop={responsiveWidth(14)} />
              <Title_Here fontSize={responsiveFontSize(1.6)} title={'• You will stop receiving updates until enable it.'} />
              <Title_Here fontSize={responsiveFontSize(1.6)} title={'• You can change this anytime in settings.'} />
            </>
          ) : (
            <ActivityIndicator color={COLOURS.primary} size={'large'} />
          )}
        </ScrollView>

      </SafeAreaView>
    </>
  )
}

export default Notification_Preference

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  circle_lg: {
    position: 'absolute',
    top: -responsiveWidth(20),
    right: -responsiveWidth(20),
    width: responsiveWidth(70),
    height: responsiveWidth(70),
    borderRadius: responsiveWidth(35),
    opacity: 0.08,
  },
  circle_sm: {
    position: 'absolute',
    bottom: responsiveWidth(20),
    left: -responsiveWidth(15),
    width: responsiveWidth(50),
    height: responsiveWidth(50),
    borderRadius: responsiveWidth(25),
    opacity: 0.06,
  },
  scroll_content: {
    // paddingHorizontal: responsiveWidth(4.5),
    paddingTop: responsiveWidth(4),
  },
});