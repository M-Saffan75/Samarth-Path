// hooks/useLike.js
import { useState } from 'react';
import { likeContent, unlikeContent } from '../homebackend/HomeBackend';

const useLike = (initialLiked, initialCount, contentId) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);

    const handleLike = async () => {
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        setCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            if (newLiked) {
                await likeContent(contentId);
            } else {
                await unlikeContent(contentId);
            }
        } catch (e) {
            // API fail → revert karo
            setIsLiked(!newLiked);
            setCount(prev => newLiked ? prev - 1 : prev + 1);
            console.log('Like error:', e);
        }
    };

    return { isLiked, count, handleLike };
};

export default useLike;