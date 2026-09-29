"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import type { LeaveType } from "@/types";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { leaveType: LeaveType; startDate: string; endDate: string; reason: string }) => void;
}

export default function ApplyLeaveModal({ isOpen, onClose, onSubmit }: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ leaveType, startDate, endDate, reason });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      description="Submit a formal absence request for manager and HR approval."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Category"
          id="leave-type-select"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { label: "Casual Leave (Personal)", value: "casual" },
            { label: "Sick Leave (1 per month allowance)", value: "sick" },
            { label: "Annual Vacation Leave", value: "annual" },
            { label: "Unpaid Sabbatical", value: "unpaid" },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Reason / Purpose
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Brief reason for your absence..."
            className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Application
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
