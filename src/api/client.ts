import AsyncStorage from '@react-native-async-storage/async-storage';

/** Symfony server origin (no trailing slash). Paths include `/api/...` */
export const API_BASE_URL = 'http://10.233.126.40:8000';

export const AUTH_TOKEN_KEY = '@credo/auth_token';

export type ApiError = {
  status: number;
  error: string;
  code?: number;
  violations?: Record<string, string>;
  message?: string;
};

export class ApiRequestError extends Error {
  status: number;
  code?: number;
  violations?: Record<string, string>;

  constructor(payload: ApiError) {
    super(payload.error || payload.message || 'Request failed');
    this.name = 'ApiRequestError';
    this.status = payload.status;
    this.code = payload.code;
    this.violations = payload.violations;
  }
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export function unwrapBody<T>(body: unknown): T {
  if (body === null || body === undefined) {
    return body as T;
  }
  if (typeof body === 'object' && 'data' in (body as object)) {
    return (body as { data: T }).data;
  }
  return body as T;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

/**
 * Reusable fetch wrapper for Symfony REST API.
 * @param path - e.g. `/api/login` or `/api/customer/products`
 * @param requireAuth - attach Bearer token from AsyncStorage when true
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requireAuth) {
    const token = await getStoredToken();
    if (!token) {
      throw new ApiRequestError({
        status: 401,
        error: 'Authentication required. Please log in.',
      });
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiRequestError({
      status: 0,
      error: 'Network error. Check your connection and API URL.',
    });
  }

  const body = await parseResponseBody(response);
  const record = (body ?? {}) as Record<string, unknown>;

  if (!response.ok) {
    throw new ApiRequestError({
      status: response.status,
      error:
        (record.error as string) ||
        (record.message as string) ||
        `Request failed (${response.status})`,
      code: (record.code as number) ?? response.status,
      violations: record.violations as Record<string, string> | undefined,
      message: record.message as string | undefined,
    });
  }

  return unwrapBody<T>(body);
}

export const apiGet = <T>(path: string, auth = false) =>
  apiRequest<T>(path, { method: 'GET' }, auth);

export const apiPost = <T>(path: string, body: unknown, auth = false) =>
  apiRequest<T>(
    path,
    { method: 'POST', body: JSON.stringify(body) },
    auth,
  );

export const apiPut = <T>(path: string, body: unknown, auth = true) =>
  apiRequest<T>(
    path,
    { method: 'PUT', body: JSON.stringify(body) },
    auth,
  );

export const apiDelete = <T>(path: string, auth = true) =>
  apiRequest<T>(path, { method: 'DELETE' }, auth);
