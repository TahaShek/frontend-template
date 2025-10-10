/**
 * useAbac Hook
 * Main hook for accessing ABAC functionality
 */

import { useAbacContext } from '../context/useAbacContext';
import type {
  Action,
  IResourceAttributes,
  IAuthorizationDecision,
  IPermissionCheck,
} from '../types';

/**
 * useAbac Hook
 * Comprehensive hook for authorization checks
 */
export const useAbac = () => {
  const context = useAbacContext();

  /**
   * Check if user can perform action
   */
  const can = (action: Action, resource: IResourceAttributes): boolean => {
    const decision = context.can(action, resource);
    return decision.allowed;
  };

  /**
   * Check with full decision details
   */
  const canWithReason = (
    action: Action,
    resource: IResourceAttributes
  ): IAuthorizationDecision => {
    return context.can(action, resource);
  };

  /**
   * Check if user cannot perform action
   */
  const cannot = (action: Action, resource: IResourceAttributes): boolean => {
    return !can(action, resource);
  };

  /**
   * Check multiple permissions
   */
  const checkAll = (checks: IPermissionCheck[]): boolean => {
    const results = context.canMultiple(checks);
    return Object.values(results).every((decision) => (decision as IAuthorizationDecision).allowed);
  };

  /**
   * Check if any permission is allowed
   */
  const checkAny = (checks: IPermissionCheck[]): boolean => {
    const results = context.canMultiple(checks);
    return Object.values(results).some((decision) => (decision as IAuthorizationDecision).allowed);
  };

  /**
   * Check if user is owner
   */
  const isOwner = (resource: IResourceAttributes): boolean => {
    return context.isOwner(resource);
  };

  /**
   * Check if same department
   */
  const isSameDepartment = (resource: IResourceAttributes): boolean => {
    return context.isSameDepartment(resource);
  };

  return {
    subject: context.subject,
    can,
    canWithReason,
    cannot,
    checkAll,
    checkAny,
    canMultiple: context.canMultiple,
    isOwner,
    isSameDepartment,
  };
};

