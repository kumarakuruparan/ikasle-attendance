import { apiClient } from './api';

export type Role = 'EMPLOYEE' | 'HR' | 'CEO';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  clerkUserId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: Role;
  jobTitle: string | null;
  departmentId: string | null;
  departmentName: string | null;
  department?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  role?: Role;
  status?: EmploymentStatus;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  role?: Role;
  jobTitle?: string | null;
  departmentId?: string | null;
  joiningDate?: string;
  employmentStatus?: EmploymentStatus;
  isActive?: boolean;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  profileImage?: string | null;
  role?: Role;
  jobTitle?: string | null;
  departmentId?: string | null;
  joiningDate?: string;
  employmentStatus?: EmploymentStatus;
  isActive?: boolean;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCount: number;
  departmentOverview: Array<{
    id: string;
    name: string;
    employeeCount: number;
  }>;
}

export const employeeService = {
  async getEmployees(filters: EmployeeFilters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.departmentId && filters.departmentId !== 'all') params.append('departmentId', filters.departmentId);
    if (filters.role && filters.role !== ('all' as unknown)) params.append('role', filters.role);
    if (filters.status && filters.status !== ('all' as unknown)) params.append('status', filters.status);
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<Employee[]>(`/employees${query}`);
    return {
      employees: res.data || [],
      pagination: res.meta || { total: res.data?.length || 0, page: 1, limit: 50, totalPages: 1 },
    };
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const res = await apiClient<Employee>(`/employees/${id}`);
    if (!res.data) throw new Error('Employee not found');
    return res.data;
  },

  async createEmployee(data: CreateEmployeeInput): Promise<Employee> {
    const res = await apiClient<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.data) throw new Error('Failed to create employee');
    return res.data;
  },

  async updateEmployee(id: string, data: UpdateEmployeeInput): Promise<Employee> {
    const res = await apiClient<Employee>(`/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.data) throw new Error('Failed to update employee');
    return res.data;
  },

  async updateEmployeeStatus(
    id: string,
    statusData: { isActive?: boolean; employmentStatus?: EmploymentStatus }
  ): Promise<Employee> {
    const res = await apiClient<Employee>(`/employees/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
    if (!res.data) throw new Error('Failed to update employee status');
    return res.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient<DashboardStats>('/employees/dashboard/stats');
    if (!res.data) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        departmentCount: 0,
        departmentOverview: [],
      };
    }
    return res.data;
  },

  async getSelfProfile(token?: string | null): Promise<Employee> {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await apiClient<Employee>('/me', { headers });
    if (!res.data) throw new Error('Failed to load profile');
    return res.data;
  },

  async updateSelfProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    profileImage?: string | null;
  }): Promise<Employee> {
    const res = await apiClient<Employee>('/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.data) throw new Error('Failed to update profile');
    return res.data;
  },
};

