"use client";

import React, { useState } from "react";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PERMISSION_REQUESTS } from "@/services/mock-data";
import type { PermissionRequest } from "@/types";

export default function HRPermissionsPage() {
  const [requests, setRequests] = useState<PermissionRequest[]>(MOCK_PERMISSION_REQUESTS);

  const handleAction = (id: string, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, reviewedBy: "Sarah Jenkins (HR Lead)" }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Request Approvals"
        subtitle="Review temporary daytime absence requests (Enforced maximum 4.0 hours duration limit)."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5FAFF] border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Employee</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Window</th>
                <th className="py-2.5 px-3 font-semibold">Duration</th>
                <th className="py-2.5 px-3 font-semibold">Reason</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-[#F5FAFF]/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {r.employeeName}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{r.department}</td>
                  <td className="py-3 px-3 text-slate-600">{r.date}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {r.startTime} - {r.endTime}
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-600">{r.durationHours} hrs</td>
                  <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{r.reason}</td>
                  <td className="py-3 px-3">
                    <Badge variant={r.status === "approved" ? "success" : "warning"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {r.status === "pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleAction(r.id, "approved")}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(r.id, "rejected")}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Reviewed by {r.reviewedBy}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
