"use client";

import React from "react";
import { FolderKanban, CheckSquare, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { MOCK_PROJECTS } from "@/services/mock-data";

export default function CEOProjectsPage() {
  const totalBudget = MOCK_PROJECTS.reduce((acc, p) => acc + (p.budgetSpent || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategic Initiatives & Milestone Velocity"
        subtitle="Portfolio tracking of high-impact corporate deliverables, roadmap health, and department accountability."
        badge="Executive Portfolio"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Initiatives
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {MOCK_PROJECTS.length} Key Projects
          </div>
          <p className="text-xs text-slate-500 mt-1">3 active, 1 completed</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Portfolio Progress
          </span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            66.2%
          </div>
          <p className="text-xs text-slate-500 mt-1">Weighted completion across all deliverables</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Capital Allocated
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">Operating expenditure tracked</p>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <ProjectTable projects={MOCK_PROJECTS} />
      </div>
    </div>
  );
}
