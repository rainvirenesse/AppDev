export {
  API_BASE_URL,
  AUTH_TOKEN_KEY,
  ApiRequestError,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from './client';

export { login, logout, restoreToken, googleLogin, authLogin, userGoogleLogin } from './auth';
export {
  fetchProducts,
  fetchProductById,
  fetchProduct,
  resolveProductImageUrl,
  extractRawImageSource,
  isPlaceholderImage,
  PLACEHOLDER_IMAGE,
} from './products';
export {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearServerCart,
  mapApiCartToLocalItems,
} from './cart';
export type { ApiCart, RemoteCartLine } from './cart';
export {
  fetchOrders,
  fetchOrder,
  createOrderFromCart,
  cancelOrder,
} from './orders';
export type { Order, OrderItem } from './orders';
export { fetchPaymentStatus, processPayment } from './payments';
export type { PaymentStatus } from './payments';
export { fetchProfile, updateProfile } from './profile';
export type { CustomerProfile } from './profile';
