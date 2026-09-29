"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function HRSettingsPage() {
  const [officeStartTime, setOfficeStartTime] = useState("09:00");
  const [officeEndTime, setOfficeEndTime] = useState("18:00");
  const [graceMinutes, setGraceMinutes] = useState("15");
  const [geoRadius, setGeoRadius] = useState("100");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workplace & Attendance Policy Settings"
        subtitle="Configure official office operating hours, grace intervals, and presence verification thresholds."
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Workplace policy configuration updated successfully!</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Core Office Hours & Shift Timing</CardTitle>
          <CardDescription>Applied to all standard full-time employee contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Standard Shift Start Time"
                type="time"
                value={officeStartTime}
                onChange={(e) => setOfficeStartTime(e.target.value)}
              />
              <Input
                label="Standard Shift End Time"
                type="time"
                value={officeEndTime}
                onChange={(e) => setOfficeEndTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Arrival Grace Period (Minutes)"
                type="number"
                value={graceMinutes}
                onChange={(e) => setGraceMinutes(e.target.value)}
                helperText="Arrival after this period is flagged as late."
              />
              <Input
                label="Office Geo-Fence Radius (Meters)"
                type="number"
                value={geoRadius}
                onChange={(e) => setGeoRadius(e.target.value)}
                helperText="Maximum allowed distance from designated corporate campus."
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary">
                <Save className="h-4 w-4 mr-1.5" />
                Save Policy Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
