import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '@/api/client';
import { User, Language, Theme, CalculationMethod } from '@tariq/shared';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  appleLogin: (idToken: string, firstName?: string, lastName?: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { user } = await apiClient.login(email, password);
    set({ user, isAuthenticated: true });
  },

  appleLogin: async (idToken: string, firstName?: string, lastName?: string) => {
    const { user } = await apiClient.appleLogin(idToken, firstName, lastName);
    set({ user, isAuthenticated: true });
  },

  googleLogin: async (idToken: string) => {
    const { user } = await apiClient.googleLogin(idToken);
    set({ user, isAuthenticated: true });
  },

  register: async (email: string, password: string, name?: string) => {
    const { user } = await apiClient.register(email, password, name);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data: Partial<User>) => {
    const updatedUser = await apiClient.updateProfile(data);
    set({ user: updatedUser });
  },

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const user = await apiClient.getProfile();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
