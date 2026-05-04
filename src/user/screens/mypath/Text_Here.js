import React, { useEffect, useState } from 'react';
import Title_Here from '../../../components/Title_Here';
import { FlashList } from '@shopify/flash-list';
import { FadeUp } from '../../../components/FadeUp';
import ImageCard from '../../../components/ImageCard';
import { useLoader } from '../../../loading/LoaderContext';
import { fetchBookmarks } from './mypathbackend/MyPathBackend';
import { useTheme } from '../../../assets/themecontext/ThemeContext';
import { Image, RefreshControl, StyleSheet, View } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const Images_Here = () => {

    const { theme: COLOURS, isDark } = useTheme();
    const [images, setImages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { setLoading } = useLoader();


    useEffect(() => {
        loadBookmarkedImages();
    }, []);

    const loadBookmarkedImages = async (isRefresh = false) => {
        try {
            if (!isRefresh) setLoading(true);
            const res = await fetchBookmarks();
            if (res.success) {
                const onlyImages = res.data
                    .filter(item => item.contentType === 'text') // ← text type = image card
                    .map(item => ({
                        id: item._id,
                        type: 'image',
                        image: item.textContent?.image || null,
                        schedule: item.textContent?.title || '',
                        title: item.textContent?.title || '',
                        description: item.textContent?.description || '',
                        label: item.textContent?.label || '',
                        isLiked: item.isLiked || false,
                        likesCount: item.likesCount || 0,
                        commentsCount: item.commentsCount || 0,
                        isArchived: true,
                    }));
                setImages(onlyImages);
            }
        } catch (e) {
            console.log('Bookmark images error:', e);
        } finally {
            if (!isRefresh) setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookmarkedImages();
        setRefreshing(false);
    };

    return (
        <FlashList
            data={images}
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
                    <ImageCard
                        item={item}
                        onUnbookmark={(id) => setImages(prev => prev.filter(i => i.id !== id))}
                    />
                </FadeUp>
            )}
            ListEmptyComponent={
                <View>
                    <View style={[styles.bg_img, { backgroundColor: COLOURS.light_grey, }]}>
                        <Image source={globalImages.app_logo} style={styles.logo_img} tintColor={COLOURS.primary} />
                    </View>
                    <Title_Here title={'no saved posts'} textAlign={'center'} />
                    <Title_Here
                        title={'save spiritual posts to read them later...'}
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

export default Images_Here;

const styles = StyleSheet.create({
    bg_img: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        marginTop: responsiveWidth(80),
        borderRadius: responsiveWidth(3),
    },
    logo_img: {
        alignSelf: 'center',
        width: responsiveWidth(15),
        height: responsiveWidth(15),
    }
});