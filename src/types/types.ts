export type Category = {
  id: string;
  name: string;
  status: 'income' | 'expense';
  color: string;
  icon: string;
};

export interface Transaction {
  id: string;
  image: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  created_at: string;
  updated_at: string;
}
