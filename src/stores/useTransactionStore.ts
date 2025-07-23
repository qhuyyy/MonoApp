import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/types';

const STORAGE_KEY = 'transaction-storage';

type TransactionState = {
  transactions: Transaction[];
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (updatedTransaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],

  loadTransactions: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Transaction[] = JSON.parse(stored);
        set({ transactions: parsed });
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  },

  addTransaction: async (transaction: Transaction) => {
    const updated = [...get().transactions, transaction];
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateTransaction: async (updatedTransaction: Transaction) => {
    const updated = get().transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteTransaction: async (id: string) => {
    const updated = get().transactions.filter(t => t.id !== id);
    set({ transactions: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
