import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import { Product } from '@/lib/types/product.type';
import Link from 'next/link';
import { createApiImageUrl, formatPriceVND } from '@/utils';

type Breadcrumb = {
  name: string;
  href: string;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    async function fetchProductData() {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch product details by slug
        const productData = await productService.getProductBySlug(slug as string);
        setProduct(productData);

        if (productData.category_id) {
          const categoryData = await categoryService.getCategoryBreadcrumbs(productData.category_id);

          if (categoryData) {
            const breadcrumbs = [...(categoryData.parents || []), categoryData].map(cat => ({
              name: cat.name,
              href: `/categories/${cat.pathUrl}`,
            }));
            setBreadcrumbs([{ name: 'Home', href: '/' }, ...breadcrumbs, { name: productData.name, href: '#' }]);
          }
        }

        if (productData.relatedProductIds && productData.relatedProductIds.length > 0) {
          const relatedData = await Promise.all(
            productData.relatedProductIds.slice(0, 4).map(id => productService.getProductById(id))
          );
          setRelatedProducts(relatedData.filter(Boolean));
        } else {
          const relatedResponse = await productService.getProducts({
            categoryId: productData.category_id,
            limit: 4,
            isActive: true,
            inStock: true,
          });
          setRelatedProducts(relatedResponse.items.filter(item => item.id !== productData.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductData();
  }, [slug]);

  const handleNextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
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

  if (error || !product) {
    return (
      <Layout title="Product Not Found">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
            <p>{error || 'Product not found'}</p>
            <div className="mt-4">
              <Link href="/products" className="btn-primary">
                Return to Shop
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedPrice = formatPriceVND(product.price);

  return (
    <Layout title={product.name}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{breadcrumb.name}</span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className="ml-1 text-sm font-medium text-primary hover:text-accent md:ml-2"
                  >
                    {breadcrumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative h-[400px] md:h-[500px] mb-4 rounded-lg overflow-hidden">
              <Image
                src={createApiImageUrl(product.images[currentImageIndex]) || 'https://placehold.co/500x500'}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white"
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 relative rounded border-2 cursor-pointer flex-shrink-0 ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      src={createApiImageUrl(image) || 'https://placehold.co/80x80'}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            {product.category && <p className="text-accent mb-2">{product.category.name}</p>}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-accent' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.reviewCount} reviews</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-sm text-gray-600">{product.purchaseCount} sold</span>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-bold text-primary">{formattedPrice}</div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Status:</span>
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stockQuantity} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              {product.sku && (
                <div className="flex items-center mt-2">
                  <span className="text-gray-700 mr-4">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {/* Specifications if available */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Specifications:</h3>
                <div className="border rounded-lg overflow-hidden">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={key} className={`flex ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-2 text-sm`}>
                      <span className="font-medium w-1/3">{key}</span>
                      <span className="w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags if available */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary py-3 px-6 flex-1 flex items-center justify-center transition-transform hover:scale-105 hover:shadow-md rounded-lg text-base font-medium">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
                <button className="btn-outline border-2 border-primary text-primary py-3 px-6 flex-1 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 ease-in-out rounded-lg text-base font-medium">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div
                  key={relatedProduct.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link href={`/product/${relatedProduct.slug}`} className="block">
                    <div className="aspect-square relative">
                      <Image
                        src={createApiImageUrl(relatedProduct.images[0]) || 'https://placehold.co/300x300'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-medium truncate">{relatedProduct.name}</h3>
                      <div className="mt-2 font-medium text-primary">{formatPriceVND(relatedProduct.price)}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
