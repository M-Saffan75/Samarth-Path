// helper/ToastConfig.js

import React from 'react';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useTheme } from '../assets/themecontext/ThemeContext';

export const ToastConfig = () => {
  const { theme: COLOURS } = useTheme();

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#4CAF50',
          backgroundColor: COLOURS.primary,
        }}
        text1Style={{
          fontSize: responsiveFontSize(1.6),
          fontFamily: 'Poppins-Medium',
          color: COLOURS.black,
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: '#F44336',
          backgroundColor: COLOURS.primary,
        }}
        text1Style={{
          fontSize: responsiveFontSize(1.6),
          fontFamily: 'Poppins-Medium',
          color: COLOURS.black,
        }}
      />
    ),
  };
};

;