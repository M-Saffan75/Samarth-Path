import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {

    const [likedIds, setLikedIds] = useState(new Set());
    const [likeCounts, setLikeCounts] = useState({});
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

    const initializeLike = (id, isLiked, count) => {
        setLikedIds(prev => {
            if (prev.has(id)) return prev; // ← already hai toh mat badlo
            const next = new Set(prev);
            if (isLiked) next.add(id);
            return next;
        });
        setLikeCounts(prev => {
            if (prev[id] !== undefined) return prev; // ← already hai toh mat badlo
            return { ...prev, [id]: count };
        });
    };

    const toggleLike = (id, isLiked, currentCount) => {
        setLikedIds(prev => {
            const next = new Set(prev);
            isLiked ? next.add(id) : next.delete(id);
            return next;
        });
        setLikeCounts(prev => ({
            ...prev,
            [id]: isLiked
                ? (prev[id] ?? currentCount) + 1
                : (prev[id] ?? currentCount) - 1,
        }));
    };


    const toggleBookmark = (id, isBookmarked) => {
        setBookmarkedIds(prev => {
            const next = new Set(prev);
            isBookmarked ? next.add(id) : next.delete(id);
            return next;
        });
    };

    return (
        <ContentContext.Provider value={{ likedIds, bookmarkedIds, likeCounts, initializeLike, toggleLike, toggleBookmark }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);