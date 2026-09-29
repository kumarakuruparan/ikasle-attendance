"use client";

import React from "react";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AttendanceRecord } from "@/services/attendance.service";

interface WorkingHoursCardProps {
  attendance: AttendanceRecord | null;
}

export function WorkingHoursCard({ attendance }: WorkingHoursCardProps) {
  const checkInTime = attendance?.checkInAt
    ? new Date(attendance.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const checkOutTime = attendance?.checkOutAt
    ? new Date(attendance.checkOutAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const totalBreakMinutes = attendance?.totalBreakMinutes || 0;
  const workingMinutes = attendance?.totalWorkingMinutes || 0;
  const workingHours = (workingMinutes / 60).toFixed(1);

  // Standard workday = 8h (480 min)
  const standardWorkdayMinutes = 480;
  const progressPercent = Math.min(100, Math.round((workingMinutes / standardWorkdayMinutes) * 100));

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-500" />
          Today&apos;s Productive Hours Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Check In</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-1 block">
              {checkInTime}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Check Out</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-1 block">
              {checkOutTime}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Breaks</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono mt-1 block">
              {totalBreakMinutes} min
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Net Productive</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">
              {workingHours} hrs
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500">Progress against 8-hour shift target</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
