import { apiClient } from './api';


export interface Department {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDetail extends Department {
  users: Array<{
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    jobTitle: string | null;
    role: string;
    isActive: boolean;
    employmentStatus: string;
    profileImage: string | null;
    joiningDate: string;
  }>;
}

export interface CreateDepartmentInput {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateDepartmentInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export const departmentService = {
  async getDepartments(filters: { search?: string; isActive?: boolean } = {}): Promise<Department[]> {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient<Department[]>(`/departments${query}`);
    return res.data || [];
  },

  async getDepartmentById(id: string): Promise<DepartmentDetail> {
    const res = await apiClient<DepartmentDetail>(`/departments/${id}`);
    if (!res.data) throw new Error('Department not found');
    return res.data;
  },

  async createDepartment(data: CreateDepartmentInput): Promise<Department> {
    const res = await apiClient<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.data) throw new Error('Failed to create department');
    return res.data;
  },

  async updateDepartment(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const res = await apiClient<Department>(`/departments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!res.data) throw new Error('Failed to update department');
    return res.data;
  },

  async updateDepartmentStatus(id: string, isActive: boolean): Promise<Department> {
    const res = await apiClient<Department>(`/departments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
    if (!res.data) throw new Error('Failed to update department status');
    return res.data;
  },

  async deleteDepartment(id: string): Promise<{ id: string; message: string }> {
    const res = await apiClient<{ id: string; message: string }>(`/departments/${id}`, {
      method: 'DELETE',
    });
    return res.data || { id, message: 'Department deleted successfully' };
  },
};

