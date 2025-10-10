/**
 * ABAC Context Provider
 * Provides authorization context throughout the application
 */

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/features/auth';
import type {
  ISubjectAttributes,
  IResourceAttributes,
  IAuthorizationDecision,
  IPermissionCheck,
  Action,
} from '../types';
import { permissionEvaluator } from '../services';
import { AbacContext } from './AbacContextDefinition';
import type { IAbacContext } from './AbacContextDefinition';

/**
 * ABAC Provider Props
 */
interface AbacProviderProps {
  children: ReactNode;
}

/**
 * ABAC Provider Component
 */
export const AbacProvider = ({ children }: AbacProviderProps) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Build subject attributes from current user
  const subject = useMemo<ISubjectAttributes | null>(() => {
    if (!isAuthenticated || !user) {
      return null;
    }

    return {
      userId: user.id,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
      // Add more attributes as needed
      // department: user.department,
      // clearanceLevel: user.clearanceLevel,
      // location: user.location,
    };
  }, [isAuthenticated, user]);

  // Can perform action
  const can = (action: Action, resource: IResourceAttributes): IAuthorizationDecision => {
    if (!subject) {
      return {
        allowed: false,
        reason: 'User not authenticated',
        evaluatedAt: new Date(),
      };
    }

    return permissionEvaluator.can(subject, action, resource);
  };

  // Check multiple permissions
  const canMultiple = (checks: IPermissionCheck[]): Record<string, IAuthorizationDecision> => {
    if (!subject) {
      const results: Record<string, IAuthorizationDecision> = {};
      checks.forEach((check) => {
        results[check.key] = {
          allowed: false,
          reason: 'User not authenticated',
          evaluatedAt: new Date(),
        };
      });
      return results;
    }

    return permissionEvaluator.canMultiple(subject, checks);
  };

  // Check if user is owner
  const isOwner = (resource: IResourceAttributes): boolean => {
    if (!subject) return false;
    return permissionEvaluator.isOwner(subject, resource);
  };

  // Check if same department
  const isSameDepartment = (resource: IResourceAttributes): boolean => {
    if (!subject) return false;
    return permissionEvaluator.isSameDepartment(subject, resource);
  };

  const value: IAbacContext = {
    subject,
    can,
    canMultiple,
    isOwner,
    isSameDepartment,
  };

  return <AbacContext.Provider value={value}>{children}</AbacContext.Provider>;
};

