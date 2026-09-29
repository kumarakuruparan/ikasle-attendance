import React from "react";
import { FolderKanban, Users, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";

export default function ProjectTable({
  projects,
  onManage,
}: {
  projects: Project[];
  onManage?: (p: Project) => void;
}) {
  return (
    <div className="overflow-x-auto border border-slate-100 rounded-lg">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[#F5FAFF] border-b border-slate-200 text-slate-600">
            <th className="py-2.5 px-3 font-semibold">Project Title</th>
            <th className="py-2.5 px-3 font-semibold">Department</th>
            <th className="py-2.5 px-3 font-semibold">Status</th>
            <th className="py-2.5 px-3 font-semibold">Priority</th>
            <th className="py-2.5 px-3 font-semibold">Progress</th>
            <th className="py-2.5 px-3 font-semibold">Due Date</th>
            <th className="py-2.5 px-3 font-semibold">Lead</th>
            {onManage && <th className="py-2.5 px-3 font-semibold text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-[#F5FAFF]/50 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-blue-600" />
                {p.title}
              </td>
              <td className="py-3 px-3 text-slate-600">{p.department}</td>
              <td className="py-3 px-3">
                <Badge
                  variant={
                    p.status === "active"
                      ? "success"
                      : p.status === "completed"
                      ? "default"
                      : "purple"
                  }
                >
                  {p.status}
                </Badge>
              </td>
              <td className="py-3 px-3">
                <Badge variant={p.priority === "critical" ? "destructive" : "outline"}>
                  {p.priority}
                </Badge>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${p.progressPercentage}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-800">
                    {p.progressPercentage}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-3 text-slate-500">{p.dueDate}</td>
              <td className="py-3 px-3 text-slate-600">{p.leadName}</td>
              {onManage && (
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onManage(p)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Assign</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
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
