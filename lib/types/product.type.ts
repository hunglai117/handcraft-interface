import { Category } from '@/services/categoryService';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  category?: Category;
  price: string;
  originalPrice?: string;
  currency: string;
  stockQuantity: number;
  sku: string;
  images: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  isActive: boolean;
  relatedProductIds?: string[];
  rating: number;
  reviewCount: number;
  purchaseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductResponseDto {
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
