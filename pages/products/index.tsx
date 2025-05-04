import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import productService, { ESortBy, Product, ProductFilters } from '../../services/productService';

const ProductsPage = () => {
  const router = useRouter();
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
    // Extract query parameters from URL
    const { categoryId, minPrice, maxPrice, inStock, search, sortBy, page = '1' } = router.query;

    // Update filters based on URL parameters
    const newFilters: ProductFilters = {
      page: Number(page),
      limit: 12,
      ...(categoryId && { categoryId: categoryId as string }),
      ...(minPrice && { minPrice: Number(minPrice) }),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
      ...(inStock === 'true' && { inStock: true }),
      ...(search && { search: search as string }),
      ...(sortBy && { sortBy: sortBy as ESortBy }),
    };

    setFilters(newFilters);
    setPage(Number(page) || 1);

    fetchProducts(newFilters);
  }, [router.query]);

  const fetchProducts = async (params: ProductFilters) => {
    setLoading(true);
    try {
      const response = await productService.getProducts(params);
      setProducts(response.items);
      setTotalPages(response.totalPages);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;
    router.push({
      pathname: '/products',
      query: { ...router.query, sortBy, page: 1 },
    });
  };

  const handlePriceFilterChange = (min?: number, max?: number) => {
    router.push({
      pathname: '/products',
      query: {
        ...router.query,
        ...(min !== undefined && { minPrice: min }),
        ...(max !== undefined && { maxPrice: max }),
        page: 1,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    router.push({
      pathname: '/products',
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Handcrafted Products</h1>

        {/* Filters and Sorting */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded p-2"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
                <option value="top-seller">Top Sellers</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handlePriceFilterChange(undefined, undefined)}
                className={`px-3 py-1 rounded ${!filters.minPrice && !filters.maxPrice ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                All
              </button>
              <button
                onClick={() => handlePriceFilterChange(0, 100000)}
                className={`px-3 py-1 rounded ${filters.maxPrice === 100000 ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Under 100K
              </button>
              <button
                onClick={() => handlePriceFilterChange(100000, 300000)}
                className={`px-3 py-1 rounded ${filters.minPrice === 100000 && filters.maxPrice === 300000 ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                100K - 300K
              </button>
              <button
                onClick={() => handlePriceFilterChange(300000, 500000)}
                className={`px-3 py-1 rounded ${filters.minPrice === 300000 && filters.maxPrice === 500000 ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                300K - 500K
              </button>
              <button
                onClick={() => handlePriceFilterChange(500000, undefined)}
                className={`px-3 py-1 rounded ${filters.minPrice === 500000 && !filters.maxPrice ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Over 500K
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded text-red-700 mb-6">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-gray-600 mt-2">Try changing your filters or search terms.</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.images[0] || '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-gray-700 mb-2 line-clamp-1">{product.category.name}</p>
                      {product.priceMin < product.priceMax ? (
                        <p className="font-semibold">
                          {formatPrice(product.priceMin)} - {formatPrice(product.priceMax)}
                        </p>
                      ) : (
                        <p className="font-semibold">{formatPrice(product.priceMin)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded border disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-4 py-2 rounded ${p === page ? 'bg-primary text-white' : 'border'}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded border disabled:opacity-50"
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
