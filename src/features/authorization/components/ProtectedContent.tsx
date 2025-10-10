/**
 * ProtectedContent Component
 * Advanced permission-based content rendering
 */

import type { ReactNode } from 'react';
import { useAbac } from '../hooks';
import type { IPermissionCheck, IResourceAttributes, IAuthorizationDecision } from '../types';

/**
 * ProtectedContent Props
 */
interface ProtectedContentProps {
  checks: IPermissionCheck[];
  requireAll?: boolean; // Require all checks to pass (default: false)
  children: ReactNode;
  fallback?: ReactNode;
  onUnauthorized?: (failedChecks: string[]) => void;
}

/**
 * ProtectedContent Component
 * Renders content based on multiple permission checks
 * 
 * @example
 * <ProtectedContent
 *   checks={[
 *     { action: Action.READ, resourceType: ResourceType.DOCUMENT },
 *     { action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
 *   ]}
 *   requireAll={true}
 * >
 *   <DocumentEditor />
 * </ProtectedContent>
 */
export const ProtectedContent = ({
  checks,
  requireAll = false,
  children,
  fallback = null,
  onUnauthorized,
}: ProtectedContentProps) => {
  const { checkAll, checkAny, canMultiple } = useAbac();

  // Determine if checks pass
  const allowed = requireAll ? checkAll(checks) : checkAny(checks);

  if (!allowed) {
    // Find which checks failed
    const results = canMultiple(checks);
    const failedChecks = Object.entries(results)
      .filter(([, decision]) => !(decision as IAuthorizationDecision).allowed)
      .map(([key]) => key);

    onUnauthorized?.(failedChecks);
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * OwnerOnly Component
 * Renders children only if user is the owner of the resource
 */
interface OwnerOnlyProps {
  resource: IResourceAttributes;
  children: ReactNode;
  fallback?: ReactNode;
}

export const OwnerOnly = ({ resource, children, fallback = null }: OwnerOnlyProps) => {
  const { isOwner } = useAbac();

  if (!isOwner(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * SameDepartmentOnly Component
 * Renders children only if user is in same department as resource
 */
interface SameDepartmentOnlyProps {
  resource: IResourceAttributes;
  children: ReactNode;
  fallback?: ReactNode;
}

export const SameDepartmentOnly = ({
  resource,
  children,
  fallback = null,
}: SameDepartmentOnlyProps) => {
  const { isSameDepartment } = useAbac();

  if (!isSameDepartment(resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

