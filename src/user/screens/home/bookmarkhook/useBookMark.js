import { useState } from 'react';
import { bookmarkContent, removeBookmarkContent } from '../homebackend/HomeBackend';

const useBookMark = (initialBookmarked, contentId, onUnbookmark) => {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

    const handleBookmark = async () => {
        const newBookmarked = !isBookmarked;
        setIsBookmarked(newBookmarked); // optimistic

        try {
            if (newBookmarked) {
                const res = await bookmarkContent(contentId);
                console.log('Bookmark res:', res);
            } else {
                const res = await removeBookmarkContent(contentId);
                console.log('Unbookmark res:', res);
                onUnbookmark?.();
            }
        } catch (e) {
            setIsBookmarked(!newBookmarked); // revert
            console.log('Bookmark error:', e);
        }
    };

    return { isBookmarked, handleBookmark };
};

export default useBookMark;