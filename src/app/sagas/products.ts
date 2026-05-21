import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchProductById, fetchProducts } from '../../api/products';
import { ApiRequestError } from '../../api/client';
import {
  FETCH_PRODUCT,
  FETCH_PRODUCTS,
  FETCH_PRODUCT_COMPLETED,
  FETCH_PRODUCT_ERROR,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCTS_COMPLETED,
  FETCH_PRODUCTS_ERROR,
  FETCH_PRODUCTS_REQUEST,
} from '../actions';
import { Product } from '../../types/product.types';

interface FetchProductAction {
  type: string;
  payload: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Request failed';
}

export function* fetchProductsAsync(): Generator {
  yield put({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const products = (yield call(fetchProducts)) as Product[];
    yield put({ type: FETCH_PRODUCTS_COMPLETED, payload: products });
  } catch (error: unknown) {
    yield put({ type: FETCH_PRODUCTS_ERROR, payload: getErrorMessage(error) });
  }
}

export function* fetchProductAsync(action: FetchProductAction): Generator {
  yield put({ type: FETCH_PRODUCT_REQUEST });
  try {
    const product = (yield call(fetchProductById, action.payload)) as Product;
    yield put({ type: FETCH_PRODUCT_COMPLETED, payload: product });
  } catch (error: unknown) {
    yield put({ type: FETCH_PRODUCT_ERROR, payload: getErrorMessage(error) });
  }
}

export function* watchFetchProducts(): Generator {
  yield takeEvery(FETCH_PRODUCTS, fetchProductsAsync);
}

export function* watchFetchProduct(): Generator {
  yield takeEvery(FETCH_PRODUCT, fetchProductAsync);
}
