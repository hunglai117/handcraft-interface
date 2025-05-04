export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  currency: string;
  images: string[];
  priceMin: number;
  priceMax: number;
  variants: ProductVariant[];
  options: ProductOption[];
  purchaseCount: number;
  rating: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  sku: string;
  stockQuantity: number;
  weight: number;
  image?: string;
  variantOptions: Array<{
    id: string;
    value: string;
    orderIndex: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOption {
  id: string;
  name: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export enum ESortBy {
  NEWEST = 'newest',
  PRICE_ASC = 'price-asc',
  PRICE_DESC = 'price-desc',
  POPULARITY = 'popularity',
  TOP_SELLER = 'top-seller',
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  search?: string;
  sortBy?: ESortBy;
}
