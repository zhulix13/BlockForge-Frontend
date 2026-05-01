import axiosInstance from "../axiosInstance";
import type { Task } from "../types/task.types";
import type {
  ApiResponse,
  PaginatedResponse,
  TaskLevel,
} from "../types/shared.types";
import type { CreateTaskInput } from "../types/task.types";
export const taskApi = {
  getTasks: async (params?: {
    level?: TaskLevel;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userStatus?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Task>>
    >("/tasks", { params });
    return response.data;
  },

  getTask: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (input: CreateTaskInput) => {
    const response = await axiosInstance.post<ApiResponse<Task>>(
      "/tasks/admin",
      input,
    );
    return response.data;
  },

  getAdminTasks: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Task>>
    >("/tasks/admin/all", { params });
    return response.data;
  },

  getAdminTask: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Task>>(`/tasks/admin/${id}`);
    return response.data;
  },

  updateTask: async (id: string, input: any) => {
    const response = await axiosInstance.patch<ApiResponse<Task>>(`/tasks/admin/${id}`, input);
    return response.data;
  },
};
