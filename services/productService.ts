import { PaginatedProducts, Product, ProductFilters } from '@/lib/types/product.type';
import { get } from './api';

const PREFIX_PATH = '/products';

const productService = {
  // Get product listings with optional filtering
  getProducts: (params: ProductFilters = {}) => get<PaginatedProducts>(`${PREFIX_PATH}`, params),

  // Get a specific product by slug
  getProductBySlug: (slug: string) => get<Product>(`${PREFIX_PATH}/slug/${slug}`),

  // Get a specific product by ID
  getProductById: (id: string) => get<Product>(`${PREFIX_PATH}/${id}`),

  // Get multiple products by their IDs
  getProductsByIds: (productIds: string[]) =>
    get<Record<string, Product | null>>(`${PREFIX_PATH}/by-ids`, { productIds: productIds.join(',') }),
};

export default productService;
