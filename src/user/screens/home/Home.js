import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../../components/Header';
import Title_Here from '../../../components/Title_Here';
import messaging from '@react-native-firebase/messaging'; // message firebase
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { AppState, Image, RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native';


import { fetchTodayContent } from '../../screens/home/homebackend/HomeBackend';

import { FlashList } from '@shopify/flash-list';
import Button from '../../../components/Button';
import { Pulse } from '../../../components/Pulse';
import QuizCard from '../../../components/QuizCard';
import VideoCard from '../../../components/VideoCard';
import UserRoutes from '../../user_routes/UserRoutes';
import ImageCard from '../../../components/ImageCard';
import { showToast } from '../../../components/AppToast';
import { useFocusEffect } from '@react-navigation/native';
import { useLoader } from '../../../loading/LoaderContext';
import { useUser } from '../auth/user_context/UserContext';
import FloatingButton from '../../floatbutton/FloatingButton';
import { getUserFCMToken } from '../../../notifications/FCM_Send';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { Fonts } from '../../../assets/fonts/Fonts';
import { FadeUp } from '../../../components/FadeUp';

const Home = ({ navigation }) => {

  const { userData } = useUser();
  const { theme: COLOURS, isDark } = useTheme();
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    loadContent();
  }, []);


  const loadContent = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await fetchTodayContent();
      setMessage(res?.message);
      if (res.success && res.data.length > 0) {
        const items = res?.data;
        const normalized = items.map((item) => {
          if (!item) return null;
          return {
            id: item?._id,
            type: item?.contentType === 'text' ? 'image' : item?.contentType,
            // Video
            video: item?.videoContent?.videoUrl || null,
            thumbnail: item?.videoContent?.thumbnail || null,
            // Image/Text
            image: item?.textContent?.image || null,
            label: item?.textContent?.label || null,

            // Common
            schedule: item?.videoContent?.title || item?.textContent?.title || item?.quizContent?.title || '',
            title: item?.videoContent?.title || item?.textContent?.title || item?.quizContent?.title || '',
            description: item?.videoContent?.description || item?.textContent?.description || '',
            // Engagement

            isLiked: item?.isLiked ?? false,
            isBookmarked: item?.isBookmarked ?? false,
            likesCount: item?.likesCount || 0,
            commentsCount: item?.commentsCount || 0,
            // Quiz
            question: item?.quizContent?.question || null,
            options: item?.quizContent?.options || [],
            correctOptionId: item?.quizContent?.correctOptionId || null,
            timerSeconds: item?.quizContent?.timerSeconds || 180,
            explanation: item?.quizContent?.explanation || '',
            quizAttempt: item?.quizAttempt || null,
          };
        })
          .filter(Boolean)
          .filter(item => item?.id); // ← yahan

        setContentList(normalized);
      }
    } catch (e) {
      console.log('Content fetch error:', e);
    } finally {
      if (!isRefresh) setLoading(false);

    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') setActiveVideoId(null);
    });
    return () => subscription.remove();
  }, []);

  const updateQuizAttempt = (itemId, attemptData) => {
    setContentList(prev => prev.map(content =>
      content.id === itemId
        ? { ...content, quizAttempt: attemptData }
        : content
    ));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent(true);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      refreshCounts();
    }, [])
  );


  useEffect(() => {
    getUserFCMToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showToast('info', remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  const refreshCounts = async () => {
    try {
      const res = await fetchTodayContent();
      if (res?.success && res?.data?.length > 0) {
        setContentList(prev => {
          if (!prev.length) return prev; // nothing to update yet
          return prev.map(card => {
            const fresh = res.data.find(i => i._id === card.id);
            if (!fresh) return card;
            return {
              ...card,
              likesCount: fresh.likesCount ?? card.likesCount,
              commentsCount: fresh.commentsCount ?? card.commentsCount,
            };
          });
        });
      }
    } catch (e) {
      console.log('Count refresh error:', e);
    }
  };



  const expiryDate = new Date(userData?.subscription?.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
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

          <View style={[styles.card_area, { flex: 1 }]}>

            <FlashList
              data={contentList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLOURS.primary]}
                  tintColor={COLOURS.primary}
                  progressBackgroundColor={COLOURS.light_primary}
                />
              }

              keyExtractor={(item) =>
                item?.id?.toString() ?? Math.random().toString()
              }

              showsVerticalScrollIndicator={false}
              estimatedItemSize={responsiveWidth(100)}
              onScrollBeginDrag={() => setActiveVideoId(null)}
              removeClippedSubviews={true}

              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: responsiveWidth(5),
              }}

              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={[styles.empty_text, { color: COLOURS.primary }]}>
                    {message || 'No content available for today!'}
                  </Text>
                  <Pulse>
                    {isExpired ? <Button label={'𝙱𝚞𝚢 𝚜𝚞𝚋𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗 ⚜'} fontSize={responsiveFontSize(2)}
                      width={responsiveWidth(50)} paddingVertical={responsiveWidth(2)}
                      onPress={() => navigation.navigate(UserRoutes.Subscription)} /> : ''}
                  </Pulse>
                </View>
              }

              renderItem={({ item }) => {
                if (item?.type === 'video')
                  return (
                    <VideoCard
                      navigation={navigation}
                      item={item}
                      activeVideoId={activeVideoId}
                      setActiveVideoId={setActiveVideoId}
                      fullshow={false}
                    />
                  );
                console.log('commentscount', item?.commentsCount)
                if (item?.type === 'image')
                  return <ImageCard navigation={navigation} item={item} />;

                // if (item?.type === 'quiz')
                //   return <QuizCard item={item} navigation={navigation} />;
                if (item?.type === 'quiz')
                  return (
                    <FadeUp>
                      <View style={[styles.quiz_card, { backgroundColor: COLOURS.light_primary, marginTop: responsiveWidth(3) }]}>
                        <View style={styles.row_quiz}>
                          <View style={[styles.quiz_bg, { backgroundColor: COLOURS.light_grey }]} >
                            <Image source={globalImages.quiz_icon} style={styles.quiz_img} tintColor={COLOURS.primary} />
                          </View>
                          <Text style={[styles.title_quiz, { color: COLOURS.black }]}>Afternoon Quiz</Text>
                        </View>
                        <Text style={[styles.info_quiz, { color: COLOURS.black }]}>Test your understanding of mindfulness, Inner peace,
                          and personal growth with a quick Quiz.</Text>

                        <View style={styles.row_cards}>

                          <View style={[styles.card_here]}>
                            <View style={[styles.card_here_mini]}>
                              <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                <Image source={globalImages.clock_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                              </View>
                              <Text style={[styles.icon_text, { color: COLOURS.black }]}>3 Minutes</Text>
                            </View>
                            <View style={{
                              borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                              height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                            }} />
                          </View>

                          <View style={[styles.card_here]}>
                            <View style={[styles.card_here_mini]}>
                              <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                <Image source={globalImages.question_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                              </View>
                              <Text style={[styles.icon_text, { color: COLOURS.black }]}>1 Question</Text>
                            </View>
                            <View style={{
                              borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                              height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                            }} />
                          </View>

                          <View style={[styles.card_here]}>
                            <View style={[styles.card_here_mini]}>
                              <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                <Image source={globalImages.options_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                              </View>
                              <Text style={[styles.icon_text, { color: COLOURS.black }]}>4 Options</Text>
                            </View>
                            <View style={{
                              borderRightWidth: responsiveWidth(.2), borderRightColor: COLOURS.grey,
                              height: responsiveWidth(12), top: responsiveWidth(1), left: responsiveWidth(3),
                            }} />
                          </View>

                          <View style={[styles.card_here]}>
                            <View style={[styles.card_here_mini]}>
                              <View style={[styles.main_icon_bg, { backgroundColor: COLOURS.light_grey }]}>
                                <Image source={globalImages.win_icon} style={styles.icon_bg} tintColor={COLOURS.primary} />
                              </View>
                              <Text style={[styles.icon_text, { color: COLOURS.black }]}>Instant Result</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[styles.bottom_line, { backgroundColor: COLOURS.grey }]} navigation={navigation} />
                        <Button label={'sart quiz  ➞'}
                          onPress={() => navigation.navigate(UserRoutes.QuizCard, {
                            item, onAttemptComplete: (attemptData) => updateQuizAttempt(item.id, attemptData)
                          })}
                          width={responsiveWidth(80)}
                          paddingVertical={responsiveWidth(3)} alignSelf={'center'} />
                      </View>
                    </FadeUp>
                  )
                return null;
              }}
            />

          </View>

          <FloatingButton
            image={globalImages.consultation_icon}
            navigation={navigation} />

          <View style={{ marginBottom: responsiveWidth(12) }} />

          {/*  */}

        </View>
      </SafeAreaView>
    </>
  )
}

