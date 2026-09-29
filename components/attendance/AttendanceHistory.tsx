"use client";

import React, { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAttendanceHistory } from "@/hooks/useAttendance";

export default function AttendanceHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAttendanceHistory({ page, limit: 10 });

  const records = data?.records || [];
  const pagination = data?.pagination;

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            My Attendance History
          </CardTitle>
          <span className="text-xs text-slate-400">
            Total records: {pagination?.total ?? 0}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Loading attendance records...
          </div>
        )}

        {isError && (
          <div className="py-8 text-center text-xs text-rose-500">
            {error instanceof Error ? error.message : "Failed to load attendance history."}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !isError && records.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400">
            No attendance records logged yet. Your checked-in shifts will appear here.
          </div>
        )}

        {!isLoading && !isError && records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Clock In</th>
                  <th className="pb-3 font-semibold">Clock Out</th>
                  <th className="pb-3 font-semibold">Break Duration</th>
                  <th className="pb-3 font-semibold">Working Hours</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {new Date(rec.date).toLocaleDateString([], {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {new Date(rec.checkInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {rec.checkOutAt
                        ? new Date(rec.checkOutAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "Active"}
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {rec.totalBreakMinutes} min
                    </td>
                    <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {(rec.totalWorkingMinutes / 60).toFixed(1)} hrs
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          rec.status === "COMPLETED"
                            ? "success"
                            : rec.status === "PRESENT"
                            ? "info"
                            : "destructive"
                        }
                      >
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
