import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';

export const registerUser = async ({ name, phone, email, password }) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.REGISTER}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, password }),
    });

    const data = await response.json();
    console.log('data', data)
    if (!response.ok) {
        const error = new Error(data.message || 'Registration failed');
        error.code = data.code; // ✅ phir code set karo
        throw error; // ✅ phir throw karo
    }

    return data;
};


export const resendOtp = async ({ phone }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.RESEND_OTP}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Resend OTP failed');
        error.code = data.code;
        throw error;
    }

    return data;
};

export const verifyOtp = async ({ phone, otp }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.VERIFY_PHONE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (response.status === 410) { // ✅ OTP expired
        const error = new Error(data.message);
        error.code = 410;
        throw error;
    }
    if (!response.ok) {
        console.log(data.code);
        throw new Error(data.message || 'OTP verification failed');
    }

    return data;
};


export const loginUser = async ({ phone, password }) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.LOGIN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
    });

    console.log(phone, password)
    const data = await response.json();
    if (response.status === 403) {
        const error = new Error(data.message);
        error.code = 403;
        throw error;
    }

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
};

// forogot/reset process

export const forgotPassword = async ({ phone }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || 'Forgot password failed');
    }

    return data;
};


export const verifyResetOtp = async ({ phone, otp }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.RESET_OTP}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        error.code = data.code;
        throw new Error(data.message || 'OTP verification failed');
    }

    return data;
};


export const resetPassword = async ({ phone, newPassword }) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.NEW_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || 'Reset password failed');
    }

    return data;
};



export const changedpassword = async ({ currentPassword, newPassword }) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || 'Reset password failed');
    }

    return data;
};


export const getUserMe = async (token) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.ME}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
};