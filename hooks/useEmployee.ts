"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";
import { EMPLOYEE_QUERY_KEYS } from "./useEmployees";

export { useUpdateEmployee, useUpdateEmployeeStatus } from "./useEmployees";

export function useEmployee(id: string | undefined | null) {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.detail(id || ""),
    queryFn: () => {
      if (!id) throw new Error("Employee ID is required");
      return employeeService.getEmployeeById(id);
    },
    enabled: Boolean(id && id.trim() !== ""),
    retry: 1,
  });
}
