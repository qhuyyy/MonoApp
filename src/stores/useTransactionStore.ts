import { create } from 'zustand';

type TransactionForm = {
  amount: string;
  description: string;
  category: string;
  date: Date;
  image: string | null;
  type: 'income' | 'expense';
};

type TransactionStore = TransactionForm & {
  setField: <K extends keyof TransactionForm>(key: K, value: TransactionForm[K]) => void;
  reset: () => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  amount: '',
  description: '',
  category: '',
  date: new Date(),
  image: null,
  type: 'income',

  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  reset: () =>
    set({
      amount: '',
      description: '',
      category: '',
      date: new Date(),
      image: null,
      type: 'income',
    }),
}));
