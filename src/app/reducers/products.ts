import { Product } from '../../types/product.types';
import {
  FETCH_PRODUCTS_COMPLETED,
  FETCH_PRODUCTS_ERROR,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCT_COMPLETED,
  FETCH_PRODUCT_ERROR,
  FETCH_PRODUCT_REQUEST,
} from '../actions';

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

interface ProductsAction {
  type: string;
  payload?: Product[] | Product | string;
}

const INITIAL_STATE: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  isDetailLoading: false,
  isError: false,
  errorMessage: null,
};

export default function productsReducer(
  state = INITIAL_STATE,
  action: ProductsAction,
): ProductsState {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: null,
      };

    case FETCH_PRODUCTS_COMPLETED:
      return {
        ...state,
        items: action.payload as Product[],
        isLoading: false,
        isError: false,
      };

    case FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload as string,
      };

    case FETCH_PRODUCT_REQUEST:
      return {
        ...state,
        isDetailLoading: true,
        isError: false,
        errorMessage: null,
      };

    case FETCH_PRODUCT_COMPLETED: {
      const product = action.payload as Product;
      return {
        ...state,
        selectedProduct: product,
        items: state.items.some(p => p.id === product.id)
          ? state.items.map(p => (p.id === product.id ? product : p))
          : [...state.items, product],
        isDetailLoading: false,
        isError: false,
      };
    }

    case FETCH_PRODUCT_ERROR:
      return {
        ...state,
        isDetailLoading: false,
        isError: true,
        errorMessage: action.payload as string,
      };

    default:
      return state;
  }
}
