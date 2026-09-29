"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  departmentService,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/services/department.service";

export const DEPARTMENT_QUERY_KEYS = {
  all: ["departments"] as const,
  lists: () => [...DEPARTMENT_QUERY_KEYS.all, "list"] as const,
  list: (filters?: { search?: string; isActive?: boolean }) =>
    [...DEPARTMENT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...DEPARTMENT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DEPARTMENT_QUERY_KEYS.details(), id] as const,
};

export function useDepartments(filters?: { search?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list(filters),
    queryFn: () => departmentService.getDepartments(filters),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentInput) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentInput }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateDepartmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      departmentService.updateDepartmentStatus(id, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
