'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { UserRole } from '@/types/auth';

interface UnauthorizedStateProps {
  title?: string;
  message?: string;
  requiredRole?: UserRole | UserRole[];
  returnPath?: string;
}

export default function UnauthorizedState({
  title = 'Access Restricted (403)',
  message,
  requiredRole,
  returnPath,
}: UnauthorizedStateProps) {
  const { role, defaultPath, switchRole } = useAuthRole();
  const targetPath = returnPath || defaultPath;
  const targetRole = Array.isArray(requiredRole) ? requiredRole[0] : requiredRole;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 mb-4">
        <ShieldAlert className="h-7 w-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 mb-3">
        <Lock className="h-3 w-3" />
        <span>Authorization Required</span>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
        {title}
      </h1>

      <p className="max-w-md text-xs sm:text-sm text-slate-500 mb-5">
        {message || (
          <>
            Your current active role (
            <span className="font-semibold text-slate-900 capitalize">
              {role}
            </span>
            ) does not have privileges to view or perform actions in this portal.
          </>
        )}
      </p>

      {requiredRole && (
        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 max-w-sm">
          <span>Required Role: </span>
          <span className="font-semibold text-slate-900 capitalize">
            {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {targetRole && (
          <button
            type="button"
            onClick={() => switchRole(targetRole)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <span>Switch Role to {targetRole.toUpperCase()}</span>
          </button>
        )}
        <Link
          href={targetPath}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
