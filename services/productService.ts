import { ESortBy, Product } from '@/lib/types/product.type';
import { get } from './api';

interface PaginatedProductResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  inStock?: boolean;
  search?: string;
  sortBy?: ESortBy;
  page?: number;
  limit?: number;
}

const PREFIX_PATH = '/products';

const productService = {
  getProducts: (filters?: ProductFilters) => get<PaginatedProductResponse>(PREFIX_PATH, filters),

  getProductBySlug: (slug: string) => get<Product>(`${PREFIX_PATH}/slug/${slug}`),

  getProductById: (id: string) => get<Product>(`${PREFIX_PATH}/${id}`),
};

export default productService;
