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
  toggleCategory: (id: string) => void;
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
  toggleCategory: id =>
    set(state => ({
      selectedCategories: state.selectedCategories.includes(id)
        ? state.selectedCategories.filter(c => c !== id)
        : [...state.selectedCategories, id],
    })),
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
