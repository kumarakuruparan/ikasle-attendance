'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderKanban,
  CheckSquare,
  FileSpreadsheet,
  CalendarDays,
  Clock,
  UserCheck,
  Users,
  Settings,
  Building2,
  TrendingUp,
  BarChart4,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { ROLE_METADATA } from '@/lib/auth/roles';
import { NavigationItem, UserRole } from '@/types/auth';

interface SidebarProps {
  role?: UserRole;
  isOpen: boolean;
  onCloseMobile: () => void;
}

// Centralized Role-Aware Navigation Configuration
export const ROLE_NAVIGATION: Record<UserRole, NavigationItem[]> = {
  employee: [
    { label: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', href: '/employee/attendance', icon: CalendarCheck },
    { label: 'Projects', href: '/employee/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/employee/tasks', icon: CheckSquare },
    { label: 'Daily Reports', href: '/employee/work-reports', icon: FileSpreadsheet },
    { label: 'Leave', href: '/employee/leave', icon: CalendarDays },
    { label: 'Permission', href: '/employee/permission', icon: Clock },
    { label: 'My Profile', href: '/employee/profile', icon: UserCheck },
  ],
  hr: [
    { label: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'Employees', href: '/hr/employees', icon: Users },
    { label: 'Departments', href: '/hr/departments', icon: Building2 },
    { label: 'Attendance', href: '/hr/attendance', icon: CalendarCheck },
    { label: 'Projects', href: '/hr/projects', icon: FolderKanban },
    { label: 'Tasks', href: '/hr/tasks', icon: CheckSquare },
    { label: 'Daily Reports', href: '/hr/work-reports', icon: FileSpreadsheet },
    { label: 'Leave', href: '/hr/leave', icon: CalendarDays },
    { label: 'Permission', href: '/hr/permissions', icon: Clock },
    { label: 'Reports', href: '/hr/reports', icon: BarChart4 },
    { label: 'Settings', href: '/hr/settings', icon: Settings },
    { label: 'My Profile', href: '/employee/profile', icon: UserCheck },
  ],
  ceo: [
    { label: 'Dashboard', href: '/ceo/dashboard', icon: LayoutDashboard },
    { label: 'Employees / Organization', href: '/hr/employees', icon: Users },
    { label: 'Departments', href: '/hr/departments', icon: Building2 },
    { label: 'Attendance', href: '/ceo/attendance', icon: CalendarCheck },
    { label: 'Projects', href: '/ceo/projects', icon: FolderKanban },
    { label: 'Productivity', href: '/ceo/productivity', icon: TrendingUp },
    { label: 'Reports', href: '/ceo/reports', icon: BarChart4 },
    { label: 'My Profile', href: '/employee/profile', icon: UserCheck },
  ],
};

export default function Sidebar({ isOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAuthRole();

  // Navigation is strictly determined by the authenticated user's role
  const navItems = ROLE_NAVIGATION[role] || ROLE_NAVIGATION.employee;
  const roleMeta = ROLE_METADATA[role] || ROLE_METADATA.employee;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-15 items-center gap-2.5 border-b border-slate-100 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                IKASLE
              </span>
              <span className="rounded bg-blue-50 px-1 py-0.2 text-[9px] font-bold text-blue-700 border border-blue-200/60">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal">Workplace Suite</p>
          </div>
        </div>

        {/* Display-Only Role Indicator Tag */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-[#F5FAFF]/50">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Portal</span>
            <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-slate-200">
              {roleMeta.badge}
            </span>
          </div>
        </div>

        {/* Authorized Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#EAF6FF] text-[#2563EB] font-semibold'
                    : 'text-slate-600 hover:bg-[#F5FAFF] hover:text-slate-900'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-[#2563EB]' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer Link to Public Portal */}
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-600 hover:bg-[#F5FAFF] hover:text-slate-900 transition-colors"
          >
            <span>Public Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
