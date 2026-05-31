#!/usr/bin/env node
/**
 * Targeted stock consistency checks for inventario.
 *
 * Covers sequential and concurrent redelivery idempotency, the full
 * failure -> DLQ -> divergence -> reinjection -> reconvergence cycle,
 * DLQ-depth detection, and poison-message parking.
 */

const fs = require('node:fs');
const { execFileSync, execSync } = require('node:child_process');
const amqp = require('amqplib');

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://nachopps:nachopps_secret@localhost:5672';
const REPORT_DIR = 'stress-tests/reports';
const EXCHANGE = 'nachopps_exchange';
const DLX = 'NACHOPPS_DLX';
const INVENTARIO_DLQ = 'dlq.inventario_queue';
const INVENTARIO_PARKING = 'parking.inventario_queue';
const FORCE_DLQ_MARKER = '__QA_INVENTARIO_FORCE_DLQ__';
const MAX_REINJECTIONS = Number.parseInt(process.env.MAX_REINJECTIONS || '2', 10);
const STOCK_ITERATIONS = Number.parseInt(process.env.STOCK_ITERATIONS || '1', 10);
const STOCK_HIGH_CONTENTION = process.env.STOCK_HIGH_CONTENTION === '1';

const results = [];
let token = '';
let mesaCounter = Date.now() % 1000000000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unique(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextMesaNumero() {
  mesaCounter += 1;
  return 1000000000 + mesaCounter;
}

async function req(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.token !== false && token) headers.Authorization = `Bearer ${token}`;
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return { ok: res.ok, status: res.status, ms: Date.now() - started, data };
  } catch (error) {
    return { ok: false, status: 0, ms: Date.now() - started, error: error.message };
  }
}

function entity(data, key) {
  return data?.[key] || data;
}

