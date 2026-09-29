"use client";

import React from "react";
import { Download, FileText, BarChart4, TrendingUp, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import AttendanceChart from "@/components/reports/AttendanceChart";
import ProductivityChart from "@/components/reports/ProductivityChart";

export default function CEOReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Strategic Reports & Audits"
        subtitle="Quarterly performance synthesis, headcount efficiency summaries, and institutional audit data."
        badge="Executive Briefing"
        action={
          <Button variant="primary" onClick={() => alert("Board Report briefing packet downloaded.")}>
            <Download className="h-4 w-4 mr-1.5" />
            Download Board Briefing (PDF)
          </Button>
        }
      />

      {/* Executive Key Takeaways Banner */}
      <div className="rounded-xl border border-blue-100 bg-[#F5FAFF] p-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Q3 Performance Highlights
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Workforce presence reached 90.5% with productive hours remaining consistent at 6.8h per employee day. Daily work report submission compliance exceeded 94%, ensuring strong deliverable accountability across cross-functional engineering and product initiatives.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <ProductivityChart />
      </div>
    </div>
  );
}
