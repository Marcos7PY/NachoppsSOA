-- T-03: Lockout por cuenta en login
-- Campos para rastrear fallos de autenticación y bloqueo temporal de cuenta.
ALTER TABLE "Usuario"
  ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3);
