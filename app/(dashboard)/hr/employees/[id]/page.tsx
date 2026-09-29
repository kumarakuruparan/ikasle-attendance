"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Building2,
  Calendar,
  Briefcase,
  Shield,
  Clock,
  FolderKanban,
  CheckSquare,
  FileSpreadsheet,
  CalendarDays,
  Edit,
  Power,
  AlertCircle,
  RotateCw,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { EmployeeModal } from "@/components/employees/EmployeeModal";
import {
  useEmployee,
  useUpdateEmployee,
  useUpdateEmployeeStatus,
} from "@/hooks/useEmployee";
import { useDepartments } from "@/hooks/useDepartments";
import { UpdateEmployeeInput } from "@/services/employee.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EmployeeDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  // TanStack Query for server state
  const {
    data: employee,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployee(resolvedParams.id);

  const { data: deptData } = useDepartments();
  const departments = deptData || [];

  const updateEmployeeMutation = useUpdateEmployee();
  const updateStatusMutation = useUpdateEmployeeStatus();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleEditSubmit = async (data: UpdateEmployeeInput) => {
    if (!employee) throw new Error("Employee not found");
    const updated = await updateEmployeeMutation.mutateAsync({
      id: employee.id,
      data,
    });
    showNotification(`Employee ${updated.employeeId} updated successfully`);
    return updated;
  };

  const handleStatusToggle = async () => {
    if (!employee) return;
    try {
      const nextActive = !employee.isActive;
      const updated = await updateStatusMutation.mutateAsync({
        id: employee.id,
        statusData: {
          isActive: nextActive,
          employmentStatus: nextActive ? "ACTIVE" : "INACTIVE",
        },
      });
      showNotification(
        `Employee ${updated.employeeId} status set to ${updated.employmentStatus}`
      );
      setIsStatusDialogOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse py-8">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    const errorMsg =
      error instanceof Error ? error.message : "The requested employee record does not exist.";
    return (
      <div className="py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          Employee Not Found
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{errorMsg}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/hr/employees")}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Directory
          </Button>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview & Profile" },
    { id: "attendance", label: "Attendance" },
    { id: "projects", label: "Projects & Tasks" },
    { id: "reports", label: "Work Reports" },
    { id: "leave", label: "Leave & Permissions" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/hr/employees"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Employee Directory
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit Profile
          </Button>
          <Button
            variant={employee.isActive ? "destructive" : "primary"}
            size="sm"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            <Power className="h-3.5 w-3.5 mr-1.5" />
            {employee.isActive ? "Deactivate Account" : "Reactivate Account"}
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Profile Hero Card */}
      <Card className="overflow-hidden border-blue-100 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-24" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-tr from-blue-700 to-indigo-700 text-2xl font-black text-white shadow-xl dark:border-slate-900">
                {employee.firstName.charAt(0)}
                {employee.lastName.charAt(0)}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {employee.fullName}
                  </h1>
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                    {employee.employeeId}
                  </span>
                  <Badge variant={employee.isActive ? "success" : "destructive"}>
                    {employee.employmentStatus}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {employee.jobTitle || "Team Member"} • {employee.departmentName || "Unassigned Department"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {employee.role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab: Overview & Profile */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Employment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{employee.employeeId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Application Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.departmentName || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Job Title</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.jobTitle || "-"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Employment Status</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.employmentStatus}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Joining Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information & Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                Contact & Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Phone Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.phone || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Clerk Authentication ID</span>
                <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]" title={employee.clerkUserId}>
                  {employee.clerkUserId}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Account Created</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {new Date(employee.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Attendance (Future Module Placeholder) */}
      {activeTab === "attendance" && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Attendance Module</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No attendance records yet.</p>
          </CardContent>
        </Card>
      )}

      {/* Tab: Projects & Tasks (Future Module Placeholder) */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FolderKanban className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Assigned Projects</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No projects assigned yet.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Active Tasks</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No active tasks.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Work Reports (Future Module Placeholder) */}
      {activeTab === "reports" && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Daily Work Reports</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No work reports submitted yet.</p>
          </CardContent>
        </Card>
      )}

      {/* Tab: Leave & Permissions (Future Module Placeholder) */}
      {activeTab === "leave" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Leave Requests</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No leave requests yet.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Short Permissions</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No permission requests yet.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Employee Modal */}
      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {}}
        employeeToEdit={employee}
        departments={departments}
        onSubmitApi={handleEditSubmit}
      />

      {/* Confirmation Dialog for Status Change */}
      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleStatusToggle}
        title={employee.isActive ? "Deactivate Employee" : "Reactivate Employee"}
        message={
          employee.isActive
            ? `Are you sure you want to deactivate ${employee.fullName} (${employee.employeeId})? They will immediately lose access to sign in.`
            : `Are you sure you want to reactivate ${employee.fullName} (${employee.employeeId})? This will restore their system access.`
        }
        confirmText={employee.isActive ? "Deactivate" : "Reactivate"}
        variant={employee.isActive ? "danger" : "primary"}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
