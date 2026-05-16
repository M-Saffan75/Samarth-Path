import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../api_url/BASE_URL';
import { USER_API_URL } from '../../user_api_url/USER_API_URL';

const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
};

export const fetchConsultantMessages = async () => {
    try {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}${USER_API_URL.CONSULTANT_MESSAGES}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log('fetchConsultantMessages error:', e);
        return { success: false };
    }
};

export const sendConsultantMessage = async (message) => {
    try {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}${USER_API_URL.SEND_CONSULTANT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message }),
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log('sendConsultantMessage error:', e);
        return { success: false };
    }
};


/**
 * Format time from backend createdAt
 * Output: "5/15/2026  5:25 PM"
 */
export const formatChatTime = (dateStr) => {
    const date = new Date(dateStr);
 
    const month = date.getMonth() + 1;        // 1–12
    const day = date.getDate();               // 1–31
    const year = date.getFullYear();          // e.g. 2026
 
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
 
    return `${month}/${day}/${year}  ${h}:${m} ${ampm}`;
};
 
/**
 * Used ONLY for optimistic (temp) messages while modal is open.
 * Once modal closes + reopens, backend time replaces this.
 * Output: "Just now" or "Xs ago" / "Xm ago"
 */
export const formatOptimisticTime = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return formatChatTime(dateStr); // fallback to full format
};