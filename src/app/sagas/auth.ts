import { call, put, takeEvery } from 'redux-saga/effects';
import { login, logout, restoreToken } from '../../api/auth';
import { ApiRequestError } from '../../api/client';
import { fetchProfile } from '../../api/profile';
import {
  CLEAR_CART,
  RESTORE_AUTH,
  RESTORE_AUTH_COMPLETED,
  SYNC_CART,
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_RESET,
} from '../actions';
import { LoginCredentials, LoginResponse } from '../../types/api.types';

interface UserLoginAction {
  type: string;
  payload: LoginCredentials;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function* userLoginAsync(action: UserLoginAction): Generator {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response = (yield call(login, action.payload)) as LoginResponse;
    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
    yield put({ type: SYNC_CART });
  } catch (error: unknown) {
    yield put({ type: USER_LOGIN_ERROR, payload: getErrorMessage(error) });
  }
}

export function* restoreAuthAsync(): Generator {
  const token = (yield call(restoreToken)) as string | null;
  if (!token) {
    return;
  }
  try {
    const profile = (yield call(fetchProfile)) as {
      id: number;
      email: string;
    };
    yield put({
      type: USER_LOGIN_COMPLETED,
      payload: {
        token,
        user: { id: profile.id, email: profile.email },
        message: '',
      } as LoginResponse,
    });
    yield put({ type: RESTORE_AUTH_COMPLETED });
    yield put({ type: SYNC_CART });
  } catch {
    yield call(logout);
  }
}

export function* logoutAsync(): Generator {
  yield call(logout);
  yield put({ type: CLEAR_CART });
}

export function* userLogin(): Generator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}

export function* watchRestoreAuth(): Generator {
  yield takeEvery(RESTORE_AUTH, restoreAuthAsync);
}

export function* watchLogout(): Generator {
  yield takeEvery(USER_LOGIN_RESET, logoutAsync);
}
