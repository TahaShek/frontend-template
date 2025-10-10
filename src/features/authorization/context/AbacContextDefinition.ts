/**
 * ABAC Context Definition
 * Separate file for context definition to satisfy Fast Refresh
 */

import { createContext } from 'react';
import type {
  ISubjectAttributes,
  IResourceAttributes,
  IAuthorizationDecision,
  IPermissionCheck,
  Action,
} from '../types';

/**
 * ABAC Context Interface
 */
export interface IAbacContext {
  subject: ISubjectAttributes | null;
  can: (action: Action, resource: IResourceAttributes) => IAuthorizationDecision;
  canMultiple: (checks: IPermissionCheck[]) => Record<string, IAuthorizationDecision>;
  isOwner: (resource: IResourceAttributes) => boolean;
  isSameDepartment: (resource: IResourceAttributes) => boolean;
}

/**
 * Create Context
 */
export const AbacContext = createContext<IAbacContext | undefined>(undefined);

