import React from 'react';
import LottieView from 'lottie-react-native';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import { COLOURS } from '../assets/theme/Theme';
import { globalImages } from '../assets/images/images_file/All_Images';

import useLike from '../user/screens/home/likehook/UseLike';
import useBookmark from '../user/screens/home/bookmarkhook/useBookMark';

const Reaction = ({
    source,
    count,
    onPress,
    contentId,
    isLiked: initialLiked,
    isHeart,
    isBookmark,
    onUnbookmark,
    initialBookmarked
}) => {

    const { isLiked, count: likeCount, handleLike } = useLike(initialLiked ?? false, count ?? 0, contentId);

    const { isBookmarked, handleBookmark } = useBookmark(initialBookmarked ?? false, contentId, onUnbookmark);

    // ❤️ LIKE
    if (isHeart) {
        return (
            <TouchableOpacity onPress={handleLike} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(3) }}>
                {
                    isLiked
                        ? <LottieView source={globalImages.like_json} style={{ width: responsiveWidth(6), height: responsiveWidth(6) }} autoPlay loop={false} />
                        : <Image source={globalImages.heart} style={{ width: responsiveWidth(6), height: responsiveWidth(6) }} tintColor={COLOURS.grey} />
                }

                <Text style={{ marginLeft: responsiveWidth(1), fontSize: responsiveFontSize(1.6), color: isLiked ? COLOURS.primary : COLOURS.grey }}>
                    {likeCount}
                </Text>
            </TouchableOpacity>
        );
    }

    // 🔖 BOOKMARK
    if (isBookmark) {
        return (
            <TouchableOpacity onPress={handleBookmark} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(3) }}>

                {isBookmarked ? (
                    <Image
                        source={globalImages.save_filled}
                        style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                        tintColor={COLOURS.primary}
                    />) : (
                    <Image
                        source={globalImages.save_icon}
                        style={{ width: responsiveWidth(5), height: responsiveWidth(5) }}
                        tintColor={COLOURS.grey}
                    />)}
            </TouchableOpacity>
        );
    }

    // 💬 NORMAL
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(3) }}>
            <Image source={source} style={{ width: responsiveWidth(5), height: responsiveWidth(5) }} tintColor={COLOURS.grey} />

            <Text style={{ marginLeft: responsiveWidth(1), fontSize: responsiveFontSize(1.6), color: COLOURS.grey }}>
                {count}
            </Text>
        </TouchableOpacity>
    );
};

export default Reaction;

const styles = StyleSheet.create({

    react_img: {
        height: responsiveWidth(5.8),
        width: responsiveWidth(5.8),
    },

})