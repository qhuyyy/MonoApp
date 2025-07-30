import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Welcome/OnboardingScreen';
import GetStartedScreen from '../screens/Welcome/GetStartedScreen';

export type WelcomeStackParamList = {
  Onboarding: undefined;
  GetStarted: undefined;
};

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export function WelcomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStartedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
