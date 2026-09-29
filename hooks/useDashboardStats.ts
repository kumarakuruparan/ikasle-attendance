"use client";

import { useQuery } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => employeeService.getDashboardStats(),
    staleTime: 30 * 1000,
  });
}
