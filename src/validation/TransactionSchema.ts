import * as yup from 'yup';
import i18n from '../config/i18n';

export const transactionSchema = yup.object({
  amount: yup
    .number()
    .typeError(i18n.t('amount-number'))
    .positive(i18n.t('amount-positive'))
    .max(999999999, i18n.t('amount-too-large'))
    .required(i18n.t('amount-required')),

  category: yup
    .object({
      name: yup.string().required(i18n.t('category-name-required')),
      status: yup.string().oneOf(['income', 'expense']),
    })
    .required(i18n.t('category-required'))
    .typeError(i18n.t('category-invalid')),

  description: yup
    .string()
    .max(255, i18n.t('description-too-long'))
    .optional(),

  date: yup
    .date()
    .transform((value, originalValue) => {
      return originalValue ? new Date(originalValue) : value;
    })
    .max(new Date(new Date().setHours(23, 59, 59, 999)), i18n.t('date-future'))
    .required(i18n.t('date-required')),

  type: yup
    .string()
    .oneOf(['income', 'expense'], i18n.t('type-invalid'))
    .required(i18n.t('type-required')),

  image: yup.string().nullable(),
});
