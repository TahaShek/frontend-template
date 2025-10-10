/**
 * ABAC Demo Page
 * Demonstrates Attribute-Based Access Control with real UI examples
 */

import { useState } from 'react';
import { useAuthStore } from '@/features/auth';
import {
  Action,
  ResourceType,
  Department,
  SensitivityLevel,
  useAbac,
  Can,
  ProtectedContent,
  OwnerOnly,
} from '@/features/authorization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  FileText,
  Settings,
  DollarSign,
  Shield,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  UserCheck,
  Building,
} from 'lucide-react';

export const AbacDemoPage = () => {
  const currentUser = useAuthStore((state) => state.user);
  const { subject, can, isOwner } = useAbac();
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-gray-600">
        <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg">Please log in to view this page.</p>
      </div>
    );
  }

  // Sample resources
  const engineeringDoc = {
    id: 'doc-eng-001',
    type: ResourceType.DOCUMENT,
    owner: 'user-1', // John Doe
    department: Department.ENGINEERING,
    sensitivity: SensitivityLevel.INTERNAL,
    createdBy: 'user-1',
  };

  const hrDoc = {
    id: 'doc-hr-001',
    type: ResourceType.DOCUMENT,
    owner: 'user-2', // Jane Smith
    department: Department.HR,
    sensitivity: SensitivityLevel.CONFIDENTIAL,
    createdBy: 'user-2',
  };

  const confidentialReport = {
    id: 'report-fin-001',
    type: ResourceType.REPORT,
    owner: 'user-3', // Admin
    department: Department.FINANCE,
    sensitivity: SensitivityLevel.CONFIDENTIAL,
    createdBy: 'user-3',
  };

  const publicDoc = {
    id: 'doc-pub-001',
    type: ResourceType.DOCUMENT,
    owner: 'user-1',
    department: Department.ENGINEERING,
    sensitivity: SensitivityLevel.PUBLIC,
  };

  const userProfile = {
    id: currentUser.id,
    type: ResourceType.USER,
    owner: currentUser.id,
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((msg, idx) => (
            <div
              key={idx}
              className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right"
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">ABAC Permissions Demo</h1>
        <p className="text-lg text-gray-600 mt-2">
          Currently logged in as:{' '}
          <span className="font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </span>{' '}
          <Badge variant="outline">{currentUser.role}</Badge>
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {subject?.department && (
            <Badge variant="secondary">
              <Building className="h-3 w-3 mr-1" />
              {subject.department}
            </Badge>
          )}
          {subject?.clearanceLevel && (
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Clearance Level {subject.clearanceLevel}
            </Badge>
          )}
        </div>
      </div>

      {/* Section 1: Department-Based Document Access */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📁 Department-Based Document Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Engineering Document */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Engineering Document
              </CardTitle>
              <CardDescription>
                Dept: Engineering | Sensitivity: Internal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {can(Action.READ, engineeringDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.READ, engineeringDoc) ? 'Can Read' : 'Cannot Read'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {can(Action.UPDATE, engineeringDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.UPDATE, engineeringDoc) ? 'Can Update' : 'Cannot Update'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {can(Action.DELETE, engineeringDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.DELETE, engineeringDoc) ? 'Can Delete' : 'Cannot Delete'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Can action={Action.READ} resource={engineeringDoc}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotification('Reading Engineering Document')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Can>
              <Can action={Action.UPDATE} resource={engineeringDoc}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotification('Editing Engineering Document')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Can>
              <Can action={Action.DELETE} resource={engineeringDoc}>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => addNotification('Deleting Engineering Document')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </Can>
            </CardFooter>
          </Card>

          {/* HR Document */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                HR Document
              </CardTitle>
              <CardDescription>Dept: HR | Sensitivity: Confidential</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {can(Action.READ, hrDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.READ, hrDoc) ? 'Can Read' : 'Cannot Read'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {can(Action.UPDATE, hrDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.UPDATE, hrDoc) ? 'Can Update' : 'Cannot Update'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {can(Action.DELETE, hrDoc) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">
                  {can(Action.DELETE, hrDoc) ? 'Can Delete' : 'Cannot Delete'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Can
                action={Action.READ}
                resource={hrDoc}
                fallback={
                  <Button size="sm" variant="outline" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Access Denied
                  </Button>
                }
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotification('Reading HR Document')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Can>
              <Can action={Action.UPDATE} resource={hrDoc}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addNotification('Editing HR Document')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Can>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Section 2: Clearance Level & Sensitivity */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🔐 Clearance Level & Sensitivity</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Confidential Financial Report
            </CardTitle>
            <CardDescription>
              Dept: Finance | Sensitivity: Confidential | Requires Clearance Level 4+
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectedContent
              checks={[
                {
                  key: 'readReport',
                  action: Action.READ,
                  resourceType: ResourceType.REPORT,
                  resourceAttributes: { sensitivity: SensitivityLevel.CONFIDENTIAL },
                },
              ]}
              fallback={
                <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Access Denied</p>
                    <p className="text-sm text-red-700">
                      You need Clearance Level 4+ to view confidential financial reports.
                    </p>
                  </div>
                </div>
              }
            >
              <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                <Unlock className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Access Granted</p>
                  <p className="text-sm text-green-700">
                    You have sufficient clearance to view this confidential report.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-mono">
                  📊 Q4 Financial Report - Revenue: $2.5M | Profit: $450K
                </p>
              </div>
            </ProtectedContent>
          </CardContent>
          <CardFooter>
            <Can action={Action.EXPORT} resource={confidentialReport}>
              <Button size="sm" onClick={() => addNotification('Exporting Financial Report')}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </Can>
          </CardFooter>
        </Card>
      </section>

      {/* Section 3: Ownership-Based Access */}
      <section>
        <h2 className="text-2xl font-bold mb-4">👤 Ownership-Based Access</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Your Profile Settings
            </CardTitle>
            <CardDescription>Only you can edit your own profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Email: {currentUser.email}</span>
                <OwnerOnly
                  resource={userProfile}
                  fallback={
                    <Badge variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Read Only
                    </Badge>
                  }
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addNotification('Editing email')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </OwnerOnly>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">
                  Name: {currentUser.firstName} {currentUser.lastName}
                </span>
                <OwnerOnly
                  resource={userProfile}
                  fallback={
                    <Badge variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Read Only
                    </Badge>
                  }
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addNotification('Editing name')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </OwnerOnly>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <OwnerOnly resource={userProfile}>
              <Button onClick={() => addNotification('Saving profile changes')}>
                Save Changes
              </Button>
            </OwnerOnly>
          </CardFooter>
        </Card>
      </section>

      {/* Section 4: Public Resources */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🌐 Public Resources</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Public Documentation
            </CardTitle>
            <CardDescription>
              Available to all authenticated users (Public Sensitivity)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Can
              action={Action.READ}
              resource={publicDoc}
              fallback={
                <p className="text-red-600">You don't have access to public documents.</p>
              }
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✅ All authenticated users can view public documents regardless of
                  department or role.
                </p>
                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-sm font-mono">
                    📄 Company Handbook - Version 2.1 - Updated: Oct 2025
                  </p>
                </div>
              </div>
            </Can>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addNotification('Downloading public document')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Section 5: Admin-Only Actions */}
      <section>
        <h2 className="text-2xl font-bold mb-4">⚙️ Admin-Only Actions</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Only administrators can access system settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectedContent
              checks={[
                {
                  key: 'manageSettings',
                  action: Action.UPDATE,
                  resourceType: ResourceType.SETTING,
                },
              ]}
              fallback={
                <div className="flex items-center gap-3 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">Admin Access Required</p>
                    <p className="text-sm text-yellow-700">
                      Only administrators can modify system settings.
                    </p>
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <span className="text-sm">API Rate Limit</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addNotification('Updating API rate limit')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <span className="text-sm">Email Notifications</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addNotification('Updating email settings')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </ProtectedContent>
          </CardContent>
          <CardFooter>
            <Can action={Action.UPDATE} resource={{ type: ResourceType.SETTING }}>
              <Button onClick={() => addNotification('Saving system settings')}>
                Save System Settings
              </Button>
            </Can>
          </CardFooter>
        </Card>
      </section>

      {/* Section 6: Multiple Permission Checks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">🔄 Multiple Permission Checks</h2>
        <Card>
          <CardHeader>
            <CardTitle>Bulk Document Operations</CardTitle>
            <CardDescription>
              Requires both READ and EXPORT permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectedContent
              checks={[
                {
                  key: 'readDocs',
                  action: Action.READ,
                  resourceType: ResourceType.DOCUMENT,
                },
                {
                  key: 'exportDocs',
                  action: Action.EXPORT,
                  resourceType: ResourceType.DOCUMENT,
                },
              ]}
              requireAll={true}
              fallback={
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    ❌ You need both READ and EXPORT permissions to perform bulk operations.
                  </p>
                </div>
              }
            >
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900 mb-3">
                  ✅ You have permission to perform bulk operations.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNotification('Exporting multiple documents')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNotification('Importing documents')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import
                  </Button>
                </div>
              </div>
            </ProtectedContent>
          </CardContent>
        </Card>
      </section>

      {/* Permission Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📊 Your Permissions Summary</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {subject?.clearanceLevel || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Clearance Level</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {subject?.department || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Department</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{currentUser.role}</p>
                <p className="text-sm text-gray-600">Role</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {isOwner(userProfile) ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-600">Profile Owner</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

