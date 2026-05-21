import { apiGet } from './client';
import {
  extractRawImageSource,
  isPlaceholderImage,
  mapApiProductToProduct,
  normalizeProductList,
  PLACEHOLDER_IMAGE,
  resolveProductImageUrl,
} from './mappers/productMapper';
import { ApiProduct } from '../types/api.types';
import { Product } from '../types/product.types';

export type { Product };

export {
  extractRawImageSource,
  isPlaceholderImage,
  resolveProductImageUrl,
  PLACEHOLDER_IMAGE,
};

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiGet<unknown>('/api/customer/products', true);
  return normalizeProductList(data).map(mapApiProductToProduct);
}

export async function fetchProductById(id: string): Promise<Product> {
  const data = await apiGet<ApiProduct>(`/api/customer/products/${id}`, true);
  return mapApiProductToProduct(data);
}

/** @deprecated Use fetchProductById */
export const fetchProduct = fetchProductById;
