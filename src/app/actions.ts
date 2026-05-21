// AUTH

import { LoginCredentials } from "../types/api.types";
import { Product } from '../types/product.types';

// AUTH/USER_LOGIN
export const USER_LOGIN: string = 'USER_LOGIN';
export const USER_LOGIN_REQUEST: string = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETED: string = 'USER_LOGIN_COMPLETED';
export const USER_LOGIN_ERROR: string = 'USER_LOGIN_ERROR';
export const USER_LOGIN_RESET: string = 'USER_LOGIN_RESET';
export const USER_REGISTER: string = 'USER_REGISTER';                      //new added
export const USER_REGISTER_COMPLETED: string = 'USER_REGISTER_COMPLETED'; //new added

export const userLogin = (payload: LoginCredentials) => ({
  type: USER_LOGIN,
  payload,
});


export const resetLogin = () => ({
  type: USER_LOGIN_RESET
});

// SHOP
export const ADD_TO_CART = 'ADD_TO_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export const addToCart = (payload: {
  product: Product;
  size: string;
  quantity: number;
}) => ({
  type: ADD_TO_CART,
  payload,
});

export const updateCartQuantity = (payload: {
  productId: string;
  size: string;
  quantity: number;
}) => ({
  type: UPDATE_CART_QUANTITY,
  payload,
});

export const removeFromCart = (payload: { productId: string; size: string }) => ({
  type: REMOVE_FROM_CART,
  payload,
});

export const clearCart = () => ({ type: CLEAR_CART });

export const toggleFavorite = (productId: string) => ({
  type: TOGGLE_FAVORITE,
  payload: productId,
});

// PRODUCTS (Symfony API)
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_COMPLETED = 'FETCH_PRODUCTS_COMPLETED';
export const FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR';

export const FETCH_PRODUCT = 'FETCH_PRODUCT';
export const FETCH_PRODUCT_REQUEST = 'FETCH_PRODUCT_REQUEST';
export const FETCH_PRODUCT_COMPLETED = 'FETCH_PRODUCT_COMPLETED';
export const FETCH_PRODUCT_ERROR = 'FETCH_PRODUCT_ERROR';

export const fetchProducts = () => ({ type: FETCH_PRODUCTS });

export const fetchProduct = (productId: string) => ({
  type: FETCH_PRODUCT,
  payload: productId,
});

// CART (Symfony API)
export const SYNC_CART = 'SYNC_CART';
export const SYNC_CART_REQUEST = 'SYNC_CART_REQUEST';
export const SYNC_CART_COMPLETED = 'SYNC_CART_COMPLETED';
export const SYNC_CART_ERROR = 'SYNC_CART_ERROR';

export const ADD_TO_CART_API = 'ADD_TO_CART_API';
export const UPDATE_CART_API = 'UPDATE_CART_API';
export const REMOVE_CART_API = 'REMOVE_CART_API';

export const RESTORE_AUTH = 'RESTORE_AUTH';
export const RESTORE_AUTH_COMPLETED = 'RESTORE_AUTH_COMPLETED';

export const syncCart = () => ({ type: SYNC_CART });

export const addToCartApi = (payload: {
  product: Product;
  size: string;
  quantity: number;
}) => ({
  type: ADD_TO_CART_API,
  payload,
});

export const updateCartApi = (payload: {
  lineId: number;
  productId: string;
  size: string;
  quantity: number;
}) => ({
  type: UPDATE_CART_API,
  payload,
});

export const removeCartApi = (payload: {
  lineId: number;
  productId: string;
  size: string;
}) => ({
  type: REMOVE_CART_API,
  payload,
});

export const restoreAuth = () => ({ type: RESTORE_AUTH });

export const ADD_TO_CART_API_SUCCESS = 'ADD_TO_CART_API_SUCCESS';
export const ADD_TO_CART_API_ERROR = 'ADD_TO_CART_API_ERROR';

// ORDERS
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_COMPLETED = 'FETCH_ORDERS_COMPLETED';
export const FETCH_ORDERS_ERROR = 'FETCH_ORDERS_ERROR';

export const fetchOrders = () => ({ type: FETCH_ORDERS });