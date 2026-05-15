import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SecureOverlay = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Content Protected 🔐
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SecureOverlay;