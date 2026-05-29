#!/usr/bin/env node
/**
 * Targeted concurrency, limits and safety checks for NachoPps.
 *
 * The runner discovers real tables/products through Kong, creates isolated QA
 * data where needed, and records scenario-level invariants in a Markdown report.
 */

const fs = require('node:fs');
const { execFileSync, execSync } = require('node:child_process');

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const CONCURRENCY = Number.parseInt(process.env.CONCURRENCY || '10', 10);
const TIMEOUT_MS = Number.parseInt(process.env.TIMEOUT_MS || '15000', 10);
const REPORT_DIR = 'stress-tests/reports';

let token = '';
const results = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unique(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

async function req(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.token !== false && token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const ms = Date.now() - started;
    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return { ok: res.ok, status: res.status, ms, data };
  } catch (error) {
    return { ok: false, status: 0, ms: Date.now() - started, error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(label, total, concurrency, worker) {
  const started = Date.now();
  const output = new Array(total);
  let next = 0;

  async function loop() {
    while (next < total) {
      const index = next++;
      const t0 = Date.now();
      try {
        const value = await worker(index);
        output[index] = { ...value, ms: value?.ms ?? Date.now() - t0 };
      } catch (error) {
        output[index] = { ok: false, status: 0, ms: Date.now() - t0, error: error.message };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, loop));
  const durationMs = Date.now() - started;
  const statuses = {};
  const latencies = [];
  for (const item of output) {
    statuses[item.status] = (statuses[item.status] || 0) + 1;
    if (Number.isFinite(item.ms)) latencies.push(item.ms);
  }
  return {
    label,
    total,
    concurrency,
    durationMs,
    responses: output,
    statuses,
    ok: output.filter((r) => r.ok).length,
    failed: output.filter((r) => !r.ok).length,
    rps: durationMs ? Number((total / (durationMs / 1000)).toFixed(2)) : 0,
    latency: {
      p50: percentile(latencies, 0.5),
      p95: percentile(latencies, 0.95),
      p99: percentile(latencies, 0.99),
      max: latencies.length ? Math.max(...latencies) : 0,
    },
  };
}

async function waitFor(label, fn, predicate, timeoutMs = 12000, intervalMs = 250) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await fn();
    if (predicate(last)) return last;
    await sleep(intervalMs);
  }
  throw new Error(`${label} timed out. Last value: ${JSON.stringify(last?.data ?? last)}`);
}

function extractArray(data, key) {
  if (Array.isArray(data)) return data;
  return data?.[key] || [];
}

function extractEntity(data, key) {
  return data?.[key] || data;
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

async function createMesa(label) {
  const res = await req('POST', '/mesas', {
    numero: Math.floor(100000 + Math.random() * 800000),
    capacidad: 4,
    ubicacion: label,
  });
  if (!res.ok) throw new Error(`Could not create mesa: ${res.status} ${JSON.stringify(res.data)}`);
  const mesa = extractEntity(res.data, 'mesa');
  await waitForMesaProjection(mesa.id);
  return mesa;
}

async function waitForMesaProjection(mesaId) {
  const safeMesaId = mesaId.replace(/'/g, "''");
  await waitFor(
    'mesa projection in pedidos',
    async () => {
      try {
        const out = execFileSync('docker', [
          'exec',
          'nachopps-db-pedidos',
          'psql',
          '-U',
          'nachopps',
          '-d',
          'pedidos_db',
          '-tAc',
          `select count(*) from mesas_local where id = '${safeMesaId}';`,
        ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { ok: true, count: Number.parseInt(out.trim() || '0', 10) };
      } catch (error) {
        return { ok: false, count: 0, error: error.message };
      }
    },
    (probe) => probe.ok && probe.count > 0,
    12000,
    300,
  );
}

async function createProduct({ stockActual = null, precio = 11.5, name = unique('QA Producto') } = {}) {
  const catRes = await req('POST', '/inventario/categorias', {
    nombre: unique('QA Concurrencia'),
    descripcion: 'Categoria creada por pruebas de concurrencia',
  });
  if (!catRes.ok) throw new Error(`Could not create categoria: ${catRes.status} ${JSON.stringify(catRes.data)}`);
  const categoria = extractEntity(catRes.data, 'categoria');

  const productBody = {
    categoriaId: categoria.id,
    nombre: name,
    descripcion: 'Producto creado por pruebas de concurrencia',
    precio,
    disponible: true,
  };
  if (stockActual !== null) productBody.stockActual = stockActual;

  const prodRes = await req('POST', '/inventario/productos', productBody);
  if (!prodRes.ok) throw new Error(`Could not create producto: ${prodRes.status} ${JSON.stringify(prodRes.data)}`);
  const product = extractEntity(prodRes.data, 'producto');

  await waitFor(
    'product readable from inventario',
    () => req('GET', `/inventario/productos/${product.id}`),
    (probe) => probe.ok,
  );
  await waitForProductProjection(product.id);
  return product;
}

async function waitForProductProjection(productId) {
  const safeProductId = productId.replace(/'/g, "''");
  await waitFor(
    'product projection in pedidos',
    async () => {
      try {
        const out = execFileSync('docker', [
          'exec',
          'nachopps-db-pedidos',
          'psql',
          '-U',
          'nachopps',
          '-d',
          'pedidos_db',
          '-tAc',
          `select count(*) from productos_locales where id = '${safeProductId}';`,
        ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { ok: true, count: Number.parseInt(out.trim() || '0', 10) };
      } catch (error) {
        return { ok: false, count: 0, error: error.message };
      }
    },
    (probe) => probe.ok && probe.count > 0,
    12000,
    300,
  );
}

async function createPedido(mesaId, productoId, cantidad = 1) {
  return req('POST', '/pedidos', {
    mesaId,
    items: [{ productoId, cantidad, area: 'COCINA' }],
  });
}

async function waitCuenta(mesaId) {
  const res = await waitFor(
    `cuenta abierta for mesa ${mesaId}`,
    () => req('GET', `/cuentas/mesa/${mesaId}`),
    (probe) => probe.ok && probe.data?.estado === 'ABIERTA',
    15000,
    250,
  );
  return res.data;
}

async function servePedidos(mesaId) {
  const res = await req('GET', `/pedidos?mesaId=${mesaId}`);
  const pedidos = extractArray(res.data, 'pedidos');
  for (const pedido of pedidos) {
    if (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_PREPARACION') {
      await req('PATCH', `/pedidos/${pedido.id}/estado`, { estado: 'ENTREGADO' });
    }
  }
}

async function payCuenta(cuenta, metodo = 'EFECTIVO') {
  return req('POST', '/caja/pagos', {
    cuentaId: cuenta.id,
    montoRecibido: cuenta.total,
    metodo,
  });
}

async function closeMesaAccount(mesaId) {
  const cuentaProbe = await req('GET', `/cuentas/mesa/${mesaId}`);
  if (!cuentaProbe.ok) return;
  await servePedidos(mesaId);
  await payCuenta(cuentaProbe.data);
  await sleep(1000);
}

async function rabbitQueues() {
  try {
    return execSync(
      'docker exec nachopps-rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    ).trim();
  } catch (error) {
    return `RabbitMQ check failed: ${error.message}`;
  }
}

async function scenarioSameMesaManyPedidos() {
  const count = Number.parseInt(process.env.SAME_MESA_ORDERS || String(CONCURRENCY), 10);
  const mesa = await createMesa('QA-CONC-SAME-MESA');
  const product = await createProduct({ stockActual: count + 20, precio: 9.75 });

  const run = await runPool('C3 misma mesa, muchos pedidos', count, count, () =>
    createPedido(mesa.id, product.id, 1),
  );

  const cuenta = await waitCuenta(mesa.id);
  const cuentaFresh = await waitFor(
    'cuenta snapshot has all successful pedidos',
    () => req('GET', `/cuentas/${cuenta.id}`),
    (probe) => probe.ok && (probe.data?.pedidos || []).length >= run.ok,
    15000,
    300,
  );
  await closeMesaAccount(mesa.id);

  return {
    ...run,
    invariant: run.failed === 0 && cuentaFresh.data.estado === 'ABIERTA' && cuentaFresh.data.pedidos.length === run.ok,
    details: {
      mesaId: mesa.id,
      productId: product.id,
      successfulPedidos: run.ok,
      cuentaId: cuentaFresh.data.id,
      cuentaEstadoAntesDeLimpieza: cuentaFresh.data.estado,
      pedidosInCuenta: cuentaFresh.data.pedidos.length,
      totalCuenta: cuentaFresh.data.total,
    },
  };
}

async function scenarioReservaSameSlot() {
  const count = Number.parseInt(process.env.RESERVA_CONFLICTS || String(CONCURRENCY), 10);
  const fecha = futureDate(20 + Math.floor(Math.random() * 200));
  const hora = `${String(18 + Math.floor(Math.random() * 4)).padStart(2, '0')}:15`;

  const run = await runPool('C7 reservas mismo slot', count, count, (i) =>
    req('POST', '/reservas', {
      clienteNombre: `QA Reserva ${i}`,
      clienteTelefono: `999${String(i).padStart(6, '0')}`,
      fecha,
      hora,
      mesaPreferida: 'QA',
      numComensales: 2,
    }),
  );

  const successCount = run.responses.filter((r) => r.status === 201 || r.status === 200).length;
  const conflictCount = run.responses.filter((r) => r.status === 409).length;
  const list = await req('GET', '/reservas');
  const matching = extractArray(list.data, 'reservas').filter(
    (r) => r.fecha === fecha && r.hora === hora && r.estado !== 'CANCELADA',
  );

  return {
    ...run,
    invariant: !run.responses.some((r) => r.status === 0) && successCount === 1 && matching.length === 1,
    details: { fecha, hora, successCount, conflictCount, activeReservationsForSlot: matching.length },
  };
}

async function scenarioDuplicatePayment() {
  const count = Number.parseInt(process.env.DUPLICATE_PAYMENTS || String(CONCURRENCY), 10);
  const mesa = await createMesa('QA-CONC-DUP-PAY');
  const product = await createProduct({ stockActual: count + 5, precio: 13.25 });
  const pedido = await createPedido(mesa.id, product.id, 1);
  if (!pedido.ok) throw new Error(`Could not create payment setup pedido: ${pedido.status}`);
  const cuenta = await waitCuenta(mesa.id);
  await servePedidos(mesa.id);

  const run = await runPool('C5 pago duplicado concurrente', count, count, () =>
    payCuenta(cuenta, 'EFECTIVO'),
  );

  await sleep(2500);
  const trans = await req('GET', '/caja');
  const txs = extractArray(trans.data, 'transacciones').filter((t) => t.cuentaId === cuenta.id);
  const cuentaFinal = await req('GET', `/cuentas/${cuenta.id}`);

  return {
    ...run,
    invariant: txs.length === 1 && cuentaFinal.data?.estado === 'CERRADA',
    details: {
      cuentaId: cuenta.id,
      successPayments: run.responses.filter((r) => r.ok).length,
      transactionsForCuenta: txs.length,
      finalCuentaEstado: cuentaFinal.data?.estado,
      statuses: run.statuses,
    },
  };
}

async function scenarioSharedStock() {
  const stock = Number.parseInt(process.env.STOCK_SHARED || String(CONCURRENCY), 10);
  const attempts = Number.parseInt(process.env.STOCK_ATTEMPTS || String(stock + Math.max(2, Math.ceil(stock / 5))), 10);
  const product = await createProduct({ stockActual: stock, precio: 7.5 });
  const mesas = [];
  for (let i = 0; i < attempts; i += 1) {
    mesas.push(await createMesa('QA-CONC-STOCK'));
  }

  const run = await runPool('C6 stock compartido', attempts, Math.min(CONCURRENCY, attempts), (i) =>
    createPedido(mesas[i].id, product.id, 1),
  );

  await sleep(2500);
  const productRes = await req('GET', `/inventario/productos/${product.id}`);
  const stockActual = productRes.data?.stockActual ?? productRes.data?.producto?.stockActual;
  const successes = run.responses.filter((r) => r.ok).length;

  for (const mesa of mesas) {
    await closeMesaAccount(mesa.id).catch(() => undefined);
  }

  return {
    ...run,
    invariant:
      !run.responses.some((r) => r.status === 0) &&
      run.responses.filter((r) => r.status === 400).length === attempts - successes &&
      successes <= stock &&
      stockActual >= 0,
    details: {
      productId: product.id,
      stockInicial: stock,
      attempts,
      successfulPedidos: successes,
      stockActual,
      statuses: run.statuses,
    },
  };
}

async function scenarioSecurityAndLimits() {
  const probes = [
    ['GET /mesas sin token', () => req('GET', '/mesas', undefined, { token: false })],
    ['GET /pedidos sin token', () => req('GET', '/pedidos', undefined, { token: false })],
    ['GET /cuentas sin token', () => req('GET', '/cuentas', undefined, { token: false })],
    ['GET /inventario/productos sin token', () => req('GET', '/inventario/productos', undefined, { token: false })],
    ['token invalido', () => req('GET', '/cuentas', undefined, { headers: { Authorization: 'Bearer basura' }, token: false })],
    ['pedido cantidad cero', async () => {
      const mesas = extractArray((await req('GET', '/mesas')).data, 'mesas');
      const productos = extractArray((await req('GET', '/inventario/productos')).data, 'productos');
      return req('POST', '/pedidos', {
        mesaId: mesas[0]?.id,
        items: [{ productoId: productos[0]?.id, cantidad: 0 }],
      });
    }],
  ];

  const responses = [];
  for (const [label, fn] of probes) {
    const res = await fn();
    responses.push({ label, status: res.status, ok: res.status >= 400 && res.status < 500, ms: res.ms });
  }

  return {
    label: 'S3/S4 seguridad y limites basicos',
    total: responses.length,
    concurrency: 1,
    durationMs: responses.reduce((sum, r) => sum + r.ms, 0),
    responses,
    statuses: responses.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {}),
    ok: responses.filter((r) => r.ok).length,
    failed: responses.filter((r) => !r.ok).length,
    rps: 0,
    latency: {
      p50: percentile(responses.map((r) => r.ms), 0.5),
      p95: percentile(responses.map((r) => r.ms), 0.95),
      p99: percentile(responses.map((r) => r.ms), 0.99),
      max: Math.max(...responses.map((r) => r.ms)),
    },
    invariant: responses.every((r) => r.ok),
    details: { probes: responses },
  };
}

function renderReport({ commit, branch, queuesBefore, queuesAfter }) {
  const now = new Date().toISOString();
  const passed = results.filter((r) => r.invariant).length;
  const failed = results.length - passed;
  let md = `# Informe de concurrencia, limites y seguridad\n\n`;
  md += `- Fecha: ${now}\n`;
  md += `- Base URL: ${BASE}\n`;
  md += `- Rama: ${branch}\n`;
  md += `- Commit: ${commit}\n`;
  md += `- Concurrencia base: ${CONCURRENCY}\n`;
  md += `- Resultado: ${passed}/${results.length} invariantes OK\n\n`;

  md += `## Resumen\n\n`;
  md += `| Escenario | Invariante | Requests | Status | p95 | RPS |\n`;
  md += `|---|---:|---:|---|---:|---:|\n`;
  for (const r of results) {
    md += `| ${r.label} | ${r.invariant ? 'OK' : 'FALLA'} | ${r.total} | ${JSON.stringify(r.statuses)} | ${r.latency.p95}ms | ${r.rps} |\n`;
  }

  md += `\n## Detalle\n\n`;
  for (const r of results) {
    md += `### ${r.label}\n\n`;
    md += `- Invariante: ${r.invariant ? 'OK' : 'FALLA'}\n`;
    md += `- Duracion: ${r.durationMs}ms\n`;
    md += `- Latencia: p50=${r.latency.p50}ms, p95=${r.latency.p95}ms, p99=${r.latency.p99}ms, max=${r.latency.max}ms\n`;
    md += `- Detalle: \`${JSON.stringify(r.details || {})}\`\n\n`;
  }

  md += `## RabbitMQ antes\n\n\`\`\`text\n${queuesBefore}\n\`\`\`\n\n`;
  md += `## RabbitMQ despues\n\n\`\`\`text\n${queuesAfter}\n\`\`\`\n\n`;
  md += `## Decision\n\n`;
  md += failed === 0
    ? `- Aceptado: la corrida focalizada no encontro inconsistencias con la concurrencia configurada.\n`
    : `- Requiere fix: al menos un invariante de concurrencia/seguridad fallo.\n`;

  return md;
}

async function main() {
  console.log('NachoPps targeted concurrency runner');
  console.log(`Base URL: ${BASE}`);
  console.log(`Concurrency: ${CONCURRENCY}`);

  await login();
  console.log('Auth OK');

  const queuesBefore = await rabbitQueues();
  const commit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();

  for (const scenario of [
    scenarioSameMesaManyPedidos,
    scenarioReservaSameSlot,
    scenarioDuplicatePayment,
    scenarioSharedStock,
    scenarioSecurityAndLimits,
  ]) {
    const started = Date.now();
    try {
      const result = await scenario();
      results.push(result);
      console.log(`${result.invariant ? 'OK' : 'FAIL'} ${result.label} (${Date.now() - started}ms)`);
    } catch (error) {
      const label = scenario.name;
      results.push({
        label,
        total: 0,
        concurrency: 0,
        durationMs: Date.now() - started,
        responses: [],
        statuses: { error: 1 },
        ok: 0,
        failed: 1,
        rps: 0,
        latency: { p50: 0, p95: 0, p99: 0, max: 0 },
        invariant: false,
        details: { error: error.message },
      });
      console.log(`FAIL ${label}: ${error.message}`);
    }
  }

  await sleep(3000);
  const queuesAfter = await rabbitQueues();
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const filename = `${REPORT_DIR}/concurrency-limits-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(filename, renderReport({ commit, branch, queuesBefore, queuesAfter }), 'utf8');
  console.log(`Report saved to ${filename}`);

  const failed = results.filter((r) => !r.invariant);
  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
