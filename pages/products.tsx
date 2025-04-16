import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import productService, { ProductFilters } from '@/services/productService';
import categoryService, { Category } from '@/services/categoryService';
import { ESortBy, Product } from '@/lib/types/product.type';

export default function Shop() {
  const router = useRouter();
  const { categoryId: queryCategoryId, search: querySearch } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortOption, setSortOption] = useState<ESortBy>(ESortBy.NEWEST);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const productsPerPage = 12;

  useEffect(() => {
    // If there's a category ID or search term in the query, set it as the initial value
    if (queryCategoryId && typeof queryCategoryId === 'string') {
      setSelectedCategory(queryCategoryId);
    }

    if (querySearch && typeof querySearch === 'string') {
      setSearchQuery(querySearch);
    }
  }, [queryCategoryId, querySearch]);

  useEffect(() => {
    // Fetch menu categories
    const fetchCategories = async () => {
      try {
        const categoryResponse = await categoryService.getMenuCategories();
        setCategories(categoryResponse.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const filters: ProductFilters = {
          page: currentPage,
          limit: productsPerPage,
          isActive: true,
          inStock: true,
          sortBy: sortOption,
        };

        // Apply category filter
        if (selectedCategory) {
          filters.categoryId = selectedCategory;
        }

        // Apply search query filter
        if (searchQuery) {
          filters.search = searchQuery;
        }

        // Apply price range filter
        if (priceRange[0] > 0) {
          filters.minPrice = priceRange[0];
        }
        if (priceRange[1] < 10000000) {
          filters.maxPrice = priceRange[1];
        }

        // Fetch products with filters
        const response = await productService.getProducts(filters);

        setProducts(response.items);
        setFilteredProducts(response.items);
        setTotalProducts(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, priceRange, sortOption, currentPage, searchQuery]);

  // Collect all unique tags from products
  useEffect(() => {
    if (products.length > 0) {
      const allTags = products.flatMap(product => product.tags || []);
      const uniqueTags = Array.from(new Set(allTags));
      setTags(uniqueTags);
    }
  }, [products]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleSortChange = (sortOption: ESortBy) => {
    setSortOption(sortOption);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      // The fetchProducts call is already triggered by the useEffect watching currentPage
    }
    // Scroll to top when changing page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setPriceRange([0, 10000000]);
    setSortOption(ESortBy.NEWEST);
    setCurrentPage(1);
    setSearchQuery('');
  };

  return (
    <Layout title="Shop">
      {/* Shop Header */}
      <section className="bg-subtle py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-h1 text-center mb-4">Shop Our Collection</h1>
          <p className="text-center max-w-xl mx-auto">
            Discover our carefully curated selection of handcrafted products.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-subtle rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setCurrentPage(1)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <button className="md:hidden flex items-center text-primary font-medium" onClick={toggleMobileFilter}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter Products
            </button>

            <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-end ml-auto">
              <span className="mr-2 text-gray-700 hidden md:inline-block">Sort by:</span>
              <div className="dropdown dropdown-end w-full md:w-56">
                <label
                  tabIndex={0}
                  className="flex justify-between items-center w-full px-3 py-3 border border-gray-300 rounded cursor-pointer hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <span className="text-gray-700">
                    {sortOption === ESortBy.TOP_SELLER
                      ? 'Best Selling'
                      : sortOption === ESortBy.NEWEST
                        ? 'Newest Arrivals'
                        : sortOption === ESortBy.PRICE_ASC
                          ? 'Price: Low to High'
                          : sortOption === ESortBy.PRICE_DESC
                            ? 'Price: High to Low'
                            : sortOption === ESortBy.POPULARITY
                              ? 'Most Popular'
                              : 'Select Sort Option'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-md bg-white rounded-md w-full mt-1 z-[1]">
                  <li>
                    <button
                      onClick={() => handleSortChange(ESortBy.TOP_SELLER)}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Best Selling
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSortChange(ESortBy.NEWEST)}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Newest Arrivals
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSortChange(ESortBy.PRICE_ASC)}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSortChange(ESortBy.PRICE_DESC)}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Price: High to Low
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleSortChange(ESortBy.POPULARITY)}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Most Popular
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            {/* Filter Sidebar - Desktop */}
            <div className={`w-full md:w-1/4 px-4 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="font-heading text-h3 mb-4">Categories</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all-categories"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => handleCategoryChange('')}
                      className="mr-2"
                    />
                    <label htmlFor="all-categories">All Categories</label>
                  </div>
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.id}`}>{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="font-heading text-h3 mb-4">Price Range</h2>
                <div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={e => handlePriceChange(priceRange[0], parseInt(e.target.value))}
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

              {tags.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="font-heading text-h3 mb-4">Tags</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all-tags"
                        name="tag"
                        checked={selectedTag === ''}
                        onChange={() => handleTagChange('')}
                        className="mr-2"
                      />
                      <label htmlFor="all-tags">All Tags</label>
                    </div>
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`tag-${index}`}
                          name="tag"
                          checked={selectedTag === tag}
                          onChange={() => handleTagChange(tag)}
                          className="mr-2"
                        />
                        <label htmlFor={`tag-${index}`}>{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="w-full md:w-3/4 px-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg mb-4">No products found matching your filters.</p>
                  <button onClick={clearAllFilters} className="btn-secondary">
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-12">
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
              <p className="text-gray-600">{totalProducts} products found in this category</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
