import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionSchema } from '../validation/TransactionSchema';
import { Transaction, Category } from '../types/types';
import { useTransactionStore } from '../stores/useTransactionStore';

export type EditTransactionFormValues = {
  amount: number;
  description: string;
  category: Category;
  date: Date;
  type: 'income' | 'expense';
  image?: string;
};

export const useEditTransactionForm = (transaction: Transaction) => {
  const updateTransaction = useTransactionStore(state => state.updateTransaction);
  const deleteTransaction = useTransactionStore(state => state.deleteTransaction);
  const duplicateTransaction = useTransactionStore(state => state.duplicateTransaction);

  const form = useForm<EditTransactionFormValues>({
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date),
      type: transaction.category.status,
      image: transaction.image,
    },
    resolver: yupResolver(transactionSchema) as any,
  });

  const handleUpdate = (data: EditTransactionFormValues) => {
    updateTransaction({
      ...transaction,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: data.date.toISOString(),
      image: data.image || '',
    });
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
  };

  const handleDuplicate = () => {
    duplicateTransaction(transaction.id);
  };

  return {
    form,
    handleUpdate,
    handleDelete,
    handleDuplicate,
  };
};
