import React from "react";
import { CheckSquare, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Task } from "@/types";

export default function TaskTable({
  tasks,
  onAssign,
}: {
  tasks: Task[];
  onAssign?: (t: Task) => void;
}) {
  return (
    <div className="overflow-x-auto border border-slate-100 rounded-lg">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[#F5FAFF] border-b border-slate-200 text-slate-600">
            <th className="py-2.5 px-3 font-semibold">Task</th>
            <th className="py-2.5 px-3 font-semibold">Project</th>
            <th className="py-2.5 px-3 font-semibold">Status</th>
            <th className="py-2.5 px-3 font-semibold">Priority</th>
            <th className="py-2.5 px-3 font-semibold">Assigned To</th>
            <th className="py-2.5 px-3 font-semibold">Due Date</th>
            <th className="py-2.5 px-3 font-semibold">Hours</th>
            {onAssign && <th className="py-2.5 px-3 font-semibold text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {tasks.map((t) => (
            <tr key={t.id} className="hover:bg-[#F5FAFF]/50 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-600" />
                {t.title}
              </td>
              <td className="py-3 px-3 text-slate-500">{t.projectName}</td>
              <td className="py-3 px-3">
                <Badge
                  variant={
                    t.status === "completed"
                      ? "success"
                      : t.status === "in_progress"
                      ? "info"
                      : t.status === "blocked"
                      ? "destructive"
                      : "default"
                  }
                >
                  {t.status.replace("_", " ")}
                </Badge>
              </td>
              <td className="py-3 px-3">
                <Badge variant={t.priority === "critical" ? "destructive" : "outline"}>
                  {t.priority}
                </Badge>
              </td>
              <td className="py-3 px-3 text-slate-700">
                {t.assignedTo.name}
              </td>
              <td className="py-3 px-3 text-slate-500">{t.dueDate}</td>
              <td className="py-3 px-3 text-blue-600 font-semibold">
                {t.loggedHours}/{t.estimatedHours}h
              </td>
              {onAssign && (
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onAssign(t)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Reassign
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
