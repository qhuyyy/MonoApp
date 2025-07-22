import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Category = {
  name: string;
  status: 'income' | 'expense';
  color: string;
};

type CategoryState = {
  categories: Category[];
  addCategory: (category: Category) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
    }),
    {
      name: 'category-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
