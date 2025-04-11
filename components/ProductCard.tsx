import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category?: string;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  rating,
  image,
  category,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`product-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden flex-grow">
        <Link href={`/product/${id}`} className="block h-full">
          <div className="w-full h-[270px] relative">
            <Image
              src={image || "https://placehold.co/280x280"}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover transition-transform duration-300 ease-in-out"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
          </div>

          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black opacity-30 transition-opacity duration-300"></div>
          )}
        </Link>

        <button
          className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors duration-200 cursor-pointer"
          aria-label="Add to cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          {category && (
            <span className="text-accent text-small mb-1 block">
              {category}
            </span>
          )}
          <h3 className="font-medium mb-1 line-clamp-2 overflow-hidden text-ellipsis">
            <Link
              href={`/product/${id}`}
              className="hover:text-primary truncate block"
            >
              {name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">${price.toFixed(2)}</span>

          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? "text-accent" : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-small ml-1">({rating})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
