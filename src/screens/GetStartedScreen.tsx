import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import FormInput from '../components/FormInput';

const GetStartedScreen = () => {
  return (
    <LinearGradient
      colors={['#429690', '#2A7C76']}
      style={styles.linearGradient}
    >
      <Text style={styles.title}>Let's Get Started!</Text>

      <Text style={styles.subTitle}>
        We gonna need some of your information first
      </Text>

      <View style={styles.formContainer}>
        <FormInput title="Full Name:" placeholder="Enter your full name" />
      </View>

      <View style={styles.formContainer}>
        <FormInput title="Email:" placeholder="Enter your email" />
      </View>
    </LinearGradient>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  subTitle: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    width: windowWidth - 60,
    aspectRatio: 3 / 4,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'center',
  },
});
