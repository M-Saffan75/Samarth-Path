import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../../api_url/BASE_URL';
import { USER_API_URL } from '../../../user_api_url/USER_API_URL';


export const createSubscriptionOrder = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const orderRes = await fetch(
            `${BASE_URL}/user/subscription/recurring/create`,
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

        // console.log('Response Status:', orderRes.status);
        const orderData = await orderRes.json();
        // console.log('Order Data:', orderData);

        if (!orderData.success || !orderData.data) {
            throw new Error(orderData.message || 'Order create failed');
        }

        return { token, orderData, };
    } catch (error) {
        console.log('Create Order Error:', error);
        throw error;
    }
};

export const verifySubscriptionPayment = async ({ token, paymentData, subsID }) => {
    const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
    } = paymentData;

    console.log('Verify Payload >>>', {
        token,
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
        subsID,
    });

    try {
        const verifyRes = await fetch(
            `${BASE_URL}/user/subscription/recurring/verify`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    razorpay_payment_id,
                    razorpay_subscription_id,
                    razorpay_signature,
                    subsID, // backend se mile hue subscription_id bhi bhej rahe (cross-check ke liye)
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

export const buildRazorpayOptions = (orderData, name, email, phone) => {
    return {
        description: 'Subscription Payment',
        currency: 'INR',
        key: orderData.data.key,
        amount: orderData.data.amount,
        order_id: orderData.data.orderId,
        subscription_id: orderData.data.razorpaySubscriptionId, // yahi zaroori hai
        name: 'Samarth Path',
        prefill: {
            email: email,
            contact: phone,
            name: name,
        },
        theme: { color: '#000' },
        method: {
            emi: true,
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