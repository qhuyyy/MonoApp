import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import CategoryCreateScreen from '../screens/Categories/CategoryCreateScreen';
import CategoryEditScreen from '../screens/Categories/CategoryEditScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Category } from '../types/types';

export type CategoriesStackParamList = {
  Categories: undefined;
  CategoryCreate: undefined;
  CategoryEdit: { category: Category };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="CategoryCreate" component={CategoryCreateScreen} />
      <Stack.Screen name="CategoryEdit" component={CategoryEditScreen} />
    </Stack.Navigator>
  );
}
