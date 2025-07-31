import { create } from 'zustand';
import { Category } from '../types/types';

type HistoryFilterState = {
  search: string;
  filterType: 'all' | 'income' | 'expense';
  sortBy: 'date' | 'amount' | 'updated';
  selectedCategories: string[];
  page: number;
  categories: Category[];

  setSearch: (search: string) => void;
  setFilterType: (type: 'all' | 'income' | 'expense') => void;
  setSortBy: (sort: 'date' | 'amount' | 'updated') => void;
  toggleCategory: (name: string, status: 'income' | 'expense') => void;
  setCategories: (cats: Category[]) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
};

export const useHistoryFilterStore = create<HistoryFilterState>(set => ({
  search: '',
  filterType: 'all',
  sortBy: 'updated',
  selectedCategories: [],
  page: 1,
  categories: [],

  setSearch: search => set({ search }),
  setFilterType: filterType => set({ filterType }),
  setSortBy: sortBy => set({ sortBy }),
  toggleCategory: (name: string, status: 'income' | 'expense') =>
    set(state => {
      const key = `${name}:${status}`;
      return {
        selectedCategories: state.selectedCategories.includes(key)
          ? state.selectedCategories.filter(c => c !== key)
          : [...state.selectedCategories, key],
      };
    }),

  setCategories: categories => set({ categories }),
  setPage: page => set({ page }),
  resetFilters: () =>
    set({
      search: '',
      filterType: 'all',
      sortBy: 'updated',
      selectedCategories: [],
      page: 1,
    }),
}));
