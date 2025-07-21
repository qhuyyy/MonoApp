import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigations/RootStack';
import SplashScreen from './src/screens/Welcome/SplashScreen';
import { StatusBar } from 'react-native';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'}/>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;