import { api } from "./axios";
import { PageProductResponse, ProductResponse } from "@/types/product";

export interface GetProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
  companyId?: number;
}

export const getProducts = (params?: GetProductsParams) => {
  return api.get<PageProductResponse>("/product", { params });
};

export const getProduct = (id: number) => {
  return api.get<ProductResponse>(`/product/${id}`);
};