import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { transactionSchema } from '../validation/TransactionSchema';

export const useCreateTransForm = (defaultValues: any, onSubmit: (values: any) => void) => {
  const form = useForm({
    defaultValues,
    resolver: yupResolver(transactionSchema),
  });

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};