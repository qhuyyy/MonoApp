/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#429690', '#2A7C76']}
        style={styles.linearGradient}
      >
        <Text style={styles.text}>mono</Text>
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 24 }}
        />
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 50,
  },
  lottieWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
