import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutScreen from '../screens/Settings/AboutScreen';
import AppSettingsScreen from '../screens/Settings/AppSettingsScreen';
import DataManagementScreen from '../screens/Settings/DataManagementScreen';
import ProfileScreen from '../screens/Settings/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

export type SettingsStackParamList = {
  About: undefined;
  AppSettings: undefined;
  DataManagement: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
      <Stack.Screen name="DataManagement" component={DataManagementScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
