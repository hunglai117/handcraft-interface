export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description: string;
  materials: string[];
  featured: boolean;
}
