import HistoryScreen from '../screens/Main/HistoryScreen';
import DetailsScreen from '../screens/History/DetailsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type HistoryStackParamList = {
  History: undefined;
  Details: { id: string };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
