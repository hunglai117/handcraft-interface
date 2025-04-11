import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  name: string;
  image: string;
  productCount: number;
  slug: string;
};

export default function CategoryCard({ name, image, productCount, slug }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`} className="block group">
      <div className="relative h-[320px] overflow-hidden rounded-lg">
        <Image 
          src={image} 
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-h3 font-bold mb-1">{name}</h3>
          <p className="text-white text-opacity-80">{productCount} products</p>
        </div>
      </div>
    </Link>
  );
}
