import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import { useAuth } from '../../contexts/AuthContext';
import { Product, ProductVariant } from '@/lib/types/product.type';

const ProductDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (slug) {
      fetchProduct(slug as string);
    }
  }, [slug]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      // Initialize with the first variant
      setSelectedVariant(product.variants[0]);
      setActiveImage(product.variants[0].image || product.images[0] || '');

      // Initialize selected options based on the first variant
      const initialOptions: Record<string, string> = {};
      product.variants[0].variantOptions.forEach(opt => {
        // Find the option name by ID
        const optionDef = product.options.find(o => {
          // Find the option that matches this variant option's ID
          const variantOption = product.variants[0].variantOptions.find(vo => vo.id === opt.id);
          return variantOption !== undefined;
        });

        if (optionDef) {
          initialOptions[optionDef.id] = opt.value;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  const fetchProduct = async (productSlug: string) => {
    setLoading(true);
    try {
      const data = await productService.getProductBySlug(productSlug);
      setProduct(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionId: string, value: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionId]: value,
    };
    setSelectedOptions(newSelectedOptions);

    // Find the matching variant based on selected options
    const matchingVariant = product?.variants.find(variant => {
      // Check if all selected options match this variant's options
      return Object.entries(newSelectedOptions).every(([optionId, optionValue]) => {
        const variantOption = variant.variantOptions.find(vo => {
          const option = product.options.find(o => o.id === optionId);
          return option !== undefined;
        });
        return variantOption && variantOption.value === optionValue;
      });
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      if (matchingVariant.image) {
        setActiveImage(matchingVariant.image);
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1 and not more than available stock
    const max = selectedVariant ? selectedVariant.stockQuantity : 1;
    const validQuantity = Math.max(1, Math.min(newQuantity, max));
    setQuantity(validQuantity);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }

    setAddingToCart(true);
    setError('');
    setSuccess('');

    try {
      await cartService.addToCart({
        productVariantId: selectedVariant.id,
        quantity: quantity,
      });
      setSuccess('Product added to cart!');
      setTimeout(() => setSuccess(''), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error | HandcraftBK">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>
          <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product Not Found | HandcraftBK">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.name} | HandcraftBK`}>
      <div className="container mx-auto px-4" style={{ padding: '30px 0' }}>
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-primary transition flex items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {success && (
          <div className="mb-4 bg-green-100 text-green-700 p-4 rounded flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
            <button
              onClick={() => router.push('/cart')}
              className="bg-green-700 text-white px-4 py-1 rounded hover:bg-green-800 transition"
            >
              View Cart
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={activeImage || product.images[0] || '/images/placeholder.png'}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Image Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 cursor-pointer rounded-md overflow-hidden ${
                      activeImage === image ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="hover:opacity-80 transition"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="text-sm text-gray-500 mb-4">
              Category: <span className="text-primary">{product.category.name}</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {selectedVariant ? (
                <div className="text-2xl font-bold text-primary">{formatPrice(selectedVariant.price)}</div>
              ) : product.priceMin < product.priceMax ? (
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(product.priceMin)} - {formatPrice(product.priceMax)}
                </div>
              ) : (
                <div className="text-2xl font-bold text-primary">{formatPrice(product.priceMin)}</div>
              )}
            </div>

            {/* Variant Options */}
            {product.options.length > 0 && (
              <div className="mb-6 space-y-4">
                {product.options.map(option => (
                  <div key={option.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {/* Get unique option values for this option */}
                      {Array.from(
                        new Set(
                          product.variants.map(
                            variant =>
                              variant.variantOptions.find(vo => {
                                const opt = product.options.find(o => o.id === option.id);
                                return opt !== undefined;
                              })?.value
                          )
                        )
                      ).map(value => (
                        <button
                          key={`${option.id}-${value}`}
                          className={`px-4 py-2 border rounded-md ${
                            selectedOptions[option.id] === value
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                          onClick={() => handleOptionChange(option.id, value!)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  className="w-10 h-10 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={!!selectedVariant && quantity >= (selectedVariant?.stockQuantity || 0)}
                >
                  +
                </button>

                {selectedVariant && (
                  <span className="ml-4 text-sm text-gray-500">{selectedVariant.stockQuantity} available</span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-6">
              <button
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity < 1 || addingToCart}
              >
                {addingToCart ? (
                  <>
                    <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                    Adding...
                  </>
                ) : selectedVariant && selectedVariant.stockQuantity < 1 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
