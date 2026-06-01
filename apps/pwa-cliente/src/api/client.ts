// api/client.ts — Wrapper delgado sobre fetch nativo con credentials: 'include'.
// Sin axios. Manejo centralizado de errores HTTP, 401, 429.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const AUTH_TOKEN_KEY = 'nachopps.access_token';

let authToken = localStorage.getItem(AUTH_TOKEN_KEY);

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// ─── Error normalizado ─────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: unknown,
  ) {
    const msg =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as Record<string, unknown>).message)
        : statusText;
    super(msg);
    this.name = 'ApiError';
  }
}

// ─── Request interno ────────────────────────────────────────────
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = { message: res.statusText };
    }

    // 401 → sesión expirada
    if (res.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      throw new ApiError(res.status, res.statusText, body);
    }

    // 429 → rate limit
    if (res.status === 429) {
      throw new ApiError(
        res.status,
        'Demasiadas solicitudes. Intenta de nuevo en unos segundos.',
        body,
      );
    }

    throw new ApiError(res.status, res.statusText, body);
  }

  // 204 No Content → no hay body
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Helpers tipados ────────────────────────────────────────────
export const client = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'GET' }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      body: body != null ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'PATCH',
      body: body != null ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'DELETE' }),
};
