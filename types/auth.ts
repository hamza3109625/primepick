export interface LoginRequest {
  username: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  userId?: string;
  id?: string;
  username: string;
  roles?: string[] | string;
  role?: string;
  mobile?: string;
}