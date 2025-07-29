import SettingsStack, { SettingsStackParamList } from './SettingsStack';
import HomeScreen from '../screens/Home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SettingsStack" component={SettingsStack} />
    </Stack.Navigator>
  );
}
