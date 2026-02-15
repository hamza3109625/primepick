// activation.api.ts
import { api } from './axios';

export interface ValidateTokenResponse {
  valid: boolean;
  username?: string;
  email?: string;
  role?: string;        
  userRole?: string;    
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

/**
 * Validates an activation token
 * @param token - The JWT bearer token from the activation link
 * @returns Promise with validation result including user details and role
 */
export async function validateActivationToken(
  token: string
): Promise<ValidateTokenResponse> {
  try {
    const response = await api.get('/api/activation/validate', {
      params: { token },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to validate token';
    throw new Error(message);
  }
}

export async function setPassword(
  request: SetPasswordRequest
): Promise<SetPasswordResponse> {
  try {
    const response = await api.post('/api/activation/set-password', request);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to set password';
    throw new Error(message);
  }
}