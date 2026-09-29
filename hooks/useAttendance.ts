"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  attendanceService,
  GPSCoordinates,
  BreakType,
  AttendanceHistoryFilters,
  AllAttendanceFilters,
} from "@/services/attendance.service";

export const ATTENDANCE_QUERY_KEYS = {
  all: ["attendance"] as const,
  today: () => [...ATTENDANCE_QUERY_KEYS.all, "today"] as const,
  history: (filters: AttendanceHistoryFilters) =>
    [...ATTENDANCE_QUERY_KEYS.all, "history", filters] as const,
  list: (filters: AllAttendanceFilters) =>
    [...ATTENDANCE_QUERY_KEYS.all, "all", filters] as const,
  stats: (date?: string) =>
    [...ATTENDANCE_QUERY_KEYS.all, "stats", date || "today"] as const,
  settings: () => [...ATTENDANCE_QUERY_KEYS.all, "settings"] as const,
};

export function useTodayAttendance() {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.today(),
    queryFn: () => attendanceService.getTodayAttendance(),
    refetchInterval: (query) => {
      // Auto-poll every 30s while checked in and not checked out
      const record = query.state.data?.attendance;
      if (record && !record.checkOutAt) return 30000;
      return false;
    },
  });
}

export function useAttendanceHistory(filters: AttendanceHistoryFilters = {}) {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.history(filters),
    queryFn: () => attendanceService.getAttendanceHistory(filters),
  });
}

export function useAllAttendance(filters: AllAttendanceFilters = {}) {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.list(filters),
    queryFn: () => attendanceService.getAllAttendance(filters),
  });
}

export function useAttendanceStats(date?: string) {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEYS.stats(date),
    queryFn: () => attendanceService.getAttendanceStats(date),
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coords: GPSCoordinates) => attendanceService.checkIn(coords),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coords: GPSCoordinates) => attendanceService.checkOut(coords),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useStartBreak() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type?: BreakType) => attendanceService.startBreak(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.today() });
    },
  });
}

export function useEndBreak() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => attendanceService.endBreak(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.today() });
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEYS.all });
    },
  });
}
