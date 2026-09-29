import { Permission, UserRole } from '@/types/auth';
import { ROLE_PERMISSIONS } from './permissions';
import { ROLE_METADATA } from './roles';

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

/**
 * Check if a role possesses any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  if (permissions.length === 0) return true;
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Check if a role possesses all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  if (permissions.length === 0) return true;
  return permissions.every((perm) => hasPermission(role, perm));
}

/**
 * Check if user has an allowed role
 */
export function hasRole(currentRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(currentRole);
  }
  return currentRole === allowedRoles;
}

/**
 * Get default starting path for a role
 */
export function getRoleDefaultPath(role: UserRole): string {
  return ROLE_METADATA[role]?.defaultPath || '/employee/dashboard';
}

/**
 * Route protection validator
 * Determines if a role is permitted to access a given URL pathname
 */
export function isRouteAllowed(role: UserRole, pathname: string): boolean {
  // Public or general routes
  if (pathname === '/' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return true;
  }

  // Shared dashboard root redirects to the user's role dashboard
  if (pathname === '/dashboard') {
    return true;
  }

  // Profile is universally accessible to all authenticated roles
  if (pathname === '/employee/profile') {
    return true;
  }

  // Employee portal routes (personal self-service)
  if (pathname.startsWith('/employee')) {
    // Both employee and HR have personal employee self-service view capabilities
    return role === 'employee' || role === 'hr';
  }

  // HR portal routes
  if (pathname.startsWith('/hr')) {
    // CEO has read-only organizational view of employees directory and departments
    if (pathname.startsWith('/hr/employees') || pathname.startsWith('/hr/departments')) {
      return role === 'hr' || role === 'ceo';
    }
    // All other HR management routes (attendance, leave approvals, reports, settings, etc.) are HR-exclusive
    return role === 'hr';
  }

  // CEO cockpit routes (executive telemetry, strategic reports, productivity)
  if (pathname.startsWith('/ceo')) {
    return role === 'ceo';
  }

  return true;
}
