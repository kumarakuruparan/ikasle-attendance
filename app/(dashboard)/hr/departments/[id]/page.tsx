"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Users,
  Edit,
  Power,
  AlertCircle,
  RotateCw,
  CheckCircle,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import {
  useDepartment,
  useUpdateDepartment,
  useUpdateDepartmentStatus,
} from "@/hooks/useDepartment";
import { UpdateDepartmentInput } from "@/services/department.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DepartmentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  // TanStack Query for department details
  const {
    data: department,
    isLoading,
    isError,
    error,
    refetch,
  } = useDepartment(resolvedParams.id);

  const updateDeptMutation = useUpdateDepartment();
  const updateStatusMutation = useUpdateDepartmentStatus();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleEditSubmit = async (data: UpdateDepartmentInput) => {
    if (!department) throw new Error("Department not found");
    const updated = await updateDeptMutation.mutateAsync({
      id: department.id,
      data,
    });
    showNotification(`Department '${updated.name}' updated successfully`);
    return updated;
  };

  const handleStatusToggle = async () => {
    if (!department) return;
    try {
      const nextActive = !department.isActive;
      const updated = await updateStatusMutation.mutateAsync({
        id: department.id,
        isActive: nextActive,
      });
      showNotification(
        `Department '${updated.name}' is now ${updated.isActive ? "Active" : "Deactivated"}`
      );
      setIsStatusDialogOpen(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change department status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse py-8">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (isError || !department) {
    const errorMsg =
      error instanceof Error ? error.message : "The requested department record does not exist.";
    return (
      <div className="py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          Department Not Found
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{errorMsg}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push("/hr/departments")}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Departments
          </Button>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const assignedEmployees = department.users || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/hr/departments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Department Directory
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit Department
          </Button>
          <Button
            variant={department.isActive ? "destructive" : "primary"}
            size="sm"
            onClick={() => setIsStatusDialogOpen(true)}
          >
            <Power className="h-3.5 w-3.5 mr-1.5" />
            {department.isActive ? "Deactivate Department" : "Activate Department"}
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

      {/* Department Hero Card */}
      <Card className="overflow-hidden border-blue-100 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-20" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-tr from-blue-700 to-indigo-700 text-2xl font-black text-white shadow-xl dark:border-slate-900">
                <Building2 className="h-10 w-10" />
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {department.name}
                  </h1>
                  <Badge variant={department.isActive ? "success" : "destructive"}>
                    {department.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  {department.description || "No description provided for this business unit."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Total Headcount
                </span>
                <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  {assignedEmployees.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roster of Assigned Employees */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Department Members ({assignedEmployees.length})
            </CardTitle>
            <Link
              href="/hr/employees"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Assign more in Employees →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {assignedEmployees.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                No employees in this department
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                You can assign employees to this department by editing their profiles.
              </p>
              <div className="mt-4">
                <Link href="/hr/employees">
                  <Button variant="outline" size="sm">
                    Go to Employee Directory
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                    <th className="pb-3 font-semibold">Employee</th>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Role & Title</th>
                    <th className="pb-3 font-semibold">Contact</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assignedEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/hr/employees/${emp.id}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                            >
                              {emp.fullName}
                            </Link>
                            <p className="text-[11px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {emp.employeeId}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {emp.jobTitle || "Team Member"}
                        </span>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">{emp.role}</p>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">
                        {emp.phone || "No phone"}
                      </td>
                      <td className="py-3">
                        <Badge variant={emp.isActive ? "success" : "destructive"}>
                          {emp.employmentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/hr/employees/${emp.id}`}>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Department Modal */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {}}
        departmentToEdit={department}
        onSubmitApi={handleEditSubmit}
      />

      {/* Confirmation Dialog for Status Change */}
      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleStatusToggle}
        title={department.isActive ? "Deactivate Department" : "Activate Department"}
        message={
          department.isActive
            ? `Are you sure you want to deactivate '${department.name}'? Existing employees will remain assigned.`
            : `Are you sure you want to activate '${department.name}'?`
        }
        confirmText={department.isActive ? "Deactivate" : "Activate"}
        variant={department.isActive ? "danger" : "primary"}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
