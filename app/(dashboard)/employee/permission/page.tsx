"use client";

import React, { useState } from "react";
import { Plus, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import PermissionModal from "@/components/leave/PermissionModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PERMISSION_REQUESTS } from "@/services/mock-data";
import type { PermissionRequest } from "@/types";

export default function EmployeePermissionPage() {
  const [requests, setRequests] = useState<PermissionRequest[]>(MOCK_PERMISSION_REQUESTS);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRequestPermission = (data: {
    date: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    reason: string;
  }) => {
    const newRequest: PermissionRequest = {
      id: `perm_${Date.now()}`,
      employeeId: "usr_emp_001",
      employeeName: "Alex Morgan",
      department: "Engineering",
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      durationHours: data.durationHours,
      reason: data.reason,
      status: "pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    setRequests([newRequest, ...requests]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Requests"
        subtitle="Request temporary daytime leaves for medical, personal, or administrative errands (Policy: Max 4 hours)."
        action={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Request Permission
          </Button>
        }
      />

      {/* Policy Reminder Banner */}
      <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-900">
        <Clock className="h-4 w-4 shrink-0 text-blue-600" />
        <div>
          <span className="font-semibold">IKASLE Corporate Permission Guidelines:</span> Permissions are designed for short absences during working hours up to a strict maximum of 4.0 hours per instance. Over 4 hours must be filed as a half-day or full-day leave.
        </div>
      </div>

      {/* Permission History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Log & Requests</CardTitle>
          <CardDescription>Track status, timing, duration, and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5FAFF] border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Time Window</th>
                  <th className="py-2.5 px-3 font-semibold">Duration</th>
                  <th className="py-2.5 px-3 font-semibold">Reason</th>
                  <th className="py-2.5 px-3 font-semibold">Applied At</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5FAFF]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {p.date}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {p.startTime} - {p.endTime}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-600">
                      {p.durationHours} hrs
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{p.reason}</td>
                    <td className="py-3 px-3 text-slate-400">{p.appliedAt}</td>
                    <td className="py-3 px-3">
                      <Badge variant={p.status === "approved" ? "success" : "warning"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{p.reviewedBy || "Pending Review"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PermissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRequestPermission}
      />
    </div>
  );
}
