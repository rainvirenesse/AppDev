import { all } from 'redux-saga/effects';
import { userLogin, watchLogout, watchRestoreAuth } from './auth';
import {
  watchAddToCartApi,
  watchRemoveCartApi,
  watchSyncCart,
  watchUpdateCartApi,
} from './cart';
import { watchFetchProduct, watchFetchProducts } from './products';
import { watchFetchOrders } from './orders';

export default function* rootSaga() {
  yield all([
    userLogin(),
    watchRestoreAuth(),
    watchLogout(),
    watchFetchProducts(),
    watchFetchProduct(),
    watchFetchOrders(),
    watchSyncCart(),
    watchAddToCartApi(),
    watchUpdateCartApi(),
    watchRemoveCartApi(),
  ]);
}