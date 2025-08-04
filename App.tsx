import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigations/RootStack';
import SplashScreen from './src/screens/Welcome/SplashScreen';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSettingsStore } from './src/stores/useSettingsStore';
import { darkTheme, lightTheme } from './src/constants/Theme';
import './src/config/i18n';
import { useCategoryStore } from './src/stores/useCategoryStore';
import { useTransactionStore } from './src/stores/useTransactionStore';
import NotificationService from './src/services/NotificationService';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, loadSettings } = useSettingsStore();
  const { loadCategories } = useCategoryStore();
  const { loadTransactions } = useTransactionStore();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([loadSettings(), loadCategories(), loadTransactions()]);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      NotificationService.showReminder();
    }
  }, [isLoading]);

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
