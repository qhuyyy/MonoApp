import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import CreateCategoryScreen from '../screens/Categories/CreateCategoryScreen';
import EditCategoryScreen from '../screens/Categories/EditCategoryScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Category } from '../types/types';

export type CategoriesStackParamList = {
  Categories: undefined;
  CreateCategory: undefined;
  EditCategory: { category: Category };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
      <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
    </Stack.Navigator>
  );
}
