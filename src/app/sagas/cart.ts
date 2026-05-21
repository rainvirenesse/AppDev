import { call, put, takeEvery } from 'redux-saga/effects';
import {
  addCartItem,
  fetchCart,
  mapApiCartToLocalItems,
  removeCartItem,
  updateCartItem,
} from '../../api/cart';
import { ApiRequestError } from '../../api/client';
import {
  ADD_TO_CART_API,
  ADD_TO_CART_API_ERROR,
  ADD_TO_CART_API_SUCCESS,
  REMOVE_CART_API,
  SYNC_CART,
  SYNC_CART_COMPLETED,
  SYNC_CART_ERROR,
  SYNC_CART_REQUEST,
  UPDATE_CART_API,
} from '../actions';
import { Product } from '../../types/product.types';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Cart request failed';
}

export function* syncCartAsync(): Generator {
  yield put({ type: SYNC_CART_REQUEST });
  try {
    const cart = (yield call(fetchCart)) as Awaited<ReturnType<typeof fetchCart>>;
    yield put({
      type: SYNC_CART_COMPLETED,
      payload: mapApiCartToLocalItems(cart),
    });
  } catch (error: unknown) {
    yield put({ type: SYNC_CART_ERROR, payload: getErrorMessage(error) });
  }
}

interface AddToCartPayload {
  product: Product;
  size: string;
  quantity: number;
}

export function* addToCartApiAsync(action: {
  type: string;
  payload: AddToCartPayload;
}): Generator {
  const { product, quantity } = action.payload;
  yield put({ type: SYNC_CART_REQUEST });
  try {
    yield call(addCartItem, Number(product.id), quantity);
    const cart = (yield call(fetchCart)) as Awaited<ReturnType<typeof fetchCart>>;
    const items = mapApiCartToLocalItems(cart);
    yield put({
      type: ADD_TO_CART_API_SUCCESS,
      payload: {
        items,
        message: `${product.name} × ${quantity} added to cart`,
      },
    });
  } catch (error: unknown) {
    yield put({ type: ADD_TO_CART_API_ERROR, payload: getErrorMessage(error) });
  }
}

export function* updateCartApiAsync(action: {
  type: string;
  payload: { lineId: number; productId: string; size: string; quantity: number };
}): Generator {
  const { lineId, quantity } = action.payload;
  yield put({ type: SYNC_CART_REQUEST });
  try {
    const cart = (yield call(updateCartItem, lineId, quantity)) as Awaited<
      ReturnType<typeof updateCartItem>
    >;
    yield put({
      type: SYNC_CART_COMPLETED,
      payload: mapApiCartToLocalItems(cart),
    });
  } catch (error: unknown) {
    yield put({ type: SYNC_CART_ERROR, payload: getErrorMessage(error) });
  }
}

export function* removeCartApiAsync(action: {
  type: string;
  payload: { lineId: number; productId: string; size: string };
}): Generator {
  const { lineId } = action.payload;
  yield put({ type: SYNC_CART_REQUEST });
  try {
    const cart = (yield call(removeCartItem, lineId)) as Awaited<
      ReturnType<typeof removeCartItem>
    >;
    yield put({
      type: SYNC_CART_COMPLETED,
      payload: mapApiCartToLocalItems(cart),
    });
  } catch (error: unknown) {
    yield put({ type: SYNC_CART_ERROR, payload: getErrorMessage(error) });
  }
}

export function* watchSyncCart(): Generator {
  yield takeEvery(SYNC_CART, syncCartAsync);
}

export function* watchAddToCartApi(): Generator {
  yield takeEvery(ADD_TO_CART_API, addToCartApiAsync);
}

export function* watchUpdateCartApi(): Generator {
  yield takeEvery(UPDATE_CART_API, updateCartApiAsync);
}

export function* watchRemoveCartApi(): Generator {
  yield takeEvery(REMOVE_CART_API, removeCartApiAsync);
}
