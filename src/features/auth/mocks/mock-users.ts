/**
 * Mock Users for Testing
 * Dummy users with different roles, departments, and permissions
 */

import type { IUser } from '../types';
import { UserRole } from '@/features/auth/types';
import { Department, ClearanceLevel } from '@/features/authorization/types';

/**
 * Mock Users Database
 */
export const mockUsers: IUser[] = [
  // Admin User
  {
    id: 'user-admin-001',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    // Extended attributes for ABAC
    metadata: {
      department: Department.IT,
      clearanceLevel: ClearanceLevel.LEVEL_5,
      location: 'New York',
    },
  },

  // HR Manager
  {
    id: 'user-hr-001',
    email: 'hr@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    metadata: {
      department: Department.HR,
      clearanceLevel: ClearanceLevel.LEVEL_4,
      location: 'New York',
      jobTitle: 'HR Manager',
    },
  },

  // Finance User
  {
    id: 'user-finance-001',
    email: 'finance@example.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    metadata: {
      department: Department.FINANCE,
      clearanceLevel: ClearanceLevel.LEVEL_3,
      location: 'San Francisco',
      jobTitle: 'Financial Analyst',
    },
  },

  // Marketing User
  {
    id: 'user-marketing-001',
    email: 'marketing@example.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    metadata: {
      department: Department.MARKETING,
      clearanceLevel: ClearanceLevel.LEVEL_2,
      location: 'Los Angeles',
      jobTitle: 'Marketing Specialist',
    },
  },

  // Engineering User
  {
    id: 'user-eng-001',
    email: 'engineer@example.com',
    firstName: 'David',
    lastName: 'Kim',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    metadata: {
      department: Department.ENGINEERING,
      clearanceLevel: ClearanceLevel.LEVEL_3,
      location: 'Seattle',
      jobTitle: 'Software Engineer',
    },
  },

  // Moderator
  {
    id: 'user-mod-001',
    email: 'moderator@example.com',
    firstName: 'Alex',
    lastName: 'Taylor',
    role: UserRole.MODERATOR,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    metadata: {
      department: Department.OPERATIONS,
      clearanceLevel: ClearanceLevel.LEVEL_3,
      location: 'Chicago',
      jobTitle: 'Content Moderator',
    },
  },

  // Sales User
  {
    id: 'user-sales-001',
    email: 'sales@example.com',
    firstName: 'Jessica',
    lastName: 'Williams',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    metadata: {
      department: Department.SALES,
      clearanceLevel: ClearanceLevel.LEVEL_2,
      location: 'Boston',
      jobTitle: 'Sales Representative',
    },
  },

  // IT User (Low Clearance)
  {
    id: 'user-it-001',
    email: 'it@example.com',
    firstName: 'Robert',
    lastName: 'Brown',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
    metadata: {
      department: Department.IT,
      clearanceLevel: ClearanceLevel.LEVEL_2,
      location: 'Austin',
      jobTitle: 'IT Support',
    },
  },

  // Basic User (No Department)
  {
    id: 'user-basic-001',
    email: 'user@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: UserRole.USER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    metadata: {
      clearanceLevel: ClearanceLevel.LEVEL_1,
      location: 'Remote',
    },
  },

  // Guest User (Limited Access)
  {
    id: 'user-guest-001',
    email: 'guest@example.com',
    firstName: 'Guest',
    lastName: 'User',
    role: UserRole.GUEST,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
    metadata: {
      clearanceLevel: ClearanceLevel.LEVEL_1,
      location: 'Remote',
    },
  },
];

/**
 * Mock Credentials
 * Use these credentials to test login
 */
export const mockCredentials = {
  admin: { email: 'admin@example.com', password: 'Admin@123' },
  hr: { email: 'hr@example.com', password: 'Hr@123456' },
  finance: { email: 'finance@example.com', password: 'Finance@123' },
  marketing: { email: 'marketing@example.com', password: 'Marketing@123' },
  engineer: { email: 'engineer@example.com', password: 'Engineer@123' },
  moderator: { email: 'moderator@example.com', password: 'Moderator@123' },
  sales: { email: 'sales@example.com', password: 'Sales@123' },
  it: { email: 'it@example.com', password: 'It@123456' },
  user: { email: 'user@example.com', password: 'User@123456' },
  guest: { email: 'guest@example.com', password: 'Guest@123' },
};

/**
 * Find user by email
 */
export const findUserByEmail = (email: string): IUser | undefined => {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Find user by ID
 */
export const findUserById = (id: string): IUser | undefined => {
  return mockUsers.find((user) => user.id === id);
};

/**
 * Validate mock credentials
 */
export const validateCredentials = (email: string, password: string): IUser | null => {
  const user = findUserByEmail(email);
  if (!user) return null;

  // In real app, you'd hash and compare passwords
  // For mock, we just check if password matches expected pattern
  const credentialEntry = Object.entries(mockCredentials).find(
    ([, cred]) => cred.email === email
  );

  if (credentialEntry && credentialEntry[1].password === password) {
    return user;
  }

  return null;
};

/**
 * Mock Tokens Generator
 */
export const generateMockTokens = (userId: string) => {
  return {
    accessToken: `mock_access_token_${userId}_${Date.now()}`,
    refreshToken: `mock_refresh_token_${userId}_${Date.now()}`,
    expiresIn: 3600, // 1 hour
  };
};

