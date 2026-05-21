import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchOrders as fetchOrdersApi } from '../../api/orders';
import { ApiRequestError } from '../../api/client';
import {
  FETCH_ORDERS,
  FETCH_ORDERS_COMPLETED,
  FETCH_ORDERS_ERROR,
  FETCH_ORDERS_REQUEST,
} from '../actions';
import { Order } from '../../api/orders';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to load orders';
}

export function* fetchOrdersAsync(): Generator {
  yield put({ type: FETCH_ORDERS_REQUEST });
  try {
    const orders = (yield call(fetchOrdersApi)) as Order[];
    yield put({
      type: FETCH_ORDERS_COMPLETED,
      payload: Array.isArray(orders) ? orders : [],
    });
  } catch (error: unknown) {
    yield put({ type: FETCH_ORDERS_ERROR, payload: getErrorMessage(error) });
  }
}

export function* watchFetchOrders(): Generator {
  yield takeEvery(FETCH_ORDERS, fetchOrdersAsync);
}
