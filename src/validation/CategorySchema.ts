import * as yup from 'yup';

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  status: yup
    .mixed<'income' | 'expense'>()
    .oneOf(['income', 'expense'], 'Invalid status')
    .required('Status is required'),
});