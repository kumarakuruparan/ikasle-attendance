"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  Calendar,
  Briefcase,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  RotateCw,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useSelfProfile, useUpdateSelfProfile } from "@/hooks/useSelfProfile";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EmployeeProfilePage() {
  const {
    data: employee,
    isLoading,
    isError,
    error,
    refetch,
  } = useSelfProfile();

  const updateProfileMutation = useUpdateSelfProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        phone: employee.phone || "",
        profileImage: employee.profileImage || "",
      });
    }
  }, [employee, reset]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await updateProfileMutation.mutateAsync(data);
      showNotification("Your profile has been successfully updated.");
      reset({
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone || "",
        profileImage: updated.profileImage || "",
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update profile");
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
    return (
      <div className="py-16 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Profile Unavailable</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {error instanceof Error ? error.message : "Failed to load employee profile"}
        </p>
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, view assigned department, and review account permissions."
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Profile Overview Banner */}
      <Card className="overflow-hidden border-blue-100 dark:border-slate-800">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-20" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-tr from-blue-700 to-indigo-700 text-2xl font-black text-white shadow-xl dark:border-slate-900">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
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
                  {employee.jobTitle || "Team Member"} • {employee.departmentName || "Unassigned"}
                </p>
              </div>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {employee.role}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editable Personal Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-blue-500" />
                Personal Details
              </CardTitle>
              <CardDescription className="text-xs">
                You can update your personal display name, contact phone, and profile avatar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    placeholder="e.g. Jane"
                    {...register("firstName")}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name *"
                    placeholder="e.g. Doe"
                    {...register("lastName")}
                    error={errors.lastName?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="e.g. +1 (555) 000-0000"
                    {...register("phone")}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Profile Image URL"
                    placeholder="https://..."
                    {...register("profileImage")}
                    error={errors.profileImage?.message}
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!isDirty || updateProfileMutation.isPending}
                    isLoading={updateProfileMutation.isPending}
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Read-Only Organizational Attributes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Company Records
              </CardTitle>
              <CardDescription className="text-xs">
                Official employment attributes configured and managed by HR operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {employee.employeeId}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.email}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.departmentName || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Job Title</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.jobTitle || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Role</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {employee.role}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Joining Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
