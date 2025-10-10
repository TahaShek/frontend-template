/**
 * ABAC Usage Examples
 * Practical examples of how to use the ABAC system
 */

import { useAbac, Can, ProtectedContent, OwnerOnly } from '@/features/authorization';
import { Action, ResourceType, Department, SensitivityLevel } from '@/features/authorization/types';

// ============= Example 1: Basic Permission Check =============

export function Example1_BasicCheck() {
  const { can } = useAbac();

  const canEditDocument = can(Action.UPDATE, {
    type: ResourceType.DOCUMENT,
    id: 'doc-123',
  });

  return (
    <div>
      {canEditDocument ? (
        <button>Edit Document</button>
      ) : (
        <p>You don't have permission to edit</p>
      )}
    </div>
  );
}

// ============= Example 2: Using Can Component =============

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export function Example2_CanComponent({ post }: { post: Post }) {
  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <div className="actions">
        {/* Show edit button only if user can update */}
        <Can
          action={Action.UPDATE}
          resource={{ type: ResourceType.POST, id: post.id, owner: post.userId }}
        >
          <button>Edit</button>
        </Can>

        {/* Show delete with fallback */}
        <Can
          action={Action.DELETE}
          resource={{ type: ResourceType.POST, id: post.id, owner: post.userId }}
          fallback={<span className="text-gray-400">Cannot delete</span>}
        >
          <button className="text-red-600">Delete</button>
        </Can>
      </div>
    </div>
  );
}

// ============= Example 3: Protected Content =============

export function Example3_ProtectedContent() {
  return (
    <ProtectedContent
      checks={[
        { key: 'read', action: Action.READ, resourceType: ResourceType.DOCUMENT },
        { key: 'update', action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
      ]}
      requireAll={true}
      fallback={
        <div className="alert alert-warning">
          You need both read and update permissions to access this editor
        </div>
      }
    >
      <div className="document-editor">
        <h2>Document Editor</h2>
        {/* Rich text editor here */}
      </div>
    </ProtectedContent>
  );
}

// ============= Example 4: Owner-Based Access =============

interface Project {
  id: string;
  name: string;
  ownerId: string;
}

export function Example4_OwnerAccess({ project }: { project: Project }) {
  const { isOwner } = useAbac();

  const isProjectOwner = isOwner({
    type: ResourceType.PROJECT,
    owner: project.ownerId,
  });

  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      
      {isProjectOwner && (
        <span className="badge badge-primary">Owner</span>
      )}

      {/* Settings only for owner */}
      <OwnerOnly
        resource={{ type: ResourceType.PROJECT, owner: project.ownerId }}
        fallback={<p>Only project owner can access settings</p>}
      >
        <button>Project Settings</button>
      </OwnerOnly>
    </div>
  );
}

// ============= Example 5: Department-Based Access =============

export function Example5_DepartmentAccess() {
  const { can, subject } = useAbac();

  const canViewHRReports = can(Action.READ, {
    type: ResourceType.REPORT,
    department: Department.HR,
  });

  const canViewFinanceReports = can(Action.READ, {
    type: ResourceType.REPORT,
    department: Department.FINANCE,
  });

  return (
    <div className="dashboard">
      <h1>Employee Dashboard</h1>
      
      <p>Logged in as: {subject?.email}</p>
      <p>Department: {subject?.department || 'N/A'}</p>

      {canViewHRReports && (
        <section>
          <h2>HR Reports</h2>
          {/* HR content */}
        </section>
      )}

      {canViewFinanceReports && (
        <section>
          <h2>Finance Reports</h2>
          {/* Finance content */}
        </section>
      )}
    </div>
  );
}

// ============= Example 6: Multiple Permission Checks =============

export function Example6_MultipleChecks() {
  const { checkAll, checkAny } = useAbac();

  const hasAllPermissions = checkAll([
    { key: 'read', action: Action.READ, resourceType: ResourceType.DOCUMENT },
    { key: 'update', action: Action.UPDATE, resourceType: ResourceType.DOCUMENT },
    { key: 'delete', action: Action.DELETE, resourceType: ResourceType.DOCUMENT },
  ]);

  const hasAnyPermission = checkAny([
    { key: 'approve', action: Action.APPROVE, resourceType: ResourceType.POST },
    { key: 'reject', action: Action.REJECT, resourceType: ResourceType.POST },
  ]);

  return (
    <div>
      {hasAllPermissions && (
        <div className="admin-panel">
          <h2>Full Document Management</h2>
          <p>You have complete control over documents</p>
        </div>
      )}

      {hasAnyPermission && (
        <div className="moderator-panel">
          <h2>Content Moderation</h2>
          <p>You can approve or reject posts</p>
        </div>
      )}
    </div>
  );
}

