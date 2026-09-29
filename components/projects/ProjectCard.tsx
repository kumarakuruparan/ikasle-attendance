import React from "react";
import { FolderKanban, Users, Calendar, CheckSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onSelect?: (project: Project) => void;
  showAssignButton?: boolean;
}

export default function ProjectCard({ project, onSelect, showAssignButton }: ProjectCardProps) {
  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "planning":
        return <Badge variant="purple">Planning</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "on_hold":
        return <Badge variant="warning">On Hold</Badge>;
    }
  };

  const getPriorityBadge = (priority: Project["priority"]) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="amber">High Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card className="flex flex-col justify-between hover:border-blue-300 transition-colors border-slate-200 bg-white shadow-xs">
      <div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {project.department}
            </span>
            <div className="flex items-center gap-1.5">
              {getPriorityBadge(project.priority)}
              {getStatusBadge(project.status)}
            </div>
          </div>
          <CardTitle className="text-sm font-semibold text-slate-900">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1 text-xs text-slate-500">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-900">
                {project.progressPercentage}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Due: {project.dueDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {project.tasksCount.completed}/{project.tasksCount.total} Tasks
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="justify-between text-xs border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5 overflow-hidden">
            {project.members.slice(0, 3).map((m, i) => (
              <div
                key={i}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700 ring-1 ring-white"
                title={m.name}
              >
                {m.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-slate-500">
            {project.members.length} team members
          </span>
        </div>

        {showAssignButton ? (
          <button
            onClick={() => onSelect?.(project)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Manage Team
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">Lead: {project.leadName}</span>
        )}
      </CardFooter>
    </Card>
  );
}