function sqlValue(value) {
  return String(value).replace(/'/g, "''");
}

function psql(container, db, sql) {
  return execFileSync('docker', [
    'exec',
    container,
    'psql',
    '-U',
    'nachopps',
    '-d',
    db,
    '-tAc',
    sql,
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

async function waitFor(label, fn, predicate, timeoutMs = 15000, intervalMs = 300) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await fn();
    if (predicate(last)) return last;
    await sleep(intervalMs);
  }
  throw new Error(`${label} timed out. Last value: ${JSON.stringify(last?.data ?? last)}`);
}

async function login() {
  const res = await req('POST', '/identidad/auth/login', {
    email: 'admin@nachopps.pe',
    password: 'nachopps123',
  }, { token: false });
  if (!res.ok || !res.data?.access_token) {
    throw new Error(`Login failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  token = res.data.access_token;
}

async function createMesa(label = 'QA-STOCK-IDEMPOTENCY') {
  let lastError = null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const res = await req('POST', '/mesas', {
      numero: nextMesaNumero(),
      capacidad: 4,
      ubicacion: label,
    });
    if (res.ok) {
      const mesa = entity(res.data, 'mesa');
      await waitForMesaProjection(mesa.id);
      return mesa;
    }
    lastError = res;
    if (res.status !== 409 && res.status !== 0 && res.status < 500) break;
    await sleep(200 * (attempt + 1));
  }
  throw new Error(`Could not create mesa: ${lastError?.status} ${JSON.stringify(lastError?.data ?? lastError?.error)}`);
}

async function createProduct(stockActual, namePrefix = 'QA Producto Idempotente') {
  const catRes = await req('POST', '/inventario/categorias', {
    nombre: unique('QA Idempotencia'),
    descripcion: 'Categoria creada por prueba de stock idempotente',
  });
  if (!catRes.ok) throw new Error(`Could not create categoria: ${catRes.status} ${JSON.stringify(catRes.data)}`);
  const categoria = entity(catRes.data, 'categoria');

  const prodRes = await req('POST', '/inventario/productos', {
    categoriaId: categoria.id,
    nombre: unique(namePrefix),
    descripcion: 'Producto creado por prueba de stock idempotente',
    precio: 14.5,
    disponible: true,
    stockActual,
  });
  if (!prodRes.ok) throw new Error(`Could not create producto: ${prodRes.status} ${JSON.stringify(prodRes.data)}`);
  const product = entity(prodRes.data, 'producto');
  await waitForProductProjection(product.id);
  return product;
}

async function waitForMesaProjection(mesaId) {
  const id = sqlValue(mesaId);
  await waitFor(
    'mesa projection in pedidos',
    async () => {
      try {
        return { ok: true, count: Number.parseInt(psql('nachopps-db-pedidos', 'pedidos_db', `select count(*) from mesas_local where id = '${id}';`) || '0', 10) };
      } catch (error) {
        return { ok: false, count: 0, error: error.message };
      }
    },
    (probe) => probe.ok && probe.count > 0,
  );
}

async function waitForProductProjection(productId) {
  const id = sqlValue(productId);
  await waitFor(
    'product projection in pedidos',
    async () => {
      try {
        return { ok: true, count: Number.parseInt(psql('nachopps-db-pedidos', 'pedidos_db', `select count(*) from productos_locales where id = '${id}';`) || '0', 10) };
      } catch (error) {
        return { ok: false, count: 0, error: error.message };
      }
    },
    (probe) => probe.ok && probe.count > 0,
  );
}

async function getProduct(productId) {
  const res = await req('GET', `/inventario/productos/${productId}`);
  if (!res.ok) throw new Error(`Could not read product: ${res.status} ${JSON.stringify(res.data)}`);
  return entity(res.data, 'producto');
}

function getPedidosLocalStock(productId) {
  const id = sqlValue(productId);
  const out = psql('nachopps-db-pedidos', 'pedidos_db', `select coalesce("stockActual"::text, 'NULL') from productos_locales where id = '${id}';`);
  return out === 'NULL' ? null : Number.parseInt(out, 10);
}

function getIdempotencyUniqueEvidence() {
  const indexName = psql(
    'nachopps-db-inventario',
    'inventario_db',
    "select indexname from pg_indexes where tablename = 'idempotency_keys' and indexdef ilike '%UNIQUE%' and indexdef ilike '%key%';",
  );
  return {
    schema: 'apps/servicio-inventario/prisma/schema.prisma: IdempotencyKey.key @unique',
    migration: 'apps/servicio-inventario/prisma/migrations/20260529000000_add_idempotency_keys/migration.sql',
    dbIndex: indexName || null,
  };
}

async function withChannel(fn) {
  const conn = await amqp.connect(RABBITMQ_URI);
  try {
    const channel = await conn.createConfirmChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertExchange(DLX, 'topic', { durable: true });
    await channel.assertQueue(INVENTARIO_DLQ, { durable: true });
    await channel.assertQueue(INVENTARIO_PARKING, { durable: true });
    await channel.bindQueue(INVENTARIO_DLQ, DLX, INVENTARIO_DLQ);
    const result = await fn(channel);
    await channel.waitForConfirms();
    await channel.close();
    return result;
  } finally {
    await conn.close();
  }
}

function encodePedidoMessage(pedido) {
  return Buffer.from(JSON.stringify({ pattern: 'pedido.creado', data: { pedido } }));
}

function encodeProductoActualizadoMessage(payload) {
  return Buffer.from(JSON.stringify({ pattern: 'producto.actualizado', data: payload }));
}

async function publishPedidoCreado(pedido, headers = {}) {
  await withChannel(async (channel) => {
    channel.publish(
      EXCHANGE,
      'pedido.creado',
      encodePedidoMessage(pedido),
      { contentType: 'application/json', headers },
    );
  });
}

async function publishDuplicatePedidoConcurrently(pedido, count) {
  await withChannel(async (channel) => {
    for (let i = 0; i < count; i += 1) {
      channel.publish(
        EXCHANGE,
        'pedido.creado',
        encodePedidoMessage(pedido),
        {
          contentType: 'application/json',
          headers: { 'x-qa-duplicate-index': String(i) },
        },
      );
    }
  });
}

async function publishProductoActualizado(payload, headers = {}) {
  await withChannel(async (channel) => {
    channel.publish(EXCHANGE, 'producto.actualizado', encodeProductoActualizadoMessage(payload), {
      contentType: 'application/json',
      headers,
    });
  });
}

async function publishProductoActualizadoConcurrently(payload, count) {
  await withChannel(async (channel) => {
    for (let i = 0; i < count; i += 1) {
      channel.publish(EXCHANGE, 'producto.actualizado', encodeProductoActualizadoMessage(payload), {
        contentType: 'application/json',
        headers: { 'x-qa-reverse-duplicate-index': String(i) },
      });
    }
  });
}

async function probeInventoryDlq() {
  const marker = `qa-dlq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return withChannel(async (channel) => {
    channel.sendToQueue(INVENTARIO_DLQ, Buffer.from(JSON.stringify({ marker })), { contentType: 'application/json' });
    await channel.waitForConfirms();

    const msg = await waitFor(
      'inventory DLQ marker',
      async () => channel.get(INVENTARIO_DLQ, { noAck: false }),
      (value) => Boolean(value),
      5000,
      200,
    );
    const body = JSON.parse(msg.content.toString('utf8'));
    channel.ack(msg);
    return body.marker === marker;
  });
}

async function getDlqMessage(queue = INVENTARIO_DLQ, timeoutMs = 12000) {
  return withChannel(async (channel) => {
    const msg = await waitFor(
      `${queue} message`,
      async () => channel.get(queue, { noAck: false }),
      (value) => Boolean(value),
      timeoutMs,
      500,
    );
    return { channel, msg };
  });
}

async function reinyectarPrimerMensajeInventarioDlq({ corregirPayload = false } = {}) {
  const conn = await amqp.connect(RABBITMQ_URI);
  try {
    const channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(INVENTARIO_DLQ, { durable: true });
    const msg = await waitFor(
      `${INVENTARIO_DLQ} message`,
      async () => channel.get(INVENTARIO_DLQ, { noAck: false }),
      (value) => Boolean(value),
      12000,
      500,
    );
    let body = JSON.parse(msg.content.toString('utf8'));
    if (corregirPayload) {
      body = {
        ...body,
        data: {
          ...body.data,
          pedido: {
            ...body.data?.pedido,
            items: (body.data?.pedido?.items || []).map((item) => ({
              ...item,
              notas: item.notas === FORCE_DLQ_MARKER ? undefined : item.notas,
            })),
          },
        },
      };
    }
    const headers = {
      ...(msg.properties.headers || {}),
      'x-reinjection-count': String(Number.parseInt(msg.properties.headers?.['x-reinjection-count'] || '0', 10) + 1),
    };
    channel.publish(EXCHANGE, 'pedido.creado', Buffer.from(JSON.stringify(body)), {
      contentType: 'application/json',
      headers,
    });
    channel.ack(msg);
    await channel.close();
    return body.data?.pedido?.id;
  } finally {
    await conn.close();
  }
}

async function parkPoisonMessageWhenLimitReached(queue = INVENTARIO_DLQ) {
  const conn = await amqp.connect(RABBITMQ_URI);
  try {
    const channel = await conn.createConfirmChannel();
    await channel.assertQueue(queue, { durable: true });
    await channel.assertQueue(INVENTARIO_PARKING, { durable: true });
    const msg = await channel.get(queue, { noAck: false });
    if (!msg) {
      await channel.close();
      return { parked: false, reason: 'empty' };
    }

    const headers = msg.properties.headers || {};
    const reinjections = Number.parseInt(headers['x-reinjection-count'] || '0', 10);
    if (reinjections >= MAX_REINJECTIONS) {
      channel.sendToQueue(INVENTARIO_PARKING, msg.content, {
        contentType: msg.properties.contentType || 'application/json',
        headers: {
          ...headers,
          'x-parked-reason': `reinjection limit ${MAX_REINJECTIONS}`,
        },
        persistent: true,
      });
      await channel.waitForConfirms();
      channel.ack(msg);
      await channel.close();
      return { parked: true, reinjections };
    }

    channel.nack(msg, false, true);
    await channel.close();
    return { parked: false, reinjections };
  } finally {
    await conn.close();
  }
}

async function rabbitQueuesRaw() {
  try {
    return execSync(
      'docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
  } catch (error) {
    return `RabbitMQ check failed: ${error.message}`;
  }
}

async function rabbitQueues() {
  const raw = await rabbitQueuesRaw();
  const rows = raw
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('Timeout:') && !line.startsWith('Listing queues') && !line.startsWith('name\t'))
    .map((line) => {
      const [name, ready, unacked, consumers] = line.split(/\t/);
      return {
        name,
        messages_ready: Number.parseInt(ready || '0', 10),
        messages_unacknowledged: Number.parseInt(unacked || '0', 10),
        consumers: Number.parseInt(consumers || '0', 10),
      };
    })
    .filter((row) => row.name);
  return { raw, rows };
}

function assertNoDlqReady(rows) {
  return rows
    .filter((row) => row.name.startsWith('dlq.') && row.messages_ready > 0)
    .map((row) => ({ name: row.name, messages_ready: row.messages_ready }));
}

function assertNoMonitoredFailureReady(rows) {
  return rows
    .filter((row) => (row.name.startsWith('dlq.') || row.name.startsWith('parking.')) && row.messages_ready > 0)
    .map((row) => ({ name: row.name, messages_ready: row.messages_ready }));
}

function assertNoUnexpectedQueueBacklog(rows) {
  return rows
    .filter((row) => row.messages_ready > 0 || row.messages_unacknowledged > 0)
    .map((row) => ({
      name: row.name,
      messages_ready: row.messages_ready,
      messages_unacknowledged: row.messages_unacknowledged,
    }));
}

async function purgeQueue(queue) {
  try {
    execFileSync('docker', ['exec', 'nachopps-rabbitmq', 'rabbitmqctl', 'purge_queue', queue], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    // The queue may not exist in very old local runs. The assertions will catch real residue.
  }
}

async function scenarioT0StockAuthority() {
  return {
    label: 'T0 autoridad de stock y direccion de sync',
    invariant: true,
    details: {
      oversellGuard: 'servicio-pedidos.productos_locales, decrementado transaccionalmente al crear pedido',
      reportingSource: 'servicio-inventario.productos, actualizado asincronicamente por pedido.creado',
      risk: 'servicio-pedidos consume producto.actualizado desde inventario; un inventario stale-alto podria re-inflar productos_locales si se emite una actualizacion stale.',
      evidence: [
        'apps/servicio-pedidos/src/app/app.service.ts:persistirPedido usa productoLocal.updateMany(... stockActual decrement ...)',
        'apps/servicio-pedidos/src/app/events.controller.ts escucha producto.creado/producto.actualizado y llama upsertProductoLocal',
        'apps/servicio-inventario/src/app/app.service.ts procesa pedido.creado y emite producto.actualizado',
      ],
    },
  };
}

async function scenarioRedeliveryIdempotente() {
  const stockInicial = 12;
  const cantidad = 4;
  const mesa = await createMesa();
  const product = await createProduct(stockInicial);

  const pedidoRes = await req('POST', '/pedidos', {
    mesaId: mesa.id,
    items: [{ productoId: product.id, cantidad, area: 'COCINA' }],
  });
  if (!pedidoRes.ok) throw new Error(`Could not create pedido: ${pedidoRes.status} ${JSON.stringify(pedidoRes.data)}`);
  const pedido = entity(pedidoRes.data, 'pedido');

  await waitFor(
    'stock after first pedido.creado',
    () => getProduct(product.id),
    (probe) => probe.stockActual === stockInicial - cantidad,
  );

  await publishPedidoCreado(pedido);
  await sleep(2500);
  const afterDuplicate = await getProduct(product.id);

  return {
    label: 'D1 redelivery secuencial idempotente pedido.creado',
    invariant: afterDuplicate.stockActual === stockInicial - cantidad,
    details: {
      pedidoId: pedido.id,
      productId: product.id,
      stockInicial,
      cantidad,
      stockFinal: afterDuplicate.stockActual,
    },
  };
}

async function scenarioRedeliveryConcurrente() {
  const stockInicial = 20;
  const cantidad = 5;
  const duplicateCount = Number.parseInt(process.env.STOCK_DUPLICATE_REDELIVERIES || '12', 10);
  const mesa = await createMesa('QA-STOCK-D1C');
  const product = await createProduct(stockInicial, 'QA Producto D1c');
  const pedido = {
    id: `pedido-d1c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mesaId: mesa.id,
    numeroMesa: mesa.numero,
    estado: 'PENDIENTE',
    total: 72.5,
    createdAt: new Date().toISOString(),
    items: [{ productoId: product.id, nombre: product.nombre, cantidad, precioUnitario: 14.5, area: 'COCINA' }],
  };

  await publishDuplicatePedidoConcurrently(pedido, duplicateCount);
  await waitFor(
    'stock after concurrent duplicate redelivery',
    () => getProduct(product.id),
    (probe) => probe.stockActual === stockInicial - cantidad,
    20000,
    300,
  );
  await sleep(2500);
  const afterDuplicates = await getProduct(product.id);
  const queues = await rabbitQueues();
  const dlqResidue = assertNoDlqReady(queues.rows);

  return {
    label: 'D1c redelivery concurrente idempotente',
    invariant: afterDuplicates.stockActual === stockInicial - cantidad && dlqResidue.length === 0,
    details: {
      duplicateCount,
      pedidoId: pedido.id,
      productId: product.id,
      stockInicial,
      cantidad,
      stockFinal: afterDuplicates.stockActual,
      uniqueEvidence: getIdempotencyUniqueEvidence(),
      dlqResidue,
    },
  };
}

async function scenarioReverseReposicionIdempotente() {
  const stockInicial = 10;
  const stockDelta = 5;
  const duplicateCount = Number.parseInt(process.env.STOCK_REVERSE_DUPLICATES || '12', 10);
  const product = await createProduct(stockInicial, 'QA Producto R1');
  const payload = {
    eventId: `repo-r1-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    stockActual: stockInicial + 100,
    stockDelta,
    stockSyncMode: 'REPOSICION',
    categoriaNombre: product.categoria?.nombre ?? 'COCINA',
    disponible: true,
  };

  await publishProductoActualizado(payload);
  await waitFor(
    'R1 sequential reverse replenishment applied once',
    async () => getPedidosLocalStock(product.id),
    (value) => value === stockInicial + stockDelta,
    12000,
    300,
  );
  await publishProductoActualizado(payload);
  await publishProductoActualizadoConcurrently(payload, duplicateCount);
  await sleep(2500);
  const stockFinal = getPedidosLocalStock(product.id);
  const queues = await rabbitQueues();
  const residue = assertNoMonitoredFailureReady(queues.rows);

  return {
    label: 'R1 reposicion inversa idempotente secuencial y concurrente',
    invariant: stockFinal === stockInicial + stockDelta && residue.length === 0,
    details: {
      duplicateCount,
      eventId: payload.eventId,
      productId: product.id,
      stockInicial,
      stockDelta,
      stockFinal,
      uniqueEvidence: {
        schema: 'apps/servicio-pedidos/prisma/schema.prisma: IdempotencyKey.key @unique',
        migration: 'apps/servicio-pedidos/prisma/migrations/20260529001000_add_idempotency_keys/migration.sql',
      },
      residue,
    },
  };
}

async function scenarioReposicionDeltaVentanaStale() {
  await purgeQueue(INVENTARIO_DLQ);
  const stockInicial = 12;
  const consumo = 4;
  const reposicion = 10;
  const mesa = await createMesa('QA-STOCK-R2');
  const product = await createProduct(stockInicial, 'QA Producto R2');
  const pedidoRes = await req('POST', '/pedidos', {
    mesaId: mesa.id,
    items: [{ productoId: product.id, cantidad: consumo, area: 'COCINA', notas: FORCE_DLQ_MARKER }],
  });
  if (!pedidoRes.ok) throw new Error(`Could not create R2 pedido: ${pedidoRes.status} ${JSON.stringify(pedidoRes.data)}`);

  await waitFor(
    'R2 pedidos projection discounted before replenishment',
    async () => getPedidosLocalStock(product.id),
    (value) => value === stockInicial - consumo,
    12000,
    300,
  );
  await waitFor(
    'R2 forced consumo lands in DLQ',
    async () => {
      const queues = await rabbitQueues();
      return queues.rows.find((row) => row.name === INVENTARIO_DLQ)?.messages_ready || 0;
    },
    (value) => value >= 1,
    18000,
    500,
  );

  const reposicionRes = await req('PATCH', `/inventario/productos/${product.id}/stock`, { stock: reposicion });
  if (!reposicionRes.ok) throw new Error(`Could not replenish product: ${reposicionRes.status} ${JSON.stringify(reposicionRes.data)}`);

  const expectedDuringStale = stockInicial - consumo + reposicion;
  const pedidosDuranteStale = await waitFor(
    'R2 replenishment applied as delta during stale inventory window',
    async () => getPedidosLocalStock(product.id),
    (value) => value === expectedDuringStale,
    15000,
    300,
  );

  await reinyectarPrimerMensajeInventarioDlq({ corregirPayload: true });
  const inventarioFinal = await waitFor(
    'R2 inventory reconverged after stale-window replenishment',
    () => getProduct(product.id),
    (probe) => probe.stockActual === expectedDuringStale,
    20000,
    300,
  );
  const pedidosFinal = getPedidosLocalStock(product.id);

  return {
    label: 'R2 reposicion como delta durante ventana stale',
    invariant: pedidosDuranteStale === expectedDuringStale && pedidosFinal === expectedDuringStale && inventarioFinal.stockActual === expectedDuringStale,
    details: {
      productId: product.id,
      stockInicial,
      consumo,
      reposicion,
      absoluteStaleWouldHaveBeen: stockInicial + reposicion,
      expectedDuringStale,
      pedidosDuranteStale,
      pedidosFinal,
      inventarioFinal: inventarioFinal.stockActual,
    },
  };
}

async function scenarioStockSyncModeTrustBoundary() {
  const product = await createProduct(10, 'QA Producto R7');
  const badPayload = {
    eventId: `bad-mode-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    id: product.id,
    nombre: product.nombre,
    precio: product.precio,
    stockActual: 99,
    stockDelta: -4,
    stockSyncMode: 'REPOSICION',
    categoriaNombre: product.categoria?.nombre ?? 'COCINA',
    disponible: true,
  };

  await publishProductoActualizado(badPayload);
  await sleep(2500);
  const stockFinal = getPedidosLocalStock(product.id);

  return {
    label: 'T7 consumo mal etiquetado no infla stock local',
    invariant: stockFinal === 10,
    details: {
      productId: product.id,
      stockInicial: 10,
      maliciousLabel: badPayload.stockSyncMode,
      stockDelta: badPayload.stockDelta,
      stockActualPayload: badPayload.stockActual,
      stockFinal,
      rule: 'REPOSICION solo puede aumentar si stockDelta es positivo y el evento no fue procesado antes',
    },
  };
}

async function scenarioDlqInventario() {
  const ok = await probeInventoryDlq();
  return {
    label: 'DLQ inventario declarada y enrutable',
    invariant: ok,
    details: {
      dlx: DLX,
      dlq: INVENTARIO_DLQ,
      recovery: 'Si el consumidor agota reintentos, RabbitMQRetryInterceptor hace nack(false) y RabbitMQ enruta a esta DLQ.',
    },
  };
}

async function scenarioD2ReconciliacionEndToEnd() {
  await purgeQueue(INVENTARIO_DLQ);
  const stockInicial = 13;
  const cantidad = 4;
  const mesa = await createMesa('QA-STOCK-DLQ-RECOVERY');
  const product = await createProduct(stockInicial, 'QA Producto D2');
  const pedidoRes = await req('POST', '/pedidos', {
    mesaId: mesa.id,
    items: [{ productoId: product.id, cantidad, area: 'COCINA', notas: FORCE_DLQ_MARKER }],
  });
  if (!pedidoRes.ok) throw new Error(`Could not create pedido: ${pedidoRes.status} ${JSON.stringify(pedidoRes.data)}`);
  const pedido = entity(pedidoRes.data, 'pedido');

  const pedidosStock = await waitFor(
    'pedidos projection discounted before inventory recovery',
    async () => getPedidosLocalStock(product.id),
    (value) => value === stockInicial - cantidad,
    12000,
    300,
  );
  const inventarioBefore = await getProduct(product.id);
  const dlqReady = await waitFor(
    'forced pedido.creado lands in inventory DLQ',
    async () => {
      const queues = await rabbitQueues();
      return queues.rows.find((row) => row.name === INVENTARIO_DLQ)?.messages_ready || 0;
    },
    (value) => value >= 1,
    18000,
    500,
  );

  await reinyectarPrimerMensajeInventarioDlq({ corregirPayload: true });
  const inventarioAfter = await waitFor(
    'inventory reconverged after DLQ reinjection',
    () => getProduct(product.id),
    (probe) => probe.stockActual === stockInicial - cantidad,
    20000,
    300,
  );
  const queuesAfter = await rabbitQueues();
  const dlqAfter = queuesAfter.rows.find((row) => row.name === INVENTARIO_DLQ);

  return {
    label: 'D2 fallo DLQ divergencia reinyeccion reconvergencia',
    invariant:
      pedidosStock === stockInicial - cantidad &&
      inventarioBefore.stockActual === stockInicial &&
      dlqReady >= 1 &&
      inventarioAfter.stockActual === stockInicial - cantidad &&
      (!dlqAfter || dlqAfter.messages_ready === 0),
    details: {
      pedidoId: pedido.id,
      productId: product.id,
      stockInicial,
      cantidad,
      pedidosStockDuranteDivergencia: pedidosStock,
      inventarioStockDuranteDivergencia: inventarioBefore.stockActual,
      dlqReadyDuranteFallo: dlqReady,
      inventarioStockFinal: inventarioAfter.stockActual,
      dlqFinal: dlqAfter || null,
    },
  };
}

async function scenarioDlqDetection() {
  const marker = `qa-alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await withChannel(async (channel) => {
    channel.sendToQueue(INVENTARIO_DLQ, Buffer.from(JSON.stringify({ marker })), {
      contentType: 'application/json',
      headers: { 'x-qa-alert-probe': marker },
    });
    await channel.waitForConfirms();
  });
  const queuesWithDlq = await waitFor(
    'DLQ depth alert sees marker',
    rabbitQueues,
    (queues) => assertNoDlqReady(queues.rows).some((row) => row.name === INVENTARIO_DLQ),
    5000,
    300,
  );
  const detected = assertNoMonitoredFailureReady(queuesWithDlq.rows);
  await purgeQueue(INVENTARIO_DLQ);

  return {
    label: 'T3 deteccion de profundidad DLQ',
    invariant: detected.some((row) => row.name === INVENTARIO_DLQ),
    details: {
      detected,
      productionAlertTarget: 'health/job que consulte RabbitMQ management/rabbitmqctl y alerte si cualquier dlq.* o parking.* tiene messages_ready > 0',
      cleanup: `${INVENTARIO_DLQ} purgada tras la prueba`,
    },
  };
}

async function scenarioParkingDetection() {
  const marker = `qa-parking-alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await withChannel(async (channel) => {
    channel.sendToQueue(INVENTARIO_PARKING, Buffer.from(JSON.stringify({ marker })), {
      contentType: 'application/json',
      headers: { 'x-qa-parking-alert-probe': marker },
    });
    await channel.waitForConfirms();
  });

  const queuesWithParking = await waitFor(
    'parking depth alert sees marker',
    rabbitQueues,
    (queues) => assertNoMonitoredFailureReady(queues.rows).some((row) => row.name === INVENTARIO_PARKING),
    5000,
    300,
  );
  const detected = assertNoMonitoredFailureReady(queuesWithParking.rows);
  await purgeQueue(INVENTARIO_PARKING);

  return {
    label: 'T9 deteccion de profundidad parking',
    invariant: detected.some((row) => row.name === INVENTARIO_PARKING),
    details: {
      detected,
      retention: 'idempotency_keys se purga por cron cada hora con retencion de 7 dias en inventario y pedidos',
      cleanup: `${INVENTARIO_PARKING} purgada tras la prueba`,
    },
  };
}

async function scenarioPoisonParking() {
  await purgeQueue(INVENTARIO_DLQ);
  await purgeQueue(INVENTARIO_PARKING);
  const marker = `qa-poison-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await withChannel(async (channel) => {
    channel.sendToQueue(INVENTARIO_DLQ, Buffer.from(JSON.stringify({ marker, poison: true })), {
      contentType: 'application/json',
      headers: { 'x-reinjection-count': String(MAX_REINJECTIONS) },
      persistent: true,
    });
    await channel.waitForConfirms();
  });

  const decision = await parkPoisonMessageWhenLimitReached(INVENTARIO_DLQ);
  const parked = await withChannel(async (channel) => {
    const msg = await channel.get(INVENTARIO_PARKING, { noAck: false });
    if (!msg) return null;
    const body = JSON.parse(msg.content.toString('utf8'));
    channel.ack(msg);
    return {
      marker: body.marker,
      reason: msg.properties.headers?.['x-parked-reason'],
    };
  });
  await purgeQueue(INVENTARIO_PARKING);

  return {
    label: 'T4 mensaje veneno aparcado tras tope de reinyeccion',
    invariant: decision.parked === true && parked?.marker === marker,
    details: {
      maxReinjections: MAX_REINJECTIONS,
      decision,
      parked,
      parkingQueue: INVENTARIO_PARKING,
    },
  };
}

async function scenarioFinalQueuesClean() {
  const queues = await rabbitQueues();
  const backlog = assertNoUnexpectedQueueBacklog(queues.rows);
  return {
    label: 'Colas finales sin pendientes inesperados',
    invariant: backlog.length === 0,
    details: { backlog },
  };
}

function renderReport({ branch, commit, queuesBefore, queuesAfter }) {
  const passed = results.filter((r) => r.invariant).length;
  let md = `# Informe stock idempotency, DLQ y reconciliacion\n\n`;
  md += `- Fecha: ${new Date().toISOString()}\n`;
  md += `- Base URL: ${BASE}\n`;
  md += `- Rama: ${branch}\n`;
  md += `- Commit: ${commit}\n`;
  md += `- Iteraciones: ${STOCK_ITERATIONS}\n`;
  md += `- Modo alta contencion: ${STOCK_HIGH_CONTENTION ? 'si' : 'no'}\n`;
  md += `- Resultado: ${passed}/${results.length} invariantes OK\n\n`;
  md += `## Resumen\n\n`;
  md += `| Escenario | Invariante |\n`;
  md += `|---|---:|\n`;
  for (const r of results) {
    md += `| ${r.label} | ${r.invariant ? 'OK' : 'FALLA'} |\n`;
  }
  md += `\n## Detalle\n\n`;
  for (const r of results) {
    md += `### ${r.label}\n\n`;
    md += `- Invariante: ${r.invariant ? 'OK' : 'FALLA'}\n`;
    md += `- Detalle: \`${JSON.stringify(r.details)}\`\n\n`;
  }
  md += `## RabbitMQ antes\n\n\`\`\`text\n${queuesBefore.raw}\n\`\`\`\n\n`;
  md += `## RabbitMQ despues\n\n\`\`\`text\n${queuesAfter.raw}\n\`\`\`\n\n`;
  md += `## Recuperacion y deteccion\n\n`;
  md += `1. La proyeccion que previene oversell es \`servicio-pedidos.productos_locales\`; inventario reporta y emite actualizaciones asincronas.\n`;
  md += `2. Ante fallos, revisar \`${INVENTARIO_DLQ}\`, corregir causa y reinyectar a \`${EXCHANGE}\` con routing key \`pedido.creado\`.\n`;
  md += `3. El check de DLQ debe alertar si cualquier \`dlq.*\` tiene \`messages_ready > 0\`.\n`;
  md += `4. Mensajes con \`x-reinjection-count >= ${MAX_REINJECTIONS}\` se aparcan en \`${INVENTARIO_PARKING}\` para inspeccion manual.\n`;
  return md;
}

async function main() {
  console.log('NachoPps stock idempotency/DLQ runner');
  await login();
  await purgeQueue(INVENTARIO_DLQ);
  await purgeQueue(INVENTARIO_PARKING);
  const queuesBefore = await rabbitQueues();
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  const commit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
  const scenarios = STOCK_HIGH_CONTENTION
    ? [
      scenarioRedeliveryConcurrente,
      scenarioReverseReposicionIdempotente,
      scenarioFinalQueuesClean,
    ]
    : [
    scenarioT0StockAuthority,
    scenarioRedeliveryIdempotente,
    scenarioRedeliveryConcurrente,
    scenarioReverseReposicionIdempotente,
    scenarioReposicionDeltaVentanaStale,
    scenarioStockSyncModeTrustBoundary,
    scenarioDlqInventario,
    scenarioD2ReconciliacionEndToEnd,
    scenarioDlqDetection,
    scenarioParkingDetection,
    scenarioPoisonParking,
    scenarioFinalQueuesClean,
  ];

  for (let iteration = 1; iteration <= STOCK_ITERATIONS; iteration += 1) {
    for (const scenario of scenarios) {
      try {
        const result = await scenario();
        result.label = STOCK_ITERATIONS > 1 ? `${result.label} iter ${iteration}/${STOCK_ITERATIONS}` : result.label;
        result.details = { ...(result.details || {}), iteration };
        results.push(result);
        console.log(`${result.invariant ? 'OK' : 'FAIL'} ${result.label}`);
      } catch (error) {
        const label = STOCK_ITERATIONS > 1 ? `${scenario.name} iter ${iteration}/${STOCK_ITERATIONS}` : scenario.name;
        results.push({
          label,
          invariant: false,
          details: { error: error.message, iteration },
        });
        console.log(`FAIL ${label}: ${error.message}`);
      }
    }
  }

  const queuesAfter = await rabbitQueues();
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const filename = `${REPORT_DIR}/stock-idempotency-dlq-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(filename, renderReport({ branch, commit, queuesBefore, queuesAfter }), 'utf8');
  console.log(`Report saved to ${filename}`);

  if (results.some((r) => !r.invariant)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
