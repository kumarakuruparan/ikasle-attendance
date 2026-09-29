'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRole } from '@/lib/auth/useAuthRole';

export default function RoleDashboardRoute() {
  const router = useRouter();
  const { defaultPath, isLoaded } = useAuthRole();

  useEffect(() => {
    if (isLoaded) {
      router.replace(defaultPath);
    }
  }, [isLoaded, defaultPath, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Connecting to your workspace...
        </p>
      </div>
    </div>
  );
}
