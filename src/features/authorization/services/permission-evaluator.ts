/**
 * Permission Evaluator
 * High-level service for checking permissions
 */

import type {
  IAuthorizationContext,
  IAuthorizationDecision,
  ISubjectAttributes,
  IResourceAttributes,
  IEnvironmentAttributes,
  IPermissionCheck,
} from '../types';
import { policyEngine } from './policy-engine';

/**
 * Permission Evaluator Class
 */
export class PermissionEvaluator {
  /**
   * Check if a subject can perform an action on a resource
   */
  can(
    subject: ISubjectAttributes,
    action: IPermissionCheck['action'],
    resource: IResourceAttributes,
    environment?: IEnvironmentAttributes
  ): IAuthorizationDecision {
    const context: IAuthorizationContext = {
      subject,
      resource,
      action,
      environment: environment || this.getEnvironmentContext(),
    };

    return policyEngine.evaluate(context);
  }

  /**
   * Check multiple permissions at once
   */
  canMultiple(
    subject: ISubjectAttributes,
    checks: IPermissionCheck[],
    environment?: IEnvironmentAttributes
  ): Record<string, IAuthorizationDecision> {
    const results: Record<string, IAuthorizationDecision> = {};

    checks.forEach((check) => {
      const resource: IResourceAttributes = {
        type: check.resourceType,
        id: check.resourceId,
        ...check.resourceAttributes,
      };

      results[check.key] = this.can(subject, check.action, resource, environment);
    });

    return results;
  }

  /**
   * Check if subject is owner of resource
   */
  isOwner(subject: ISubjectAttributes, resource: IResourceAttributes): boolean {
    return resource.owner === subject.userId || resource.createdBy === subject.userId;
  }

  /**
   * Check if subject is in same department as resource
   */
  isSameDepartment(subject: ISubjectAttributes, resource: IResourceAttributes): boolean {
    return subject.department !== undefined && 
           resource.department !== undefined && 
           subject.department === resource.department;
  }

  /**
   * Check if current time is within business hours
   */
  isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Monday-Friday, 9am-5pm
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  }

  /**
   * Get current environment context
   */
  private getEnvironmentContext(): IEnvironmentAttributes {
    return {
      time: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      isBusinessHours: this.isBusinessHours(),
      isTrustedNetwork: true, // Can be determined based on IP
    };
  }
}

// Export singleton instance
export const permissionEvaluator = new PermissionEvaluator();

// Export class for testing
export default PermissionEvaluator;

