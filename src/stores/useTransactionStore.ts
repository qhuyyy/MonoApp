// useTransactionStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/types';

type TransactionState = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  loadTransactions: () => Promise<void>;
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),

      updateTransaction: (updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === updatedTransaction.id ? updatedTransaction : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      loadTransactions: async () => {
        try {
          const storedData = await AsyncStorage.getItem('transaction-storage');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const allTransactions: Transaction[] = parsed.state?.transactions || [];
            set({ transactions: allTransactions });
          } else {
            set({ transactions: [] });
          }
        } catch (error) {
          console.error('Failed to load transactions from AsyncStorage:', error);
        }
      },
    }),
    {
      name: 'transaction-storage',
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
