import { responsiveWidth } from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';

export const showError = (message) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: 3000,
    topOffset: responsiveWidth(17),
    autoHide: true,
  });
};

export const showSuccess = (message) => {
  Toast.show({
    type: 'success',
    text1: message,
    position: 'top',
    visibilityTime: 3000,
    topOffset: responsiveWidth(17),
    autoHide: true,
  });
};