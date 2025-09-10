export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Product {
  id: number;
  name: string;
  detail: string;
  price: number;
  imageUrl?: string | null; // make optional & nullable
  category: {
    id: number;
    name: string;
  } | null; // category may be null
}

export interface ProductCardsProps {
  products: Product[];
}

/**
 * Returns a safe image URL for a product.
 * Falls back to a placeholder if no valid image exists.
 */
export const getImageUrl = (product: Product): string => {
  if (!product.imageUrl) {
    // ✅ Fallback product placeholder
    return "/images/product-placeholder.png";
  }

  // If the URL is already absolute (e.g. starts with http/https), return as is
  if (/^https?:\/\//i.test(product.imageUrl)) {
    return product.imageUrl;
  }

  // Otherwise, assume it's a relative path served by backend
  return `${API_URL}${product.imageUrl}`;
};
