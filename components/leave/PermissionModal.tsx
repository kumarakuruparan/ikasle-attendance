"use client";

import React, { useState } from "react";
import { AlertCircle, Clock } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; startTime: string; endTime: string; durationHours: number; reason: string }) => void;
}

export default function PermissionModal({ isOpen, onClose, onSubmit }: PermissionModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [reason, setReason] = useState("");

  // Calculate duration automatically
  const calculateDuration = (): number => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    return Math.max(0, Math.round((diffMins / 60) * 10) / 10);
  };

  const duration = calculateDuration();
  const isExceeded = duration > 4.0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExceeded) {
      alert("Permission duration cannot exceed 4.0 hours per company policy.");
      return;
    }
    onSubmit({ date, startTime, endTime, durationHours: duration, reason });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Request Short Permission"
      description="Apply for short absence during business hours (Maximum 4 hours)."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Policy Alert Banner */}
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-blue-600" />
          <span>Company Policy: Maximum 4.0 hours per permission request.</span>
        </div>

        <Input
          label="Date of Permission"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="End Time"
            type="time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {/* Dynamic Duration Box */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-[#F5FAFF] p-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">
              Calculated Duration:
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-bold ${
                isExceeded ? "text-rose-600" : "text-blue-600"
              }`}
            >
              {duration} hours
            </span>
            {isExceeded && (
              <span className="block text-[10px] text-rose-500 font-semibold">
                Exceeds 4h limit!
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Reason / Justification
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Official justification for temporary absence..."
            className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isExceeded || duration <= 0}>
            Submit Permission Request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
