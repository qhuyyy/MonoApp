import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Transaction } from '../types/types';
import { Alert } from 'react-native';
import i18n from '../config/i18n';

type CategoryState = {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  deleteCategory: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  updateCategoryOrder: (newOrder: Category[]) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (category: Category) =>
        set(state => ({ categories: [...state.categories, category] })),

      updateCategory: async (updatedCategory: Category) => {
        try {
          const transactionData = await AsyncStorage.getItem(
            'transaction-storage',
          );
          const parsed = transactionData ? JSON.parse(transactionData) : null;
          const transactions: Transaction[] = parsed?.state?.transactions || [];

          const existingCategory = get().categories.find(
            cat => cat.id === updatedCategory.id,
          );

          if (!existingCategory) return;

          const used = transactions.some(
            t => t.category?.id === updatedCategory.id,
          );

          const noChanges =
            existingCategory.name === updatedCategory.name &&
            existingCategory.status === updatedCategory.status &&
            existingCategory.color === updatedCategory.color &&
            existingCategory.icon === updatedCategory.icon;

          if (used && !noChanges) {
            Alert.alert(
              i18n.t('cannot-update'),
              i18n.t('this-category-is-being-used-in-a-transaction'),
            );
            return;
          }

          // Cập nhật state nếu có thay đổi hoặc category chưa được dùng
          if (!noChanges) {
            set(state => ({
              categories: state.categories.map(cat =>
                cat.id === updatedCategory.id ? updatedCategory : cat,
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to update category:', error);
        }
      },

      deleteCategory: async (id: string) => {
        try {
          const transactionData = await AsyncStorage.getItem(
            'transaction-storage',
          );
          const parsed = transactionData ? JSON.parse(transactionData) : null;
          const transactions = parsed?.state?.transactions || [];

          const used = transactions.some(
            (t: Transaction) => t.category?.id === id,
          );

          if (used) {
            Alert.alert(
              i18n.t('cannot-delete'),
              i18n.t('this-category-is-being-used-in-a-transaction'),
            );
            return;
          }

          set(state => ({
            categories: state.categories.filter(cat => cat.id !== id),
          }));
        } catch (error) {
          console.error('Failed to delete category:', error);
        }
      },

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

      updateCategoryOrder: (newOrder: Category[]) => {
        set({ categories: newOrder });
      },
    }),
    {
      name: 'category-storage',
      storage: {
        getItem: async key => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async key => {
          await AsyncStorage.removeItem(key);
        },
      },
    },
  ),
);
