import TransactionsHistoryScreen from '../screens/History/TransactionsHistoryScreen';
import TransactionEditScreen from '../screens/History/TransactionEditScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Transaction } from '../types/types';

export type HistoryStackParamList = {
  TransactionsHistory: undefined;
  TransactionEdit: { transaction: Transaction };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsHistory" component={TransactionsHistoryScreen} />
      <Stack.Screen name="TransactionEdit" component={TransactionEditScreen} />
    </Stack.Navigator>
  );
}
