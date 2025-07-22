import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeStack } from './WelcomeStack';
import MainBottomTabs from './MainBottomTabs';

export type RootStackParamList = {
  WelcomeStack: undefined;
  MainBottomTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainBottomTabs" component={MainBottomTabs} />
      <Stack.Screen name="WelcomeStack" component={WelcomeStack} />
    </Stack.Navigator>
  );
}
