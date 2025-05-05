import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types/product.type';
import { formatPriceVND } from '@/utils';

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { name, slug, priceMin, priceMax, rating, images, category } = product;

  const [isHovered, setIsHovered] = useState(false);

  const displayImage = images && images.length > 0 ? images[0] : 'https://placehold.co/280x280';

  const hasPriceRange = priceMin !== priceMax;
  const priceDisplay = hasPriceRange
    ? `${formatPriceVND(priceMin.toLocaleString())} - ${formatPriceVND(priceMax.toLocaleString())}`
    : formatPriceVND(priceMin.toLocaleString());

  return (
    <div
      className={`group border rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[350px]">
        <Link href={`/product/${slug}`}>
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          {isHovered && <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />}
        </Link>

        <button
          className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors duration-200 cursor-pointer z-10"
          aria-label="Add to cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between gap-2">
        {category && <span className="text-accent text-xs uppercase">{category.name}</span>}
        <h3 className="font-semibold text-base line-clamp-2">
          <Link href={`/product/${slug}`} className="hover:text-primary">
            {name}
          </Link>
        </h3>

        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-primary">{priceDisplay}</span>

          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">({rating.toFixed(1)})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
