export function unwrapArray<T>(response: unknown, key: string): T[] {
  if (Array.isArray(response)) return response as T[];
  if (
    response &&
    typeof response === 'object' &&
    key in response &&
    Array.isArray((response as Record<string, unknown>)[key])
  ) {
    return (response as Record<string, T[]>)[key];
  }
  return [];
}

export function unwrapEntity<T>(response: unknown, key: string): T {
  if (response && typeof response === 'object' && key in response) {
    return (response as Record<string, T>)[key];
  }
  return response as T;
}
