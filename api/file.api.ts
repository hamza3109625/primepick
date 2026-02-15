import { api } from "./axios";

export interface FileItem {
  id: number;
  fileName: string;
  fileSize: string;
  filePath: string;
  fileRecords: number;
  companyName: string | null;
  companyId: number;
  productId: number;
  productName: string | null;
  fileType: "COLLECTION" | "REPORT";
  status: "UPLOADED" | "PROCESSING" | "FAILED";
  message: string | null;
  uploadDate: string; 
  uploadUserId: number; 
}

export interface FileResponse {
  content: FileItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface FileParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export const getFiles = (params: FileParams = {}) => {
  return api.get<FileResponse>("/files", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 100,
      sortBy: params.sortBy ?? "id",
      direction: params.direction ?? "asc",
    },
  });
};

export const presignDownload = (key: string) => {
  return api.get<{ url: string }>("/s3/files/presign-download", {
    params: { key },
  });
};