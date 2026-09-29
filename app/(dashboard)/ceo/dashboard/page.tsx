"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  TrendingUp,
  FolderKanban,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import AttendanceChart from "@/components/reports/AttendanceChart";
import ProductivityChart from "@/components/reports/ProductivityChart";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function CEODashboard() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        title="CEO Strategic Cockpit"
        subtitle="Executive business intelligence: real-time headcount, departmental composition, and operational efficiency."
        badge="Executive Overview"
      />

      {/* Strategic KPI Grid: Real employee data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Total Workforce</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {isLoadingStats ? "..." : (stats?.totalEmployees ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total registered corporate headcount</p>
        </Card>

        {/* Active Employees */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Active Team Members</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {isLoadingStats ? "..." : (stats?.activeEmployees ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Authorized & actively participating</p>
        </Card>

        {/* Department Count */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Operational Departments</span>
            <Building2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600">
            {isLoadingStats ? "..." : (stats?.departmentCount ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active functional divisions</p>
        </Card>

        {/* Inactive Headcount */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Inactive / On Leave</span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-500">
            {isLoadingStats ? "..." : (stats?.inactiveEmployees ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Deactivated accounts</p>
        </Card>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <ProductivityChart />
      </div>

      {/* Real Department Headcount Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Department Overview & Capacity</CardTitle>
              <CardDescription>Live workforce distribution across company divisions</CardDescription>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Database
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {!stats || stats.departmentOverview.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No department data available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.departmentOverview.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="truncate">{dept.name}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {dept.employeeCount} {dept.employeeCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 mt-2.5">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: stats.totalEmployees > 0 ? `${(dept.employeeCount / stats.totalEmployees) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {stats.totalEmployees > 0
                      ? `${Math.round((dept.employeeCount / stats.totalEmployees) * 100)}% of total company headcount`
                      : "0%"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
