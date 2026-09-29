"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAttendanceStats, useAllAttendance } from "@/hooks/useAttendance";

export default function CEOAttendancePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const { data: stats, isLoading: isLoadingStats } = useAttendanceStats(selectedDate || undefined);
  const { data: attendanceData, isLoading: isLoadingList } = useAllAttendance({
    date: selectedDate || undefined,
    limit: 10,
  });

  const records = attendanceData?.records || [];

  const totalEmployees = stats?.totalEmployees ?? 0;
  const presentCount = stats?.presentCount ?? 0;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Attendance Overview"
        subtitle="Corporate workforce presence, geofence compliance rate, and executive working hour aggregates."
        badge="Executive View"
      />

      {/* Date selector */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Viewing Attendance for: {selectedDate ? new Date(selectedDate).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" }) : "Today (Live)"}
        </span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* High-Level Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Corporate Attendance Rate</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-2 font-mono">
            {isLoadingStats ? "..." : `${attendanceRate}%`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {presentCount} Present / {totalEmployees} Total
          </p>
        </Card>

        {/* Present Today */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active on Premises</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">
            {isLoadingStats ? "..." : stats?.activeCount ?? 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats?.completedCount ?? 0} shifts completed
          </p>
        </Card>

        {/* Absent */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Unrecorded / Absent</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2 font-mono">
            {isLoadingStats ? "..." : stats?.absentCount ?? 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Did not clock in via geofence
          </p>
        </Card>

        {/* Average Working Hours */}
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Working Time</span>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-600 mt-2 font-mono">
            {isLoadingStats ? "..." : `${stats?.avgWorkingHours ?? "0.0"} hrs`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Per completed shift</p>
        </Card>
      </div>

      {/* Live Presence Table for Executive */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Presence Snapshot</CardTitle>
              <CardDescription>Verified employee attendance records from corporate geofence</CardDescription>
            </div>
            <Link
              href="/hr/attendance"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Full HR Log</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingList && (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading executive presence feed...
            </div>
          )}

          {!isLoadingList && records.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No presence records logged for this date.
            </div>
          )}

          {!isLoadingList && records.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                    <th className="pb-3 font-semibold">Employee</th>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Clock In</th>
                    <th className="pb-3 font-semibold">Clock Out</th>
                    <th className="pb-3 font-semibold">Effective Time</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {r.user?.fullName || "Employee"}
                      </td>
                      <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {r.user?.employeeId || "---"}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {r.user?.departmentName || "Unassigned"}
                      </td>
                      <td className="py-3 font-mono text-slate-700 dark:text-slate-300">
                        {new Date(r.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 font-mono text-slate-700 dark:text-slate-300">
                        {r.checkOutAt
                          ? new Date(r.checkOutAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Active"}
                      </td>
                      <td className="py-3 font-mono font-bold text-blue-600">
                        {(r.totalWorkingMinutes / 60).toFixed(1)} hrs
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={
                            r.status === "COMPLETED"
                              ? "success"
                              : r.status === "PRESENT"
                              ? "info"
                              : "destructive"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
