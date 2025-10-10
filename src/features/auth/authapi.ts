/**
 * Auth API Service
 * Handles all authentication-related API calls
 */

import { axios } from '@/lib/axios';
import type {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  IUser,
} from './types';

/**
 * Auth API Endpoints
 */
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

/**
 * Auth API Service Class
 */
class AuthApiService {
  /**
   * Login user
   */
  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    const response = await axios.post<IAuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  }

  /**
   * Signup new user
   */
  async signup(credentials: ISignupRequest): Promise<IAuthResponse> {
    const response = await axios.post<IAuthResponse>(
      AUTH_ENDPOINTS.SIGNUP,
      credentials
    );
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await axios.post(AUTH_ENDPOINTS.LOGOUT);
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    request: IRefreshTokenRequest
  ): Promise<IRefreshTokenResponse> {
    const response = await axios.post<IRefreshTokenResponse>(
      AUTH_ENDPOINTS.REFRESH,
      request
    );
    return response.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<IUser> {
    const response = await axios.get<IUser>(AUTH_ENDPOINTS.ME);
    return response.data;
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  }

  /**
   * Reset password
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      { token, password }
    );
    return response.data;
  }
}

// Export singleton instance
export const authApi = new AuthApiService();

// Export class for testing
export default AuthApiService;

