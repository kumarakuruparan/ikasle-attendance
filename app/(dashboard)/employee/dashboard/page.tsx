"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Coffee,
  User,
  Shield,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import AttendanceCard from "@/components/attendance/AttendanceCard";
import BreakCard from "@/components/attendance/BreakCard";
import TaskCard from "@/components/tasks/TaskCard";
import ProjectCard from "@/components/projects/ProjectCard";
import LeaveBalanceCard from "@/components/leave/LeaveBalanceCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MOCK_TASKS,
  MOCK_PROJECTS,
  MOCK_LEAVE_BALANCE,
  MOCK_PERMISSION_REQUESTS,
} from "@/services/mock-data";
import { useSelfProfile } from "@/hooks/useSelfProfile";
import {
  useTodayAttendance,
  useCheckIn,
  useCheckOut,
  useStartBreak,
  useEndBreak,
} from "@/hooks/useAttendance";

export default function EmployeeDashboard() {
  const { data: profile } = useSelfProfile();
  const { data: attendanceData } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  const startBreakMutation = useStartBreak();
  const endBreakMutation = useEndBreak();

  const attendance = attendanceData?.attendance || null;
  const activeBreak = attendanceData?.activeBreak || null;
  const officeSettings = attendanceData?.officeSettings || {
    officeStartTime: "09:30",
    officeEndTime: "19:00",
    officeRadiusMeters: 300,
    maxAccuracyThresholdMeters: 150,
  };

  const displayName = profile ? profile.fullName : "Team Member";
  const firstName = profile ? profile.firstName : "Member";
  const employeeId = profile ? profile.employeeId : "---";
  const departmentName = profile ? (profile.departmentName || "Unassigned") : "Unassigned";
  const jobTitle = profile ? (profile.jobTitle || "Employee") : "Employee";
  const status = profile ? profile.employmentStatus : "ACTIVE";

  const tasks = MOCK_TASKS.slice(0, 3);
  const projects = MOCK_PROJECTS.slice(0, 2);
  const latestPermission = MOCK_PERMISSION_REQUESTS[0];

  return (
    <div className="space-y-8">
      {/* Header with real employee identity */}
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle={`${jobTitle} • ${departmentName} Department • ID: ${employeeId}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/employee/profile">
              <Button size="sm" variant="outline">
                <User className="h-4 w-4 mr-1.5" />
                View Profile
              </Button>
            </Link>
            <Link href="/employee/work-reports">
              <Button size="sm" variant="outline">
                <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                Daily Report
              </Button>
            </Link>
            <Link href="/employee/leave">
              <Button size="sm" variant="primary">
                Apply Leave
              </Button>
            </Link>
          </div>
        }
      />

      {/* Employee Identity Summary Banner */}
      <div className="rounded-xl border border-blue-100 bg-[#F5FAFF] p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              {firstName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm">{displayName}</span>
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  {employeeId}
                </span>
                <Badge variant={status === "ACTIVE" ? "success" : "destructive"}>
                  {status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {jobTitle} • {departmentName} • Joined: {profile ? new Date(profile.joiningDate).toLocaleDateString() : "Active"}
              </p>
            </div>
          </div>

          <Link
            href="/employee/profile"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Edit Profile Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Attendance & Breaks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AttendanceCard
            attendance={attendance}
            activeBreak={activeBreak}
            officeSettings={officeSettings}
            onCheckIn={(coords) => checkInMutation.mutateAsync(coords)}
            onCheckOut={(coords) => checkOutMutation.mutateAsync(coords)}
            isCheckingIn={checkInMutation.isPending}
            isCheckingOut={checkOutMutation.isPending}
          />
        </div>
        <div className="lg:col-span-5">
          <BreakCard
            attendance={attendance}
            activeBreak={activeBreak}
            onStartBreak={(type) => startBreakMutation.mutateAsync(type)}
            onEndBreak={() => endBreakMutation.mutateAsync()}
            isStarting={startBreakMutation.isPending}
            isEnding={endBreakMutation.isPending}
          />
        </div>
      </div>

      {/* Working & Productive Hours Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Productive Hours</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            5h 42m
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span>84% of office session</span>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Tasks Due Today</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <CheckSquare className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            2 Tasks
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span>1 In-Progress, 1 Done</span>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Projects</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <FolderKanban className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            2 Assigned
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 truncate">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>
            <span className="truncate">Core Redesign, Presence</span>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Latest Permission</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {latestPermission ? `${latestPermission.durationHours} hrs` : "None"}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            <span className="capitalize">{latestPermission?.status || "None active"}</span>
          </div>
        </Card>
      </div>

      {/* Leave Balances Widget */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Leave Balances & Allowances
          </h3>
          <Link
            href="/employee/leave"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All & Apply</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <LeaveBalanceCard balance={MOCK_LEAVE_BALANCE} />
      </div>

      {/* Today's Tasks & Assigned Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Assigned Tasks
            </h3>
            <Link
              href="/employee/tasks"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Task Board</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Current Projects
            </h3>
            <Link
              href="/employee/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
