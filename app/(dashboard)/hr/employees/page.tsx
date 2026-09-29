"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  CheckCircle,
  Eye,
  Edit,
  Power,
  RotateCw,
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { EmployeeModal } from "@/components/employees/EmployeeModal";
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useUpdateEmployeeStatus,
} from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import {
  Employee,
  Role,
  EmploymentStatus,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/services/employee.service";

export default function HREmployeesPage() {
  // Filters and Pagination (UI state only)
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [statusDialogEmployee, setStatusDialogEmployee] = useState<Employee | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // TanStack Query: Real departments for filter and assignment
  const { data: departments = [] } = useDepartments();

  // TanStack Query: Real employees from backend with server-side filters and pagination
  const {
    data: employeesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    search: searchTerm || undefined,
    departmentId: departmentFilter !== "all" ? departmentFilter : undefined,
    role: roleFilter !== "all" ? (roleFilter as Role) : undefined,
    status: statusFilter !== "all" ? (statusFilter as EmploymentStatus) : undefined,
    page: currentPage,
    limit: 10,
  });

  const employees = employeesData?.employees || [];
  const pagination = employeesData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // TanStack Query Mutations
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const updateStatusMutation = useUpdateEmployeeStatus();

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: CreateEmployeeInput | UpdateEmployeeInput) => {
    if (employeeToEdit) {
      const updated = await updateEmployeeMutation.mutateAsync({
        id: employeeToEdit.id,
        data: data as UpdateEmployeeInput,
      });
      showNotification(`Employee ${updated.employeeId} updated successfully`);
      return updated;
    } else {
      const created = await createEmployeeMutation.mutateAsync(data as CreateEmployeeInput);
      showNotification(`Employee ${created.employeeId} created successfully`);
      return created;
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusDialogEmployee) return;
    try {
      const nextActive = !statusDialogEmployee.isActive;
      const updated = await updateStatusMutation.mutateAsync({
        id: statusDialogEmployee.id,
        statusData: {
          isActive: nextActive,
          employmentStatus: nextActive ? "ACTIVE" : "INACTIVE",
        },
      });
      showNotification(
        `Employee ${updated.employeeId} (${updated.fullName}) is now ${updated.isActive ? "Active" : "Deactivated"}.`
      );
      setStatusDialogEmployee(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change employee status.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage workforce records, assign departments & roles, and control active employment status."
        action={
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Employee
          </Button>
        }
      />

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, ID, job title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR Manager</option>
              <option value="CEO">CEO</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table & List Section */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            /* Loading Skeletons */
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse py-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-850" />
                  </div>
                  <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : isError ? (
            /* Error State */
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Unable to load employees</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {error instanceof Error ? error.message : "Unable to connect to backend API."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
                <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                Retry
              </Button>
            </div>
          ) : employees.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">No employees found</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No employees matched your current filters. Clear the search or create a new employee record.
              </p>
              <Button variant="primary" size="sm" onClick={handleOpenAdd} className="mt-5">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add First Employee
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pl-2">ID</th>
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Job Title</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Joined</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        {/* Employee ID */}
                        <td className="py-3.5 pl-2 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {emp.employeeId}
                        </td>

                        {/* Name & Avatar */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
                              {emp.firstName.charAt(0)}
                              {emp.lastName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/hr/employees/${emp.id}`}
                                className="font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors truncate block"
                              >
                                {emp.fullName}
                              </Link>
                              <div className="text-[11px] text-slate-400 truncate">{emp.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">
                          {emp.departmentName ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              {emp.departmentName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Role */}
                        <td className="py-3.5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              emp.role === "HR"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                                : emp.role === "CEO"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {emp.role}
                          </span>
                        </td>

                        {/* Job Title */}
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">
                          {emp.jobTitle || <span className="text-slate-400 italic">—</span>}
                        </td>

                        {/* Status */}
                        <td className="py-3.5">
                          <Badge variant={emp.isActive ? "success" : "destructive"}>
                            {emp.employmentStatus}
                          </Badge>
                        </td>

                        {/* Joining Date */}
                        <td className="py-3.5 text-slate-500 dark:text-slate-400 text-[11px]">
                          {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pr-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/hr/employees/${emp.id}`}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
                              title="View Employee Profile"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(emp)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors"
                              title="Edit Employee"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => setStatusDialogEmployee(emp)}
                              className={`rounded-lg p-1.5 transition-colors ${
                                emp.isActive
                                  ? "text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                  : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                              }`}
                              title={emp.isActive ? "Deactivate Employee" : "Reactivate Employee"}
                            >
                              <Power className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List (no horizontal overflow) */}
              <div className="block md:hidden space-y-3">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
                          {emp.firstName.charAt(0)}
                          {emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <Link
                            href={`/hr/employees/${emp.id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600"
                          >
                            {emp.fullName}
                          </Link>
                          <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                            {emp.employeeId}
                          </div>
                        </div>
                      </div>

                      <Badge variant={emp.isActive ? "success" : "destructive"}>
                        {emp.employmentStatus}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Department</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                          {emp.departmentName || "Unassigned"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Job Title</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                          {emp.jobTitle || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] text-slate-400">{emp.email}</span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/hr/employees/${emp.id}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setStatusDialogEmployee(emp)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}{" "}
                    employees
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                      Previous
                    </Button>
                    <span className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {currentPage} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
        employeeToEdit={employeeToEdit}
        departments={departments}
        onSubmitApi={handleModalSubmit}
      />

      {/* Confirmation Dialog for Activation / Deactivation */}
      <ConfirmationDialog
        isOpen={Boolean(statusDialogEmployee)}
        onClose={() => setStatusDialogEmployee(null)}
        onConfirm={handleConfirmStatusToggle}
        title={statusDialogEmployee?.isActive ? "Deactivate Employee" : "Reactivate Employee"}
        message={
          statusDialogEmployee?.isActive
            ? `Are you sure you want to deactivate employee ${statusDialogEmployee?.fullName} (${statusDialogEmployee?.employeeId})? They will immediately lose access to sign in to the platform.`
            : `Are you sure you want to reactivate employee ${statusDialogEmployee?.fullName} (${statusDialogEmployee?.employeeId})? This will restore their system access.`
        }
        confirmText={statusDialogEmployee?.isActive ? "Deactivate" : "Reactivate"}
        variant={statusDialogEmployee?.isActive ? "danger" : "primary"}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
