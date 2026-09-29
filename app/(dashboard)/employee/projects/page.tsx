"use client";

import React, { useState } from "react";
import { FolderKanban, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_PROJECTS } from "@/services/mock-data";

export default function EmployeeProjectsPage() {
  const [activeTab, setActiveTab] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_PROJECTS.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Projects"
        subtitle="Explore active projects, track milestones, team members, and delivery timelines (Read-only view)."
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: "cards", label: "Grid" },
                { id: "table", label: "Table" },
              ]}
            />
          </div>
        }
      />

      {activeTab === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ProjectTable projects={filtered} />
        </div>
      )}
    </div>
  );
}
