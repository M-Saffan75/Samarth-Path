import React, { useEffect, useState } from 'react';
import { COLOURS } from '../../../assets/theme/Theme';
import Title_Here from '../../../components/Title_Here';
import { Image, StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlashList } from '@shopify/flash-list';
import Reaction from '../../../components/Reaction';
import { Fonts } from '../../../assets/fonts/Fonts';
import CommentSheet from '../../../components/CommentSheet';
import { fetchBookmarks } from './mypathbackend/MyPathBackend';
import { useLoader } from '../../../loading/LoaderContext';
import { FadeUp } from '../../../components/FadeUp';
import { useTheme } from '../../../assets/themecontext/ThemeContext';


const QuizItem = ({ item, onUnbookmark }) => {

  const { theme: COLOURS, isDark } = useTheme();
  const [showComments, setShowComments] = useState(false);



  return (
    <View style={{
      backgroundColor: COLOURS.light_primary, paddingHorizontal: responsiveWidth(4),
      paddingVertical: responsiveWidth(4), borderRadius: responsiveWidth(4),
      marginHorizontal: responsiveWidth(4), marginTop: responsiveWidth(3),
    }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={globalImages.app_logo}
            style={{ height: responsiveWidth(6), width: responsiveWidth(6) }}
            tintColor={COLOURS.primary} />
          <Text style={{
            paddingLeft: responsiveWidth(1), textTransform: 'uppercase',
            fontFamily: Fonts.Medium, top: responsiveWidth(.5), color: COLOURS.primary
          }}>{item.schedule}</Text>
        </View>
        <Text style={{
          textTransform: 'uppercase', fontFamily: Fonts.Medium,
          top: responsiveWidth(.5), color: COLOURS.grey
        }}>Quiz</Text>
      </View>

      {/* Question */}
      <Text style={{
        marginTop: responsiveWidth(3), fontSize: responsiveFontSize(1.8),
        fontFamily: Fonts.Medium, color: COLOURS.black, lineHeight: responsiveWidth(5),
      }}>
        {item.question}
      </Text>

      {/* Options — read only */}
      {item.options.map((option, index) => (
        <View key={option.id} style={{
          flexDirection: 'row', alignItems: 'center',
          marginTop: responsiveWidth(2),
        }}>
          <Image
            source={globalImages.unselect}
            style={{ height: responsiveWidth(5), width: responsiveWidth(5) }}
            tintColor={COLOURS.black}
          />
          <Text style={{
            paddingLeft: responsiveWidth(3), fontSize: responsiveFontSize(1.6),
            fontFamily: Fonts.Regular, color: COLOURS.black,
            textTransform: 'capitalize', width: '90%',
          }}>
            {option.text}
          </Text>
        </View>
      ))}

      {/* Divider */}
      <View style={{
        width: '91%', height: responsiveWidth(.2), backgroundColor: COLOURS.grey,
        marginTop: responsiveWidth(3), alignSelf: 'center'
      }} />

      {/* Reactions */}
      <View style={{
        marginTop: responsiveWidth(2.5), flexDirection: 'row',
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <Reaction isHeart contentId={item.id} isLiked={item.isLiked} count={item.likesCount} />
        <Reaction source={globalImages.comment} count={item.commentsCount} onPress={() => setShowComments(true)} />
        <Reaction isBookmark contentId={item.id} initialBookmarked={true} onUnbookmark={() => onUnbookmark?.(item.id)} />
      </View>

      <CommentSheet isOpen={showComments} onClose={() => setShowComments(false)} postId={item.id} />
    </View>
  );
};



const Quiz_Here = () => {

  const [quizzes, setQuizzes] = useState([]);
  const { setLoading } = useLoader();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookmarkedQuizzes();
  }, []);

  const loadBookmarkedQuizzes = async (isRefresh = null) => {
    try {
      if (!isRefresh) setLoading(true);
      const res = await fetchBookmarks();
      if (res.success) {
        const onlyQuizzes = res.data
          .filter(item => item.contentType === 'quiz')
          .map(item => ({
            id: item._id,
            schedule: item.quizContent?.title || 'afternoon',
            question: item.quizContent?.question || '',
            options: item.quizContent?.options || [],
            isLiked: item.isLiked || false,
            likesCount: item.likesCount || 0,
            commentsCount: item.commentsCount || 0,
          }));
        setQuizzes(onlyQuizzes);
      }
    } catch (e) {
      console.log('Bookmark quizzes error:', e);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookmarkedQuizzes();
    setRefreshing(false);
  };

  return (
    <FlashList
      data={quizzes}
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
      removeClippedSubviews={true}
      contentContainerStyle={{ paddingBottom: responsiveWidth(5) }}
      renderItem={({ item }) => (
        <FadeUp>
          <QuizItem
            item={item}
            onUnbookmark={(id) => setQuizzes(prev => prev.filter(q => q.id !== id))}
          />
        </FadeUp>
      )}
      ListEmptyComponent={
        <View>
          <View style={styles.bg_img}>
            <Image source={globalImages.app_logo} style={styles.logo_img} tintColor={COLOURS.primary} />
          </View>
          <Title_Here title={'no saved Quiz'} textAlign={'center'} />
          <Title_Here
            title={'save spiritual Quiz to see them later...'}
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

export default Quiz_Here;

const styles = StyleSheet.create({
  bg_img: {
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    width: responsiveWidth(20), height: responsiveWidth(20),
    marginTop: responsiveWidth(80), borderRadius: responsiveWidth(3),
    backgroundColor: COLOURS.light_grey,
  },
  logo_img: {
    alignSelf: 'center', width: responsiveWidth(15), height: responsiveWidth(15),
  }
});