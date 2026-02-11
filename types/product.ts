export interface ProductResponse {
  id: number;
  companyId: number;
  name: string;
  description: string;
  shortCode: string;
  longCode: string;
  createDate: string; 
  createdBy: number;
  status: string;
}

export interface PageProductResponse {
  content: ProductResponse[];
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
  totalPages: number;
  totalElements: number;
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