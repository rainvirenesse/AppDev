import { apiDelete, apiGet, apiPost, unwrapBody } from './client';

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
  status: string;
  productId?: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  orderedAt: string;
  notes?: string | null;
  completedAt?: string | null;
  itemCount?: number;
  items?: OrderItem[];
};

export async function fetchOrders(): Promise<Order[]> {
  const data = await apiGet<unknown>('/api/customer/orders', true);
  const list = unwrapBody<Order[] | { items?: Order[] }>(data);
  if (Array.isArray(list)) {
    return list;
  }
  if (list && typeof list === 'object' && Array.isArray(list.items)) {
    return list.items;
  }
  return [];
}

export async function fetchOrder(id: number): Promise<Order> {
  return apiGet<Order>(`/api/customer/orders/${id}`, true);
}

export async function createOrderFromCart(notes?: string): Promise<Order> {
  return apiPost<Order>(
    '/api/customer/orders',
    { notes: notes ?? null },
    true,
  );
}

export async function cancelOrder(id: number): Promise<Order> {
  return apiDelete<Order>(`/api/customer/orders/${id}`, true);
}
