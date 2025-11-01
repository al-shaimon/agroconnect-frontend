import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, isAuthenticated: !!user });
  },

  setToken: (token) => set({ token }),

  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getToken();

    if (storedUser && storedToken) {
      set({
        user: storedUser,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
