import { Product } from "@/lib/types/product.type";
import { get, post, put, del } from "./api";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  materials?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const PREFIX_PATH = "/products";

const productService = {
  getProducts: (filters?: ProductFilters) =>
    get<ProductsResponse>(PREFIX_PATH, filters),

  getProductById: (id: number | string) =>
    get<{ product: Product }>(`${PREFIX_PATH}/${id}`),

  getFeaturedProducts: () =>
    get<{ products: Product[] }>(`${PREFIX_PATH}/featured`),

  searchProducts: (query: string) =>
    get<ProductsResponse>(`${PREFIX_PATH}/search`, { query }),
};

export default productService;
