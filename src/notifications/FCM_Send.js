import messaging from '@react-native-firebase/messaging';
import { updateFCMToken } from '../user/screens/auth/auth_backend/Auth_Backend';

export const getUserFCMToken = async () => {
    try {
        const authStatus = await messaging().requestPermission();

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.log('Notification permission not granted');
            return;
        }

        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        const res = await updateFCMToken(token);

        console.log('FCM_Status',res.status);
        console.log('FCM_Message',res.message);
        console.log('FCM_Data',res.data);

    } catch (err) {
        console.log('Error Status:', err?.status);
        console.log('Error Message:', err?.message);
    }
};