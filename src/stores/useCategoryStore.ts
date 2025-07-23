import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types/types';

type CategoryState = {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  deleteCategory: (id: string) => void;
  loadCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        })),

      loadCategories: async () => {
        try {
          const storedData = await AsyncStorage.getItem('category-storage');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const allCategories: Category[] = parsed.state?.categories || [];
            set({ categories: allCategories });
          } else {
            set({ categories: [] });
          }
        } catch (error) {
          console.error('Failed to load categories from AsyncStorage:', error);
        }
      },
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
