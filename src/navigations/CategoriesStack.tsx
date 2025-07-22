import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import AddNewCategoryScreen from "../screens/Categories/AddNewCategoryScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type CategoriesStackParamList = {
  Categories: undefined;
  AddNewCategory: undefined;
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="AddNewCategory" component={AddNewCategoryScreen} />
    </Stack.Navigator>
  );
}