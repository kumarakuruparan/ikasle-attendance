"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MOCK_MONTHLY_HOURS } from "@/services/mock-data";

export default function ProductivityChart() {
  return (
    <Card className="border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Available vs Productive Hours</CardTitle>
        <CardDescription className="text-xs text-slate-500">Monthly capacity utilization and output velocity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_MONTHLY_HOURS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
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
              <Area
                type="monotone"
                dataKey="available"
                stroke="#64748b"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorAvailable)"
                name="Total Available Hours"
              />
              <Area
                type="monotone"
                dataKey="productive"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProductive)"
                name="Productive Logged Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
