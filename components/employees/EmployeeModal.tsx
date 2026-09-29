"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Employee, CreateEmployeeInput, UpdateEmployeeInput, Role, EmploymentStatus } from "@/services/employee.service";
import { Department } from "@/services/department.service";
import { AlertCircle } from "lucide-react";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  role: z.enum(["EMPLOYEE", "HR", "CEO"]),
  jobTitle: z.string().optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE"]),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedEmployee: Employee) => void;
  employeeToEdit?: Employee | null;
  departments: Department[];
  onSubmitApi: (data: CreateEmployeeInput | UpdateEmployeeInput) => Promise<Employee>;
}

export function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  employeeToEdit,
  departments,
  onSubmitApi,
}: EmployeeModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(employeeToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      role: "EMPLOYEE",
      jobTitle: "",
      joiningDate: new Date().toISOString().split("T")[0],
      employmentStatus: "ACTIVE",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        reset({
          firstName: employeeToEdit.firstName,
          lastName: employeeToEdit.lastName,
          email: employeeToEdit.email,
          phone: employeeToEdit.phone || "",
          departmentId: employeeToEdit.departmentId || "",
          role: employeeToEdit.role,
          jobTitle: employeeToEdit.jobTitle || "",
          joiningDate: employeeToEdit.joiningDate ? employeeToEdit.joiningDate.split("T")[0] : new Date().toISOString().split("T")[0],
          employmentStatus: employeeToEdit.employmentStatus,
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          departmentId: departments[0]?.id || "",
          role: "EMPLOYEE",
          jobTitle: "",
          joiningDate: new Date().toISOString().split("T")[0],
          employmentStatus: "ACTIVE",
        });
      }
    }
  }, [isOpen, employeeToEdit, reset, departments]);

  const onFormSubmit = async (data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload: CreateEmployeeInput | UpdateEmployeeInput = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        departmentId: data.departmentId || null,
        role: data.role as Role,
        jobTitle: data.jobTitle?.trim() || null,
        joiningDate: new Date(data.joiningDate).toISOString(),
        employmentStatus: data.employmentStatus as EmploymentStatus,
        isActive: data.employmentStatus === "ACTIVE",
      };

      const result = await onSubmitApi(payload);
      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save employee details";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departmentOptions = [
    { label: "Select Department", value: "" },
    ...departments.map((d) => ({
      label: d.name,
      value: d.id,
    })),
  ];

  const roleOptions = [
    { label: "Employee", value: "EMPLOYEE" },
    { label: "HR Manager", value: "HR" },
    { label: "CEO / Executive", value: "CEO" },
  ];

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Employee: ${employeeToEdit?.employeeId}` : "Add New Employee"}
      description={
        isEdit
          ? "Update organizational role, department, employment status, or profile details."
          : "Register a new employee record and assign initial role and department."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {apiError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label="First Name *"
            placeholder="e.g. Sarah"
            {...register("firstName", { required: "First name is required" })}
            error={errors.firstName?.message}
          />

          <Input
            id="lastName"
            label="Last Name *"
            placeholder="e.g. Connor"
            {...register("lastName", { required: "Last name is required" })}
            error={errors.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="email"
            type="email"
            label="Email Address *"
            placeholder="sarah.connor@ikasle.com"
            disabled={isEdit}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={errors.email?.message}
            helperText={isEdit ? "Email is linked to auth and cannot be changed here" : undefined}
          />

          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 234-5678"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="jobTitle"
            label="Job Title"
            placeholder="e.g. Senior Frontend Engineer"
            {...register("jobTitle")}
            error={errors.jobTitle?.message}
          />

          <Select
            id="departmentId"
            label="Department"
            options={departmentOptions}
            {...register("departmentId")}
            error={errors.departmentId?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            id="role"
            label="Application Role *"
            options={roleOptions}
            {...register("role")}
            error={errors.role?.message}
          />

          <Select
            id="employmentStatus"
            label="Status *"
            options={statusOptions}
            {...register("employmentStatus")}
            error={errors.employmentStatus?.message}
          />

          <Input
            id="joiningDate"
            type="date"
            label="Joining Date *"
            {...register("joiningDate", { required: "Joining date is required" })}
            error={errors.joiningDate?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Employee" : "Create Employee"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

