import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  GetProductsParams, 
  CreateProductPayload 
} from "@/api/product.api";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: GetProductsParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Get all products with pagination and filters
export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: async () => {
      const response = await getProducts(params);
      return response.data;
    },
  });
};

// Get single product by ID
export const useProduct = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await getProduct(id);
      return response.data;
    },
    enabled,
  });
};

// Create new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};