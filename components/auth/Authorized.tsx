'use client';

import React from 'react';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { UserRole, Permission } from '@/types/auth';

interface AuthorizedProps {
  roles?: UserRole | UserRole[];
  permissions?: Permission | Permission[];
  requireAllPermissions?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Inline authorization wrapper for conditionally rendering buttons, tabs, sections
 */
export default function Authorized({
  roles,
  permissions,
  requireAllPermissions = false,
  children,
  fallback = null,
}: AuthorizedProps) {
  const { hasRole, hasAnyPermission, hasAllPermissions } = useAuthRole();

  let roleAllowed = true;
  if (roles) {
    roleAllowed = hasRole(roles);
  }

  let permAllowed = true;
  if (permissions) {
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];
    permAllowed = requireAllPermissions
      ? hasAllPermissions(permsArray)
      : hasAnyPermission(permsArray);
  }

  if (roleAllowed && permAllowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
