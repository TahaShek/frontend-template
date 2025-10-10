/**
 * ABAC (Attribute-Based Access Control) Types
 * Single source of truth for authorization-related types
 */

import type { UserRole } from '@/features/auth/types';

// ============= ENUMS =============

export const Action = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXECUTE: 'EXECUTE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  SHARE: 'SHARE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
} as const;

export type Action = typeof Action[keyof typeof Action];

export const ResourceType = {
  USER: 'USER',
  POST: 'POST',
  DOCUMENT: 'DOCUMENT',
  PROJECT: 'PROJECT',
  REPORT: 'REPORT',
  SETTING: 'SETTING',
  EMPLOYEE: 'EMPLOYEE',
  DEPARTMENT: 'DEPARTMENT',
} as const;

export type ResourceType = typeof ResourceType[keyof typeof ResourceType];

export const Department = {
  HR: 'HR',
  IT: 'IT',
  FINANCE: 'FINANCE',
  MARKETING: 'MARKETING',
  SALES: 'SALES',
  OPERATIONS: 'OPERATIONS',
  ENGINEERING: 'ENGINEERING',
} as const;

export type Department = typeof Department[keyof typeof Department];

export const SensitivityLevel = {
  PUBLIC: 'PUBLIC',
  INTERNAL: 'INTERNAL',
  CONFIDENTIAL: 'CONFIDENTIAL',
  RESTRICTED: 'RESTRICTED',
  SECRET: 'SECRET',
} as const;

export type SensitivityLevel = typeof SensitivityLevel[keyof typeof SensitivityLevel];

export const ClearanceLevel = {
  LEVEL_1: 1, // Basic access
  LEVEL_2: 2, // Standard access
  LEVEL_3: 3, // Elevated access
  LEVEL_4: 4, // High access
  LEVEL_5: 5, // Maximum access
} as const;

export type ClearanceLevel = typeof ClearanceLevel[keyof typeof ClearanceLevel];

export const PolicyEffect = {
  ALLOW: 'ALLOW',
  DENY: 'DENY',
} as const;

export type PolicyEffect = typeof PolicyEffect[keyof typeof PolicyEffect];

// ============= INTERFACES =============

/**
 * Subject Attributes (User)
 * Attributes of the user requesting access
 */
export interface ISubjectAttributes {
  userId: string;
  role: UserRole;
  department?: Department;
  location?: string;
  clearanceLevel?: ClearanceLevel;
  email?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Resource Attributes (Object)
 * Attributes of the resource being accessed
 */
export interface IResourceAttributes {
  id?: string;
  type: ResourceType;
  owner?: string;
  department?: Department;
  sensitivity?: SensitivityLevel;
  createdBy?: string;
  createdAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Environment Attributes (Context)
 * Contextual attributes of the access request
 */
export interface IEnvironmentAttributes {
  time?: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  device?: string;
  isBusinessHours?: boolean;
  isTrustedNetwork?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Policy Condition
 * Individual condition in a policy rule
 */
export interface IPolicyCondition {
  field: string; // e.g., "subject.role", "resource.owner", "environment.time"
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'greaterThan' | 'lessThan' | 'contains' | 'matches';
  value: unknown;
}

/**
 * Policy Rule
 * Defines access control rule with conditions
 */
export interface IPolicyRule {
  id: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  actions: Action[];
  resourceTypes: ResourceType[];
  conditions?: IPolicyCondition[];
  priority?: number; // Higher number = higher priority
}

/**
 * Authorization Context
 * Complete context for authorization decision
 */
export interface IAuthorizationContext {
  subject: ISubjectAttributes;
  resource: IResourceAttributes;
  action: Action;
  environment?: IEnvironmentAttributes;
}

/**
 * Authorization Decision
 * Result of policy evaluation
 */
export interface IAuthorizationDecision {
  allowed: boolean;
  reason?: string;
  matchedPolicies?: string[]; // IDs of matched policies
  evaluatedAt: Date;
}

/**
 * Permission Check
 * Simplified permission check parameters
 */
export interface IPermissionCheck {
  key: string; // Unique identifier for this permission check
  action: Action;
  resourceType: ResourceType;
  resourceId?: string;
  resourceAttributes?: Partial<IResourceAttributes>;
}

// ============= TYPE GUARDS =============

export const isAction = (value: unknown): value is Action => {
  return typeof value === 'string' && Object.values(Action).includes(value as Action);
};

export const isResourceType = (value: unknown): value is ResourceType => {
  return typeof value === 'string' && Object.values(ResourceType).includes(value as ResourceType);
};

export const isDepartment = (value: unknown): value is Department => {
  return typeof value === 'string' && Object.values(Department).includes(value as Department);
};

// ============= HELPER TYPES =============

export type PolicyConditionOperator = IPolicyCondition['operator'];

export type PermissionMap = Record<Action, boolean>;

export type ResourcePermissions = Partial<Record<ResourceType, PermissionMap>>;

