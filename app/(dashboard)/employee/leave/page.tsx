"use client";

import React, { useState } from "react";
import { Plus, CalendarDays, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import LeaveBalanceCard from "@/components/leave/LeaveBalanceCard";
import ApplyLeaveModal from "@/components/leave/ApplyLeaveModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_LEAVE_BALANCE, MOCK_LEAVE_REQUESTS } from "@/services/mock-data";
import type { LeaveRequest, LeaveType } from "@/types";

export default function EmployeeLeavePage() {
  const [balance, setBalance] = useState(MOCK_LEAVE_BALANCE);
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [modalOpen, setModalOpen] = useState(false);

  const handleApplyLeave = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const newRequest: LeaveRequest = {
      id: `lv_${Date.now()}`,
      employeeId: "usr_emp_001",
      employeeName: "Alex Morgan",
      department: "Engineering",
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: 1,
      reason: data.reason,
      status: "pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    setRequests([newRequest, ...requests]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Review annual leave allocations, monthly sick leave accrual, and track approval status."
        action={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Apply for Leave
          </Button>
        }
      />

      {/* Leave Balances */}
      <LeaveBalanceCard balance={balance} />

      {/* Leave Request History Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Applications & History</CardTitle>
          <CardDescription>Track status, manager reviews, and total days deducted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5FAFF] border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Dates</th>
                  <th className="py-2.5 px-3 font-semibold">Days</th>
                  <th className="py-2.5 px-3 font-semibold">Reason</th>
                  <th className="py-2.5 px-3 font-semibold">Applied At</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5FAFF]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold uppercase text-slate-800">
                      {r.leaveType} Leave
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {r.startDate} {r.startDate !== r.endDate ? `to ${r.endDate}` : ""}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-600">{r.totalDays} day(s)</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{r.reason}</td>
                    <td className="py-3 px-3 text-slate-400">{r.appliedAt}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          r.status === "approved"
                            ? "success"
                            : r.status === "rejected"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{r.reviewedBy || "Pending Review"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ApplyLeaveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleApplyLeave}
      />
    </div>
  );
}
