import HistoryScreen from '../screens/History/HistoryScreen';
import EditTransactionScreen from '../screens/History/EditTransactionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Transaction } from '../types/types';

export type HistoryStackParamList = {
  History: undefined;
  EditTransaction: { transaction: Transaction };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
    </Stack.Navigator>
  );
}
