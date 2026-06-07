-- Idempotencia HTTP (plan 1.3): almacena la respuesta para hacer replay.
-- AlterTable
ALTER TABLE "idempotency_keys" ADD COLUMN     "body" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "method" TEXT,
ADD COLUMN     "path" TEXT,
ADD COLUMN     "statusCode" INTEGER;
