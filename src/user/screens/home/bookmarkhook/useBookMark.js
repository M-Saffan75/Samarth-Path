import { useState, useEffect } from 'react';
import { bookmarkContent, removeBookmarkContent } from '../homebackend/HomeBackend';
import { useContent } from '../../../../user/context/ContentProvider';

const useBookMark = (initialBookmarked, contentId, onUnbookmark) => {
    const { bookmarkedIds, toggleBookmark } = useContent();
    
    const isBookmarked = bookmarkedIds.has(contentId) ?? initialBookmarked;

    useEffect(() => {
        if (initialBookmarked) {
            toggleBookmark(contentId, true);
        }
    }, []);

    const handleBookmark = async () => {
        const newBookmarked = !isBookmarked;
        toggleBookmark(contentId, newBookmarked); // ← global update
        try {
            if (newBookmarked) await bookmarkContent(contentId);
            else {
                await removeBookmarkContent(contentId);
                onUnbookmark?.();
            }
        } catch (e) {
            toggleBookmark(contentId, !newBookmarked); // revert
        }
    };

    return { isBookmarked, handleBookmark };
};

export default useBookMark;