import ImportScreen from '../screens/Settings/DataManagement/ImportScreen';
import ExportScreen from '../screens/Settings/DataManagement/ExportScreen';
import DataManagementScreen from '../screens/Settings/DataManagement/DataManagementScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type DataManagementStackParamList = {
  DataManagement: undefined;
  Import: undefined;
  Export: undefined;
};

const Stack = createNativeStackNavigator<DataManagementStackParamList>();

export default function DataManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DataManagement" component={DataManagementScreen} />
      <Stack.Screen name="Import" component={ImportScreen} />
      <Stack.Screen name="Export" component={ExportScreen} />
    </Stack.Navigator>
  );
}
