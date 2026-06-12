#!/usr/bin/env node
/**
 * Prueba de escalado horizontal del Outbox con 2 réplicas (plan T-09).
 *
 * Tras T-08, el `OutboxProcessor` reclama cada lote con
 * `UPDATE outbox_events SET status='PUBLISHING', "claimedAt"=now()
 *  WHERE id IN (SELECT id ... WHERE status='PENDING'
 *               ORDER BY "createdAt" LIMIT N FOR UPDATE SKIP LOCKED) RETURNING *`.
 * Esto debe permitir N réplicas por servicio sin publicar duplicados. Este
 * escenario verifica, contra una BD real (la de pedidos), dos garantías:
 *
 *   (A) Happy path: con DOS workers reclamando concurrentemente el mismo store,
 *       cada evento se reclama (= se publica) exactamente una vez.
 *   (B) Réplica muerta a mitad de lote: un worker reclama (PUBLISHING) y "muere"
 *       sin marcar PROCESSED; el cron de rescate devuelve esos PUBLISHING
 *       huérfanos (>60s) a PENDING y el otro worker los drena → cero eventos
 *       perdidos (at-least-once preservado).
 *
 * NO implementa nada del processor: replica su SQL exacto para ejercitarlo.
 *
 * Requisitos: la BD de pedidos `up` y migrada (migrate deploy). Uso:
 *   node stress-tests/run-outbox-replicas.js
 * Config por entorno: OUTBOX_DB_URL (default db-pedidos en localhost:5434).
 */
const fs = require('node:fs');
const crypto = require('node:crypto');
const { Client, Pool } = require('pg');

const DB_URL = process.env.OUTBOX_DB_URL || 'postgresql://nachopps:secret@localhost:5434/pedidos_db';
const TABLE = '"outbox_events"';
const TEST_RK = 'pedido.replicas-test'; // namespace propio; se limpia antes y después
const BATCH = 50;
const REPORT_DIR = 'stress-tests/reports';

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Claim atómico idéntico al del processor (T-08). Devuelve los ids reclamados. */
async function claimBatch(db, limit = BATCH) {
  const { rows } = await db.query(
    `UPDATE ${TABLE} SET status = 'PUBLISHING', "claimedAt" = now()
     WHERE id IN (
       SELECT id FROM ${TABLE} WHERE status = 'PENDING'
       ORDER BY "createdAt" ASC LIMIT ${limit} FOR UPDATE SKIP LOCKED
     ) RETURNING id`,
  );
  return rows.map((r) => r.id);
}

async function markProcessed(db, ids) {
  if (ids.length === 0) return;
  await db.query(`UPDATE ${TABLE} SET status = 'PROCESSED' WHERE id = ANY($1::text[])`, [ids]);
}

async function cleanTestRows(db) {
  await db.query(`DELETE FROM ${TABLE} WHERE "routingKey" = $1`, [TEST_RK]);
}

async function seed(db, n) {
  const values = [];
  const params = [];
  for (let i = 0; i < n; i += 1) {
    const base = i * 3;
    params.push(`($${base + 1}, $${base + 2}, $${base + 3}, 'PENDING', 0, now(), now())`);
    values.push(crypto.randomUUID(), TEST_RK, JSON.stringify({ seq: i }));
  }
  await db.query(
    `INSERT INTO ${TABLE} (id, "routingKey", payload, status, attempts, "createdAt", "updatedAt") VALUES ${params.join(',')}`,
    values,
  );
}

async function statusCounts(db) {
  const { rows } = await db.query(
    `SELECT status, count(*)::int AS c FROM ${TABLE} WHERE "routingKey" = $1 GROUP BY status`,
    [TEST_RK],
  );
  return Object.fromEntries(rows.map((r) => [r.status, r.c]));
}

/** Worker que drena el store reclamando lotes hasta que no quede nada PENDING. */
async function drainWorker(pool, claimedBy, workerId) {
  const db = await pool.connect();
  let empties = 0;
  try {
    while (empties < 3) {
      const ids = await claimBatch(db);
      if (ids.length === 0) {
        empties += 1;
        await sleep(15);
        continue;
      }
      empties = 0;
      for (const id of ids) {
        // Registro de quién reclamó cada id → detecta doble publicación.
        claimedBy.set(id, (claimedBy.get(id) ?? []).concat(workerId));
      }
      await markProcessed(db, ids);
    }
  } finally {
    db.release();
  }
}

