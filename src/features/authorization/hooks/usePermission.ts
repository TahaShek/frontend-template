/**
 * usePermission Hook
 * Check permissions for specific actions and resources
 */

import { useMemo } from 'react';
import { useAbacContext } from '../context/useAbacContext';
import type { Action, IResourceAttributes, IAuthorizationDecision } from '../types';

/**
 * usePermission Hook
 * Returns permission check function and current decision
 */
export const usePermission = (
  action: Action,
  resource: IResourceAttributes
): IAuthorizationDecision & { check: () => IAuthorizationDecision } => {
  const { can } = useAbacContext();

  const decision = useMemo(() => {
    return can(action, resource);
  }, [action, resource, can]);

  return {
    ...decision,
    check: () => can(action, resource),
  };
};

/**
 * usePermissions Hook
 * Check multiple permissions at once
 */
export const usePermissions = (
  action: Action,
  resources: IResourceAttributes[]
): Record<string, IAuthorizationDecision> => {
  const { can } = useAbacContext();

  return useMemo(() => {
    const results: Record<string, IAuthorizationDecision> = {};
    resources.forEach((resource, index) => {
      const key = resource.id || `${resource.type}-${index}`;
      results[key] = can(action, resource);
    });
    return results;
  }, [action, resources, can]);
};

/**
 * useResourcePermissions Hook
 * Get all action permissions for a resource
 */
export const useResourcePermissions = (
  resource: IResourceAttributes,
  actions: Action[]
): Record<Action, boolean> => {
  const { can } = useAbacContext();

  return useMemo(() => {
    const results: Record<string, boolean> = {};
    actions.forEach((action) => {
      const decision = can(action, resource);
      results[action] = decision.allowed;
    });
    return results;
  }, [resource, actions, can]);
};

