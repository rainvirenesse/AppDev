import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import auth from './auth';
import shop from './shop';
import products from './products';
import orders from './orders';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth,
  shop,
  products,
  orders,
});

export default () => {
  let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

  const runSaga = sagaMiddleware.run;

  return { store, runSaga };
};