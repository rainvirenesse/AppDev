import { apiDelete, apiGet, apiPost, apiPut } from './client';
import { mapApiProductToProduct } from './mappers/productMapper';
import { ApiProduct } from '../types/api.types';
import { CartItem, Product } from '../types/product.types';

/** Remote cart line item from Symfony API (not app CartItem) */
export type RemoteCartLine = {
  id: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: ApiProduct;
};

export type ApiCart = {
  id: number;
  updatedAt: string;
  itemCount: number;
  subtotal: number;
  items: RemoteCartLine[];
};

export function normalizeCart(payload: unknown): ApiCart {
  const cart = payload as ApiCart;
  return {
    id: cart?.id ?? 0,
    updatedAt: cart?.updatedAt ?? '',
    itemCount: cart?.itemCount ?? cart?.items?.length ?? 0,
    subtotal: cart?.subtotal ?? 0,
    items: Array.isArray(cart?.items) ? cart.items : [],
  };
}

export function mapApiCartToLocalItems(cart: ApiCart): CartItem[] {
  return cart.items.map(item => ({
    lineId: item.id,
    productId: String(item.product.id),
    size: 'Standard',
    quantity: item.quantity,
    product: mapApiProductToProduct(item.product),
  }));
}

export async function fetchCart(): Promise<ApiCart> {
  const data = await apiGet<unknown>('/api/customer/cart', true);
  return normalizeCart(data);
}

export async function addCartItem(
  productId: number,
  quantity = 1,
): Promise<ApiCart> {
  const result = await apiPost<unknown>(
    '/api/customer/cart/items',
    { productId, quantity },
    true,
  );
  const record = result as { cart?: ApiCart };
  return normalizeCart(record.cart ?? result);
}

export async function updateCartItem(
  itemId: number,
  quantity: number,
): Promise<ApiCart> {
  const result = await apiPut<unknown>(
    `/api/customer/cart/items/${itemId}`,
    { quantity },
    true,
  );
  const record = result as { cart?: ApiCart };
  return normalizeCart(record.cart ?? result);
}

export async function removeCartItem(itemId: number): Promise<ApiCart> {
  const result = await apiDelete<unknown>(
    `/api/customer/cart/items/${itemId}`,
    true,
  );
  return normalizeCart(result);
}

export async function clearServerCart(): Promise<void> {
  await apiDelete('/api/customer/cart', true);
}
