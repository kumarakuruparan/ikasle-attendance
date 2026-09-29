"use client";

import React from "react";
import { Download, BarChart4, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import AttendanceChart from "@/components/reports/AttendanceChart";
import ProductivityChart from "@/components/reports/ProductivityChart";

export default function HRReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Human Resources & Workforce Intelligence"
        subtitle="Departmental compliance ratios, average logged work hours, and productivity capacity utilization."
        action={
          <Button variant="outline" onClick={() => alert("Report generation complete. Export ready.")}>
            <Download className="h-4 w-4 mr-1.5" />
            Download Monthly Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AttendanceChart />
        <ProductivityChart />
      </div>
    </div>
  );
}