// ============= Example 7: Conditional Rendering =============

interface Document {
  id: string;
  title: string;
  content: string;
  owner: string;
  sensitivity: SensitivityLevel;
}

export function Example7_ConditionalUI({ document }: { document: Document }) {
  const { can } = useAbac();

  const resource = {
    type: ResourceType.DOCUMENT,
    id: document.id,
    owner: document.owner,
    sensitivity: document.sensitivity,
  };

  const canDelete = can(Action.DELETE, resource);

  return (
    <div className="document-view">
      <h1>{document.title}</h1>
      <div className="content">{document.content}</div>

      <div className="actions space-x-2">
        {can(Action.UPDATE, resource) && (
          <button className="btn btn-primary">Edit</button>
        )}

        {can(Action.SHARE, resource) && (
          <button className="btn btn-secondary">Share</button>
        )}

        {can(Action.EXPORT, resource) && (
          <button className="btn btn-secondary">Export</button>
        )}

        {canDelete ? (
          <button className="btn btn-danger">Delete</button>
        ) : (
          <button 
            className="btn btn-disabled" 
            title="You don't have permission to delete"
            disabled
          >
            Delete (Restricted)
          </button>
        )}
      </div>
    </div>
  );
}

// ============= Example 8: Dynamic Resource Permissions =============

interface Item {
  id: string;
  title: string;
  owner: string;
}

export function Example8_DynamicPermissions({ items }: { items: Item[] }) {
  const { can } = useAbac();

  return (
    <ul className="item-list">
      {items.map((item) => {
        const canEdit = can(Action.UPDATE, {
          type: ResourceType.POST,
          id: item.id,
          owner: item.owner,
        });

        const canDelete = can(Action.DELETE, {
          type: ResourceType.POST,
          id: item.id,
          owner: item.owner,
        });

        return (
          <li key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <div className="actions">
              {canEdit && <button>Edit</button>}
              {canDelete && <button>Delete</button>}
              {!canEdit && !canDelete && <span className="text-muted">Read-only</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ============= Example 9: Form with Permission Checks =============

export function Example9_FormPermissions() {
  const { can } = useAbac();

  const canCreatePost = can(Action.CREATE, {
    type: ResourceType.POST,
  });

  if (!canCreatePost) {
    return (
      <div className="alert alert-warning">
        You don't have permission to create posts
      </div>
    );
  }

  return (
    <form className="post-form">
      <h2>Create New Post</h2>
      <input type="text" placeholder="Title" />
      <textarea placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}

// ============= Example 10: Advanced Business Logic =============

interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  sensitivityLevel: SensitivityLevel;
  phone?: string;
  location?: string;
  salary?: string;
  performanceRating?: string;
}

export function Example10_BusinessLogic({ employee }: { employee: Employee }) {
  const { can, subject, isSameDepartment } = useAbac();

  const resource = {
    type: ResourceType.EMPLOYEE,
    id: employee.id,
    department: employee.department,
    sensitivity: employee.sensitivityLevel,
  };

  const canViewDetails = can(Action.READ, resource);
  const canEdit = can(Action.UPDATE, resource);
  const inSameDepartment = isSameDepartment(resource);
  const isHR = subject?.department === Department.HR;

  return (
    <div className="employee-profile">
      <h2>{employee.name}</h2>

      {canViewDetails ? (
        <>
          <div className="basic-info">
            <p>Email: {employee.email}</p>
            <p>Department: {employee.department}</p>
          </div>

          {(inSameDepartment || isHR) && (
            <div className="extended-info">
              <p>Phone: {employee.phone}</p>
              <p>Location: {employee.location}</p>
            </div>
          )}

          {isHR && (
            <div className="hr-only">
              <p>Salary: {employee.salary}</p>
              <p>Performance: {employee.performanceRating}</p>
            </div>
          )}

          {canEdit && (
            <button className="btn btn-primary">Edit Employee</button>
          )}
        </>
      ) : (
        <p>You don't have permission to view this employee's details</p>
      )}
    </div>
  );
}