export default Home

const styles = StyleSheet.create({

  bottom_line: {
    width: '94%',
    left: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    height: responsiveWidth(.1),
  },

  row_cards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: responsiveWidth(3),
  },

  main_icon_bg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(100),
  },

  icon_bg: {
    height: responsiveWidth(5),
    width: responsiveWidth(5),
  },

  card_here: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(3),
  },


  card_here_mini: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon_text: {
    fontFamily: Fonts.Medium,
    paddingTop: responsiveWidth(1),
    fontSize: responsiveFontSize(1.4),
  },

  row_quiz: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  quiz_card: {
    borderRadius: responsiveWidth(4),
    marginHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(3),
  },

  info_quiz: {
    // backgroundColor:'red'  ,
    textTransform: 'none',
    fontFamily: Fonts.Medium,
    marginTop: responsiveWidth(2),
    fontSize: responsiveFontSize(1.6),
  },

  title_quiz: {
    width: responsiveWidth(50),
    fontFamily: Fonts.Medium,
    marginLeft: responsiveWidth(3),
    fontSize: responsiveFontSize(2),
  },

  quiz_bg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(100),
  },

  quiz_img: {
    height: responsiveWidth(6),
    width: responsiveWidth(6),
  },

  // quiz area 

  card_area: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty_icon: {
    fontSize: responsiveFontSize(5),
    marginBottom: responsiveWidth(3),
  },
  empty_text: {
    fontFamily: 'Poppins-Medium',
    fontSize: responsiveFontSize(1.8),
    textAlign: 'center',
  },

  container: {
    height: '100%',
    width: '100%',
  },
})