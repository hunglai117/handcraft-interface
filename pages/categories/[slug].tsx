import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import productService, { ProductFilters } from '@/services/productService';
import categoryService, { Category } from '@/services/categoryService';
import { ESortBy, Product } from '@/lib/types/product.type';
import Head from 'next/head';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState<ESortBy>(ESortBy.NEWEST);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const match = useMemo(() => {
    if (!slug || typeof slug !== 'string') return null;
    return slug.match(/-c(\d+)$/);
  }, [slug]);

  useEffect(() => {
    if (match && match[1]) {
      const categoryId = match[1];
      fetchCategoryAndProducts(categoryId);
    } else {
      setError('Invalid category URL');
      setIsLoading(false);
    }
  }, [match]);

  const fetchCategoryAndProducts = async (categoryId: string) => {
    try {
      setIsLoading(true);

      const categoryResponse = await categoryService.getCategoryById(categoryId);
      if (categoryResponse) {
        setCategoryData(categoryResponse);
      }

      await fetchProducts(categoryId);
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError('Failed to load category information.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async (categoryId: string, pageNumber?: number, sortOption?: ESortBy) => {
    setIsLoading(true);

    try {
      const pageToUse = pageNumber !== undefined ? pageNumber : currentPage;
      const sortBy = sortOption || sortOption;
      const filters: ProductFilters = {
        categoryId,
        page: pageToUse,
        limit: 12,
        isActive: true,
        inStock: true,
        sortBy,
      };

      // Apply price filter if set
      if (priceRange[0] > 0) {
        filters.minPrice = priceRange[0];
      }
      if (priceRange[1] < 10000000) {
        filters.maxPrice = priceRange[1];
      }

      const response = await productService.getProducts(filters);

      setProducts(response.items);
      setTotalProducts(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      if (match && match[1]) {
        const categoryId = match[1];
        fetchProducts(categoryId, page);
      }
    }
    // Scroll to top when changing page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSortChange = (option: ESortBy) => {
    setSortOption(option);
    setCurrentPage(1);

    if (match && match[1]) {
      fetchProducts(match[1], 1, option);
    }
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1);

    if (match && match[1]) {
      fetchProducts(match[1], 1);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !categoryData) {
    return (
      <Layout title="Category Not Found">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
            <p>{error || 'Category not found'}</p>
            <button onClick={() => router.push('/products')} className="mt-4 btn-primary">
              Browse All Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{categoryData.name} - HandcraftBK</title>
        <meta name="description" content={`Browse our collection of ${categoryData.name} handicraft products.`} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{categoryData.name}</h1>
          <p className="text-gray-600">{totalProducts} products found in this category</p>
        </div>

        <div className="flex flex-wrap -mx-4">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4 px-4 mb-6 md:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="font-heading text-h3 mb-4">Price Range</h2>
              <div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={e => handlePriceRangeChange(priceRange[0], parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])}
                  </span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
                  </span>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-heading text-h3 mb-4">Sort By</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-default"
                    name="sort"
                    checked={sortOption === ESortBy.TOP_SELLER}
                    onChange={() => handleSortChange(ESortBy.TOP_SELLER)}
                    className="mr-2"
                  />
                  <label htmlFor="sort-default">Top Seller</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-newest"
                    name="sort"
                    checked={sortOption === ESortBy.NEWEST}
                    onChange={() => handleSortChange(ESortBy.NEWEST)}
                    className="mr-2"
                  />
                  <label htmlFor="sort-newest">Newest Arrivals</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-asc"
                    name="sort"
                    checked={sortOption === ESortBy.PRICE_ASC}
                    onChange={() => handleSortChange(ESortBy.PRICE_ASC)}
                    className="mr-2"
                  />
                  <label htmlFor="sort-price-asc">Price: Low to High</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-price-desc"
                    name="sort"
                    checked={sortOption === ESortBy.PRICE_DESC}
                    onChange={() => handleSortChange(ESortBy.PRICE_DESC)}
                    className="mr-2"
                  />
                  <label htmlFor="sort-price-desc">Price: High to Low</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sort-popularity"
                    name="sort"
                    checked={sortOption === ESortBy.POPULARITY}
                    onChange={() => handleSortChange(ESortBy.POPULARITY)}
                    className="mr-2"
                  />
                  <label htmlFor="sort-popularity">Most Popular</label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4 px-4">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg mb-4">No products found in this category.</p>
                <button onClick={() => router.push('/products')} className="btn-secondary">
                  Browse All Products
                </button>
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && totalPages > 1 && (
              <div className="flex justify-center my-12">
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <button
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-subtle hover:bg-subtle'
                    }`}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    // Always show first page
                    const pages = [1];

                    // Add ellipsis if needed
                    if (currentPage > 3) {
                      pages.push(-1); // -1 represents an ellipsis
                    }

                    // Add pages around current page
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                      if (!pages.includes(i)) {
                        pages.push(i);
                      }
                    }

                    // Add ellipsis if needed
                    if (currentPage < totalPages - 2) {
                      pages.push(-2); // -2 represents an ellipsis
                    }

                    // Always show last page if we have more than 1 page
                    if (totalPages > 1 && !pages.includes(totalPages)) {
                      pages.push(totalPages);
                    }

                    return pages.map((page, index) => {
                      // Render ellipsis
                      if (page < 0) {
                        return (
                          <span key={page} className="px-3 py-1 text-gray-500">
                            …
                          </span>
                        );
                      }

                      // Render page number button
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === page
                              ? 'border-primary bg-primary text-white'
                              : 'border-subtle hover:bg-subtle'
                          }`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}

                  <button
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-subtle hover:bg-subtle'
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
