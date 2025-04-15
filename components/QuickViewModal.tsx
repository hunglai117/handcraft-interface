import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

type QuickViewModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Reset quantity when modal opens with a new product
    if (isOpen) {
      setQuantity(1);
    }

    // Add/remove body scroll lock
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button onClick={onClose} className="text-gray-500 hover:text-primary" aria-label="Close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
            {/* Product Image */}
            <div className="relative h-[350px]">
              <Image
                src={product.image || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Product Details */}
            <div>
              <span className="text-accent text-small mb-1 block">{product.category}</span>
              <h2 className="font-heading text-h2 mb-2">{product.name}</h2>

              <div className="flex items-center mb-4">
                <div className="flex mr-2">
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
                </div>
                <span className="text-small text-gray-500">({product.rating})</span>
              </div>

              <p className="text-2xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>

              <div className="mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Materials:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span key={index} className="bg-subtle text-primary px-3 py-1 rounded-full text-small">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center py-1">{quantity}</span>
                  <button
                    className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                    onClick={increaseQuantity}
                    aria-label="Increase quantity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary flex-1 flex items-center justify-center">
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
                <Link href={`/product/${product.id}`} className="btn-secondary flex-1 text-center">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
