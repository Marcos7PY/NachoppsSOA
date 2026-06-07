// api/client.ts — Wrapper delgado sobre fetch nativo con credentials: 'include'.
// Sin axios. Manejo centralizado de errores HTTP, 401, 429.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
// Versionado de API (plan 6.2): el gateway expone /v1/{servicio}. Las rutas sin
// versión siguen activas como fallback durante la transición.
const API_VERSION_PREFIX = '/v1';
const LEGACY_AUTH_TOKEN_KEY = ['nachopps', 'access_token'].join('.');
const CSRF_COOKIE_KEY = 'nachopps.csrf_token';
const CSRF_HEADER_KEY = 'X-CSRF-Token';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);

export function setAuthToken(token: string) {
  void token;
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}

export function getAuthToken() {
  return null;
}

export function clearAuthToken() {
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}

function newIdempotencyKey(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  // Fallback para contextos sin crypto.randomUUID.
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getCookie(name: string) {
  const encodedName = `${encodeURIComponent(name)}=`;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(encodedName));

  return match ? decodeURIComponent(match.slice(encodedName.length)) : null;
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

// Refresh tokens (plan 1.4): intenta renovar el access token con la cookie
// refresh_token httpOnly. Devuelve true si la renovación tuvo éxito.
let refreshInFlight: Promise<boolean> | null = null;
async function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const csrf = getCookie(CSRF_COOKIE_KEY);
      const res = await fetch(`${BASE_URL}${API_VERSION_PREFIX}/identidad/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: csrf ? { [CSRF_HEADER_KEY]: csrf } : {},
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

// ─── Request interno ────────────────────────────────────────────
async function request<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
  const versionedPath =
    path.startsWith('/') && !path.startsWith(`${API_VERSION_PREFIX}/`)
      ? `${API_VERSION_PREFIX}${path}`
      : path;
  const url = `${BASE_URL}${versionedPath}`;

  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const method = (init?.method ?? 'GET').toUpperCase();
  const csrfToken = getCookie(CSRF_COOKIE_KEY);
  if (
    csrfToken &&
    MUTATING_METHODS.has(method) &&
    !headers.has(CSRF_HEADER_KEY)
  ) {
    headers.set(CSRF_HEADER_KEY, csrfToken);
  }

  // Idempotencia HTTP (plan 1.3): el backend deduplica POST con la misma clave,
  // así un retry de transporte no crea pedidos/pagos duplicados.
  if (method === 'POST' && !headers.has('Idempotency-Key')) {
    headers.set('Idempotency-Key', newIdempotencyKey());
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

    // 401 → intentar refrescar el access token una vez; si falla, sesión expirada.
    if (res.status === 401) {
      const isAuthPath = /\/auth\/(refresh|login|logout)$/.test(path);
      if (!retried && !isAuthPath && (await tryRefresh())) {
        return request<T>(path, init, true);
      }
      clearAuthToken();
      if (!url.endsWith('/logout')) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
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
