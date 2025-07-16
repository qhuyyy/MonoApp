import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import ButtonCustom from '../components/ButtonCustom';

const OnboardingScreen = () => {
  const CustomDot = ({ selected }: { selected: boolean }) => {
    return (
      <View
        style={{
          height: 8,
          width: 8,
          borderRadius: 4,
          marginHorizontal: 3,
          backgroundColor: selected ? '#438883' : '#d3d3d3',
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={require('../assets/animations/coin.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: <Text style={styles.title}>Welcome to Mono App</Text>,
            subtitle: (
              <Text style={styles.subtitle}>
                Easily manage your personal expenses and take control of your
                finances.
              </Text>
            ),
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={require('../assets/animations/money.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: <Text style={styles.title}>Track Income & Expenses</Text>,
            subtitle: (
              <Text style={styles.subtitle}>
                Record every transaction and monitor your daily spending habits.
              </Text>
            ),
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={require('../assets/animations/flying-money.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: <Text style={styles.title}>Financial Insights</Text>,
            subtitle: (
              <Text style={styles.subtitle}>
                Visualize your financial data with clear and insightful reports.
              </Text>
            ),
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottieWrapper}>
                <LottieView
                  source={require('../assets/animations/benefits.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: <Text style={styles.title}>Spend Smarter Save More</Text>,
            subtitle: (
              <View style={{marginTop: 30}}>
                <ButtonCustom text="Get Started" />
              </View>
            ),
          },
        ]}
        SkipButtonComponent={props => (
          <TouchableOpacity style={{ marginLeft: 16 }} {...props}>
            <Text style={styles.onboardAction}>Skip</Text>
          </TouchableOpacity>
        )}
        NextButtonComponent={props => (
          <TouchableOpacity style={{ marginRight: 16 }} {...props}>
            <Text style={styles.onboardAction}>Next</Text>
          </TouchableOpacity>
        )}
        DoneButtonComponent={props => (
          <TouchableOpacity style={{ marginRight: 16 }} {...props}>
            <Text style={styles.onboardAction}>Done</Text>
          </TouchableOpacity>
        )}
        containerStyles={{ backgroundColor: '#fff' }}
        DotComponent={CustomDot}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  title: {
    color: '#438883',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 60,
  },
  subtitle: {
    color: '#438883',
    fontSize: 18,
    fontWeight: 'semibold',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  onboardAction: {
    color: '#438883',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
