import type { NextApiRequest, NextApiResponse } from "next";

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

type Data = {
  products: Product[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Mock data for handicraft products
  const products = [
    {
      id: 1,
      name: "Handwoven Basket",
      price: 45.99,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Home Decor",
      description:
        "Beautiful handwoven basket made from natural materials, perfect for storage or decoration.",
      materials: ["Rattan", "Bamboo"],
      featured: true,
    },
    {
      id: 2,
      name: "Ceramic Vase",
      price: 79.99,
      rating: 4.7,
      image: "/images/insta-1.jpg",
      category: "Home Decor",
      description:
        "Hand-thrown ceramic vase with unique glazing, each piece is one-of-a-kind.",
      materials: ["Ceramic", "Clay"],
      featured: true,
    },
    {
      id: 3,
      name: "Macrame Wall Hanging",
      price: 59.99,
      rating: 4.9,
      image: "/images/insta-1.jpg",
      category: "Wall Art",
      description:
        "Intricate macrame wall hanging, handcrafted with 100% cotton rope.",
      materials: ["Cotton"],
      featured: true,
    },
    {
      id: 4,
      name: "Wooden Cutting Board",
      price: 35.99,
      rating: 4.5,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description: "Handmade wooden cutting board with unique grain patterns.",
      materials: ["Oak", "Walnut"],
      featured: true,
    },
    {
      id: 5,
      name: "Hand-painted Pottery Set",
      price: 120.0,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description:
        "Set of 4 hand-painted pottery plates with artisanal designs.",
      materials: ["Clay", "Food-safe paint"],
      featured: true,
    },
    {
      id: 6,
      name: "Hand-painted Pottery Set",
      price: 120.0,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description:
        "Set of 4 hand-painted pottery plates with artisanal designs.",
      materials: ["Clay", "Food-safe paint"],
      featured: true,
    },
    {
      id: 7,
      name: "Hand-painted Pottery Set",
      price: 120.0,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description:
        "Set of 4 hand-painted pottery plates with artisanal designs.",
      materials: ["Clay", "Food-safe paint"],
      featured: true,
    },
    {
      id: 8,
      name: "Hand-painted Pottery Set",
      price: 120.0,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description:
        "Set of 4 hand-painted pottery plates with artisanal designs.",
      materials: ["Clay", "Food-safe paint"],
      featured: true,
    },
    {
      id: 9,
      name: "Hand-painted Pottery Set",
      price: 120.0,
      rating: 4.8,
      image: "/images/insta-1.jpg",
      category: "Kitchen",
      description:
        "Set of 4 hand-painted pottery plates with artisanal designs.",
      materials: ["Clay", "Food-safe paint"],
      featured: true,
    },
  ];

  res.status(200).json({ products });
}
