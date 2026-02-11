export interface LoginRequest {
  username: string;
  password: string;
  role: string;
}

interface UserProfile {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  role: string;
  active?: boolean;
  homeDir?: string;
  companyId?: number;
  permissions?: Permission[];
}

export interface LoginResponse {
  token: string;
  userProfile: UserProfile;
}

interface Permission {
 
}