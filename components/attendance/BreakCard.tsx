"use client";

import React, { useState } from "react";
import { Coffee, Pause, Play, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BreakTimer } from "./BreakTimer";
import {
  AttendanceRecord,
  BreakRecord,
  BreakType,
} from "@/services/attendance.service";

interface BreakCardProps {
  attendance: AttendanceRecord | null;
  activeBreak: BreakRecord | null;
  onStartBreak: (type: BreakType) => Promise<unknown>;
  onEndBreak: () => Promise<unknown>;
  isStarting?: boolean;
  isEnding?: boolean;
}

export default function BreakCard({
  attendance,
  activeBreak,
  onStartBreak,
  onEndBreak,
  isStarting = false,
  isEnding = false,
}: BreakCardProps) {
  

  const isCheckedIn = Boolean(attendance && !attendance.checkOutAt);
  const isCheckedOut = Boolean(attendance?.checkOutAt);
  const isOnBreak = Boolean(activeBreak);

  const completedBreaks = attendance?.breaks.filter((b) => b.endedAt !== null) || [];
  const totalBreakMinutes = attendance?.totalBreakMinutes || 0;

  const breakTypes: Array<{ type: BreakType; label: string; policyMinutes: number }> = [
    { type: "MORNING", label: "Morning Tea", policyMinutes: 15 },
    { type: "LUNCH", label: "Lunch", policyMinutes: 60 },
    { type: "EVENING", label: "Evening Tea", policyMinutes: 15 },
    { type: "OTHER", label: "Quick Break", policyMinutes: 15 },
  ];

  const handleStart = async (type: BreakType) => {
    await onStartBreak(type);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm">Break & Pause Management</CardTitle>
              <CardDescription className="text-xs">
                Company policy allows Morning (15m), Lunch (60m), and Evening (15m) pauses.
              </CardDescription>
            </div>
          </div>

          {isOnBreak ? (
            <Badge variant="warning">On Active Break</Badge>
          ) : isCheckedIn ? (
            <Badge variant="success">Currently Working</Badge>
          ) : (
            <Badge variant="default">Shift Inactive</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Active Break Banner */}
        {isOnBreak && activeBreak && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  {activeBreak.type} Break in Progress
                </span>
              </div>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-0.5">
                Started at {new Date(activeBreak.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <BreakTimer startedAt={activeBreak.startedAt} />
              <Button
                variant="primary"
                size="sm"
                onClick={onEndBreak}
                isLoading={isEnding}
                disabled={isEnding}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                End Break & Resume
              </Button>
            </div>
          </div>
        )}

        {/* Start Break Actions (Only enabled if checked in and not already on break) */}
        {!isOnBreak && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {breakTypes.map(({ type, label, policyMinutes }) => (
                <button
                  key={type}
                  type="button"
                  disabled={!isCheckedIn || isCheckedOut || isStarting}
                  onClick={() => handleStart(type)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-blue-950/40 dark:hover:border-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed group text-center"
                >
                  <Pause className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Policy: {policyMinutes} min
                  </span>
                </button>
              ))}
            </div>

            {!isCheckedIn && !isCheckedOut && (
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Check in first to enable break tracking.
              </p>
            )}
            {isCheckedOut && (
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Shift completed. Breaks disabled after checkout.
              </p>
            )}
          </div>
        )}

        {/* Break Summary / History Log for Today */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/30">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Today&apos;s Total Break Time:
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {totalBreakMinutes} min
            </span>
          </div>

          {completedBreaks.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center pt-2">
              No completed breaks recorded yet today.
            </p>
          ) : (
            <div className="space-y-1.5 pt-2">
              {completedBreaks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <strong>{b.type}</strong>
                    <span>
                      ({new Date(b.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {b.endedAt ? new Date(b.endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "..."})
                    </span>
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {b.durationMinutes} min
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
