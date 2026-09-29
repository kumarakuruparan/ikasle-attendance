"use client";

import React, { useState } from "react";
import { FolderKanban, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { MOCK_PROJECTS, MOCK_COMPANY_EMPLOYEES } from "@/services/mock-data";
import type { Project } from "@/types";

export default function HRProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Developer");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Project creation fields
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newLead, setNewLead] = useState("");

  const handleAssignMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newMemberName) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              members: [
                ...p.members,
                { userId: `usr_${Date.now()}`, name: newMemberName, role: newMemberRole },
              ],
            }
          : p
      )
    );
    setSelectedProject(null);
    setNewMemberName("");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Project = {
      id: `prj_${Date.now()}`,
      title: newTitle || "New Enterprise Initiative",
      description: "Company project initiated by People & Operations.",
      department: newDept as Project["department"],
      status: "planning",
      priority: "medium",
      progressPercentage: 0,
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "2026-12-31",
      leadName: newLead || "Sarah Jenkins",
      members: [{ userId: "lead_1", name: newLead || "Sarah Jenkins", role: "Project Lead" }],
      tasksCount: { total: 0, completed: 0 },
    };
    setProjects([created, ...projects]);
    setCreateModalOpen(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Management & Team Assignment"
        subtitle="Oversee company-wide deliverables, allocate talent resources, and configure project teams."
        action={
          <div className="flex items-center gap-3">
            <Tabs
              activeTab={viewMode}
              onChange={setViewMode}
              tabs={[
                { id: "table", label: "Table" },
                { id: "grid", label: "Cards" },
              ]}
            />
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              New Project
            </Button>
          </div>
        }
      />

      {viewMode === "table" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <ProjectTable
            projects={projects}
            onManage={(p) => setSelectedProject(p)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              showAssignButton
              onSelect={(proj) => setSelectedProject(proj)}
            />
          ))}
        </div>
      )}

      {/* Member Assignment Dialog */}
      <Dialog
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={`Manage Team: ${selectedProject?.title}`}
        description="Add team members and assign responsibilities."
      >
        <form onSubmit={handleAssignMember} className="space-y-4">
          <div className="rounded-xl bg-[#F5FAFF] border border-slate-200/80 p-3.5 text-xs">
            <span className="font-semibold text-slate-800 block mb-2">
              Existing Team Members ({selectedProject?.members.length}):
            </span>
            <div className="space-y-1.5">
              {selectedProject?.members.map((m, i) => (
                <div key={i} className="flex justify-between text-slate-600">
                  <span>• {m.name}</span>
                  <span className="font-medium text-slate-800">{m.role}</span>
                </div>
              ))}
            </div>
          </div>

          <Select
            label="Assign Employee"
            id="assign-emp-select"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            options={[
              { label: "-- Select Employee to Assign --", value: "" },
              ...MOCK_COMPANY_EMPLOYEES.map((e) => ({ label: `${e.name} (${e.department})`, value: e.name })),
            ]}
          />

          <Input
            label="Designated Project Role"
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            placeholder="e.g. Lead Analyst, Reviewer"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setSelectedProject(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Assign to Team
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Project"
        description="Initialize a cross-departmental initiative."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Title"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Mobile Design System v2"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              id="new-dept-select"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              options={[
                { label: "Engineering", value: "Engineering" },
                { label: "Product", value: "Product" },
                { label: "Design", value: "Design" },
                { label: "Human Resources", value: "Human Resources" },
                { label: "Operations", value: "Operations" },
              ]}
            />
            <Input
              label="Project Lead Name"
              required
              value={newLead}
              onChange={(e) => setNewLead(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Project
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
