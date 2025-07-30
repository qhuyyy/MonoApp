/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import ButtonCustom from '../../components/ButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WelcomeStackParamList } from '../../navigations/WelcomeStack';
import { useTranslation } from 'react-i18next';

type OnboardingScreenProps = NativeStackScreenProps<
  WelcomeStackParamList,
  'Onboarding'
>;

const CustomDot = ({ selected }: { selected: boolean }) => (
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

const SkipButton = ({
  ...props
}: {
  onPress: () => void;
  [key: string]: any;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={{ marginLeft: 16 }} {...props}>
      <Text style={styles.onboardAction}>{t('skip')}</Text>
    </TouchableOpacity>
  );
};

// Ẩn nút Next và Done bằng cách trả về null
const HiddenButton = () => null;

export default function OnboardingScreen({
  navigation,
}: OnboardingScreenProps) {
  const { t } = useTranslation();

  const onboardingPages = [
    {
      backgroundColor: '#fff',
      image: (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('../../assets/animations/coin.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: <Text style={styles.title}>{t('welcome-to-mono-app')}</Text>,
      subtitle: <Text style={styles.subtitle}>{t('welcome-subtitle')}</Text>,
    },
    {
      backgroundColor: '#fff',
      image: (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('../../assets/animations/money.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: <Text style={styles.title}>{t('track-income-expenses')}</Text>,
      subtitle: (
        <Text style={styles.subtitle}>
          {t('track-income-expenses-subtitle')}
        </Text>
      ),
    },
    {
      backgroundColor: '#fff',
      image: (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('../../assets/animations/flying-money.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: <Text style={styles.title}>{t('financial-insights')}</Text>,
      subtitle: (
        <Text style={styles.subtitle}>{t('financial-insights-subtitle')}</Text>
      ),
    },
    {
      backgroundColor: '#fff',
      image: (
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('../../assets/animations/benefits.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ),
      title: <Text style={styles.title}>{t('spend-smarter-save-more')}</Text>,
      subtitle: (
        <View style={{ marginTop: 30 }}>
          <ButtonCustom
            text={t('get-started')}
            onPress={() => navigation.navigate('GetStarted')}
          />
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Onboarding
        pages={onboardingPages}
        SkipButtonComponent={props => (
          <SkipButton
            {...props}
            onPress={() => navigation.navigate('GetStarted')}
          />
        )}
        NextButtonComponent={HiddenButton}
        DoneButtonComponent={HiddenButton}
        DotComponent={CustomDot}
        containerStyles={{ backgroundColor: '#fff' }}
        showNext={false}
        showDone={false}
      />
    </View>
  );
}

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
    fontWeight: '600',
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
