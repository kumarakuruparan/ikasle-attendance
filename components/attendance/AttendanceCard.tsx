"use client";

import React, { useState, useEffect } from "react";
import {
  LogIn,
  LogOut,
  Clock,
  AlertCircle,
  } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GPSStatus } from "./GPSStatus";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  AttendanceRecord,
  BreakRecord,
  OfficeSettings,
} from "@/services/attendance.service";

interface AttendanceCardProps {
  attendance: AttendanceRecord | null;
  activeBreak: BreakRecord | null;
  officeSettings: OfficeSettings;
  onCheckIn: (coords: { latitude: number; longitude: number; accuracy: number }) => Promise<unknown>;
  onCheckOut: (coords: { latitude: number; longitude: number; accuracy: number }) => Promise<unknown>;
  isCheckingIn?: boolean;
  isCheckingOut?: boolean;
}

export default function AttendanceCard({
  attendance,
  activeBreak,
  officeSettings,
  onCheckIn,
  onCheckOut,
  isCheckingIn = false,
  isCheckingOut = false,
}: AttendanceCardProps) {
  const { coords, status: geoStatus, requestPosition, isLoading: isGettingLocation, errorMessage: geoError } =
    useGeolocation();

  const [currentTime, setCurrentTime] = useState<string>("");
  const [now, setNow] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const isCheckedIn = Boolean(attendance);
  const isCheckedOut = Boolean(attendance?.checkOutAt);
  const isOnBreak = Boolean(activeBreak);

  // Real-time ticking wall clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Authoritative working time derived from server timestamps + ticking clock
  let workingSeconds = 0;
  if (attendance?.checkInAt) {
    if (attendance.checkOutAt) {
      workingSeconds = (attendance.totalWorkingMinutes || 0) * 60;
    } else {
      const startMs = new Date(attendance.checkInAt).getTime();
      const totalBreakSec = (attendance.totalBreakMinutes || 0) * 60;
      workingSeconds = now > 0 ? Math.max(0, Math.floor((now - startMs) / 1000) - totalBreakSec) : 0;
    }
  }

  const formatWorkingTime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleCheckInClick = async () => {
    try {
      setApiError(null);
      const position = await requestPosition();
      await onCheckIn(position);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to record check-in.");
    }
  };

  const handleCheckOutClick = async () => {
    try {
      setApiError(null);
      const position = await requestPosition();
      await onCheckOut(position);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to record check-out.");
    }
  };

  return (
    <Card className="relative border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Daily Attendance Verification
              </CardTitle>
              {isCheckedOut ? (
                <Badge variant="success">Completed</Badge>
              ) : isCheckedIn ? (
                <Badge variant="info">Active Shift</Badge>
              ) : (
                <Badge variant="default">Not Checked In</Badge>
              )}
            </div>
            <CardDescription className="text-xs mt-0.5">
              Official Shift Hours: {officeSettings?.officeStartTime || "09:30"} –{" "}
              {officeSettings?.officeEndTime || "19:00"} • Geofenced Office Area
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentTime || "..."}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Error message alert */}
        {(apiError || geoError) && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Attendance Notice: </strong>
              <span>{apiError || geoError}</span>
            </div>
          </div>
        )}

        {/* GPS Geofence Status Component */}
        <GPSStatus
          status={geoStatus}
          coords={coords}
          officeSettings={officeSettings}
          isLoading={isGettingLocation}
          onRefreshLocation={() => requestPosition().catch(() => {})}
        />

        {/* Main Attendance Display Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-gradient-to-tr from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900/60 dark:via-blue-950/20 dark:to-slate-900/60 p-5 border border-slate-200/80 dark:border-slate-800">
          {/* Check-In Record */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Clock-In Time
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {attendance?.checkInAt
                ? new Date(attendance.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--:--"}
            </div>
            <p className="text-[11px] text-slate-500">
              {attendance?.checkInAt ? "Verified on Premises" : "Awaiting check-in"}
            </p>
          </div>

          {/* Live Working Duration */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Effective Working Time
            </span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {isCheckedIn ? formatWorkingTime(workingSeconds) : "00:00:00"}
            </div>
            <p className="text-[11px] text-slate-500">
              {isOnBreak
                ? "Paused (Break active)"
                : isCheckedOut
                ? "Shift closed"
                : isCheckedIn
                ? "Live ticking timer"
                : "Starts upon check-in"}
            </p>
          </div>

          {/* Check-Out Record */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Clock-Out Time
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {attendance?.checkOutAt
                ? new Date(attendance.checkOutAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "--:--"}
            </div>
            <p className="text-[11px] text-slate-500">
              {attendance?.checkOutAt
                ? `Total: ${Math.round((attendance.totalWorkingMinutes || 0) / 60 * 10) / 10} productive hrs`
                : "Shift still active"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Check In Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto min-w-[180px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
            disabled={isCheckedIn || isCheckingIn || isGettingLocation}
            isLoading={isCheckingIn || (isGettingLocation && !isCheckedIn)}
            onClick={handleCheckInClick}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {isCheckedIn ? "Already Clocked In" : "Check In with GPS"}
          </Button>

          {/* Check Out Button */}
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="w-full sm:w-auto min-w-[180px] shadow-md shadow-red-500/20"
            disabled={!isCheckedIn || isCheckedOut || isOnBreak || isCheckingOut || isGettingLocation}
            isLoading={isCheckingOut || (isGettingLocation && isCheckedIn && !isCheckedOut)}
            onClick={handleCheckOutClick}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isCheckedOut
              ? "Shift Completed"
              : isOnBreak
              ? "End Break Before Checkout"
              : "Check Out & Close Shift"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
