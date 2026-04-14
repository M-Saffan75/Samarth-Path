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

    if (!response.ok) {
        const error = new Error(data.message || 'Registration failed'); // ✅ pehle banao
        error.code = data.code; // ✅ phir code set karo
        throw error; // ✅ phir throw karo
    }

    return data;
};


export const resendOtp = async ({ email }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.RESEND_OTP}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Resend OTP failed'); // ✅ pehle banao
        error.code = data.code;
        throw error; }

    return data;
};

export const verifyOtp = async ({ email, otp }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.VERIFY_EMAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
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


export const loginUser = async ({ email, password }) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.LOGIN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

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

export const forgotPassword = async ({ email }) => {

    const response = await fetch(`${BASE_URL}${USER_API_URL.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || 'Forgot password failed');
    }

    return data;
};


export const verifyResetOtp = async ({ email, otp }) => {
    console.log(`${BASE_URL}${USER_API_URL.RESET_OTP}`);

    const response = await fetch(`${BASE_URL}${USER_API_URL.RESET_OTP}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        error.code = data.code;
        throw new Error(data.message || 'OTP verification failed');
    }

    return data;
};


export const resetPassword = async ({ email, newPassword }) => {
    const response = await fetch(`${BASE_URL}${USER_API_URL.NEW_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.log(data.message);
        throw new Error(data.message || 'Reset password failed');
    }

    return data;
};

