
export interface Company {
  id: number;
  name: string;
  address: string | null;
  state: string | null;
  city: string;
  country: string;
  zipCode: string | null;
  createdDate: string;
  createdBy: number | null;
  status: string;
  email: string;
}

export interface CompanyResponse {
  content: Company[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}