import { Product } from '../types/product.types';

export const getTotalStock = (product: Product): number =>
  product.sizes.reduce((sum, s) => sum + s.stock, 0);

export const isProductAvailable = (product: Product): boolean => {
  const status = (product.status ?? '').toUpperCase();
  if (status === 'OUT_OF_STOCK' || status === 'INACTIVE') {
    return false;
  }
  return getTotalStock(product) > 0;
};

export const buildCategoryFilters = (products: Product[]): string[] => {
  const unique = new Set(products.map(p => p.category).filter(Boolean));
  return ['All', ...Array.from(unique).sort()];
};
