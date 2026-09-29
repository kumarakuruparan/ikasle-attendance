"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Department, CreateDepartmentInput, UpdateDepartmentInput } from "@/services/department.service";
import { AlertCircle } from "lucide-react";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().optional(),
  isActive: z.enum(["true", "false"]),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedDept: Department) => void;
  departmentToEdit?: Department | null;
  onSubmitApi: (data: CreateDepartmentInput | UpdateDepartmentInput) => Promise<Department>;
}

export function DepartmentModal({
  isOpen,
  onClose,
  onSuccess,
  departmentToEdit,
  onSubmitApi,
}: DepartmentModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(departmentToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    defaultValues: {
      name: "",
      description: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (departmentToEdit) {
        reset({
          name: departmentToEdit.name,
          description: departmentToEdit.description || "",
          isActive: departmentToEdit.isActive ? "true" : "false",
        });
      } else {
        reset({
          name: "",
          description: "",
          isActive: "true",
        });
      }
    }
  }, [isOpen, departmentToEdit, reset]);

  const onFormSubmit = async (data: DepartmentFormData) => {
    try {
      setIsSubmitting(true);
      setApiError(null);

      const payload: CreateDepartmentInput | UpdateDepartmentInput = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        isActive: data.isActive === "true",
      };

      const result = await onSubmitApi(payload);
      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save department";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Department: ${departmentToEdit?.name}` : "Create Department"}
      description={
        isEdit
          ? "Update department title, operational description, or active status."
          : "Define a new organizational department within the company."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {apiError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <Input
          id="name"
          label="Department Name *"
          placeholder="e.g. Platform Engineering"
          {...register("name", {
            required: "Department name is required",
            minLength: { value: 2, message: "Minimum 2 characters required" },
          })}
          error={errors.name?.message}
        />

        <div className="w-full space-y-1.5">
          <label
            htmlFor="description"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Brief overview of department scope and team objectives..."
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            {...register("description")}
          />
        </div>

        <Select
          id="isActive"
          label="Department Status *"
          options={[
            { label: "Active", value: "true" },
            { label: "Inactive (Deactivated)", value: "false" },
          ]}
          {...register("isActive")}
          error={errors.isActive?.message}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Update Department" : "Create Department"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

