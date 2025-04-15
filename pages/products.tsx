import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
  materials: string[];
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Fetch products from the API
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setFilteredProducts(data.products);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.products.map((product: Product) => product.category)));
        setCategories(uniqueCategories as string[]);

        // Extract unique materials
        const allMaterials = data.products.flatMap((product: Product) => product.materials);
        const uniqueMaterials = Array.from(new Set(allMaterials));
        setMaterials(uniqueMaterials as string[]);
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply material filter
    if (selectedMaterial) {
      result = result.filter(product => product.materials.includes(selectedMaterial));
    }

    // Apply price range filter
    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Apply sorting
    if (sortOption === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'alpha-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'alpha-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'best-selling') {
      // Here you would sort by a sales metric if available
      // For now, let's use rating as a proxy
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, selectedMaterial, priceRange, sortOption]);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
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
                  {sortOption === 'price-low-high'
                    ? 'Price: Low to High'
                    : sortOption === 'price-high-low'
                      ? 'Price: High to Low'
                      : sortOption === 'rating'
                        ? 'Best Rating'
                        : sortOption === 'best-selling'
                          ? 'Best Selling'
                          : sortOption === 'alpha-asc'
                            ? 'Alphabetically: A-Z'
                            : sortOption === 'alpha-desc'
                              ? 'Alphabetically: Z-A'
                              : 'Featured'}
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
                    <button onClick={() => setSortOption('')} className="py-2 px-4 hover:bg-gray-100 text-left">
                      Featured
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOption('best-selling')}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Best Selling
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setSortOption('rating')} className="py-2 px-4 hover:bg-gray-100 text-left">
                      Best Rating
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOption('price-low-high')}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOption('price-high-low')}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Price: High to Low
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOption('alpha-asc')}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Alphabetically: A-Z
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortOption('alpha-desc')}
                      className="py-2 px-4 hover:bg-gray-100 text-left"
                    >
                      Alphabetically: Z-A
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
                      onChange={() => setSelectedCategory('')}
                      className="mr-2"
                    />
                    <label htmlFor="all-categories">All Categories</label>
                  </div>
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${index}`}
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${index}`}>{category}</label>
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
                    max="200"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="font-heading text-h3 mb-4">Materials</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all-materials"
                      name="material"
                      checked={selectedMaterial === ''}
                      onChange={() => setSelectedMaterial('')}
                      className="mr-2"
                    />
                    <label htmlFor="all-materials">All Materials</label>
                  </div>
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={`material-${index}`}
                        name="material"
                        checked={selectedMaterial === material}
                        onChange={() => setSelectedMaterial(material)}
                        className="mr-2"
                      />
                      <label htmlFor={`material-${index}`}>{material}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="w-full md:w-3/4 px-4">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      image={product.image}
                      category={product.category}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg mb-4">No products found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedMaterial('');
                      setPriceRange([0, 200]);
                    }}
                    className="btn-secondary"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button className="px-3 py-1 border border-subtle rounded-md hover:bg-subtle" disabled>
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
                    <button className="px-3 py-1 border border-primary bg-primary text-white rounded-md">1</button>
                    <button className="px-3 py-1 border border-subtle rounded-md hover:bg-subtle">2</button>
                    <button className="px-3 py-1 border border-subtle rounded-md hover:bg-subtle">3</button>
                    <span className="px-2">...</span>
                    <button className="px-3 py-1 border border-subtle rounded-md hover:bg-subtle">
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
      </section>
    </Layout>
  );
}
