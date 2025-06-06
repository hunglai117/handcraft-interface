import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBox from './SearchBox';
import { useResponsive } from '../hooks/useResponsive';
import { useRouter } from 'next/router';
import categoryService, { Category } from '@/services/categoryService';
import { useAuth } from '@/contexts/AuthContext';
import cartService from '@/services/cartService';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const { isDesktop, isMobile, mounted } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { token, logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    fetchData();
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const categoriesResponse = await categoryService.getMenuCategories();

      setMenuCategories(categoriesResponse.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setTotalCartItems(data.cartItems.length);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message || 'Failed to load cart');
      } else {
        console.log('Failed to load cart');
      }
    }
  };
  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClickItemCategory = (categoryId: string) => {
    setIsCategoryOpen(false);
    
    router.push(`/categories/${categoryId}`);
  };

  if (!mounted)
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50 h-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-container h-full">
          <div className="flex h-full items-center justify-between"></div>
        </div>
      </nav>
    );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 h-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-container h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <Image
              src="/logo.svg"
              alt="HandcraftBK  Logo"
              width={40}
              height={40}
              priority
              className="transition transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation and Icons - only render when desktop */}
          {isDesktop && (
            <div className="flex items-center w-auto md:w-2/3 lg:w-[660px] justify-end gap-8">
              {/* Desktop Navigation Links */}
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="hover:text-primary font-medium transition border-b-2 border-transparent hover:border-primary pb-1 leading-[24px]"
                >
                  Home
                </Link>
                <div
                  onClick={() => setIsCategoryOpen(prev => !prev)}
                  className={`
                            relative
                            font-medium
                            leading-6
                            cursor-pointer
                            border-b-2 border-transparent
                            text-gray-800
                            transition-colors duration-200
                            hover:text-primary hover:border-primary
                          `}
                >
                  Categories
                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 w-48">
                      <ul className="py-2">
                        {menuCategories.map(category => (
                          <li
                            key={category.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleClickItemCategory(category.id)}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Link
                  href="/about"
                  className="hover:text-primary font-medium transition border-b-2 border-transparent hover:border-primary pb-1 leading-[24px]"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-primary font-medium transition border-b-2 border-transparent hover:border-primary pb-1 leading-[24px]"
                >
                  Contact
                </Link>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={openSearch}
                  className="hover:text-primary transition cursor-pointer"
                  aria-label="Open search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 hover:text-primary transition "
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

                <Link href="/cart" className="relative">
                  <div className="indicator flex items-baseline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 group-hover:text-primary transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {totalCartItems && totalCartItems > 0 && (
                      <span className="badge badge-xs badge-primary indicator-item text-small text-white bg-primary rounded-full">
                        {totalCartItems}
                      </span>
                    )}
                  </div>
                </Link>
                <div
                  ref={dropdownRef}
                  onClick={() => setIsAccountOpen(prev => !prev)}
                  className={`
                    relative
                    cursor-pointer
                    hover:text-primary
                    transition
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 hover:text-primary transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {isAccountOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 w-48">
                      <ul className="py-2">
                        {token ? (
                          <>
                            <li className="px-4 py-2 hover:bg-gray-100">
                              <Link href="/profile" onClick={() => setIsAccountOpen(false)}>
                                Thông tin cá nhân
                              </Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100">
                              <Link href="/account/orders" onClick={() => setIsAccountOpen(false)}>
                                Thanh toán
                              </Link>
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100">
                              <button onClick={handleLogout} className="w-full text-left">
                                Đăng xuất
                              </button>
                            </li>
                          </>
                        ) : (
                          <li className="px-4 py-2 hover:bg-gray-100">
                            <Link href="/login" onClick={() => setIsAccountOpen(false)}>
                              Đăng nhập
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button - only render on mobile */}
          {isMobile && (
            <button
              className="flex items-center hover:text-primary transition ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Navigation - only render when menu is open and on mobile */}
        {isMobile && isMenuOpen && (
          <div className="bg-white py-4 border-t border-gray-100">
            {/* Mobile Search Form */}
            <div className="px-4 pb-3 pt-1">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-r-lg border border-primary"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className=" hover:text-primary px-4 py-2 hover:bg-gray-50 transition rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className=" hover:text-primary px-4 py-2 hover:bg-gray-50 transition rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className=" hover:text-primary px-4 py-2 hover:bg-gray-50 transition rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className=" hover:text-primary px-4 py-2 hover:bg-gray-50 transition rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Search Box Modal */}
      <SearchBox isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onOpen={openSearch} />
    </nav>
  );
}
