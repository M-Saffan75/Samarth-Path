import Card_info from '../../../data/Data';
import Header from '../../../components/Header';
import { COLOURS } from '../../../assets/theme/Theme';
import Title_Here from '../../../components/Title_Here';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import {useTheme} from '../../../assets/themecontext/ThemeContext';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { AppState, RefreshControl, StatusBar, StyleSheet, Text, View } from 'react-native';


import { fetchTodayContent } from '../../screens/home/homebackend/HomeBackend';

import { FlashList } from '@shopify/flash-list';
import VideoCard from '../../../components/VideoCard';
import ImageCard from '../../../components/ImageCard';
import QuizCard from '../../../components/QuizCard';
import { useLoader } from '../../../loading/LoaderContext';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  
  const { theme: COLOURS, isDark } = useTheme();
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading } = useLoader();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await fetchTodayContent();
      if (res.success && res.data.length > 0) {
        // API ka content array nikalo
        const items = res.data[0].content;
        const normalized = items.map((item) => ({
          id: item._id,
          type: item.contentType === 'text' ? 'image' : item.contentType,
          // Video
          video: item.videoContent?.videoUrl || null,
          thumbnail: item.videoContent?.thumbnail || null,
          // Image/Text
          image: item.textContent?.image || null,
          label: item.textContent?.label || null,
          // Common
          schedule: item.videoContent?.title || item.textContent?.title || item.quizContent?.title || '',
          title: item.videoContent?.title || item.textContent?.title || item.quizContent?.title || '',
          description: item.videoContent?.description || item.textContent?.description || '',
          // Quiz
          question: item.quizContent?.question || null,
          options: item.quizContent?.options || [],
          correct_id: null, // API submit ke baad aayega
          timerSeconds: item.quizContent?.timerSeconds || 180,
          isLiked: item.isLiked,
          likesCount: item.likesCount,
          commentsCount: item.commentsCount,
          bookmarksCount: item?.bookmarkssCount || 0,
        }));
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

  const refreshCounts = async () => {
    try {
      // koi loader nahi — background mein
      const res = await fetchTodayContent(true);
      if (res.success && res.data.length > 0) {
        const items = res.data[0].content;
        setContentList(prev => prev.map(card => {
          const fresh = items.find(i => i._id === card.id);
          if (!fresh) return card;
          return {
            ...card,
            likesCount: fresh.likesCount,
            commentsCount: fresh.commentsCount,
            bookmarksCount: fresh?.bookmarksCount,
          };
        }));
      }
    } catch (e) {
      console.log('Count refresh error:', e);
    }
  };


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

          <View style={[styles.card_area,{backgroundColor: COLOURS.white,}]}>
            {contentList.length > 0 ? (
              <FlashList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLOURS.primary]}
                    tintColor={COLOURS.primary}
                  />
                }
                data={contentList}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={responsiveWidth(100)}
                onScrollBeginDrag={() => setActiveVideoId(null)}
                removeClippedSubviews={true}
                contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
                renderItem={({ item }) => {
                  if (item.type === 'video') return <VideoCard item={item} activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />;
                  if (item.type === 'image') return <ImageCard item={item} />;
                  if (item.type === 'quiz') return <QuizCard item={item} navigation={navigation} />;
                  return null;
                }}
              />
            ) : (
              <View style={styles.empty}>
                <Text style={[styles.empty_icon,{color: COLOURS.light_grey,}]}>𝌮</Text>
                <Text style={[styles.empty_text,{color: COLOURS.light_grey,}]}>No content available for today!</Text>
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