-- T-08: claim de lote del outbox con FOR UPDATE SKIP LOCKED.
-- Columna de marca de claim; el estado transitorio PUBLISHING se apoya en ella
-- para el cron de rescate (PUBLISHING huérfano > 60s → PENDING).
ALTER TABLE "outbox_events" ADD COLUMN "claimedAt" TIMESTAMP(3);
