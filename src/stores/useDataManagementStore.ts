import { create } from 'zustand';

type DataManagementState = {
  includeTransactions: boolean;
  includeCategories: boolean;
  minDate: Date | null;
  maxDate: Date | null;
  defaultMinDate: Date | null;
  defaultMaxDate: Date | null;
  openMin: boolean;
  openMax: boolean;
  previewData: any[];
  replace: boolean;

  setIncludeTransactions: (v: boolean) => void;
  setIncludeCategories: (v: boolean) => void;
  setMinDate: (d: Date | null) => void;
  setMaxDate: (d: Date | null) => void;
  setDefaultMinDate: (d: Date | null) => void;
  setDefaultMaxDate: (d: Date | null) => void;
  setOpenMin: (v: boolean) => void;
  setOpenMax: (v: boolean) => void;
  setPreviewData: (data: any[]) => void;
  setReplace: (v: boolean) => void;

  reset: () => void;
};

export const useDataManagementStore = create<DataManagementState>(set => ({
  includeTransactions: true,
  includeCategories: false,
  minDate: null,
  maxDate: null,
  defaultMinDate: null,
  defaultMaxDate: null,
  openMin: false,
  openMax: false,
  previewData: [],
  replace: false,

  setIncludeTransactions: v => set({ includeTransactions: v }),
  setIncludeCategories: v => set({ includeCategories: v }),
  setMinDate: d => set({ minDate: d }),
  setMaxDate: d => set({ maxDate: d }),
  setDefaultMinDate: d => set({ defaultMinDate: d }),
  setDefaultMaxDate: d => set({ defaultMaxDate: d }),
  setOpenMin: v => set({ openMin: v }),
  setOpenMax: v => set({ openMax: v }),
  setPreviewData: data => set({ previewData: data }),
  setReplace: v => set({ replace: v }),

  reset: () =>
    set({
      includeTransactions: true,
      includeCategories: false,
      minDate: null,
      maxDate: null,
      defaultMinDate: null,
      defaultMaxDate: null,
      openMin: false,
      openMax: false,
      previewData: [],
      replace: false,
    }),
}));
