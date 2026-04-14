// helper/ToastConfig.js
import React from 'react';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { COLOURS } from '../assets/theme/Theme';

export const ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50', backgroundColor: COLOURS.light_grey }}
      text1Style={{
        fontSize: responsiveFontSize(1.6),
        fontFamily: 'Poppins-Medium',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#F44336', backgroundColor: COLOURS.light_grey }}
      text1Style={{
        fontSize: responsiveFontSize(1.6),
        fontFamily: 'Poppins-Medium',
      }}
    />
  ),
};