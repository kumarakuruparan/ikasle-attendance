"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MOCK_ATTENDANCE_TREND } from "@/services/mock-data";

export default function AttendanceChart() {
  return (
    <Card className="border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Weekly Attendance Flow</CardTitle>
        <CardDescription className="text-xs text-slate-500">Daily present headcount vs late arrivals and absences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ATTENDANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  color: "#0F172A",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Bar dataKey="present" fill="#2563eb" radius={[3, 3, 0, 0]} name="Present" />
              <Bar dataKey="late" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Late" />
              <Bar dataKey="absent" fill="#ef4444" radius={[3, 3, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
