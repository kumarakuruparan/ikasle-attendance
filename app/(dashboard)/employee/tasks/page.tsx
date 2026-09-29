"use client";

import React, { useState } from "react";
import { CheckSquare, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import TaskCard from "@/components/tasks/TaskCard";
import TaskTable from "@/components/tasks/TaskTable";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_TASKS } from "@/services/mock-data";
import type { Task, TaskStatus } from "@/types";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [viewMode, setViewMode] = useState("board");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "all") return true;
    return t.status === statusFilter;
  });

  const columns: { id: TaskStatus; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: tasks.filter((t) => t.status === "pending").length },
    { id: "in_progress", label: "In Progress", count: tasks.filter((t) => t.status === "in_progress").length },
    { id: "completed", label: "Completed", count: tasks.filter((t) => t.status === "completed").length },
    { id: "blocked", label: "Blocked", count: tasks.filter((t) => t.status === "blocked").length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        subtitle="Manage daily deliverables, update progress statuses, and review time estimates."
        action={
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            <Tabs
              activeTab={viewMode}
              onChange={setViewMode}
              tabs={[
                { id: "board", label: "Kanban Board" },
                { id: "list", label: "Table List" },
              ]}
            />
          </div>
        }
      />

      {viewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-[#F5FAFF] p-3.5"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-800">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {col.count}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <TaskTable tasks={filteredTasks} />
        </div>
      )}
    </div>
  );
}
