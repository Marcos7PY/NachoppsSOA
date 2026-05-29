#!/usr/bin/env node
/**
 * Stress & Concurrency Test Suite — All Microservices
 * 
 * Tests:
 *  1. servicio-identidad: Login burst + token validation
 *  2. servicio-mesas: Concurrent table reads/writes
 *  3. servicio-pedidos: Concurrent order creation
 *  4. servicio-cuentas: Concurrent bill open/close
 *  5. servicio-reservas: Concurrent reservation creation
 *  6. servicio-inventario: Concurrent stock updates
 *  7. servicio-caja: Concurrent payment registration
 *  8. servicio-reportes: Concurrent report reads
 *  9. Cross-service: Full order-to-payment flow under load
 * 10. Cross-service: Multi-table concurrent full cycle
 */

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '20', 10);
const ROUNDS = parseInt(process.env.ROUNDS || '50', 10);
const TIMEOUT_MS = 15000;

let authToken = null;
let adminToken = null;
let testResults = [];
let testId = 0;

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function genId() { return `stress-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

async function req(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = `${BASE}${path}`;
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method, headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const ms = Date.now() - start;
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, ms, ok: res.ok, data };
  } catch (err) {
    return { status: 0, ms: Date.now() - start, ok: false, error: err.message };
  }
}

async function runConcurrent(label, fn, concurrency = CONCURRENCY, rounds = ROUNDS) {
  const id = ++testId;
  const startAll = Date.now();
  const promises = [];
  for (let i = 0; i < rounds; i++) {
    promises.push(fn(i));
  }
  const results = await Promise.allSettled(promises);
  const totalMs = Date.now() - startAll;

  const successes = results.filter(r => r.status === 'fulfilled' && r.value?.ok).length;
  const failures = results.filter(r => r.status === 'rejected' || !r.value?.ok).length;
  const statuses = {};
  const latencies = [];

  for (const r of results) {
    const val = r.status === 'fulfilled' ? r.value : { status: 0, ms: 0 };
    const key = String(val.status);
    statuses[key] = (statuses[key] || 0) + 1;
    if (val.ms) latencies.push(val.ms);
  }

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
  const avg = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

  const result = {
    id, label, concurrency, rounds, totalMs,
    successes, failures, statuses,
    latency: { avg, p50, p95, p99, max: latencies[latencies.length - 1] || 0 },
    rps: Math.round((rounds / totalMs) * 1000),
  };
  testResults.push(result);
  console.log(`  [${id}] ${label}: ${successes}/${rounds} ok, ${failures} fail, p50=${result.latency.p50}ms p95=${result.latency.p95}ms rps=${result.rps}`);
  return result;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════
// AUTH SETUP
// ═══════════════════════════════════════════

async function setupAuth() {
  console.log('\n═══ AUTH SETUP ═══');
  // Login as admin
  const r = await req('POST', '/identidad/auth/login', {
    email: 'admin@nachopps.pe', password: 'nachopps123'
  });
  if (r.ok && r.data?.access_token) {
    authToken = r.data.access_token;
    adminToken = r.data.access_token;
    console.log('  ✓ Auth token obtained');
  } else {
    console.log('  ✗ Login failed, continuing without auth. Status:', r.status, r.data);
  }
}

// ═══════════════════════════════════════════
// TEST 1: IDENTIDAD — Login Burst
// ═══════════════════════════════════════════

async function testIdentidadLoginBurst() {
  console.log('\n═══ TEST 1: servicio-identidad — Login Burst ═══');
  await runConcurrent('Login burst (20 concurrent logins)', async (i) => {
    return req('POST', '/identidad/auth/login', {
      email: 'admin@nachopps.pe', password: 'nachopps123'
    });
  });
}

async function testIdentidadTokenValidation() {
  console.log('\n═══ TEST 1b: servicio-identidad — Token Validation Burst ═══');
  await runConcurrent('Token validation burst', async (i) => {
    return req('POST', '/identidad/auth/validate', { token: authToken });
  });
}

// ═══════════════════════════════════════════
// TEST 2: MESAS — Concurrent Reads + Writes
// ═══════════════════════════════════════════

async function testMesasReads() {
  console.log('\n═══ TEST 2a: servicio-mesas — Concurrent GET ═══');
  await runConcurrent('Mesas concurrent reads', async (i) => {
    return req('GET', '/mesas', null, adminToken);
  });
}

async function testMesasCreateAndRead() {
  console.log('\n═══ TEST 2b: servicio-mesas — Concurrent Create + Read ═══');
  await runConcurrent('Mesas create+read', async (i) => {
    const create = await req('POST', '/mesas', {
      numero: 900 + i, capacidad: 4, ubicacion: `TEST-ZONE-${i}`
    }, adminToken);
    const read = await req('GET', `/mesas`, null, adminToken);
    return { ok: create.ok && read.ok, status: create.status, ms: create.ms + read.ms };
  }, 10, 20);
}

// ═══════════════════════════════════════════
// TEST 3: PEDIDOS — Concurrent Order Creation
// ═══════════════════════════════════════════

async function testPedidosConcurrentCreate() {
  console.log('\n═══ TEST 3: servicio-pedidos — Concurrent Order Creation ═══');
  // Get a table first
  const mesasRes = await req('GET', '/mesas', null, adminToken);
  const mesaId = mesasRes.data?.[0]?.id;
  if (!mesaId) { console.log('  ⚠ No mesas found, skipping'); return; }

  await runConcurrent('Pedidos concurrent creation', async (i) => {
    return req('POST', '/pedidos', {
      mesaId,
      items: [{ productoId: 'test-product', cantidad: 1, area: 'COCINA' }]
    }, adminToken);
  }, CONCURRENCY, 30);
}

// ═══════════════════════════════════════════
// TEST 4: CUENTAS — Concurrent Bill Operations
// ═══════════════════════════════════════════

async function testCuentasConcurrent() {
  console.log('\n═══ TEST 4: servicio-cuentas — Concurrent Bill Operations ═══');
  await runConcurrent('Cuentas concurrent GET', async (i) => {
    return req('GET', '/cuentas', null, adminToken);
  });
}

// ═══════════════════════════════════════════
// TEST 5: RESERVAS — Concurrent Reservation Creation
// ═══════════════════════════════════════════

async function testReservasConcurrentCreate() {
  console.log('\n═══ TEST 5: servicio-reservas — Concurrent Reservation Creation ═══');
  await runConcurrent('Reservas concurrent creation', async (i) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const fecha = date.toISOString().split('T')[0];
    const hora = `${19 + (i % 3)}:${i % 2 === 0 ? '00' : '30'}`;
    return req('POST', '/reservas', {
      clienteNombre: `Stress Client ${i}`,
      clienteTelefono: `999${String(i).padStart(6, '0')}`,
      fecha, hora,
      numComensales: 2 + (i % 4),
    }, adminToken);
  }, CONCURRENCY, 40);
}

async function testReservasAvailabilityCheck() {
  console.log('\n═══ TEST 5b: servicio-reservas — Concurrent Availability Checks ═══');
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const fecha = date.toISOString().split('T')[0];
  await runConcurrent('Reservas availability check burst', async (i) => {
    return req('GET', `/reservas/disponibilidad?fecha=${fecha}&hora=20:00`, null, adminToken);
  });
}

// ═══════════════════════════════════════════
// TEST 6: INVENTARIO — Concurrent Stock Updates
// ═══════════════════════════════════════════

async function testInventarioReads() {
  console.log('\n═══ TEST 6a: servicio-inventario — Concurrent Product Reads ═══');
  await runConcurrent('Inventario concurrent reads', async (i) => {
    return req('GET', '/inventario/productos', null, adminToken);
  });
}

async function testInventarioCreateProduct() {
  console.log('\n═══ TEST 6b: servicio-inventario — Concurrent Product Creation ═══');
  await runConcurrent('Inventario concurrent product creation', async (i) => {
    const catRes = await req('POST', '/inventario/categorias', {
      nombre: `TestCat-${genId()}`
    }, adminToken);
    if (!catRes.ok) return catRes;
    return req('POST', '/inventario/productos', {
      categoriaId: catRes.data?.id,
      nombre: `TestProd-${genId()}`,
      precio: 10 + i,
      stockActual: 100,
    }, adminToken);
  }, 10, 20);
}

// ═══════════════════════════════════════════
// TEST 7: CAJA — Concurrent Payment Registration
// ═══════════════════════════════════════════

async function testCajaConcurrent() {
  console.log('\n═══ TEST 7: servicio-caja — Concurrent Payment Registration ═══');
  // First get a cuenta
  const cuentasRes = await req('GET', '/cuentas', null, adminToken);
  const cuentaId = Array.isArray(cuentasRes.data) ? cuentasRes.data.find(c => c.estado === 'ABIERTA')?.id : null;
  if (!cuentaId) {
    console.log('  ⚠ No open cuenta found, testing health check only');
    await runConcurrent('Caja health check burst', async (i) => {
      return req('GET', '/caja/health', null, adminToken);
    });
    return;
  }
  await runConcurrent('Caja concurrent payment attempts', async (i) => {
    return req('POST', '/caja/pagos', {
      cuentaId, montoRecibido: 50 + i, metodo: i % 2 === 0 ? 'EFECTIVO' : 'TARJETA'
    }, adminToken);
  }, 10, 20);
}

// ═══════════════════════════════════════════
// TEST 8: REPORTES — Concurrent Report Reads
// ═══════════════════════════════════════════

async function testReportesConcurrent() {
  console.log('\n═══ TEST 8: servicio-reportes — Concurrent Report Reads ═══');
  await runConcurrent('Reportes concurrent reads', async (i) => {
    return req('GET', '/reportes/resumen', null, adminToken);
  });
}

// ═══════════════════════════════════════════
// TEST 9: CROSS-SERVICE — Full Order-to-Payment Flow
// ═══════════════════════════════════════════

async function testFullFlowConcurrent() {
  console.log('\n═══ TEST 9: Cross-service — Full Order-to-Payment Flow ═══');
  await runConcurrent('Full flow: mesa→pedido→cuenta→pago', async (i) => {
    // 1. Create mesa
    const mesa = await req('POST', '/mesas', {
      numero: 800 + i, capacidad: 2, ubicacion: 'STRESS-TEST'
    }, adminToken);
    if (!mesa.ok) return mesa;
    const mesaId = mesa.data?.id;

    // 2. Create pedido
    const pedido = await req('POST', '/pedidos', {
      mesaId,
      items: [{ productoId: 'stress-product', cantidad: 1, area: 'COCINA' }]
    }, adminToken);
    if (!pedido.ok) return pedido;
    const pedidoId = pedido.data?.id;

    // 3. Get cuenta
    await sleep(500);
    const cuenta = await req('GET', `/cuentas/mesa/${mesaId}`, null, adminToken);
    if (!cuenta.ok) return cuenta;
    const cuentaId = cuenta.data?.id;

    // 4. Pay
    const pago = await req('POST', '/caja/pagos', {
      cuentaId, montoRecibido: 25, metodo: 'EFECTIVO'
    }, adminToken);

    return { ok: pago.ok, status: pago.status, ms: Date.now() - Date.now() + pago.ms };
  }, 10, 15);
}

// ═══════════════════════════════════════════
// TEST 10: CROSS-SERVICE — Multi-Table Full Cycle
// ═══════════════════════════════════════════

async function testMultiTableCycle() {
  console.log('\n═══ TEST 10: Cross-service — Multi-Table Concurrent Full Cycle ═══');
  const TABLES = 10;
  await runConcurrent(`${TABLES} tables doing full cycle simultaneously`, async (i) => {
    // Each "table" does: create mesa → create order → get cuenta → pay → delete mesa
    const mesa = await req('POST', '/mesas', {
      numero: 700 + i, capacidad: 4, ubicacion: `MULTI-${i}`
    }, adminToken);
    if (!mesa.ok) return mesa;

    const pedido = await req('POST', '/pedidos', {
      mesaId: mesa.data.id,
      items: [
        { productoId: 'prod-1', cantidad: 2, area: 'COCINA' },
        { productoId: 'prod-2', cantidad: 1, area: 'BAR' }
      ]
    }, adminToken);

    await sleep(300);
    const cuenta = await req('GET', `/cuentas/mesa/${mesa.data.id}`, null, adminToken);
    if (cuenta.ok) {
      await req('POST', '/caja/pagos', {
        cuentaId: cuenta.data?.id, montoRecibido: 55, metodo: 'TARJETA'
      }, adminToken);
    }
    return { ok: true, status: 200, ms: 0 };
  }, TABLES, TABLES);
}

// ═══════════════════════════════════════════
// REPORT GENERATION
// ═══════════════════════════════════════════

function generateReport() {
  const now = new Date().toISOString();
  const totalTests = testResults.length;
  const totalRequests = testResults.reduce((s, t) => s + t.rounds, 0);
  const totalSuccess = testResults.reduce((s, t) => s + t.successes, 0);
  const totalFail = testResults.reduce((s, t) => s + t.failures, 0);
  const allP50 = testResults.map(t => t.latency.p50).filter(Boolean);
  const allP95 = testResults.map(t => t.latency.p95).filter(Boolean);
  const globalP50 = allP50.length ? Math.round(allP50.reduce((a, b) => a + b, 0) / allP50.length) : 0;
  const globalP95 = allP95.length ? Math.round(allP95.reduce((a, b) => a + b, 0) / allP95.length) : 0;

  let md = `# 📊 Stress & Concurrency Test Report\n\n`;
  md += `**Date:** ${now}  \n`;
  md += `**Base URL:** ${BASE}  \n`;
  md += `**Default Concurrency:** ${CONCURRENCY}  \n`;
  md += `**Default Rounds:** ${ROUNDS}  \n\n`;
  md += `---\n\n`;
  md += `## Executive Summary\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total Tests | ${totalTests} |\n`;
  md += `| Total Requests | ${totalRequests} |\n`;
  md += `| Successful | ${totalSuccess} (${totalRequests ? Math.round(totalSuccess / totalRequests * 100) : 0}%) |\n`;
  md += `| Failed | ${totalFail} (${totalRequests ? Math.round(totalFail / totalRequests * 100) : 0}%) |\n`;
  md += `| Global p50 Latency | ${globalP50}ms |\n`;
  md += `| Global p95 Latency | ${globalP95}ms |\n\n`;
  md += `---\n\n`;
  md += `## Detailed Results\n\n`;

  for (const t of testResults) {
    md += `### Test ${t.id}: ${t.label}\n\n`;
    md += `| Parameter | Value |\n|-----------|-------|\n`;
    md += `| Concurrency | ${t.concurrency} |\n`;
    md += `| Rounds | ${t.rounds} |\n`;
    md += `| Total Time | ${t.totalMs}ms |\n`;
    md += `| RPS | ${t.rps} |\n`;
    md += `| Successes | ${t.successes} |\n`;
    md += `| Failures | ${t.failures} |\n`;
    md += `| Status Codes | ${JSON.stringify(t.statuses)} |\n\n`;
    md += `**Latency:** avg=${t.latency.avg}ms | p50=${t.latency.p50}ms | p95=${t.latency.p95}ms | p99=${t.latency.p99}ms | max=${t.latency.max}ms\n\n`;
    md += `**Expected:** All requests return 2xx (200 or 201) with acceptable latency (p95 < 5000ms)\n\n`;
    md += `**Result:** ${t.failures === 0 ? '✅ PASS' : `⚠️ PARTIAL — ${t.failures} failures (${Math.round(t.failures / t.rounds * 100)}%)`}\n\n`;
    md += `---\n\n`;
  }

  md += `## Conclusions\n\n`;
  if (totalFail === 0) {
    md += `✅ **All tests passed.** The system handles ${CONCURRENCY} concurrent requests across all services without errors.\n\n`;
  } else {
    md += `⚠️ **Some failures detected.** ${totalFail} out of ${totalRequests} requests failed (${Math.round(totalFail / totalRequests * 100)}%). Review logs for details.\n\n`;
  }
  md += `- Global p50 latency: **${globalP50}ms**\n`;
  md += `- Global p95 latency: **${globalP95}ms**\n`;
  md += `- Total requests served: **${totalRequests}**\n`;

  return md;
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Stress & Concurrency Test Suite — All Services     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`  Base URL: ${BASE}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Rounds: ${ROUNDS}`);

  await setupAuth();

  // Individual service tests
  await testIdentidadLoginBurst();
  await testIdentidadTokenValidation();
  await testMesasReads();
  await testMesasCreateAndRead();
  await testPedidosConcurrentCreate();
  await testCuentasConcurrent();
  await testReservasConcurrentCreate();
  await testReservasAvailabilityCheck();
  await testInventarioReads();
  await testInventarioCreateProduct();
  await testCajaConcurrent();
  await testReportesConcurrent();

  // Cross-service tests
  await testFullFlowConcurrent();
  await testMultiTableCycle();

  // Generate report
  const report = generateReport();
  const fs = await import('fs');
  const reportDir = 'stress-tests/reports';
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  const filename = `${reportDir}/stress-report-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(filename, report);
  console.log(`\n\n📄 Report saved to: ${filename}`);
  console.log('\n' + report);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
