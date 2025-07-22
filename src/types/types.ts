export interface Status {
  id: number;
  name: 'income' | 'expense' ;
}

export type Category = {
  name: string;
  status: 'income' | 'expense';
  color: string;
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
