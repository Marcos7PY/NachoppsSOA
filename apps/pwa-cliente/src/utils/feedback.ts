// utils/feedback.ts — helpers de mensajes de éxito/error para hooks de queries.

/** Devuelve el mensaje del primer par cuya condición sea verdadera, o null. */
export function primerMensaje(
  ...pares: [boolean, string | null | undefined][]
): string | null {
  for (const [cond, msg] of pares) {
    if (cond && msg != null) return msg;
  }
  return null;
}
