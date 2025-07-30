import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigations/RootStack';
import SplashScreen from './src/screens/Welcome/SplashScreen';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from './src/stores/useSettingsStore';
import { darkTheme, lightTheme } from './src/constants/Theme';
import './src/config/i18n';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, loadSettings } = useSettingsStore();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    loadSettings();
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={currentTheme}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <RootStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
