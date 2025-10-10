/**
 * Policy Engine
 * Evaluates authorization policies and makes access decisions
 */

import type {
  IAuthorizationContext,
  IAuthorizationDecision,
  IPolicyRule,
  IPolicyCondition,
  PolicyEffect,
} from '../types';
import { PolicyEffect as PolicyEffectEnum } from '../types';

/**
 * Policy Engine Class
 * Core engine for evaluating ABAC policies
 */
export class PolicyEngine {
  private policies: IPolicyRule[] = [];

  /**
   * Register a policy
   */
  addPolicy(policy: IPolicyRule): void {
    this.policies.push(policy);
    // Sort by priority (higher first)
    this.policies.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Register multiple policies
   */
  addPolicies(policies: IPolicyRule[]): void {
    policies.forEach((policy) => this.addPolicy(policy));
  }

  /**
   * Remove a policy by ID
   */
  removePolicy(policyId: string): void {
    this.policies = this.policies.filter((p) => p.id !== policyId);
  }

  /**
   * Get all registered policies
   */
  getPolicies(): IPolicyRule[] {
    return [...this.policies];
  }

  /**
   * Clear all policies
   */
  clearPolicies(): void {
    this.policies = [];
  }

  /**
   * Evaluate authorization context against all policies
   */
  evaluate(context: IAuthorizationContext): IAuthorizationDecision {
    const matchedPolicies: string[] = [];
    let finalEffect: PolicyEffect | null = null;
    let reason = '';

    // Find all matching policies
    for (const policy of this.policies) {
      if (this.policyMatches(policy, context)) {
        matchedPolicies.push(policy.id);

        // DENY takes precedence over ALLOW
        if (policy.effect === PolicyEffectEnum.DENY) {
          finalEffect = PolicyEffectEnum.DENY;
          reason = `Access denied by policy: ${policy.name}`;
          break; // Stop at first DENY
        }

        // Set ALLOW if no previous decision
        if (finalEffect === null) {
          finalEffect = PolicyEffectEnum.ALLOW;
          reason = `Access allowed by policy: ${policy.name}`;
        }
      }
    }

    // Default to DENY if no policies matched
    if (finalEffect === null) {
      finalEffect = PolicyEffectEnum.DENY;
      reason = 'No matching policies found - access denied by default';
    }

    return {
      allowed: finalEffect === PolicyEffectEnum.ALLOW,
      reason,
      matchedPolicies,
      evaluatedAt: new Date(),
    };
  }

  /**
   * Check if a policy matches the context
   */
  private policyMatches(policy: IPolicyRule, context: IAuthorizationContext): boolean {
    // Check if action matches
    if (!policy.actions.includes(context.action)) {
      return false;
    }

    // Check if resource type matches
    if (!policy.resourceTypes.includes(context.resource.type)) {
      return false;
    }

    // Check all conditions
    if (policy.conditions && policy.conditions.length > 0) {
      return policy.conditions.every((condition) =>
        this.evaluateCondition(condition, context)
      );
    }

    return true;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(
    condition: IPolicyCondition,
    context: IAuthorizationContext
  ): boolean {
    const actualValue = this.getValueByPath(condition.field, context);

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value;

      case 'notEquals':
        return actualValue !== condition.value;

      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(actualValue);

      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(actualValue);

      case 'greaterThan':
        return typeof actualValue === 'number' && 
               typeof condition.value === 'number' && 
               actualValue > condition.value;

      case 'lessThan':
        return typeof actualValue === 'number' && 
               typeof condition.value === 'number' && 
               actualValue < condition.value;

      case 'contains':
        return typeof actualValue === 'string' && 
               typeof condition.value === 'string' && 
               actualValue.includes(condition.value);

      case 'matches':
        if (typeof actualValue === 'string' && typeof condition.value === 'string') {
          const regex = new RegExp(condition.value);
          return regex.test(actualValue);
        }
        return false;

      default:
        return false;
    }
  }

  /**
   * Get value from context by path (e.g., "subject.role", "resource.owner")
   */
  private getValueByPath(path: string, context: IAuthorizationContext): unknown {
    const parts = path.split('.');
    let value: unknown = context;

    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return value;
  }
}

// Export singleton instance
export const policyEngine = new PolicyEngine();

// Export class for testing
export default PolicyEngine;