// ─── Test A: exactamente una publicación por evento con 2 réplicas ──────────────
async function testExactlyOnce(pool) {
  const setup = await pool.connect();
  const N = 200;
  try {
    await cleanTestRows(setup);
    await seed(setup, N);
  } finally {
    setup.release();
  }

  const claimedBy = new Map();
  await Promise.all([
    drainWorker(pool, claimedBy, 'A'),
    drainWorker(pool, claimedBy, 'B'),
  ]);

  const dobles = [...claimedBy.values()].filter((ws) => ws.length > 1).length;
  const totalReclamados = claimedBy.size;
  record('Happy path: cada evento reclamado por exactamente un worker (sin duplicados)', dobles === 0, `${dobles} duplicados`);
  record('Happy path: los N eventos se reclamaron', totalReclamados === N, `${totalReclamados}/${N}`);

  const check = await pool.connect();
  let counts;
  try { counts = await statusCounts(check); } finally { check.release(); }
  const procesados = counts.PROCESSED ?? 0;
  const pendientes = (counts.PENDING ?? 0) + (counts.PUBLISHING ?? 0);
  record('Happy path: todos quedan PROCESSED', procesados === N, `PROCESSED=${procesados}`);
  record('Happy path: ninguno queda PENDING/PUBLISHING', pendientes === 0, `restantes=${pendientes}`);
}

// ─── Test B: cero eventos perdidos al morir una réplica a mitad de lote ─────────
async function testNoLossOnReplicaDeath(pool) {
  const setup = await pool.connect();
  const M = 100;
  try {
    await cleanTestRows(setup);
    await seed(setup, M);

    // Worker1 reclama un lote y "muere": queda PUBLISHING sin marcar PROCESSED.
    const huérfanos = await claimBatch(setup, 40);
    record('Réplica A reclama un lote y muere a mitad (queda PUBLISHING)', huérfanos.length === 40, `${huérfanos.length} en PUBLISHING`);

    // Envejecemos su claimedAt > 60s para simular el huérfano que ve el rescate.
    await setup.query(
      `UPDATE ${TABLE} SET "claimedAt" = now() - interval '2 minutes'
       WHERE "routingKey" = $1 AND status = 'PUBLISHING'`,
      [TEST_RK],
    );

    // Cron de rescate (SQL idéntico al del processor).
    const { rowCount } = await setup.query(
      `UPDATE ${TABLE} SET status = 'PENDING', "claimedAt" = NULL
       WHERE status = 'PUBLISHING' AND "claimedAt" < now() - interval '60 seconds' AND "routingKey" = $1`,
      [TEST_RK],
    );
    record('Rescate devuelve a PENDING los PUBLISHING huérfanos', rowCount === 40, `rescatados=${rowCount}`);
  } finally {
    setup.release();
  }

  // Réplica B (sana) drena todo lo que quede.
  const claimedBy = new Map();
  await drainWorker(pool, claimedBy, 'B');

  const check = await pool.connect();
  let counts;
  try { counts = await statusCounts(check); } finally { check.release(); }
  const procesados = counts.PROCESSED ?? 0;
  const perdidos = (counts.PENDING ?? 0) + (counts.PUBLISHING ?? 0);
  record('Sin pérdida: los M eventos terminan PROCESSED', procesados === M, `PROCESSED=${procesados}/${M}`);
  record('Sin pérdida: cero eventos atascados (PENDING/PUBLISHING)', perdidos === 0, `restantes=${perdidos}`);
}

async function main() {
  console.log(`\n🧪 Outbox 2-réplicas contra ${DB_URL.replace(/:[^:@/]+@/, ':***@')}\n`);

  // Verificación de precondición: la columna claimedAt (T-08) existe.
  const probe = new Client({ connectionString: DB_URL });
  await probe.connect();
  try {
    const { rows } = await probe.query(
      `SELECT 1 FROM information_schema.columns
       WHERE table_name = 'outbox_events' AND column_name = 'claimedAt'`,
    );
    record('Precondición: columna claimedAt presente (migración T-08 aplicada)', rows.length === 1);
  } finally {
    await probe.end();
  }

  const pool = new Pool({ connectionString: DB_URL, max: 6 });
  try {
    await testExactlyOnce(pool);
    await testNoLossOnReplicaDeath(pool);
    const cleanup = await pool.connect();
    try { await cleanTestRows(cleanup); } finally { cleanup.release(); }
  } finally {
    await pool.end();
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const passed = results.filter((r) => r.ok).length;
  const md = [
    `# Outbox 2-réplicas (T-09) — ${new Date().toISOString()}`,
    '',
    `Resultado: **${passed}/${results.length}** verificaciones OK`,
    '',
    '| Verificación | Resultado | Detalle |',
    '|---|---|---|',
    ...results.map((r) => `| ${r.name} | ${r.ok ? '✅' : '❌'} | ${r.detail ?? ''} |`),
    '',
  ].join('\n');
  const file = `${REPORT_DIR}/outbox-replicas-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(file, md);
  console.log(`\n📄 Reporte: ${file}`);
  if (passed !== results.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
