import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeStack } from './WelcomeStack';
import HomeBottomStack from './HomeStack';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeBottomStack} />
      <Stack.Screen name="Welcome" component={WelcomeStack} />
    </Stack.Navigator>
  );
}
