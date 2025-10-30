import { create } from 'zustand';
import type { IUser } from '../types/auth.types';
import type { ILoginRequest } from '../types/auth.types';
import { mockLogin, mockLogout } from '../mocks/mock-auth-service';

interface IAuthStore {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: { message: string } | null;
  setUser: (user: IUser) => void;
  login: (credentials: ILoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: true, error: null }),
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await mockLogin(credentials);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: { message: (error as Error).message || 'Login failed' }, 
        isLoading: false 
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true });
      await mockLogout();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: { message: (error as Error).message || 'Logout failed' },
        isLoading: false 
      });
    }
  },
}));