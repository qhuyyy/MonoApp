export interface Status {
  id: number;
  name: 'income' | 'expense';
}

export interface Category {
  id: number;
  status_id: number;
  name: string;
}

export interface Transaction {
  id: number;
  status_id: number;
  categories_id: number;
  amount: number;
  date: string; 
  image: string;
  description: string;
}
