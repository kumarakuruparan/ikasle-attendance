'use client';

import React from 'react';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { UserRole } from '@/types/auth';
import UnauthorizedState from './UnauthorizedState';

interface RoleGuardProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  const { hasRole, isLoaded } = useAuthRole();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const authorized = hasRole(allowedRoles);

  if (!authorized) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <UnauthorizedState requiredRole={allowedRoles} />
    );
  }

  return <>{children}</>;
}
