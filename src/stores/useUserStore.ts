import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  fullName: string;
  email: string;
  currency: string;
  avatar: string | null;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setCurrency: (currency: string) => void;
  setAvatar: (uri: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      fullName: '',
      email: '',
      currency: 'USD',
      avatar: null,
      setFullName: (name) => set({ fullName: name }),
      setEmail: (email) => set({ email }),
      setCurrency: (currency) => set({ currency }),
      setAvatar: (uri) => set({ avatar: uri }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);