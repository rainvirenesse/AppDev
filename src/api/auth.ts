import {
  apiPost,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  unwrapBody,
} from './client';
import { LoginCredentials, LoginResponse } from '../types/api.types';

type LoginApiResponse = {
  token?: string;
  access_token?: string;
  user?: { id: number; email: string };
  message?: string;
  error?: string;
};

function extractToken(data: LoginApiResponse): string {
  const token = data.token ?? data.access_token;
  if (!token) {
    throw new Error('No authentication token received from server');
  }
  return token;
}

function extractUser(data: LoginApiResponse): { id: number; email: string } {
  if (data.user?.email) {
    return data.user;
  }
  return { id: 0, email: '' };
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const raw = await apiPost<unknown>('/api/login', credentials, false);
  const data = unwrapBody<LoginApiResponse>(raw);
  const token = extractToken(data);
  await setStoredToken(token);
  return {
    token,
    user: extractUser(data),
    message: data.message ?? '',
  };
}

export async function logout(): Promise<void> {
  await clearStoredToken();
}

export async function restoreToken(): Promise<string | null> {
  return getStoredToken();
}

interface GoogleLoginPayload {
  idToken: string;
}

type GoogleLoginResponse = LoginResponse & { error?: string };

export async function googleLogin(
  payload: GoogleLoginPayload,
): Promise<GoogleLoginResponse> {
  try {
    const raw = await apiPost<unknown>('/api/auth/google/mobile', payload, false);
    const data = unwrapBody<LoginApiResponse>(raw);

    if (data.error) {
      return {
        token: '',
        user: { id: 0, email: '' },
        message: data.error,
        error: data.error,
      };
    }

    const token = extractToken(data);
    await setStoredToken(token);
    return { token, user: extractUser(data), message: '' };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      token: '',
      user: { id: 0, email: '' },
      message,
      error: message,
    };
  }
}

export const authLogin = login;
export const userGoogleLogin = googleLogin;
