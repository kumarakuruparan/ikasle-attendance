"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Check, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_DAILY_REPORTS } from "@/services/mock-data";
import type { DailyWorkReport } from "@/types";

export default function HRWorkReportsPage() {
  const [reports, setReports] = useState<DailyWorkReport[]>(MOCK_DAILY_REPORTS);
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});

  const handleApprove = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "approved" } : r))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Work Report Audits"
        subtitle="Review daily project time logs submitted by team members and provide management sign-off."
      />

      <div className="space-y-4">
        {reports.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {r.employeeName}
                  </h3>
                  <Badge variant={r.status === "approved" ? "success" : "warning"}>
                    {r.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Report Date: {r.date} • Submitted at {r.submissionTime}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                  {r.totalHours} hrs logged
                </span>

                {r.status !== "approved" ? (
                  <Button size="sm" variant="primary" onClick={() => handleApprove(r.id)}>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Approve Report
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Approved
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {r.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200/80 bg-[#F5FAFF] p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>
                      {item.taskTitle} • <span className="font-normal text-slate-500">{item.projectName}</span>
                    </span>
                    <span className="text-blue-600 font-semibold">{item.hoursSpent} hrs</span>
                  </div>
                  <p className="mt-1 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
