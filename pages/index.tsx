import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
  materials: string[];
  featured: boolean;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => {
        const featured = data.products.filter((product: Product) => product.featured);
        setFeaturedProducts(featured);
      });
  }, []);

  const nextSlide = () => {
    if (featuredProducts.length <= 3) return;
    setCurrentIndex(prevIndex => (prevIndex + 3 >= featuredProducts.length ? 0 : prevIndex + 3));
  };

  const prevSlide = () => {
    if (featuredProducts.length <= 3) return;
    setCurrentIndex(prevIndex =>
      prevIndex - 3 < 0 ? Math.floor((featuredProducts.length - 1) / 3) * 3 : prevIndex - 3
    );
  };

  const categories = [
    {
      name: 'Home Decor',
      image: '/images/insta-1.jpg',
      productCount: 24,
      slug: 'home-decor',
    },
    {
      name: 'Kitchen',
      image: '/images/insta-1.jpg',
      productCount: 18,
      slug: 'kitchen',
    },
    {
      name: 'Wall Art',
      image: '/images/insta-1.jpg',
      productCount: 12,
      slug: 'wall-art',
    },
  ];

  const testimonials = [
    {
      quote:
        "The ceramic vase I purchased is absolutely stunning. The craftsmanship is impeccable and it's become the centerpiece of my living room.",
      customerName: 'Sarah Johnson',
      location: 'New York, NY',
    },
    {
      quote:
        "I'm impressed by the quality of the handwoven baskets. They're not only beautiful but incredibly durable. Will definitely buy more!",
      customerName: 'Michael Thompson',
      location: 'Portland, OR',
    },
    {
      quote:
        'The macramé wall hanging has transformed my bedroom. The attention to detail is remarkable. So happy with my purchase!',
      customerName: 'Emily Rodriguez',
      location: 'Austin, TX',
    },
  ];

  return (
    <Layout title="Home">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.jpg"
            alt="Handcraft Products for your home"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Welcome to HandcraftBK!</h1>
            <p className="text-white text-lg mb-8">
              Discover unique handmade items created with passion and skill by artisans from around the world.
            </p>
            <Link href="/products" className="btn-primary inline-block">
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-center text-h1 mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                name={category.name}
                image={category.image}
                productCount={category.productCount}
                slug={category.slug}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-center text-h1 mb-12">Best Selling Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="relative px-8">
              {/* Carousel navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Previous products"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
                aria-label="Next products"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel container */}
              <div ref={carouselRef} className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
                >
                  {featuredProducts.map(product => (
                    <div
                      key={product.id}
                      className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 flex items-center justify-center"
                    >
                      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          rating={product.rating}
                          image={product.image}
                          category={product.category}
                          className="flex flex-col h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({
                  length: Math.ceil(featuredProducts.length / 3),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * 3)}
                    className={`w-2 h-2 rounded-full ${
                      Math.floor(currentIndex / 3) === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">Loading products...</div>
          )}

          <div className="text-center mt-10">
            <Link href="/products" className="btn-secondary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-10 bg-subtle">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-col">
            <h2 className="font-heading text-h1 mb-6">Our Story</h2>
            <p className="mb-4 text-center">
              We started HandcraftBK with a simple mission: to celebrate and share the beauty of handmade crafts with
              the world while supporting skilled artisans. Each item in our collection is carefully selected for its
              quality, uniqueness, and the story behind it. We work directly with artisans to ensure fair compensation
              and sustainable practices.
            </p>
            <Link href="/about" className="btn-text">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-center text-h1 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                customerName={testimonial.customerName}
                location={testimonial.location}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed & Newsletter */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Instagram Feed */}
            <div>
              <h2 className="font-heading text-h2 mb-6">Follow Us on Instagram</h2>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(item => (
                  <div key={item} className="relative aspect-square">
                    <Image
                      src={`/images/insta-${item}.jpg`}
                      alt="Instagram post"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 16vw"
                    />
                  </div>
                ))}
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-text block mt-4 text-center"
              >
                @handcraft_bk
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-white p-8 rounded-lg">
              <h2 className="font-heading text-h2 mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-6">Be the first to know about new arrivals, special offers, and artisan stories.</p>
              <form className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 flex-grow border border-subtle rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-r font-medium hover:bg-accent mt-2 sm:mt-0"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-small text-gray-500 mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
