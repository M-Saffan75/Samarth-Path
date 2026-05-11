// hooks/useLike.js
import { useState, useEffect } from 'react';
import { likeContent, unlikeContent } from '../homebackend/HomeBackend';
import { useContent } from '../../../../user/context/ContentProvider';


const useLike = (initialLiked, initialCount, contentId) => {

    const { likedIds, likeCounts, toggleLike, initializeLike } = useContent();


    useEffect(() => {
        initializeLike(contentId, initialLiked ?? false, initialCount ?? 0);
    }, []);


    const isLiked = likedIds.has(contentId);
    const count = likeCounts[contentId] ?? initialCount ?? 0;

    // useEffect(() => {
    //     if (initialLiked) {
    //         toggleLike(contentId, true);
    //     }
    // }, []);

    const handleLike = async () => {
        const newLiked = !isLiked;
        toggleLike(contentId, newLiked, count);
        try {
            if (newLiked) await likeContent(contentId);
            else await unlikeContent(contentId);
        } catch (e) {
            toggleLike(contentId, !newLiked, count); // revert
        }
    }

    return { isLiked, count, handleLike };
};
export default useLike;