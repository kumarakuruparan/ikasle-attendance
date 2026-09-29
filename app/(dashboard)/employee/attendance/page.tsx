"use client";

import React, { useState } from "react";
import { CheckCircle2, RotateCw, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import AttendanceCard from "@/components/attendance/AttendanceCard";
import BreakCard from "@/components/attendance/BreakCard";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import { WorkingHoursCard } from "@/components/attendance/WorkingHoursCard";
import {
  useTodayAttendance,
  useCheckIn,
  useCheckOut,
  useStartBreak,
  useEndBreak,
} from "@/hooks/useAttendance";
import { BreakType } from "@/services/attendance.service";

export default function EmployeeAttendancePage() {
  const { data, isLoading, isError, error, refetch } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const startBreakMutation = useStartBreak();
  const endBreakMutation = useEndBreak();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCheckIn = async (coords: { latitude: number; longitude: number; accuracy: number }) => {
    const record = await checkInMutation.mutateAsync(coords);
    showNotification(
      `Checked in successfully at ${new Date(record.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Office geofence verified.`
    );
    return record;
  };

  const handleCheckOut = async (coords: { latitude: number; longitude: number; accuracy: number }) => {
    const record = await checkOutMutation.mutateAsync(coords);
    const hrs = (record.totalWorkingMinutes / 60).toFixed(1);
    showNotification(
      `Checked out successfully. Total working time: ${hrs} hours. Have a great evening!`
    );
    return record;
  };

  const handleStartBreak = async (type: BreakType) => {
    const res = await startBreakMutation.mutateAsync(type);
    showNotification(`${type} break session started.`);
    return res;
  };

  const handleEndBreak = async () => {
    const res = await endBreakMutation.mutateAsync();
    showNotification(`Break ended. Duration: ${res.break.durationMinutes} minutes.`);
    return res;
  };

  const attendance = data?.attendance || null;
  const activeBreak = data?.activeBreak || null;
  const officeSettings = data?.officeSettings || {
    officeStartTime: "09:30",
    officeEndTime: "19:00",
    officeRadiusMeters: 300,
    maxAccuracyThresholdMeters: 150,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Time Tracking"
        subtitle="Manage daily GPS clock-ins, break compliance, office geofence verification, and work logs."
        badge="Self-Service"
      />

      {/* Action Notification */}
      {notification && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-7 h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="lg:col-span-5 h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{error instanceof Error ? error.message : "Failed to load today's attendance state."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Interactive Attendance & Break Panels */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <AttendanceCard
              attendance={attendance}
              activeBreak={activeBreak}
              officeSettings={officeSettings}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isCheckingIn={checkInMutation.isPending}
              isCheckingOut={checkOutMutation.isPending}
            />

            <WorkingHoursCard attendance={attendance} />
          </div>

          <div className="lg:col-span-5">
            <BreakCard
              attendance={attendance}
              activeBreak={activeBreak}
              onStartBreak={handleStartBreak}
              onEndBreak={handleEndBreak}
              isStarting={startBreakMutation.isPending}
              isEnding={endBreakMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Historical Logs */}
      <AttendanceHistory />
    </div>
  );
}
