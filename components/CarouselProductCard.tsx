import React from 'react';
import ProductCard from './ProductCard';

type CarouselProductCardProps = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
};

export default function CarouselProductCard(props: CarouselProductCardProps) {
  return (
    <div className="h-full flex">
      <div className="flex flex-col h-[450px] w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <ProductCard {...props} />
      </div>
    </div>
  );
}
