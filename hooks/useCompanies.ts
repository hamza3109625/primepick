import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompanies, createCompany } from "@/api/company.api";

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...companyKeys.lists(), filters] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
};

// Get all companies
export const useCompanies = () => {
  return useQuery({
    queryKey: companyKeys.lists(),
    queryFn: async () => {
      const response = await getCompanies();
      return response.data.content || [];
    },
  });
};

// Create company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createCompany(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
  });
};