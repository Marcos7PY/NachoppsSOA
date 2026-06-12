-- T-14: huella SHA-256 del cuerpo de la petición para la idempotencia HTTP.
-- Misma Idempotency-Key con un body distinto → 422 (en vez de replay silencioso).
ALTER TABLE "idempotency_keys" ADD COLUMN "requestHash" TEXT;
