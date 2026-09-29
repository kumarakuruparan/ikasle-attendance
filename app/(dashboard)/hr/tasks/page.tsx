"use client";

import React, { useState } from "react";
import { CheckSquare, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import TaskTable from "@/components/tasks/TaskTable";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { MOCK_TASKS, MOCK_COMPANY_EMPLOYEES } from "@/services/mock-data";
import type { Task } from "@/types";

export default function HRTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newAssignee, setNewAssignee] = useState("");

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newAssignee) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, assignedTo: { id: `usr_${Date.now()}`, name: newAssignee } }
          : t
      )
    );
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Team Task Monitoring"
        subtitle="Monitor task progress, unblock dependencies, and reassign deliverables across workforce members."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <TaskTable
          tasks={tasks}
          onAssign={(t) => setSelectedTask(t)}
        />
      </div>

      <Dialog
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Reassign Task: ${selectedTask?.title}`}
        description="Select an employee to take ownership of this deliverable."
      >
        <form onSubmit={handleReassign} className="space-y-4">
          <Select
            label="New Assignee"
            id="reassign-select"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            options={[
              { label: "-- Select Employee --", value: "" },
              ...MOCK_COMPANY_EMPLOYEES.map((e) => ({ label: `${e.name} (${e.role})`, value: e.name })),
            ]}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setSelectedTask(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Reassignment
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
