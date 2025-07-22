/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import HistoryScreen from '../screens/Home/HistoryScreen';
import StatisticsScreen from '../screens/Home/StatisticsScreen';
import SettingsScreen from '../screens/Home/SettingsScreen';
import CustomTabBar from '../components/CustomTabBar';
import AddNewTransTabs from './AddNewTransTab';
const Tab = createBottomTabNavigator();

export default function HomeBottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="AddNewTrans" component={AddNewTransTabs} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
