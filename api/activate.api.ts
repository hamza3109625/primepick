import { api } from "./axios";

// Types
export interface ValidationResponse {
  success: boolean;
  message?: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message?: string;
}

// API functions
export const validateActivationToken = (token: string) => {
  return api.post<ValidationResponse>("/api/activation/validation", { token }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const setActivationPassword = (data: SetPasswordRequest) => {
  return api.post<SetPasswordResponse>("/api/activation/set-password", data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
};