# Authorization (ABAC) System Documentation

## Table of Contents
- [Overview](#overview)
- [What is ABAC?](#what-is-abac)
- [Architecture](#architecture)
- [Core Concepts](#core-concepts)
- [Policy System](#policy-system)
- [Components](#components)
- [Hooks](#hooks)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Best Practices](#best-practices)

## Overview

This application implements **Attribute-Based Access Control (ABAC)**, a flexible and scalable authorization model that makes access decisions based on attributes of:

- **Subject** (User) - role, department, clearance level
- **Resource** (Object) - type, owner, sensitivity
- **Action** (Operation) - READ, UPDATE, DELETE
- **Environment** (Context) - time, location, device

### Why ABAC?

Traditional RBAC (Role-Based Access Control) is limited to roles alone. ABAC provides:

✅ **Granular Control** - Fine-grained permissions  
✅ **Flexibility** - Complex permission rules  
✅ **Scalability** - Easy to add new attributes  
✅ **Maintainability** - Centralized policy management  
✅ **Auditing** - Clear permission decisions

## What is ABAC?

### ABAC vs RBAC

| Feature | RBAC | ABAC |
|---------|------|------|
| Basis | Roles only | Multiple attributes |
| Granularity | Coarse | Fine-grained |
| Flexibility | Limited | Highly flexible |
| Complexity | Simple | More complex |
| Scalability | Limited | Highly scalable |
| Context-aware | No | Yes |

### Decision Formula

```
Permission = f(Subject, Action, Resource, Environment)
```

**Example:**
```
Can USER (role=MANAGER, dept=ENGINEERING, clearance=3) 
    perform UPDATE 
    on DOCUMENT (dept=ENGINEERING, sensitivity=MEDIUM, owner=user-1)?
```

**Answer:** Check policies that match these attributes and return ALLOW/DENY.

## Architecture

### File Structure

```
src/features/authorization/
├── types/                      # TypeScript definitions
│   └── abac.types.ts           # Interfaces & enums
├── services/                   # Business logic
│   ├── policy-engine.ts        # Policy evaluation
│   └── permission-evaluator.ts # Permission checks
├── context/                    # React Context
│   ├── AbacContextDefinition.ts # Context definition
│   ├── AbacContext.tsx         # Provider component
│   └── useAbacContext.ts       # Context hook
├── hooks/                      # Custom hooks
│   ├── useAbac.ts              # Main ABAC hook
│   └── usePermission.ts        # Single permission check
├── components/                 # UI components
│   ├── Can.tsx                 # Conditional rendering
│   ├── ProtectedContent.tsx    # Multiple checks
│   └── index.ts
├── policies/                   # Policy definitions
│   └── policies.ts             # Default policies
├── USAGE_EXAMPLES.tsx          # Live examples
└── index.ts                    # Barrel export
```

### Data Flow

```
Component
   ↓
useAbac() / Can component
   ↓
AbacContext
   ↓
PermissionEvaluator
   ↓
PolicyEngine
   ↓
Evaluate Policies
   ↓
Return Decision (ALLOW/DENY)
```

## Core Concepts

### 1. Subject Attributes (User)

Attributes of the user making the request:

```typescript
interface ISubjectAttributes {
  userId: string;
  role: UserRole;                    // ADMIN, USER, MANAGER, etc.
  department?: Department;           // ENGINEERING, HR, FINANCE
  clearanceLevel?: ClearanceLevel;   // 1-5
  email?: string;
  location?: string;
}
```

**Example:**
```typescript
{
  userId: "user-1",
  role: "MANAGER",
  department: "ENGINEERING",
  clearanceLevel: 3
}
```

### 2. Resource Attributes (Object)

Attributes of the resource being accessed:

```typescript
interface IResourceAttributes {
  id?: string;
  type: ResourceType;                // DOCUMENT, USER, REPORT
  owner?: string;
  department?: Department;
  sensitivity?: SensitivityLevel;    // PUBLIC, CONFIDENTIAL, SECRET
  createdBy?: string;
}
```

**Example:**
```typescript
{
  id: "doc-123",
  type: "DOCUMENT",
  owner: "user-1",
  department: "ENGINEERING",
  sensitivity: "INTERNAL"
}
```

### 3. Actions

Operations that can be performed:

```typescript
const Action = {
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
```

### 4. Environment Attributes (Context)

Contextual information about the request:

```typescript
interface IEnvironmentAttributes {
  time?: Date;
  ipAddress?: string;
  location?: string;
  device?: string;
  isBusinessHours?: boolean;
  isTrustedNetwork?: boolean;
}
```

**Example:**
```typescript
{
  time: new Date(),
  isBusinessHours: true,
  location: "OFFICE",
  device: "DESKTOP"
}
```

## Policy System

### Policy Structure

```typescript
interface IPolicyRule {
  id: string;
  name: string;
  description?: string;
  effect: 'ALLOW' | 'DENY';
  actions: Action[];
  resourceTypes: ResourceType[];
  conditions?: IPolicyCondition[];
  priority?: number;
}
```

### Policy Examples

#### 1. Admin Full Access
```typescript
{
  id: 'admin-full-access',
  name: 'Admin Full Access',
  effect: 'ALLOW',
  actions: Object.values(Action),  // All actions
  resourceTypes: Object.values(ResourceType),  // All resources
  conditions: [
    {
      field: 'subject.role',
      operator: 'equals',
      value: 'ADMIN'
    }
  ]
}
```

#### 2. Department-Based Document Access
```typescript
{
  id: 'dept-document-read',
  name: 'Department Document Read',
  effect: 'ALLOW',
  actions: [Action.READ],
  resourceTypes: [ResourceType.DOCUMENT],
  conditions: [
    {
      field: 'subject.department',
      operator: 'equals',
      value: '${resource.department}'  // Same department
    },
    {
      field: 'subject.role',
      operator: 'in',
      value: ['USER', 'MANAGER']
    }
  ]
}
```

#### 3. Clearance Level Policy
```typescript
{
  id: 'clearance-confidential',
  name: 'Clearance Level for Confidential',
  effect: 'ALLOW',
  actions: [Action.READ],
  resourceTypes: [ResourceType.DOCUMENT],
  conditions: [
    {
      field: 'subject.clearanceLevel',
      operator: 'greaterThan',
      value: 3
    },
    {
      field: 'resource.sensitivity',
      operator: 'equals',
      value: 'CONFIDENTIAL'
    }
  ]
}
```

#### 4. Ownership Policy
```typescript
{
  id: 'owner-full-access',
  name: 'Owner Full Access',
  effect: 'ALLOW',
  actions: [Action.READ, Action.UPDATE, Action.DELETE],
  resourceTypes: Object.values(ResourceType),
  conditions: [
    {
      field: 'subject.userId',
      operator: 'equals',
      value: '${resource.owner}'  // User is owner
    }
  ]
}
```

#### 5. Time-Based Deny Policy
```typescript
{
  id: 'deny-after-hours',
  name: 'Deny Access After Hours',
  effect: 'DENY',
  actions: [Action.READ, Action.UPDATE],
  resourceTypes: [ResourceType.DOCUMENT],
  conditions: [
    {
      field: 'resource.sensitivity',
      operator: 'equals',
      value: 'CONFIDENTIAL'
    },
    {
      field: 'environment.isBusinessHours',
      operator: 'equals',
      value: false
    }
  ],
  priority: 100  // High priority (DENY always wins)
}
```

### Policy Evaluation

1. **Find Matching Policies** - Match subject, action, resource, environment
2. **Check Conditions** - Evaluate all conditions
3. **Apply Priority** - Higher priority wins
4. **DENY Wins** - If any DENY matches, access is denied
5. **Default DENY** - If no policy matches, deny access

## Components

### Can Component

Conditionally renders children based on a single permission check.

```typescript
import { Can } from '@/features/authorization';

<Can action={Action.DELETE} resource={{ type: ResourceType.POST, id: '123' }}>
  <button>Delete Post</button>
</Can>
```

**With Fallback:**
```typescript
<Can
  action={Action.UPDATE}
  resource={{ type: ResourceType.DOCUMENT, id: 'doc-1' }}
  fallback={<button disabled>Cannot Edit</button>}
>
  <button>Edit Document</button>
</Can>
```

### ProtectedContent Component

Renders content based on multiple permission checks.

```typescript
import { ProtectedContent } from '@/features/authorization';

<ProtectedContent
  checks={[
    { key: 'read', action: Action.READ, resourceType: ResourceType.DOCUMENT },
    { key: 'update', action: Action.UPDATE, resourceType: ResourceType.DOCUMENT }
  ]}
  requireAll={true}  // Require all checks to pass
  fallback={<p>Access denied</p>}
>
  <DocumentEditor />
</ProtectedContent>
```

**Require Any (OR logic):**
```typescript
<ProtectedContent
  checks={[
    { key: 'admin', action: Action.UPDATE, resourceType: ResourceType.SETTING },
    { key: 'owner', action: Action.UPDATE, resourceType: ResourceType.USER }
  ]}
  requireAll={false}  // Require any check to pass
>
  <SettingsPanel />
</ProtectedContent>
```

### OwnerOnly Component

Renders content only for resource owners.

```typescript
import { OwnerOnly } from '@/features/authorization';

<OwnerOnly
  resource={{ type: ResourceType.USER, owner: userId }}
  fallback={<p>Read-only</p>}
>
  <EditProfileButton />
</OwnerOnly>
```

## Hooks

### useAbac Hook

Comprehensive hook for all authorization needs.

```typescript
import { useAbac } from '@/features/authorization';

function MyComponent() {
  const { can, cannot, checkAll, checkAny, isOwner, subject } = useAbac();

  // Check if user can perform action
  if (can(Action.DELETE, { type: ResourceType.POST, id: '123' })) {
    // Show delete button
  }

  // Check if user cannot perform action
  if (cannot(Action.UPDATE, { type: ResourceType.DOCUMENT })) {
    // Show read-only message
  }

  // Check multiple permissions (all must pass)
  const canManage = checkAll([
    { key: 'read', action: Action.READ, resourceType: ResourceType.DOCUMENT },
    { key: 'update', action: Action.UPDATE, resourceType: ResourceType.DOCUMENT }
  ]);

  // Check multiple permissions (any can pass)
  const hasAnyAccess = checkAny([
    { key: 'admin', action: Action.UPDATE, resourceType: ResourceType.SETTING },
    { key: 'manager', action: Action.APPROVE, resourceType: ResourceType.DOCUMENT }
  ]);

  // Check if user owns resource
  if (isOwner({ type: ResourceType.USER, owner: currentUserId })) {
    // Show owner-only controls
  }

  // Access current user attributes
  console.log(subject.role, subject.department, subject.clearanceLevel);
}
```

### usePermission Hook

Hook for checking a single permission.

```typescript
import { usePermission } from '@/features/authorization';

function MyComponent() {
  const { allowed, reason } = usePermission(
    Action.DELETE,
    { type: ResourceType.POST, id: '123' }
  );

  if (!allowed) {
    return <p>Access denied: {reason}</p>;
  }

  return <button>Delete Post</button>;
}
```

## Usage Examples

### Example 1: Simple Permission Check

```typescript
import { useAbac, Action, ResourceType } from '@/features/authorization';

function DocumentActions({ documentId }) {
  const { can } = useAbac();

  const document = {
    type: ResourceType.DOCUMENT,
    id: documentId,
    department: 'ENGINEERING',
    sensitivity: 'INTERNAL'
  };

  return (
    <div>
      {can(Action.READ, document) && (
        <button>View</button>
      )}
      {can(Action.UPDATE, document) && (
        <button>Edit</button>
      )}
      {can(Action.DELETE, document) && (
        <button>Delete</button>
      )}
    </div>
  );
}
```

### Example 2: Department-Based Access

```typescript
import { Can, Action, ResourceType, Department } from '@/features/authorization';

function HRDocuments() {
  const hrDocument = {
    type: ResourceType.DOCUMENT,
    department: Department.HR,
    sensitivity: 'CONFIDENTIAL'
  };

  return (
    <Can action={Action.READ} resource={hrDocument}>
      <div>
        <h2>HR Documents</h2>
        <p>You have access to HR documents.</p>
      </div>
    </Can>
  );
}
```

### Example 3: Clearance Level Check

```typescript
import { useAbac, Action, ResourceType, SensitivityLevel } from '@/features/authorization';

function ConfidentialReport() {
  const { can, subject } = useAbac();

  const report = {
    type: ResourceType.REPORT,
    sensitivity: SensitivityLevel.CONFIDENTIAL
  };

  if (!can(Action.READ, report)) {
    return (
      <div>
        <p>Access Denied</p>
        <p>Your clearance level: {subject?.clearanceLevel || 'None'}</p>
        <p>Required: Level 4+</p>
      </div>
    );
  }

  return <ConfidentialReportContent />;
}
```

### Example 4: Owner-Only Edit

```typescript
import { OwnerOnly, ResourceType } from '@/features/authorization';

function UserProfile({ userId }) {
  const profile = {
    type: ResourceType.USER,
    owner: userId
  };

  return (
    <div>
      <h2>User Profile</h2>
      <OwnerOnly resource={profile} fallback={<p>Read-only</p>}>
        <button>Edit Profile</button>
      </OwnerOnly>
    </div>
  );
}
```

### Example 5: Multiple Permission Checks

```typescript
import { ProtectedContent, Action, ResourceType } from '@/features/authorization';

function BulkOperations() {
  return (
    <ProtectedContent
      checks={[
        { key: 'read', action: Action.READ, resourceType: ResourceType.DOCUMENT },
        { key: 'export', action: Action.EXPORT, resourceType: ResourceType.DOCUMENT }
      ]}
      requireAll={true}
      fallback={<p>You need both READ and EXPORT permissions for bulk operations.</p>}
    >
      <div>
        <button>Bulk Export</button>
        <button>Bulk Import</button>
      </div>
    </ProtectedContent>
  );
}
```

### Example 6: Admin-Only Settings

```typescript
import { Can, Action, ResourceType } from '@/features/authorization';

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      
      <Can action={Action.UPDATE} resource={{ type: ResourceType.SETTING }}>
        <div>
          <h2>System Settings</h2>
          <p>Only administrators can see this.</p>
          <button>Update Settings</button>
        </div>
      </Can>
    </div>
  );
}
```

## Testing

### Testing with Mock Users

Use the Dev User Switcher to test different permission scenarios:

1. **Admin User** - Full access to everything
2. **Engineering Manager** - Access to engineering documents, can update
3. **HR User** - Access to HR documents, limited to own department
4. **Finance User** - Access to financial reports with high clearance
5. **Guest User** - Very limited access

### Testing Checklist

- [ ] Admin can access all resources
- [ ] Users can only access own department's resources
- [ ] Managers have elevated permissions
- [ ] Clearance levels are enforced
- [ ] Ownership checks work correctly
- [ ] DENY policies override ALLOW policies
- [ ] Time-based policies work (if implemented)
- [ ] Default deny works (no matching policy)

### Demo Page

Visit `/permissions-demo` to see live examples of:
- Department-based access
- Clearance level checks
- Ownership verification
- Public resource access
- Admin-only actions
- Multiple permission checks

## Best Practices

### 1. Always Check Permissions on Backend

Client-side checks are for UX only. Always validate permissions on the server.

```typescript
// ❌ BAD - Only client-side check
if (can(Action.DELETE, resource)) {
  await api.delete(resource.id);  // Anyone can call this API
}

// ✅ GOOD - Check on both client and server
if (can(Action.DELETE, resource)) {
  // Show delete button
}
// Server validates permission before deleting
```

### 2. Use Specific Resource Attributes

Provide as much context as possible:

```typescript
// ❌ BAD - Not enough context
can(Action.UPDATE, { type: ResourceType.DOCUMENT });

// ✅ GOOD - Specific context
can(Action.UPDATE, {
  type: ResourceType.DOCUMENT,
  id: 'doc-123',
  department: 'ENGINEERING',
  owner: 'user-1',
  sensitivity: 'INTERNAL'
});
```

### 3. Use Components for Conditional Rendering

Use `Can` and `ProtectedContent` components instead of manual checks:

```typescript
// ❌ OK - Manual check
{can(Action.DELETE, resource) && <DeleteButton />}

// ✅ BETTER - Use component
<Can action={Action.DELETE} resource={resource}>
  <DeleteButton />
</Can>
```

### 4. Cache Permission Checks

For expensive checks, cache the results:

```typescript
const permissions = useMemo(() => ({
  canRead: can(Action.READ, resource),
  canUpdate: can(Action.UPDATE, resource),
  canDelete: can(Action.DELETE, resource),
}), [resource, can]);
```

### 5. Provide Fallback Content

Always provide helpful feedback when access is denied:

```typescript
<Can
  action={Action.UPDATE}
  resource={resource}
  fallback={
    <div>
      <p>You don't have permission to edit this resource.</p>
      <p>Required: Manager role or owner</p>
    </div>
  }
>
  <EditButton />
</Can>
```

### 6. Document Your Policies

Add clear descriptions to all policies:

```typescript
{
  id: 'dept-document-access',
  name: 'Department Document Access',
  description: 'Users and managers can read documents in their own department',
  effect: 'ALLOW',
  // ...
}
```

## Troubleshooting

### Common Issues

**Issue:** Permission check always returns false
- Check if user is authenticated
- Verify subject attributes are populated
- Check if policies are loaded
- Verify resource attributes match policy conditions

**Issue:** DENY policy not working
- Check policy priority
- Verify DENY policies are evaluated first
- Check condition matching

**Issue:** Permissions not updating when user changes
- AbacContext should update automatically
- Check if AbacProvider wraps your app
- Verify user state is managed correctly

## Future Enhancements

- [ ] Dynamic policy loading from backend
- [ ] Policy versioning
- [ ] Audit logging for permission checks
- [ ] Performance optimization with caching
- [ ] Policy testing framework
- [ ] Policy conflict detection
- [ ] Visual policy builder UI

---

For more information, see:
- [Architecture Documentation](../ARCHITECTURE.md)
- [Authentication Documentation](./AUTHENTICATION.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)
- [Usage Examples](../../src/features/authorization/USAGE_EXAMPLES.tsx)

