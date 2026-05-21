import { Order } from '../../api/orders';
import {
  FETCH_ORDERS_COMPLETED,
  FETCH_ORDERS_ERROR,
  FETCH_ORDERS_REQUEST,
} from '../actions';

export interface OrdersState {
  items: Order[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const INITIAL_STATE: OrdersState = {
  items: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

interface OrdersAction {
  type: string;
  payload?: Order[] | string;
}

export default function ordersReducer(
  state = INITIAL_STATE,
  action: OrdersAction,
): OrdersState {
  switch (action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, isLoading: true, isError: false, errorMessage: null };

    case FETCH_ORDERS_COMPLETED:
      return {
        ...state,
        items: action.payload as Order[],
        isLoading: false,
        isError: false,
      };

    case FETCH_ORDERS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload as string,
      };

    default:
      return state;
  }
}
