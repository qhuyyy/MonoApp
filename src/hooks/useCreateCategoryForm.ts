import { useForm } from 'react-hook-form';
import { categorySchema } from '../validation/CategorySchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCategoryStore } from '../stores/useCategoryStore';
import uuid from 'react-native-uuid';

export interface CategoryFormData {
  name: string;
  status: 'income' | 'expense';
  color: string;
  icon: string;
}

export const useCreateCategoryForm = (
  onSuccess: () => void,
  color: string,
  icon: string,
) => {
  const createCategory = useCategoryStore(state => state.addCategory);

  const form = useForm<CategoryFormData>({
    defaultValues: { name: '', status: 'income', color, icon },
    resolver: yupResolver(categorySchema),
  });

  const onSubmit = form.handleSubmit(values => {
    createCategory({
      id: uuid.v4() as string,
      name: values.name,
      status: values.status,
      color,
      icon,
    });
    onSuccess();
    form.reset();
  });

  return { ...form, onSubmit };
};
