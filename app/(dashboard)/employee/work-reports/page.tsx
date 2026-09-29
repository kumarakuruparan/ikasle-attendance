"use client";

import React, { useState } from "react";
import { Plus, Trash2, FileSpreadsheet, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { MOCK_DAILY_REPORTS, MOCK_PROJECTS } from "@/services/mock-data";
import type { DailyWorkReport, TaskStatus } from "@/types";

export default function EmployeeWorkReportsPage() {
  const [reports, setReports] = useState<DailyWorkReport[]>(MOCK_DAILY_REPORTS);
  const [date, setDate] = useState("2026-09-23");
  const [projectId, setProjectId] = useState(MOCK_PROJECTS[0].id);
  const [taskTitle, setTaskTitle] = useState("");
  const [hoursSpent, setHoursSpent] = useState("4.0");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("in_progress");
  const [notes, setNotes] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = MOCK_PROJECTS.find((p) => p.id === projectId);
    const newReport: DailyWorkReport = {
      id: `rep_${Date.now()}`,
      employeeId: "usr_emp_001",
      employeeName: "Alex Morgan",
      date,
      totalHours: parseFloat(hoursSpent) || 4.0,
      submissionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "submitted",
      managerNotes: notes || undefined,
      items: [
        {
          id: `item_${Date.now()}`,
          projectId,
          projectName: proj ? proj.title : "General",
          taskTitle: taskTitle || "Development & Architecture",
          hoursSpent: parseFloat(hoursSpent) || 4.0,
          description: description || "Work log entry.",
          status,
        },
      ],
    };

    setReports([newReport, ...reports]);
    setTaskTitle("");
    setDescription("");
    setNotes("");
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Work Reports"
        subtitle="Log and submit detailed daily tasks, project deliverables, and time spent for manager verification."
      />

      {successNotice && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Daily work report submitted successfully for manager audit!</span>
        </div>
      )}

      {/* Submission Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Submit Today&apos;s Work Log</CardTitle>
              <CardDescription>Record project-associated hours and completion progress</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Log Date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <Select
                label="Associated Project"
                id="report-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                options={MOCK_PROJECTS.map((p) => ({ label: p.title, value: p.id }))}
              />

              <Input
                label="Hours Worked"
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                required
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Task / Deliverable Title"
                required
                placeholder="e.g. Implement user authentication layout"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <Select
                label="Work Status"
                id="report-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                options={[
                  { label: "In Progress", value: "in_progress" },
                  { label: "Completed", value: "completed" },
                  { label: "Pending Verification", value: "pending" },
                  { label: "Blocked", value: "blocked" },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Work Summary & Description
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key accomplishments, commits, or blockers encountered today..."
                className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <Input
                label="Additional Notes / Blocker Details (Optional)"
                placeholder="e.g. Dependent on API documentation from backend team"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                Submit Report to Manager
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Work Report Submission History</CardTitle>
          <CardDescription>Archive of previously logged daily records and approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 bg-[#F5FAFF] p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      Date: {r.date}
                    </span>
                    <Badge variant={r.status === "approved" ? "success" : "info"}>
                      {r.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Submitted at {r.submissionTime}</span>
                    <span className="font-semibold text-blue-600">
                      • {r.totalHours} hrs logged
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 space-y-1.5">
                  {r.items.map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex items-center justify-between font-medium text-slate-800">
                        <span>{item.taskTitle} ({item.projectName})</span>
                        <span className="font-semibold text-blue-600">{item.hoursSpent}h</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  ))}
                </div>

                {r.managerNotes && (
                  <div className="mt-2.5 rounded-lg bg-blue-50 border border-blue-100 p-2 text-xs text-blue-800">
                    <span className="font-semibold">Manager Feedback:</span> {r.managerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
