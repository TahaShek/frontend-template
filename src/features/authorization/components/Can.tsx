/**
 * Can Component
 * Conditionally render children based on permissions
 */

import type { ReactNode } from 'react';
import { useAbac } from '../hooks';
import type { Action, IResourceAttributes } from '../types';

/**
 * Can Component Props
 */
interface CanProps {
  action: Action;
  resource: IResourceAttributes;
  children: ReactNode;
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

/**
 * Can Component
 * Renders children only if user has permission
 * 
 * @example
 * <Can action={Action.DELETE} resource={{ type: ResourceType.POST, id: '123' }}>
 *   <DeleteButton />
 * </Can>
 */
export const Can = ({
  action,
  resource,
  children,
  fallback = null,
  onUnauthorized,
}: CanProps) => {
  const { can } = useAbac();

  const allowed = can(action, resource);

  if (!allowed) {
    onUnauthorized?.();
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Cannot Component
 * Inverse of Can - renders children only if user lacks permission
 */
interface CannotProps {
  action: Action;
  resource: IResourceAttributes;
  children: ReactNode;
}

export const Cannot = ({ action, resource, children }: CannotProps) => {
  const { cannot } = useAbac();

  const notAllowed = cannot(action, resource);

  if (!notAllowed) {
    return null;
  }

  return <>{children}</>;
};

