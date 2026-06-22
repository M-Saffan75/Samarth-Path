import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';

const NGROK_URL = 'https://synopsis-creative-crumpled.ngrok-free.dev'

export const createSubscriptionOrder = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const orderRes = await fetch(
            `${BASE_URL}/api/user/subscription/create-order`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: 199,
                    paymentMethod: 'upi',
                }),
            }
        );

        console.log('Response Status:', orderRes.status);
        const orderData = await orderRes.json();
        console.log('Order Data:', orderData);

        if (!orderData.success || !orderData.data) {
            throw new Error(orderData.message || 'Order create failed');
        }

        return { token, orderData, };
    } catch (error) {
        console.log('Create Order Error:', error);
        throw error;
    }
};

export const verifySubscriptionPayment = async ({ token, paymentData, }) => {
    console.log('token, paymentData<><><><><><>', token, paymentData,)
    try {
        const verifyRes = await fetch(
            `${BASE_URL}/api/user/subscription/verify-payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    razorpay_payment_id: paymentData.razorpay_payment_id,
                    razorpay_order_id: paymentData.razorpay_order_id,
                    razorpay_signature: paymentData.razorpay_signature,
                }),
            }
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            throw new Error(
                verifyData.message || 'Payment Verification Failed'
            );
        }

        return verifyData;
    } catch (error) {
        console.log('Verify Payment Error:', error);
        throw error;
    }
};

export const buildRazorpayOptions = (orderData) => {
    return {
        description: 'Subscription Payment',
        currency: 'INR',
        key: 'rzp_test_SwLX9wqJpVXeDX',
        amount: orderData.data.amount,
        order_id: orderData.data.orderId,
        name: 'Samarth Path',

        prefill: {
            email: 'user@example.com',
            contact: '9999999999',
            name: 'User Name',
        },
        theme: {
            color: '#000',
        },
    };
};

export const cancelSubscription = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(`${BASE_URL}${USER_API_URL.CANCEL_SUBSCRIPTION}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        console.log('Cancel Subscription Response:', data);

        if (!data.success) {
            throw new Error(data.message || 'Cancel subscription failed');
        }
        return data;
    } catch (error) {
        console.log('Cancel Subscription Error:', error);
        throw error;
    }
};