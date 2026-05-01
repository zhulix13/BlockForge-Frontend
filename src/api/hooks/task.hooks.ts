import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../endpoints/task.api";
import type { TaskLevel } from "../types/shared.types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { CreateTaskInput } from "../types/task.types";

export const useGetTasks = (params?: {
  level?: TaskLevel;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userStatus?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskApi.getTasks(params),
  });
};

export const useGetTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskApi.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useGetAdminTasks = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["tasks", "admin", params],
    queryFn: () => taskApi.getAdminTasks(params),
  });
};

export const useGetAdminTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", "admin", id],
    queryFn: () => taskApi.getAdminTask(id),
    enabled: !!id,
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: any }) =>
      taskApi.updateTask(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "admin", id] });
    },
  });
};
