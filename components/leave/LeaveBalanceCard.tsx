import React from "react";
import { CalendarDays, AlertCircle, HeartPulse, Sparkles, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { LeaveBalance } from "@/types";

export default function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const getProgress = (remaining: number, total: number) => {
    return Math.min(100, Math.max(0, Math.round((remaining / total) * 100)));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Sick Leave Card */}
      <Card className="p-4 border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">
            Sick Leave
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <HeartPulse className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-blue-600">
            {balance.sickLeave.remaining}
          </span>
          <span className="text-xs text-slate-500">/ {balance.sickLeave.totalPerYear} days remaining</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${getProgress(balance.sickLeave.remaining, balance.sickLeave.totalPerYear)}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span className="truncate">Accrues 1/mo • {balance.sickLeave.used}d utilized</span>
        </div>
      </Card>

      {/* Casual Leave Card */}
      <Card className="p-4 border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">
            Casual Leave
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {balance.casualLeave.remaining}
          </span>
          <span className="text-xs text-slate-500">/ {balance.casualLeave.totalPerYear} days remaining</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${getProgress(balance.casualLeave.remaining, balance.casualLeave.totalPerYear)}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="truncate">Flexible personal days • {balance.casualLeave.used}d utilized</span>
        </div>
      </Card>

      {/* Annual Leave Card */}
      <Card className="p-4 border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">
            Annual Vacation
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {balance.annualLeave.remaining}
          </span>
          <span className="text-xs text-slate-500">/ {balance.annualLeave.totalPerYear} days remaining</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${getProgress(balance.annualLeave.remaining, balance.annualLeave.totalPerYear)}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="truncate">Vacation allowance • {balance.annualLeave.used}d utilized</span>
        </div>
      </Card>
    </div>
  );
}
