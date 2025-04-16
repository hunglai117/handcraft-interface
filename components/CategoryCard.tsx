import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/services/categoryService';

type CategoryCardProps = {
  category: Category;
  image?: string; // Temporary fallback until we have image fields in the API
};

export default function CategoryCard({ category, image }: CategoryCardProps) {
  const { name, pathUrl, productsCount } = category;
  const formattedProductsCount = productsCount > 999 ? '999+' : productsCount;
  const formattedName = name.length > 20 ? `${name.slice(0, 20)}...` : name;
  const formattedProductsCountText =
    productsCount > 1
      ? `${formattedProductsCount} products`
      : formattedProductsCount === 1
        ? `${formattedProductsCount} product`
        : 'No products';

  return (
    <Link href={`/categories/${pathUrl}`} className="block group">
      <div className="relative h-[320px] overflow-hidden rounded-lg">
        <Image
          src={image || 'https://placehold.co/400x400'}
          alt={formattedName}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-h3 font-bold mb-1">{formattedName}</h3>
          <p className="text-white text-opacity-80">{formattedProductsCountText}</p>
        </div>
      </div>
    </Link>
  );
}
