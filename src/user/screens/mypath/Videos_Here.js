import React, { useEffect, useState } from 'react';
import { COLOURS } from '../../../assets/theme/Theme';
import Title_Here from '../../../components/Title_Here';
import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { FlashList } from '@shopify/flash-list';
import VideoCard from '../../../components/VideoCard';
import { fetchBookmarks } from '../../screens/mypath/mypathbackend/MyPathBackend';
import { useLoader } from '../../../loading/LoaderContext';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { FadeUp } from '../../../components/FadeUp';

const Videos_Here = ({ navigation }) => {

  const { theme: COLOURS, isDark } = useTheme();
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { setLoading } = useLoader();

  useEffect(() => {
    loadBookmarkedVideos();
  }, []);

  const loadBookmarkedVideos = async () => {
    try {
      setLoading(true);
      const res = await fetchBookmarks();
      if (res.success) {
        // sirf video type filter karo
        const onlyVideos = res.data
          .filter(item => item.contentType === 'video')
          .map(item => ({
            id: item._id,
            type: 'video',
            video: item.videoContent?.videoUrl || null,
            thumbnail: item.videoContent?.thumbnail || null,
            schedule: item.videoContent?.title || '',
            title: item.videoContent?.title || '',
            description: item.videoContent?.description || '',
            isLiked: item.isLiked || false,
            likesCount: item.likesCount || 0,
            commentsCount: item.commentsCount || 0,
            isArchived: true, // bookmark screen pe hamesha bookmarked
          }));
        setVideos(onlyVideos);
      }
    } catch (e) {
      console.log('Bookmark videos error:', e);
    } finally {
      setLoading(false);
    }
  };



  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarkedVideos();
    setRefreshing(false);
  };


  return (
    <FlashList
      data={videos}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLOURS.primary]}      // Android
          tintColor={COLOURS.primary}     // iOS
        />
      }
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={responsiveWidth(100)}
      onScrollBeginDrag={() => setActiveVideoId(null)}
      removeClippedSubviews={true}
      contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
      renderItem={({ item }) => (
        <FadeUp>
          <VideoCard
            item={item}
            activeVideoId={activeVideoId}
            setActiveVideoId={setActiveVideoId}
            onUnbookmark={(id) => setVideos(prev => prev.filter(v => v.id !== id))}
          />
        </FadeUp>
      )}
      ListEmptyComponent={
        <View>
          <View style={styles.bg_img}>
            <Image source={globalImages.app_logo} style={styles.logo_img} tintColor={COLOURS.primary} />
          </View>
          <Title_Here title={'no saved videos'} textAlign={'center'} />
          <Title_Here
            title={'save spiritual videos to read them later...'}
            fontSize={responsiveFontSize(1.7)}
            textAlign={'center'}
            color={COLOURS.light_black}
            marginTop={responsiveWidth(1)}
          />
        </View>
      }
    />
  );
};

export default Videos_Here;

const styles = StyleSheet.create({
  bg_img: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    marginTop: responsiveWidth(80),
    borderRadius: responsiveWidth(3),
    backgroundColor: COLOURS.light_grey,
  },
  logo_img: {
    alignSelf: 'center',
    width: responsiveWidth(15),
    height: responsiveWidth(15),
  }
});