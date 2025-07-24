import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/types';
import uuid from 'react-native-uuid';

type TransactionState = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void; // thêm
  loadTransactions: () => Promise<void>;
  loadRecentTransactions: () => Transaction[];
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: transaction =>
        set(state => ({
          transactions: [...state.transactions, transaction],
        })),

      updateTransaction: updatedTransaction =>
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t,
          ),
        })),

      deleteTransaction: id =>
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id),
        })),

      duplicateTransaction: id => {
        const { transactions } = get();
        const original = transactions.find(t => t.id === id);
        if (!original) return;

        const newTransaction = {
          ...original,
          id: uuid.v4().toString(),
          // date: new Date().toISOString(),
        };

        set(state => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      loadTransactions: async () => {
        try {
          const storedData = await AsyncStorage.getItem('transaction-storage');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            const allTransactions: Transaction[] =
              parsed.state?.transactions || [];
            set({ transactions: allTransactions });
          } else {
            set({ transactions: [] });
          }
        } catch (error) {
          console.error(
            'Failed to load transactions from AsyncStorage:',
            error,
          );
        }
      },

      loadRecentTransactions: () => {
        const { transactions } = get();
        return [...transactions]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 5);
      },
    }),
    {
      name: 'transaction-storage',
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
