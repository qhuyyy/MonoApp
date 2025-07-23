/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Main/HomeScreen';
import HistoryStack from './HistoryStack';
import CategoriesStack from './CategoriesStack';
import StatisticsScreen from '../screens/Main/StatisticsScreen';
import CustomBottomTabBar from '../components/CustomBottomTabBar';
import AddNewTransTabs from './AddNewTransTab';

const Tab = createBottomTabNavigator();

export default function MainBottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CategoriesStack" component={CategoriesStack} />
      <Tab.Screen name="AddNewTrans" component={AddNewTransTabs} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
}
