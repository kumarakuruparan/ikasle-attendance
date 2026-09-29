/**
 * Centralized Role-Based Access Control (RBAC) Types
 */

import React from 'react';

export type UserRole = 'employee' | 'hr' | 'ceo';

export type Role = UserRole;

export type Permission =
  // Attendance
  | 'attendance.view.own'
  | 'attendance.view.all'
  | 'attendance.manage'
  | 'attendance.checkin'
  // Employees
  | 'employees.view'
  | 'employees.manage'
  // Projects
  | 'projects.view'
  | 'projects.manage'
  | 'projects.assign'
  // Tasks
  | 'tasks.view'
  | 'tasks.manage'
  // Work Reports
  | 'workReports.view.own'
  | 'workReports.view.all'
  | 'workReports.manage'
  // Leave & Permission
  | 'leave.apply'
  | 'leave.manage'
  | 'permission.apply'
  | 'permission.manage'
  // Reports
  | 'reports.view.own'
  | 'reports.view.all'
  | 'reports.executive'
  // Settings & System
  | 'settings.manage'
  | 'auditLogs.view'
  | 'productivity.view';

export interface RoleMetadata {
  id: UserRole;
  label: string;
  badge: string;
  defaultPath: string;
  description: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  badge?: string;
}
