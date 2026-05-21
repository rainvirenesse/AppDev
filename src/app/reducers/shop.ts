import { CartItem, Product } from '../../types/product.types';
import {
  ADD_TO_CART,
  ADD_TO_CART_API_ERROR,
  ADD_TO_CART_API_SUCCESS,
  CLEAR_CART,
  REMOVE_FROM_CART,
  SYNC_CART_COMPLETED,
  SYNC_CART_ERROR,
  SYNC_CART_REQUEST,
  TOGGLE_FAVORITE,
  UPDATE_CART_QUANTITY,
} from '../actions';

export interface ShopState {
  cart: CartItem[];
  favorites: string[];
  cartLoading: boolean;
  cartError: string | null;
  lastCartMessage: string | null;
}

const initialState: ShopState = {
  cart: [],
  favorites: [],
  cartLoading: false,
  cartError: null,
  lastCartMessage: null,
};

interface AddToCartPayload {
  product: Product;
  size: string;
  quantity: number;
}

interface UpdateCartPayload {
  productId: string;
  size: string;
  quantity: number;
}

interface RemoveCartPayload {
  productId: string;
  size: string;
}

const shopReducer = (
  state: ShopState = initialState,
  action: { type: string; payload?: unknown },
): ShopState => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, size, quantity } = action.payload as AddToCartPayload;
      const existing = state.cart.find(
        item => item.productId === product.id && item.size === size,
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { productId: product.id, size, quantity, product },
        ],
      };
    }

    case UPDATE_CART_QUANTITY: {
      const { productId, size, quantity } = action.payload as UpdateCartPayload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.productId === productId && item.size === size),
          ),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item,
        ),
      };
    }

    case REMOVE_FROM_CART: {
      const { productId, size } = action.payload as RemoveCartPayload;
      return {
        ...state,
        cart: state.cart.filter(
          item => !(item.productId === productId && item.size === size),
        ),
      };
    }

    case CLEAR_CART:
      return { ...state, cart: [], cartError: null };

    case SYNC_CART_REQUEST:
      return { ...state, cartLoading: true, cartError: null };

    case SYNC_CART_COMPLETED:
      return {
        ...state,
        cart: action.payload as CartItem[],
        cartLoading: false,
        cartError: null,
      };

    case SYNC_CART_ERROR:
      return {
        ...state,
        cartLoading: false,
        cartError: action.payload as string,
      };

    case ADD_TO_CART_API_SUCCESS: {
      const payload = action.payload as
        | CartItem[]
        | { items: CartItem[]; message: string };
      const items = Array.isArray(payload) ? payload : payload.items;
      const message = Array.isArray(payload)
        ? 'Added to cart'
        : payload.message;
      return {
        ...state,
        cart: items,
        cartLoading: false,
        cartError: null,
        lastCartMessage: message,
      };
    }

    case ADD_TO_CART_API_ERROR:
      return {
        ...state,
        cartLoading: false,
        cartError: action.payload as string,
        lastCartMessage: null,
      };

    case TOGGLE_FAVORITE: {
      const productId = action.payload as string;
      const isFavorite = state.favorites.includes(productId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== productId)
          : [...state.favorites, productId],
      };
    }

    default:
      return state;
  }
};

export default shopReducer;
