import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import uuid from 'react-native-uuid';
import { Transaction } from '../types/types';

type TransactionState = {
  transactions: Transaction[];
  recentTransactions: Transaction[];
  loadTransactions: () => Promise<void>;
  loadRecentTransactions: () => Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  previewImportJson: (filePath: string) => Promise<Transaction[]>;
  confirmImportJson: (
    transactions: Transaction[],
    replace: boolean,
  ) => Promise<void>;
  clearAll: () => Promise<void>;
  exportData: (opts: {
    includeTransactions: boolean;
    includeCategories: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
  }) => Promise<void>;
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      recentTransactions: [],

      loadTransactions: async () => {
        const storedData = await AsyncStorage.getItem('transaction-storage');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          const allTransactions: Transaction[] =
            parsed.state?.transactions || [];
          const sorted = allTransactions.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          );
          set({ transactions: sorted });
        } else {
          set({ transactions: [] });
        }
      },

      loadRecentTransactions: () => {
        const { transactions } = get();
        return [...transactions]
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          )
          .slice(0, 5);
      },

      addTransaction: transaction =>
        set(state => ({
          transactions: [...state.transactions, { ...transaction }],
        })),

      updateTransaction: updatedTransaction =>
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === updatedTransaction.id
              ? { ...updatedTransaction, updated_at: new Date().toISOString() }
              : t,
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
        const newTransaction = { ...original, id: uuid.v4().toString() };
        set(state => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      previewImportJson: async (filePath: string) => {
        const content = await RNFS.readFile(filePath, 'utf8');

        let parsed: any;
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          throw new Error('File không đúng định dạng JSON (có thể là CSV).');
        }

        // Lấy danh sách transactions
        let transactions: Transaction[] = [];
        if (Array.isArray(parsed)) {
          transactions = parsed;
        } else if (Array.isArray(parsed.transactions)) {
          transactions = parsed.transactions;
        } else {
          throw new Error(
            'File JSON không chứa danh sách giao dịch (transactions[])',
          );
        }

        // Validate mỗi transaction
        const requiredKeys = ['id', 'amount', 'date', 'category'];
        const invalidItem = transactions.find(
          t =>
            !requiredKeys.every(k =>
              Object.prototype.hasOwnProperty.call(t, k),
            ),
        );
        if (invalidItem) {
          throw new Error(
            'Có giao dịch bị thiếu trường bắt buộc (id, amount, date, category)',
          );
        }

        if (transactions.length === 0) {
          throw new Error(
            'Định dạng file đúng nhưng định dạng dữ liệu không chính xác!',
          );
        }

        return transactions;
      },

      confirmImportJson: async (
        transactions: Transaction[],
        replace: boolean,
      ) => {
        set(state => {
          let finalTransactions: Transaction[];

          // Clone và tạo ID mới
          const importedWithNewId = transactions.map(t => ({
            ...t,
            id: uuid.v4().toString(),
            updated_at: new Date().toISOString(),
          }));

          if (replace) {
            finalTransactions = importedWithNewId;
          } else {
            finalTransactions = [...state.transactions, ...importedWithNewId];
          }

          return { transactions: finalTransactions };
        });
      },

      exportData: async ({
        includeTransactions,
        includeCategories,
        minDate,
        maxDate,
      }) => {
        const transactions_raw = await AsyncStorage.getItem(
          'transaction-storage',
        );
        const categories_raw = await AsyncStorage.getItem('category-storage');

        const allTransactions: Transaction[] = transactions_raw
          ? JSON.parse(transactions_raw)?.state?.transactions ?? []
          : [];
        const allCategories = categories_raw
          ? JSON.parse(categories_raw)?.state?.categories ?? []
          : [];

        const filteredTransactions = includeTransactions
          ? allTransactions.filter(t => {
              const d = new Date(t.date);
              if (minDate && d < minDate) return false;
              if (maxDate && d > maxDate) return false;
              return true;
            })
          : [];

        if (includeTransactions && includeCategories) {
          const transactionsPath = `${RNFS.CachesDirectoryPath}/transactions.json`;
          const categoriesPath = `${RNFS.CachesDirectoryPath}/categories.json`;

          await RNFS.writeFile(
            transactionsPath,
            JSON.stringify(filteredTransactions, null, 2),
            'utf8',
          );
          await RNFS.writeFile(
            categoriesPath,
            JSON.stringify(allCategories, null, 2),
            'utf8',
          );

          await Share.open({
            title: 'Export Data',
            urls: [`file://${transactionsPath}`, `file://${categoriesPath}`],
            type: 'application/json',
            failOnCancel: false,
          });
        } else {
          const exportData = {
            transactions: filteredTransactions,
            categories: includeCategories ? allCategories : undefined,
          };
          const path = `${RNFS.CachesDirectoryPath}/export.json`;
          await RNFS.writeFile(
            path,
            JSON.stringify(exportData, null, 2),
            'utf8',
          );
          await Share.open({
            title: 'Export JSON',
            url: `file://${path}`,
            type: 'application/json',
            failOnCancel: false,
          });
        }
      },

      clearAll: async () => {
        await Promise.all([
          AsyncStorage.removeItem('transaction-storage'),
          AsyncStorage.removeItem('category-storage'),
        ]);
        set({ transactions: [] });
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
