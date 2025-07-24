import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../validation/CategorySchema';
import { useCategoryStore } from '../stores/useCategoryStore';

export interface EditCategoryFormData {
  name: string;
  status: 'income' | 'expense';
}

export const useEditCategoryForm = (
  category: { id: string; name: string; status: 'income' | 'expense' },
  color: string,
  icon: string,
  onSuccess: () => void
) => {
  const updateCategory = useCategoryStore(state => state.updateCategory);

  const form = useForm<EditCategoryFormData>({
    defaultValues: {
      name: category.name,
      status: category.status,
    },
    resolver: yupResolver(categorySchema),
  });

  const onSubmit = form.handleSubmit(values => {
    updateCategory({
      id: category.id,
      name: values.name,
      status: values.status,
      color,
      icon,
    });
    onSuccess();
  });

  return { ...form, onSubmit };
};