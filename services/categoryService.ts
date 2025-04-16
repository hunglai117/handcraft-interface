import { get } from './api';

export interface Category {
  id: string;
  name: string;
  pathUrl: string;
  parents?: Category[];
  isLeaf: boolean;
  children?: Category[];
  productsCount: number;
}

interface CategoryQueryParams {
  includeChildren?: boolean;
  includeParents?: boolean;
}

const PREFIX_PATH = '/categories';

const categoryService = {
  getMenuCategories: () => get<{ categories: Category[] }>(`${PREFIX_PATH}/menu`),

  getCategoryById: (id: string, params?: CategoryQueryParams) => get<Category>(`${PREFIX_PATH}/${id}`, params),

  getCategoryBreadcrumbs: (categoryId: string) =>
    get<Category>(`${PREFIX_PATH}/${categoryId}`, { includeParents: true }),
};

export default categoryService;
