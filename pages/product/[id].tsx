import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';

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

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Mock product images
  const productImages = [
    '/images/products/product-main.jpg',
    '/images/products/product-detail-1.jpg',
    '/images/products/product-detail-2.jpg',
    '/images/products/product-detail-3.jpg',
  ];

  useEffect(() => {
    if (id) {
      // Fetch product data from API
      fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
          const foundProduct = data.products.find((p: Product) => p.id === Number(id));
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Get related products from the same category
            const related = data.products.filter((p: Product) => 
              p.category === foundProduct.category && p.id !== foundProduct.id
            ).slice(0, 4);
            
            setRelatedProducts(related);
          }
        });
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (!product) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading product details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={product.name}>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row -mx-4">
            {/* Product Images */}
            <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
              <div className="flex flex-col-reverse md:flex-row -mx-2">
                {/* Thumbnails */}
                <div className="w-full md:w-1/5 px-2 mt-4 md:mt-0">
                  <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                    {productImages.map((img, index) => (
                      <button 
                        key={index}
                        className={`border-2 ${selectedThumbnail === index ? 'border-primary' : 'border-transparent'} rounded overflow-hidden`}
                        onClick={() => setSelectedThumbnail(index)}
                        aria-label={`View product image ${index + 1}`}
                      >
                        <div className="relative w-16 h-16">
                          <Image 
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Image */}
                <div className="w-full md:w-4/5 px-2">
                  <div 
                    className="relative bg-white rounded-lg overflow-hidden cursor-crosshair"
                    style={{ height: '500px' }}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleImageZoom}
                  >
                    <Image 
                      src={productImages[selectedThumbnail]}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}
                      style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="w-full lg:w-1/2 px-4">
              <div className="bg-white rounded-lg p-6 md:p-8">
                <h1 className="font-heading text-h1 mb-2">{product.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-accent' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-small text-accent ml-2">{product.rating} (24 reviews)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                </div>

                <p className="mb-6 text-gray-600">
                  {product.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Materials:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span 
                        key={index} 
                        className="bg-subtle text-primary px-3 py-1 rounded-full text-small"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Quantity:</h3>
                  <div className="flex border border-gray-300 rounded w-fit">
                    <button 
                      className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                      onClick={decreaseQuantity}
                      aria-label="Decrease quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity} 
                      onChange={handleQuantityChange} 
                      className="w-12 text-center focus:outline-none"
                      aria-label="Quantity"
                    />
                    <button 
                      className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                      onClick={increaseQuantity}
                      aria-label="Increase quantity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                  <button className="btn-secondary flex-1">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-12">
            <div className="border-b border-subtle mb-6">
              <div className="flex overflow-x-auto">
                <button 
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'materials' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
                  onClick={() => setActiveTab('materials')}
                >
                  Materials
                </button>
                <button 
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'care' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
                  onClick={() => setActiveTab('care')}
                >
                  Care Instructions
                </button>
                <button 
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-primary'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              {activeTab === 'description' && (
                <div>
                  <h2 className="font-heading text-h3 mb-4">Product Description</h2>
                  <p className="mb-4">
                    {product.description} Our artisans spend countless hours crafting each piece to ensure exceptional quality and uniqueness.
                  </p>
                  <p>
                    This beautiful {product.name.toLowerCase()} will add charm and character to your home. Each piece tells a story and connects you to traditional craftsmanship from around the world.
                  </p>
                </div>
              )}
              
              {activeTab === 'materials' && (
                <div>
                  <h2 className="font-heading text-h3 mb-4">Materials & Construction</h2>
                  <p className="mb-4">
                    This product is lovingly made using the following materials:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    {product.materials.map((material, index) => (
                      <li key={index} className="mb-2">
                        <span className="font-medium">{material}</span> - 
                        {material === 'Rattan' && ' Sustainably harvested and known for its strength and flexibility.'}
                        {material === 'Bamboo' && ' Fast-growing and eco-friendly natural material.'}
                        {material === 'Cotton' && ' 100% natural and soft to the touch.'}
                        {material === 'Ceramic' && ' Fired at high temperatures for durability and beauty.'}
                        {material === 'Clay' && ' Hand-shaped and carefully dried before firing.'}
                        {material === 'Oak' && ' Premium hardwood known for its durability and beautiful grain patterns.'}
                        {material === 'Walnut' && ' Rich, dark wood that adds warmth and sophistication.'}
                        {material === 'Food-safe paint' && ' Non-toxic finishes that are safe for food contact.'}
                      </li>
                    ))}
                  </ul>
                  <p>All materials are ethically sourced and selected for their quality and durability.</p>
                </div>
              )}
              
              {activeTab === 'care' && (
                <div>
                  <h2 className="font-heading text-h3 mb-4">Care Instructions</h2>
                  <p className="mb-4">
                    To keep your {product.name.toLowerCase()} looking beautiful for years to come, please follow these care instructions:
                  </p>
                  <ul className="list-disc pl-5">
                    {product.category === 'Home Decor' && (
                      <>
                        <li className="mb-2">Dust regularly with a soft, dry cloth</li>
                        <li className="mb-2">Keep away from direct sunlight to prevent fading</li>
                        <li className="mb-2">Avoid placing near heat sources</li>
                      </>
                    )}
                    {product.category === 'Kitchen' && (
                      <>
                        <li className="mb-2">Hand wash with mild soap and warm water</li>
                        <li className="mb-2">Dry thoroughly after cleaning</li>
                        <li className="mb-2">Avoid harsh chemicals and abrasive cleaners</li>
                      </>
                    )}
                    {product.category === 'Wall Art' && (
                      <>
                        <li className="mb-2">Dust gently with a soft, dry cloth</li>
                        <li className="mb-2">Avoid hanging in areas with high humidity</li>
                        <li className="mb-2">Clean with a damp cloth if necessary, and dry immediately</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="font-heading text-h3 mb-4">Customer Reviews</h2>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex mr-4">
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
                    <span className="text-lg font-medium">{product.rating} out of 5</span>
                    <span className="text-gray-500 ml-2">(24 reviews)</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < 5 ? 'text-accent' : 'text-gray-300'}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-medium ml-2">Absolutely Beautiful!</h4>
                      </div>
                      <p className="text-gray-600 mb-2">This is even more beautiful in person! The craftsmanship is excellent and the materials are high quality. I've received so many compliments.</p>
                      <div className="flex items-center">
                        <span className="text-small font-medium">Jennifer L.</span>
                        <span className="text-gray-500 text-small mx-2">•</span>
                        <span className="text-gray-500 text-small">2 months ago</span>
                      </div>
                    </div>
                    
                    {/* Review 2 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < 4 ? 'text-accent' : 'text-gray-300'}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-medium ml-2">Great addition to my home</h4>
                      </div>
                      <p className="text-gray-600 mb-2">Love the unique style and how it complements my decor. Shipping was fast and it came well-packaged. Would buy from this shop again.</p>
                      <div className="flex items-center">
                        <span className="text-small font-medium">Michael R.</span>
                        <span className="text-gray-500 text-small mx-2">•</span>
                        <span className="text-gray-500 text-small">3 weeks ago</span>
                      </div>
                    </div>
                    
                    {/* Review Form */}
                    <div>
                      <h3 className="font-heading text-h3 mb-4">Write a Review</h3>
                      <form>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium" htmlFor="rating">Rating</label>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <button 
                                key={i} 
                                type="button"
                                className="focus:outline-none"
                                aria-label={`Rate ${i+1} star${i !== 0 ? 's' : ''}`}
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-6 w-6 text-gray-300 hover:text-accent" 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium" htmlFor="review-title">Review Title</label>
                          <input 
                            type="text" 
                            id="review-title" 
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Summarize your experience"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium" htmlFor="review-body">Review</label>
                          <textarea 
                            id="review-body" 
                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="What did you like or dislike about this product?"
                            rows={4}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn-primary">Submit Review</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="font-heading text-h2 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
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
            </section>
          )}
        </div>
      </section>
    </Layout>
  );
}
