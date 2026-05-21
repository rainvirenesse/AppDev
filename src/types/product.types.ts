export interface SizeStock {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  /** Resolved URL for <Image source={{ uri }} /> */
  image: string;
  /** Original path/URL from Symfony (for debugging/re-resolve) */
  imageRaw?: string | null;
  /** True when Symfony provided an uploaded image */
  hasImage?: boolean;
  updatedAt?: string;
  description: string;
  category: string;
  status?: string;
  sizes: SizeStock[];
}

export interface CartItem {
  lineId?: number;
  productId: string;
  size: string;
  quantity: number;
  product: Product;
}
