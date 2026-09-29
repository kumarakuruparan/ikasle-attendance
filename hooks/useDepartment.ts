"use client";

import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/services/department.service";
import { DEPARTMENT_QUERY_KEYS } from "./useDepartments";

export { useUpdateDepartment, useUpdateDepartmentStatus } from "./useDepartments";

export function useDepartment(id: string | undefined | null) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(id || ""),
    queryFn: () => {
      if (!id) throw new Error("Department ID is required");
      return departmentService.getDepartmentById(id);
    },
    enabled: Boolean(id && id.trim() !== ""),
    retry: 1,
  });
}
