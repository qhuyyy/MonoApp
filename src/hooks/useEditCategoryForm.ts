import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../validation/CategorySchema';
import { useCategoryStore } from '../stores/useCategoryStore';
import { Category } from '../types/types';

export interface EditCategoryFormValues {
  name: string;
  status: 'income' | 'expense';
  color: string;
  icon: string;
}

export const useEditCategoryForm = (category: Category) => {
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const deleteCategory = useCategoryStore(state => state.deleteCategory);

  const form = useForm<EditCategoryFormValues>({
    defaultValues: {
      name: category.name,
      status: category.status,
      color: category.color,
      icon: category.icon,
    },
    resolver: yupResolver(categorySchema),
  });

  const handleUpdate = (values: EditCategoryFormValues) => {
    updateCategory({
      id: category.id,
      name: values.name,
      status: values.status,
      color: values.color,
      icon: values.icon,
    });
  };

  const handleDelete = async () => {
    await deleteCategory(category.id);
  };

  return { ...form, handleUpdate, handleDelete };
};
