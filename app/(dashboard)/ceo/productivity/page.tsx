"use client";

import React from "react";
import { TrendingUp, BarChart3, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import ProductivityChart from "@/components/reports/ProductivityChart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MOCK_PRODUCTIVITY_BY_DEPT } from "@/services/mock-data";

export default function CEOProductivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Productivity & Capacity Utilization"
        subtitle="Executive analysis comparing available workforce capacity with deep productive hours and output."
        badge="Productivity Analytics"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workforce Output Ratio
          </span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            87.4%
          </div>
          <p className="text-xs text-slate-500 mt-1">Deep work ratio vs idle hours</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Daily Productive Hours
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            6.8 hrs
          </div>
          <p className="text-xs text-slate-500 mt-1">Company-wide employee daily average</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Monthly Logged Output
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            22,480 hrs
          </div>
          <p className="text-xs text-slate-500 mt-1">+4.2% gain compared to prior month</p>
        </Card>
      </div>

      <ProductivityChart />

      <Card>
        <CardHeader>
          <CardTitle>Departmental Deep Work Comparison</CardTitle>
          <CardDescription>Productive hours logged per 8-hour expected standard shift</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {MOCK_PRODUCTIVITY_BY_DEPT.map((dept, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-[#F5FAFF] p-3.5"
              >
                <span className="text-xs font-semibold text-slate-800">
                  {dept.department}
                </span>
                <div className="text-lg font-bold text-blue-600 mt-1">
                  {dept.productive}h / {dept.expected}h
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(dept.productive / dept.expected) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 block">
                  Efficiency: {Math.round((dept.productive / dept.expected) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
