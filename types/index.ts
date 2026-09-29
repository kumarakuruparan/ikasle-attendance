export * from './auth';
/**
 * IKASLE Enterprise Office Management Platform
 * Complete Type Definitions
 */

export type UserRole = "employee" | "hr" | "ceo";

export type Department =
  | "Engineering"
  | "Product"
  | "Design"
  | "Human Resources"
  | "Operations"
  | "Marketing"
  | "Executive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  designation: string;
  avatarUrl?: string;
  employeeId: string;
  joiningDate: string;
  reportingManager?: string;
  phone?: string;
}

// Attendance Types
export type AttendanceStatus = "present" | "absent" | "late" | "on_leave" | "on_permission" | "half_day";

export interface CheckInDetails {
  timestamp: string;
  gpsVerified: boolean;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  deviceInfo?: string;
}

export type BreakType = "morning" | "lunch" | "evening";

export interface BreakRecord {
  id: string;
  type: BreakType;
  title: string;
  allowedMinutes: number;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  status: "idle" | "active" | "completed";
}

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workingHours: number; // e.g. 7.5
  productiveHours: number;
  breakDurationMinutes: number;
  locationStatus: "office_verified" | "remote_approved" | "unverified";
  notes?: string;
}

export interface WorkingHoursSummary {
  expectedHours: number; // usually 8.0 or 9.0 including breaks
  loggedHours: number;
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
}

// Projects & Tasks Types
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type PriorityLevel = "low" | "medium" | "high" | "critical";

export interface ProjectMember {
  userId: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  department: Department;
  status: ProjectStatus;
  priority: PriorityLevel;
  progressPercentage: number;
  startDate: string;
  dueDate: string;
  leadName: string;
  members: ProjectMember[];
  budgetSpent?: number;
  tasksCount: {
    total: number;
    completed: number;
  };
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assignedTo: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
}

// Daily Work Report Types
export interface DailyWorkReportItem {
  id: string;
  projectId: string;
  projectName: string;
  taskTitle: string;
  hoursSpent: number;
  description: string;
  status: TaskStatus;
}

export interface DailyWorkReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  items: DailyWorkReportItem[];
  totalHours: number;
  submissionTime: string;
  managerNotes?: string;
  status: "draft" | "submitted" | "approved" | "needs_revision";
}

// Leave & Permission Types
export type LeaveType = "sick" | "casual" | "annual" | "unpaid";

export interface LeaveBalance {
  sickLeave: {
    totalPerYear: number;
    used: number;
    remaining: number;
    monthlyAllowance: number; // Rule: 1 per month
  };
  casualLeave: {
    totalPerYear: number;
    used: number;
    remaining: number;
  };
  annualLeave: {
    totalPerYear: number;
    used: number;
    remaining: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface PermissionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string;
  startTime: string; // e.g. "14:00"
  endTime: string;   // e.g. "16:00"
  durationHours: number; // Maximum 4 hours allowed
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedBy?: string;
}

// Executive & Analytics Summary Types
export interface ExecutiveMetrics {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  onPermissionToday: number;
  lateArrivalsToday: number;
  attendancePercentage: number;
  activeProjects: number;
  avgProductiveHours: number;
  dailyReportSubmissionRate: number;
}
