import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchTodayContent = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.USER_CONTENT}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
};

export const submitQuizAnswer = async ({ contentId, selectedOptionId, timeTakenSeconds }) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.QUIZ_ATTEMPT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId, selectedOptionId, timeTakenSeconds }),
    });
    const data = await response.json();
    return data;
};

// like  

export const likeContent = async (contentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.LIKE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
    });
    return response.json();
};

export const unlikeContent = async (contentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.UNLIKE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
    });
    return response.json();
};

// bookmark

export const bookmarkContent = async (contentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.BOOKMARK}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
    });
    return response.json();
};

export const removeBookmarkContent = async (contentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.REMOVE_BOOKMARK}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId }),
    });
    return response.json();
};

// comment

export const fetchComments = async (contentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.FETCH_COMMENT}${contentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
};

export const postComment = async (contentId, text) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.USER_COMMENT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contentId, text }),
    });
    return response.json();
};

export const deleteComment = async (commentId) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.DELETE_COMMENT}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ commentId }),
    });
    return response.json();
};