import { apiGet, apiPost } from './client';

export type PaymentStatus = {
  orderId: number;
  orderNumber: string;
  paymentStatus: string;
  totalPrice: number;
  orderStatus: string;
  method?: string | null;
  reference?: string | null;
  paid: boolean;
};

export async function fetchPaymentStatus(orderId: number): Promise<PaymentStatus> {
  return apiGet<PaymentStatus>(
    `/api/customer/orders/${orderId}/payment`,
    true,
  );
}

export async function processPayment(
  orderId: number,
  method: string,
  reference?: string,
): Promise<PaymentStatus> {
  return apiPost<PaymentStatus>(
    `/api/customer/orders/${orderId}/payment`,
    { method, reference: reference ?? null },
    true,
  );
}
