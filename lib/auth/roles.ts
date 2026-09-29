import { UserRole, RoleMetadata } from '@/types/auth';

export const ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  CEO: 'ceo',
} as const satisfies Record<string, UserRole>;

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  employee: {
    id: 'employee',
    label: 'Employee Portal',
    badge: 'Employee',
    defaultPath: '/employee/dashboard',
    description: 'Manage personal attendance, daily work reports, tasks, and requests',
  },
  hr: {
    id: 'hr',
    label: 'HR Operations',
    badge: 'HR Manager',
    defaultPath: '/hr/dashboard',
    description: 'Workforce management, approvals, attendance tracking, and company settings',
  },
  ceo: {
    id: 'ceo',
    label: 'CEO Cockpit',
    badge: 'Executive',
    defaultPath: '/ceo/dashboard',
    description: 'High-level business intelligence, attendance summaries, and company analytics',
  },
};

export const ALL_ROLES: UserRole[] = ['employee', 'hr', 'ceo'];
