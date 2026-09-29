"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Power,
  Users,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Eye,
  Briefcase,
  Calendar,
  X,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/services/department.service";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useUpdateDepartmentStatus,
} from "@/hooks/useDepartments";
import { useDepartment } from "@/hooks/useDepartment";

export default function HRDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // TanStack Query for departments list
  const {
    data: deptsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDepartments({ search: searchTerm || undefined });
  const departments = deptsData || [];

  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const updateStatusMutation = useUpdateDepartmentStatus();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);
  const [statusDialogDept, setStatusDialogDept] = useState<Department | null>(null);

  // Selected Department for Roster Dialog
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const {
    data: selectedDeptDetail,
    isLoading: isLoadingDetail,
  } = useDepartment(selectedDeptId);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setDeptToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setDeptToEdit(dept);
    setIsModalOpen(true);
  };

  const handleViewRoster = (dept: Department) => {
    setSelectedDeptId(dept.id);
  };

  const handleModalSubmit = async (data: CreateDepartmentInput | UpdateDepartmentInput) => {
    if (deptToEdit) {
      const updated = await updateDepartmentMutation.mutateAsync({
        id: deptToEdit.id,
        data: data as UpdateDepartmentInput,
      });
      showNotification(`Department '${updated.name}' updated successfully`);
      return updated;
    } else {
      const created = await createDepartmentMutation.mutateAsync(data as CreateDepartmentInput);
      showNotification(`Department '${created.name}' created successfully`);
      return created;
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusDialogDept) return;
    try {
      const nextActive = !statusDialogDept.isActive;
      const updated = await updateStatusMutation.mutateAsync({
        id: statusDialogDept.id,
        isActive: nextActive,
      });
      showNotification(
        `Department '${updated.name}' is now ${updated.isActive ? "Active" : "Deactivated"}`
      );
      setStatusDialogDept(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change department status");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Management"
        subtitle="Organize business units, review headcount allocation, and configure departmental status."
        action={
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create Department
          </Button>
        }
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search departments by name, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-6 h-8 w-full rounded bg-slate-200 dark:bg-slate-800" />
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Unable to load departments
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {error instanceof Error ? error.message : "Unable to load data. Please try again."}
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RotateCw className="h-3.5 w-3.5 mr-1" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && departments.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              No departments found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchTerm
                ? "Try searching with a different term."
                : "Create your first department to organize team members."}
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create First Department
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Departments Grid */}
      {!isLoading && !isError && departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card
              key={dept.id}
              className="flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                        {dept.name}
                      </CardTitle>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {dept.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                  <Badge variant={dept.isActive ? "success" : "destructive"}>
                    {dept.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 min-h-[32px] line-clamp-2">
                  {dept.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Headcount
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {dept.userCount ?? 0} {dept.userCount === 1 ? "Employee" : "Employees"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/hr/departments/${dept.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleViewRoster(dept)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Quick Roster
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      title="Edit Department"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusDialogDept(dept)}
                      title={dept.isActive ? "Deactivate" : "Activate"}
                      className={`rounded-lg p-1.5 transition-colors ${
                        dept.isActive
                          ? "text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                          : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                      }`}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
        departmentToEdit={deptToEdit}
        onSubmitApi={handleModalSubmit}
      />

      {/* Quick Roster Dialog */}
      <Dialog
        isOpen={Boolean(selectedDeptId)}
        onClose={() => setSelectedDeptId(null)}
        title={selectedDeptDetail ? `${selectedDeptDetail.name} — Employee Roster` : "Department Roster"}
        maxWidth="lg"
      >
        <div className="p-6 space-y-4">
          {isLoadingDetail && (
            <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Loading department employees...
            </div>
          )}

          {!isLoadingDetail && selectedDeptDetail && (
            <>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">
                  Total Assigned: <strong className="text-slate-900 dark:text-white font-mono">{selectedDeptDetail.users?.length || 0}</strong>
                </span>
                <Link
                  href={`/hr/departments/${selectedDeptDetail.id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Open Full Department Page →
                </Link>
              </div>

              {(!selectedDeptDetail.users || selectedDeptDetail.users.length === 0) ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No employees are currently assigned to this department.
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedDeptDetail.users.map((emp) => (
                    <div key={emp.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 font-bold text-xs text-blue-700 dark:text-blue-300">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/hr/employees/${emp.id}`}
                            className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                          >
                            {emp.fullName}
                          </Link>
                          <p className="text-[11px] text-slate-400">
                            {emp.jobTitle || "Team Member"} • <span className="font-mono">{emp.employeeId}</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant={emp.isActive ? "success" : "destructive"}>
                        {emp.employmentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setSelectedDeptId(null)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Dialog for Status Change */}
      <ConfirmationDialog
        isOpen={Boolean(statusDialogDept)}
        onClose={() => setStatusDialogDept(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusDialogDept?.isActive ? "Deactivate Department" : "Activate Department"}
        message={
          statusDialogDept?.isActive
            ? `Are you sure you want to deactivate '${statusDialogDept?.name}'? Note that existing employees will remain assigned.`
            : `Are you sure you want to activate '${statusDialogDept?.name}'?`
        }
        confirmText={statusDialogDept?.isActive ? "Deactivate" : "Activate"}
        variant={statusDialogDept?.isActive ? "danger" : "primary"}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
