// hooks/useUsers.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers, getUserById } from "@/api/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStandardUser,
  CreateStandardUserRequest,
  UserRole,
} from "@/api/user.api";

export const useUsers = (page: number, size = 10, companyId?: number) =>
  useQuery({
    queryKey: ["users", page, size, companyId],
    queryFn: async () => {
      const res = await getUsers(page, size, companyId);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

// Add this new hook to get a single user by ID
export const useUser = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await getUserById(userId!);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useCreateStandardUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, role }: { data: CreateStandardUserRequest; role: UserRole }) => {
      return await createStandardUser(data, role); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); 
    },
  });
};