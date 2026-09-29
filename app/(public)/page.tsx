"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import { useAuthRole } from "@/lib/auth/useAuthRole";
import { UserRole } from "@/types/auth";

interface RoleOption {
  id: UserRole;
  label: string;
  targetRoute: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  { id: "employee", label: "Employee", targetRoute: "/employee/dashboard" },
  { id: "hr", label: "HR", targetRoute: "/hr/dashboard" },
  { id: "ceo", label: "CEO", targetRoute: "/ceo/dashboard" },
];

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, switchRole } = useAuthRole();

  const handleRoleSelect = (roleOpt: RoleOption) => {
    switchRole(roleOpt.id);
    if (isSignedIn) {
      router.push(roleOpt.targetRoute);
    } else {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(roleOpt.targetRoute)}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F8FBFF] px-4 py-12 sm:px-6">
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        {/* IKASLE Logo & Name */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            IKASLE
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-sm font-medium text-slate-500 mb-8">
          Choose your role
        </p>

        {/* Role Options */}
        <div className="w-full flex flex-col gap-3">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleRoleSelect(opt)}
              className="w-full rounded-xl border border-blue-200 bg-white py-3.5 px-4 text-center text-sm font-semibold text-slate-900 transition-colors hover:border-blue-600 hover:bg-blue-50/60 hover:text-blue-600 cursor-pointer"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
