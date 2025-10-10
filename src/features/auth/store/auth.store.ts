/**
 * Auth Store
 * Global authentication state management using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AuthStatus,
  AuthErrorCode,
} from '../types';
import type {
  IUser,
  IAuthTokens,
  IAuthState,
  ILoginCredentials,
  ISignupCredentials,
  IAuthError,
} from '../types';
import { authApi } from '../authapi';
import { TokenStorage } from '@/lib/axios';
import { mockLogin, mockSignup, mockLogout } from '../mocks';

// Use mock API in development if no backend is available
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH !== 'false';

/**
 * Auth Store Interface
 */
interface IAuthStore extends IAuthState {
  // Actions
  login: (credentials: ILoginCredentials) => Promise<void>;
  signup: (credentials: ISignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: IUser) => void;
  setTokens: (tokens: IAuthTokens) => void;
  
  // Computed
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth Store
 */
export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      tokens: null,
      status: AuthStatus.IDLE,
      error: null,
      isAuthenticated: false,
      isLoading: false,

      // Login Action
      login: async (credentials: ILoginCredentials) => {
        try {
          set({ status: AuthStatus.LOADING, error: null, isLoading: true });

          // Use mock API in development or real API in production
          const response = USE_MOCK_API
            ? await mockLogin({
                email: credentials.email,
                password: credentials.password,
              })
            : await authApi.login({
                email: credentials.email,
                password: credentials.password,
              });

          // Store tokens in localStorage
          TokenStorage.setTokens(response.tokens);

          set({
            user: response.user,
            tokens: response.tokens,
            status: AuthStatus.AUTHENTICATED,
            error: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const error = err as { code?: string; message?: string };
          const authError: IAuthError = {
            code: (error.code || AuthErrorCode.INVALID_CREDENTIALS) as AuthErrorCode,
            message: error.message || 'Login failed. Please check your credentials.',
          };

          set({
            status: AuthStatus.ERROR,
            error: authError,
            isAuthenticated: false,
            isLoading: false,
          });

          throw authError;
        }
      },

      // Signup Action
      signup: async (credentials: ISignupCredentials) => {
        try {
          set({ status: AuthStatus.LOADING, error: null, isLoading: true });

          // Use mock API in development or real API in production
          const response = USE_MOCK_API
            ? await mockSignup({
                email: credentials.email,
                password: credentials.password,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
              })
            : await authApi.signup({
                email: credentials.email,
                password: credentials.password,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
              });

          // Store tokens in localStorage
          TokenStorage.setTokens(response.tokens);

          set({
            user: response.user,
            tokens: response.tokens,
            status: AuthStatus.AUTHENTICATED,
            error: null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const error = err as { code?: string; message?: string };
          const authError: IAuthError = {
            code: (error.code || AuthErrorCode.VALIDATION_ERROR) as AuthErrorCode,
            message: error.message || 'Signup failed. Please try again.',
          };

          set({
            status: AuthStatus.ERROR,
            error: authError,
            isAuthenticated: false,
            isLoading: false,
          });

          throw authError;
        }
      },

      // Logout Action
      logout: async () => {
        try {
          if (USE_MOCK_API) {
            await mockLogout();
          } else {
            await authApi.logout();
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens from localStorage
          TokenStorage.clearTokens();

          set({
            user: null,
            tokens: null,
            status: AuthStatus.UNAUTHENTICATED,
            error: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Refresh Token Action
      refreshToken: async () => {
        try {
          const currentTokens = get().tokens;
          if (!currentTokens?.refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await authApi.refreshToken({
            refreshToken: currentTokens.refreshToken,
          });

          const newTokens: IAuthTokens = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          };

          // Store new tokens
          TokenStorage.setTokens(newTokens);

          set({ tokens: newTokens });
        } catch (error) {
          console.error('Token refresh error:', error);
          // Logout on refresh failure
          await get().logout();
          throw error;
        }
      },

      // Get Current User
      getCurrentUser: async () => {
        try {
          set({ status: AuthStatus.LOADING, isLoading: true });

          const user = await authApi.getCurrentUser();

          set({
            user,
            status: AuthStatus.AUTHENTICATED,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Get current user error:', error);
          set({
            status: AuthStatus.UNAUTHENTICATED,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      // Clear Error
      clearError: () => {
        set({ error: null });
      },

      // Set User
      setUser: (user: IUser) => {
        set({ user });
      },

      // Set Tokens
      setTokens: (tokens: IAuthTokens) => {
        TokenStorage.setTokens(tokens);
        set({ tokens });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Listen to logout events from axios interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().logout();
  });
}

