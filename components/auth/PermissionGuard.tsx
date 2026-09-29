'use client';

import React from 'react';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { Permission } from '@/types/auth';
import UnauthorizedState from './UnauthorizedState';

interface PermissionGuardProps {
  permissions: Permission | Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  permissions,
  requireAll = false,
  children,
  fallback,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoaded } = useAuthRole();

  if (!isLoaded) {
    return null;
  }

  const permsArray = Array.isArray(permissions) ? permissions : [permissions];

  const authorized = requireAll
    ? hasAllPermissions(permsArray)
    : hasAnyPermission(permsArray);

  if (!authorized) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <UnauthorizedState message="You do not possess the required permissions to perform this operation." />
    );
  }

  return <>{children}</>;
}
