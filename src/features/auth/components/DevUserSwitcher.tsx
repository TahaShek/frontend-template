/**
 * Dev User Switcher Component
 * Quick user switching for testing (DEV ONLY)
 */

import { useState } from 'react';
import { useAuthStore } from '../store';
import { mockUsers, mockCredentials, generateMockTokens } from '../mocks';
import { Button } from '@/components/ui/button';
import { Users, X, ChevronDown } from 'lucide-react';

export const DevUserSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setUser, setTokens } = useAuthStore();
  const currentUser = useAuthStore((state) => state.user);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const handleUserSwitch = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      const tokens = generateMockTokens(user.id);
      setUser(user);
      setTokens(tokens);
      setIsOpen(false);
      console.log('🔄 Switched to user:', user.email);
    }
  };

  const getDepartment = (metadata?: Record<string, unknown>) => {
    return metadata?.department && typeof metadata.department === 'string' 
      ? metadata.department 
      : null;
  };

  const getClearanceLevel = (metadata?: Record<string, unknown>) => {
    return metadata?.clearanceLevel && typeof metadata.clearanceLevel === 'number'
      ? metadata.clearanceLevel
      : null;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 p-0"
          title="Dev: Switch User"
        >
          <Users className="h-5 w-5" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Switch Test User</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-purple-700 rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Current User */}
          {currentUser && (
            <div className="bg-purple-50 p-3 border-b border-purple-100">
              <p className="text-xs text-purple-600 font-medium mb-1">Current User</p>
              <p className="text-sm font-semibold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-600">{currentUser.email}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded">
                  {currentUser.role}
                </span>
                {getDepartment(currentUser.metadata) && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {getDepartment(currentUser.metadata)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="overflow-y-auto max-h-80">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSwitch(user.id)}
                className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  currentUser?.id === user.id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {user.role}
                      </span>
                      {getDepartment(user.metadata) && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                          {getDepartment(user.metadata)}
                        </span>
                      )}
                      {getClearanceLevel(user.metadata) && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded">
                          L{getClearanceLevel(user.metadata)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer - Credentials Reference */}
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <ChevronDown className="h-3 w-3" />
                Login Credentials
              </summary>
              <div className="mt-2 space-y-1 text-gray-700">
                {Object.entries(mockCredentials).slice(0, 5).map(([key, cred]) => (
                  <div key={key} className="font-mono text-[10px] bg-white p-1 rounded">
                    <span className="text-purple-600">{cred.email}</span>
                    <br />
                    <span className="text-gray-500">{cred.password}</span>
                  </div>
                ))}
                <p className="text-[10px] text-gray-500 pt-1">
                  💡 Use these credentials to test login
                </p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

