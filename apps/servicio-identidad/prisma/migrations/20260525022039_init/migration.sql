/*
  Warnings:

  - You are about to drop the `idempotency_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_usuarioId_fkey";

-- DropTable
DROP TABLE "idempotency_keys";

-- DropTable
DROP TABLE "refresh_tokens";
