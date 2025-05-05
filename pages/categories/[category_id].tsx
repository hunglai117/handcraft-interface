import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import productService from '../../services/productService';
import { ESortBy, Product, ProductFilters } from '@/lib/types/product.type';
import categoryService, { Category } from '@/services/categoryService';

const ProductsPage = () => {
  const router = useRouter();
  const { category_id } = router.query;
  const [category, setCategory] = useState<Category>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    sortBy: ESortBy.NEWEST,
  });

  useEffect(() => {
    const { minPrice, maxPrice, search, sortBy, page = '1' } = router.query;

    const newFilters: ProductFilters = {
      page: Number(page),
      limit: 12,
      categoryId: category_id as string,
      ...(minPrice && { minPrice: Number(minPrice) }),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
      ...(search && { search: search as string }),
      ...(sortBy && { sortBy: sortBy as ESortBy }),
      inStock: true,
    };

    setFilters(newFilters);
    setPage(Number(page) || 1);
    fetchProducts(newFilters);
    fetchCategory();
  }, [router.query, category_id]);

  const fetchProducts = async (params: ProductFilters) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(params);
      setProducts(response.items);
      setTotalPages(response.totalPages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getCategoryById(category_id as string);
      setCategory(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;
    router.push({
      pathname: '/categories/[category_id]',
      query: { ...router.query, sortBy, page: 1 },
    });
  };

  const handlePriceFilterChange = (min?: number, max?: number) => {
    router.push({
      pathname: '/categories/[category_id]',
      query: {
        ...router.query,
        minPrice: min,
        maxPrice: max,
        page: 1,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push({
      pathname: '/categories/[category_id]',
      query: { ...router.query, page: newPage },
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout title="Products | HandcraftBK">
      <div className="container mx-auto px-4" style={{ padding: '30px 0' }}>
        <h1 className="text-3xl font-bold mb-8">{category?.name}</h1>
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors cursor-pointer"
            style={{ color: 'white' }}
          >
            View All Products
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-medium">
              Sort:
            </label>
            <select id="sort" value={filters.sortBy} onChange={handleSortChange} className="border rounded p-2 text-sm">
              <option value="newest" selected>
                Newest
              </option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="top-seller">Best Sellers</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', min: undefined, max: undefined },
              { label: 'Under 100K', min: 0, max: 100000 },
              { label: '100K - 300K', min: 100000, max: 300000 },
              { label: '300K - 500K', min: 300000, max: 500000 },
              { label: 'Over 500K', min: 500000, max: undefined },
            ].map((filter, idx) => {
              const isActive = filters.minPrice === filter.min && filters.maxPrice === filter.max;
              return (
                <button
                  key={idx}
                  onClick={() => handlePriceFilterChange(filter.min, filter.max)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isActive ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded text-red-700 mb-6">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-gray-600 mt-2">Please adjust the filters or try a different search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={product.images[0] || '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="transition-transform duration-200 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1 hover:text-primary transition-colors">
                        {product.category?.name}
                      </p>
                      <div className="mt-1 font-medium text-primary">
                        {product.priceMin < product.priceMax ? (
                          <>
                            {formatPrice(product.priceMin)} - {formatPrice(product.priceMax)}
                          </>
                        ) : (
                          formatPrice(product.priceMin)
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-200 hover:text-primary cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-4 py-2 rounded ${p === page ? 'bg-primary text-white' : 'border'} hover:bg-gray-200 hover:text-primary cursor-pointer`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-200 hover:text-primary cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
