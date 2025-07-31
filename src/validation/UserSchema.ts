import * as Yup from 'yup';
import i18n from '../config/i18n';

export const UserSchema = Yup.object().shape({
  fullName: Yup.string().required(i18n.t('full-name-required')),
  email: Yup.string().email(i18n.t('email-invalid')).nullable(),
  currency: Yup.mixed<'VND' | 'USD' | 'EUR' | 'JPY'>()
    .oneOf(['VND', 'USD', 'EUR', 'JPY'], i18n.t('currency-invalid'))
    .required(i18n.t('currency-requirex`')),
  avatar: Yup.string().nullable(),
});
