import { useQuery } from "@tanstack/react-query";
import { getFiles, FileParams, presignDownload } from "@/api/file.api";

export const fileKeys = {
  all: ["files"] as const,
  lists: () => [...fileKeys.all, "list"] as const,
  list: (params: FileParams) => [...fileKeys.lists(), params] as const,
};

export const useFiles = (params: FileParams = {}) => {
  return useQuery({
    queryKey: fileKeys.list(params),
    queryFn: async () => {
      const response = await getFiles(params);
      return response.data;
    },
  });
};

export const usePresignDownload = (key: string | null) => {
  return useQuery({
    queryKey: ["presign-download", key],
    queryFn: async () => {
      const response = await presignDownload(key!);
      return response.data;
    },
    enabled: !!key,   
    staleTime: 1000 * 60 * 4, 
  });
};