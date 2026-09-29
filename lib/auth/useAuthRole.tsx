'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { UserRole, Permission } from '@/types/auth';
import { Employee, employeeService } from '@/services/employee.service';
import { ROLE_PERMISSIONS } from './permissions';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  hasRole as checkRole,
  isRouteAllowed,
  getRoleDefaultPath,
} from './access';

const ACTIVE_ROLE_STORAGE_KEY = 'ikasle_active_role';

interface AuthRoleContextType {
  role: UserRole;
  userProfile: Employee | null;
  permissions: readonly Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (allowedRoles: UserRole | UserRole[]) => boolean;
  canAccessRoute: (pathname: string) => boolean;
  defaultPath: string;
  isLoaded: boolean;
  isSignedIn: boolean;
  switchRole: (newRole: UserRole) => void;
}

const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export function AuthRoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [userProfile, setUserProfile] = useState<Employee | null>(null);
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
      if (saved === 'employee' || saved === 'hr' || saved === 'ceo') {
        return saved as UserRole;
      }
    }
    return 'employee';
  });
  const [isRoleResolved, setIsRoleResolved] = useState(false);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, newRole);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function resolveRoleFromBackend() {
      if (!isUserLoaded) return;

      if (!isSignedIn || !user) {
        if (!isCancelled) {
          setUserProfile(null);
          setRole('employee');
          setIsRoleResolved(true);
        }
        return;
      }

      try {
        // Authenticate with Clerk token against backend /api/me
        const token = await getToken();
        const profile = await employeeService.getSelfProfile(token);

        if (!isCancelled && profile) {
          setUserProfile(profile);
          const saved = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY) : null;
          if (!saved) {
            const rawRole = (profile.role || '').toLowerCase();
            if (rawRole === 'hr' || rawRole === 'ceo' || rawRole === 'employee') {
              setRole(rawRole as UserRole);
            } else {
              setRole('employee');
            }
          }
          setIsRoleResolved(true);
          return;
        }
      } catch {
        // If backend profile endpoint fails or user record is not yet synced,
        // use Clerk session token claims as secondary backend-signed fallback
        if (!isCancelled) {
          const saved = typeof window !== 'undefined' ? localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY) : null;
          if (!saved) {
            const clerkRole = (user.publicMetadata?.role || user.unsafeMetadata?.role) as string | undefined;
            const normalized = clerkRole?.toLowerCase();
            if (normalized === 'hr' || normalized === 'ceo' || normalized === 'employee') {
              setRole(normalized as UserRole);
            } else {
              setRole('employee');
            }
          }
          setIsRoleResolved(true);
        }
      }
    }

    resolveRoleFromBackend();

    return () => {
      isCancelled = true;
    };
  }, [user, isUserLoaded, isSignedIn, getToken]);

  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[role] || [];
  }, [role]);

  const value: AuthRoleContextType = {
    role,
    userProfile,
    permissions,
    hasPermission: (permission: Permission) => checkPermission(role, permission),
    hasAnyPermission: (perms: Permission[]) => checkAnyPermission(role, perms),
    hasAllPermissions: (perms: Permission[]) => checkAllPermissions(role, perms),
    hasRole: (allowedRoles: UserRole | UserRole[]) => checkRole(role, allowedRoles),
    canAccessRoute: (pathname: string) => isRouteAllowed(role, pathname),
    defaultPath: getRoleDefaultPath(role),
    isLoaded: isUserLoaded && isRoleResolved,
    isSignedIn: Boolean(isSignedIn),
    switchRole,
  };

  return <AuthRoleContext.Provider value={value}>{children}</AuthRoleContext.Provider>;
}

export function useAuthRole(): AuthRoleContextType {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
}
