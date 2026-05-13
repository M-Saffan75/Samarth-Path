import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';


export const fetchBookmarks = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.FETCH_BOOKMARK}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
};


export const fetchArchive = async (date) => {
    const token = await AsyncStorage.getItem('token');

    try {
        const response = await fetch(
            `${BASE_URL}/user/content/archive/by-date/?date=${date}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || 'Failed to fetch archive');
        }

        return json;

    } catch (error) {
        console.log('Archive fetch error:', error.message);

        return {
            success: false,
            message: error.message,
        };
    }
};
