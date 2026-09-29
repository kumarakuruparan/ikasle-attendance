import React from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "pending":
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="amber">High</Badge>;
      case "medium":
        return <Badge variant="purple">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card className="hover:border-blue-300 transition-colors flex flex-col justify-between border-slate-200 bg-white p-4 shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {task.projectName}
          </span>
          <div className="flex items-center gap-1.5">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>

        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
          {task.title}
        </h4>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {task.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>Due {task.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-slate-700">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{task.loggedHours}/{task.estimatedHours}h</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-normal">
          {task.assignedTo.name}
        </span>
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
            className="text-[11px] rounded-md border border-slate-200 bg-white py-0.5 px-2 text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        )}
      </div>
    </Card>
  );
}
