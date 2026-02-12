// hooks/useUsers.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers } from "@/api/user.api";
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

export const useCreateStandardUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      role,
    }: {
      data: CreateStandardUserRequest;
      role: UserRole;
    }) => createStandardUser(data, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
