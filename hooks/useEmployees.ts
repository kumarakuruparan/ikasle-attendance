"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  employeeService,
  EmployeeFilters,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmploymentStatus,
} from "@/services/employee.service";

export const EMPLOYEE_QUERY_KEYS = {
  all: ["employees"] as const,
  lists: () => [...EMPLOYEE_QUERY_KEYS.all, "list"] as const,
  list: (filters: EmployeeFilters) => [...EMPLOYEE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...EMPLOYEE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EMPLOYEE_QUERY_KEYS.details(), id] as const,
};

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.list(filters),
    queryFn: () => employeeService.getEmployees(filters),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeInput) => employeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.detail(data.employeeId) });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      statusData,
    }: {
      id: string;
      statusData: { isActive?: boolean; employmentStatus?: EmploymentStatus };
    }) => employeeService.updateEmployeeStatus(id, statusData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.detail(data.employeeId) });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
