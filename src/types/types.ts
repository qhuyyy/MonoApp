export interface Status {
  id: number;
  name: 'income' | 'expense' ;
}

export type Category = {
  id: string;
  name: string;
  status: 'income' | 'expense';
  color: string;
  icon: string;
};

export interface Transaction {
  id: number;
  status_id: number;
  categories_id: number;
  amount: number;
  date: string; 
  image: string;
  description: string;
}
