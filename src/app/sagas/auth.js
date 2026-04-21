// import { call } from 'redux-saga/effects';

import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin } from '../api/auth';


// import { userLogin } from '../api/auth';
// import { USER_LOGIN_ERROR } from '../actions';
import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../actions';

// export function* userLoginSaga(action) {
export function* userLoginAsync(action) {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    // const response = yield call(userLogin, action.payload);
  const response = yield call(authLogin, action.payload);
    // const response = { email: action.payload.email, name: 'Test User' };

    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error) {
    yield put({ type: USER_LOGIN_ERROR, payload: error.message });
  }
}
export function* userLogin() {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}