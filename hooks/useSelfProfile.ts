"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.service";

export function useSelfProfile() {
  return useQuery({
    queryKey: ["selfProfile"],
    queryFn: () => employeeService.getSelfProfile(),
    staleTime: 60 * 1000,
  });
}

export function useUpdateSelfProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      profileImage?: string | null;
    }) => employeeService.updateSelfProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["selfProfile"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
