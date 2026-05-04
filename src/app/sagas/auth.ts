// src/app/sagas/auth.ts

import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin } from '../api/auth';
import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../actions';
import { LoginCredentials, LoginResponse } from '../../types/api.types';

interface UserLoginAction {
  type: string;
  payload: LoginCredentials;
}

export function* userLoginAsync(action: UserLoginAction): Generator {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response = (yield call(authLogin, action.payload)) as LoginResponse;
    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    yield put({ type: USER_LOGIN_ERROR, payload: message });
  }
}

export function* userLogin(): Generator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}