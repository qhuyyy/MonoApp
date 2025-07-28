/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import HistoryStack, { HistoryStackParamList } from './HistoryStack';
import CategoriesStack from './CategoriesStack';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';
import CustomBottomTabBar from '../components/CustomBottomTabBar';
import TransactionCreateScreen from '../screens/CreateTrans/TransactionCreateScreen';
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainBottomTabsParamList = {
  Home: undefined;
  CategoriesStack: undefined;
  TransactionCreate: undefined;
  HistoryStack: NavigatorScreenParams<HistoryStackParamList>;
  Statistics: undefined;
};

const Tab = createBottomTabNavigator();

export default function MainBottomTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CategoriesStack" component={CategoriesStack} />
      <Tab.Screen name="TransactionCreate" component={TransactionCreateScreen} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
}
