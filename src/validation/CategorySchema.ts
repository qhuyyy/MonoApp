import * as yup from 'yup';
import i18n from '../config/i18n';

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .min(2, i18n.t('name-too-short'))
    .max(50, i18n.t('name-too-long'))
    .required(i18n.t('name-required')),
  status: yup
    .mixed<'income' | 'expense'>()
    .oneOf(['income', 'expense'], i18n.t('status-invalid'))
    .required(i18n.t('status-required')),
  color: yup.string().required(i18n.t('color-required')),
  icon: yup.string().required(i18n.t('icon-required')),
});