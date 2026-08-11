import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const registerUser = async ({ name, phone, email, password, address }) => {
    console.log(name, phone, email, password, address)
    const response = await fetch(`${BASE_URL}${USER_API_URL.REGISTER}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, password, address }),
    });

    const data = await response.json();
    console.log('Api Response : ', data)
    if (!response.ok || !data.success) {
        const error = new Error(data.message || 'Registration failed');
        error.code = data.code;
        throw error;
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
    console.log('verifyemailsssss', data)

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
    console.log('login api res :', phone, password)
    const response = await fetch(`${BASE_URL}${USER_API_URL.LOGIN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Login failed');
        error.code = response.status;
        error.status = response.status;
        throw error;
    }

    return data;
};

// forogot/reset process

export const forgotPassword = async ({ phone }) => {
    console.log(phone)
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

// updateProfile function

export const updateProfile = async ({ name, email, phone, gender, dateOfBirth, address, selectedImage }) => {

    console.log(name, email, phone, gender, dateOfBirth, address, selectedImage)

    const token = await AsyncStorage.getItem('token');
    const parts = [
        { name: 'name', data: name },
        { name: 'email', data: email },
        { name: 'phone', data: phone },
        { name: 'gender', data: gender },
        { name: 'dateOfBirth', data: dateOfBirth },
        { name: 'address', data: address },
    ];

    if (selectedImage?.base64) {
        parts.push({
            name: 'profilePicture',
            filename: 'profile.jpg',
            type: 'image/jpeg',
            data: selectedImage.base64, // ← base64 string directly
        });
    }

    const res = await ReactNativeBlobUtil.fetch(
        'PUT',
        `${BASE_URL}${USER_API_URL.UPDATE_PROFILE}`,
        {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        parts
    );

    const json = JSON.parse(res.data);
    // console.log('Raw response:', JSON.stringify(json));
    return { ...json, statusCode: res.respInfo?.status };
};


export const verifyEmailOtp = async (token, otp) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.UPDATE_EMAIL}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'OTP verification failed');
        error.status = response.status;
        throw error;
    }

    return { data: data.data, status: response.status };
};


export const verifyPhoneOtp = async (token, otp) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.UPDATE_PHONE}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'OTP verification failed');
        error.status = response.status;
        throw error;
    }

    return { data: data.data, status: response.status };
};



export const logoutUser = async () => {
    const authToken = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.LOGOUT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || 'Failed to logout',
            data
        };
    }

    return {
        status: response.status,
        message: data.message || 'Success',
        data
    };
};

export const updateFCMToken = async (fcmToken) => {
    const authToken = await AsyncStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${USER_API_URL.FCM_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ fcmToken }),
    });
    const data = await response.json();

    if (!response.ok) {
        throw {
            status: response.status,
            message: data.message || 'Failed to update FCM token',
            data
        };
    }

    return {
        status: response.status,
        message: data.message || 'Success',
        data
    };
};

export const fetchNotifications = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${BASE_URL}${USER_API_URL.USER_NOTIFICATION}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const json = await res.json();
        return json;
    } catch (err) {
        console.log('Notifications fetch error:', err);
        return { success: false };
    }
};

export const updateNotificationSetting = async (type, value) => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${BASE_URL}${USER_API_URL.NOTIFICAION_SETTING}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, value }),
    });

    return res.json();
};

// fetch notification status

export const getNotificationSettings = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(`${BASE_URL}${USER_API_URL.NOTIFICAION_SETTING}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to load settings');
        }

        return data.data;
    } catch (error) {
        console.log('GET Notification Settings Error:', error);
        throw error;
    }
};