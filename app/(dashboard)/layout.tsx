'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { isRouteAllowed } from '@/lib/auth/access';
import UnauthorizedState from '@/components/auth/UnauthorizedState';
import { UserRole } from '@/types/auth';

export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, isLoaded } = useAuthRole();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5FAFF]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verifying Permissions...</p>
        </div>
      </div>
    );
  }

  // Determine required role based on URL segment
  let requiredRole: UserRole | undefined;
  if (pathname.startsWith('/hr')) {
    requiredRole = 'hr';
  } else if (pathname.startsWith('/ceo')) {
    requiredRole = 'ceo';
  } else if (pathname.startsWith('/employee')) {
    requiredRole = 'employee';
  }

  const allowed = isRouteAllowed(role, pathname);

  return (
    <DashboardLayout role={role}>
      {!allowed ? (
        <UnauthorizedState
          title="Restricted Portal Route (403)"
          message="You do not have the required role privileges to access this area of the enterprise management suite."
          requiredRole={requiredRole}
        />
      ) : (
        children
      )}
    </DashboardLayout>
  );
}
