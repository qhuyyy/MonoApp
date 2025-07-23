import * as yup from 'yup';

export const transactionSchema = yup.object({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .max(999999999, 'Amount is too large')
    .required('Please enter the amount'),

  category: yup
    .object({
      name: yup.string().required('Category name is required'),
      status: yup.string().oneOf(['income', 'expense']),
    })
    .required('Please select a category')
    .typeError('Invalid category selected'),

  description: yup
    .string()
    .max(255, 'Description is too long')
    .optional(),

  date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : value;
    })
    .max(
      new Date(new Date().setHours(23, 59, 59, 999)),
      'Date cannot be in the future'
    )
    .required('Please select a date'),

  type: yup
    .string()
    .oneOf(['income', 'expense'], 'Invalid transaction type')
    .required('Please select a transaction type'),

  image: yup
    .string()
    .nullable(),
});
