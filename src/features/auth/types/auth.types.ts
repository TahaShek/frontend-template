/**
 * Auth Types, Interfaces, and Enums
 * Single source of truth for authentication-related types
 */

// ============= ENUMS =============

export const AuthStatus = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  ERROR: 'ERROR',
} as const;

export type AuthStatus = typeof AuthStatus[keyof typeof AuthStatus];

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  GUEST: 'GUEST',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const TokenType = {
  ACCESS: 'ACCESS_TOKEN',
  REFRESH: 'REFRESH_TOKEN',
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

export const AuthErrorCode = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthErrorCode = typeof AuthErrorCode[keyof typeof AuthErrorCode];

// ============= INTERFACES =============

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>; // For ABAC attributes (department, clearance, etc.)
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthResponse {
  user: IUser;
  tokens: IAuthTokens;
  message?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ISignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface IAuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface IAuthState {
  user: IUser | null;
  tokens: IAuthTokens | null;
  status: AuthStatus;
  error: IAuthError | null;
}

// ============= TYPE DEFINITIONS =============

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: IAuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: IAuthError }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: IAuthResponse }
  | { type: 'SIGNUP_FAILURE'; payload: IAuthError }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: IAuthTokens }
  | { type: 'UPDATE_USER'; payload: IUser }
  | { type: 'CLEAR_ERROR' };

export type TokenRefreshCallback = (accessToken: string) => void;

// ============= API REQUEST/RESPONSE TYPES =============

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

