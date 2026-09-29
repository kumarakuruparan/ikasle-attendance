'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, Shield, User, Settings } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useAuthRole } from '@/lib/auth/useAuthRole';
import { ROLE_METADATA } from '@/lib/auth/roles';
import { UserRole } from '@/types/auth';

interface TopNavbarProps {
  currentRole?: UserRole;
  onToggleMobileMenu: () => void;
}

export default function TopNavbar({ onToggleMobileMenu }: TopNavbarProps) {
  const { user } = useUser();
  const router = useRouter();
  const { role, userProfile, switchRole } = useAuthRole();

  const currentMeta = ROLE_METADATA[role] || ROLE_METADATA.employee;
  const displayName = userProfile?.fullName || user?.fullName || 'User';

  const roleOptions: { role: UserRole; label: string; defaultPath: string }[] = [
    { role: 'employee', label: 'Employee', defaultPath: '/employee/dashboard' },
    { role: 'hr', label: 'HR Manager', defaultPath: '/hr/dashboard' },
    { role: 'ceo', label: 'CEO Cockpit', defaultPath: '/ceo/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-15 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Interactive Navbar Role Switcher */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 text-xs">
          {roleOptions.map((opt) => {
            const isActive = role === opt.role;
            return (
              <button
                key={opt.role}
                type="button"
                onClick={() => {
                  switchRole(opt.role);
                  router.push(opt.defaultPath);
                }}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          type="button"
          onClick={() => alert(`Role: ${currentMeta.badge} - Notifications operational`)}
          className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-[#F5FAFF] hover:text-slate-700 cursor-pointer transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Profile Details & Clerk User Button */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">{currentMeta.badge}</span>
          </div>

          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'h-8 w-8 ring-1 ring-slate-200',
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="My Profile"
                href="/employee/profile"
                labelIcon={<User className="h-4 w-4" />}
              />
              {role === 'hr' && (
                <UserButton.Link
                  label="Settings"
                  href="/hr/settings"
                  labelIcon={<Settings className="h-4 w-4" />}
                />
              )}
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
