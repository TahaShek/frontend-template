/**
 * useAbacContext Hook
 * Separate file for hook to satisfy Fast Refresh
 */

import { useContext } from 'react';
import { AbacContext } from './AbacContextDefinition';
import type { IAbacContext } from './AbacContextDefinition';

/**
 * useAbacContext Hook
 * Access ABAC context
 */
export function useAbacContext(): IAbacContext {
  const context = useContext(AbacContext);
  if (!context) {
    throw new Error('useAbacContext must be used within an AbacProvider');
  }
  return context;
}

