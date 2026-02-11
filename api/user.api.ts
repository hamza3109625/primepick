// api/user.api.ts
import { api } from "./axios";
import { PaginatedResponse, User } from "@/types/user";

export const getUsers = (page = 0, size = 10) => {
  return api.get<PaginatedResponse<User>>(
    `/api/admin/users/standard?page=${page}&size=${size}`,
  );
};

export interface CreateStandardUserRequest {
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email: string;
  companyId: number;
}

export interface CreateStandardUserResponse {
  userId: number;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  email: string;
  phone?: string;
  message?: string;
}

export type UserRole = "ADMIN" | "EXTERNAL_USER" | "INTERNAL_USER";

export const createStandardUser = (
  data: CreateStandardUserRequest,
  role: UserRole
) => {
  return api.post<CreateStandardUserResponse>(
    `/users/standard?role=${role}`,
    data,
  );
};