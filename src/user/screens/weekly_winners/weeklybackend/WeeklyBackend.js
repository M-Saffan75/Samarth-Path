import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Fetch Weekly Winners (Current + Last Week) ────────────────────────────
export const fetchWeeklyWinners = async (options = {}) => {
    // backward compatible: fetchWeeklyWinners('10') ya fetchWeeklyWinners(10) bhi chalega
    const opts = typeof options === 'object' && options !== null ? options : { days: options };
    const { days = null, daily = false, weekly = false, winner = false } = opts;

    try {
        const token = await AsyncStorage.getItem('token');

        const queryParts = [];
        if (daily) queryParts.push('daily=true');
        if (weekly) queryParts.push('weekly=true');
        if (winner) queryParts.push('winner');
        if (days) queryParts.push(`days=${days}`);

        const url = `${BASE_URL}${USER_API_URL.WINNERS}${queryParts.length ? `?${queryParts.join('&')}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            return { success: true, data: json.data };
        }
        return { success: false, data: null };
    } catch (error) {
        console.error('fetchWeeklyWinners error:', error);
        return { success: false, data: null };
    }
};

// ─── Fetch User's Weekly Score ─────────────────────────────────────────────

export const fetchWeeklyScore = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${USER_API_URL.WINNER_SCORE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const json = await response.json();
        if (json.success) {
            return { success: true, data: json.data };
        }
        return { success: false, data: null };
    } catch (error) {
        console.error('fetchWeeklyScore error:', error);
        return { success: false, data: null };
    }
};