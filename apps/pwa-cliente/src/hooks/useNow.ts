// hooks/useNow.ts — Reloj reactivo compartido. Devuelve `Date.now()` y lo
// refresca cada `intervalMs`, para que los tiempos transcurridos / SLA avancen
// en vivo sin recalcularse en cada render del árbol.

import { useEffect, useState } from 'react';

export function useNow(intervalMs = 10_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
