export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Product {
  id: number;
  name: string;
  detail: string;
  price: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

export interface ProductCardsProps {
  products: Product[];
}

export const getImageUrl = (product: Product): string | null => {
  return product.imageUrl ? `${API_URL}${product.imageUrl}` : null;
}; 