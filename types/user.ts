export interface User {
  companyId: number;
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  phone: string | null;
  email: string;
  active: boolean;
  createdAt: string;
  tokenStatus: "ACTIVE" | "EXPIRED";
  tokenExpiresAt: string;

}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;  
  first: boolean;
  last: boolean;
  empty: boolean;
}
