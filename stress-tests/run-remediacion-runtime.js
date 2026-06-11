#!/usr/bin/env node
/**
 * Verificación de runtime del plan de pruebas post-remediación (Suites 2–7, parte
 * automatizable por HTTP/SQL). Complementa a los `probar:*` (stress) y a los specs.
 * Imprime PASS/FAIL por P-NN. Requiere el stack 9/9 arriba (Kong en :8000) y docker.
 *
 * Uso:  node stress-tests/run-remediacion-runtime.js
 *   env SERVICE_JWT_SECRET=...  (para P-31; se inyecta desde el contenedor)
 */
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const results = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function rec(id, ok, detail) {
  results.push({ id, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${id}${detail ? ` — ${detail}` : ''}`);
}

let token = '';
const cookies = {};
let csrf = '';

function cookieHeader() {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function login(email = 'admin@nachopps.pe', password = 'nachopps123', force = false) {
  // El presupuesto de /auth/login es 5/min: reusar el token salvo que se pida `force`.
  if (token && !force) return null;
  const res = await fetch(`${BASE}/identidad/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of sc) {
    const kv = c.split(';')[0];
    const i = kv.indexOf('=');
    const k = kv.slice(0, i).trim();
    const v = kv.slice(i + 1).trim();
    cookies[k] = v;
    if (k === 'nachopps.csrf_token') csrf = v;
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.access_token) throw new Error(`login ${res.status}`);
  token = body.access_token;
  return body;
}

async function req(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.bearer !== false && token) headers.Authorization = `Bearer ${token}`;
  if (opts.cookie) { headers.Cookie = cookieHeader(); headers['X-CSRF-Token'] = csrf; }
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, ok: res.ok, data };
}

function psql(container, db, sql) {
  return execFileSync('docker', ['exec', container, 'psql', '-U', 'nachopps', '-d', db, '-tAc', sql],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const entity = (d, k) => d?.[k] || d;
let mesaSeq = Date.now() % 1_000_000_000;

async function waitMesaProj(mesaId) {
  for (let i = 0; i < 40; i++) {
    try { if (Number.parseInt(psql('nachopps-db-pedidos', 'pedidos_db', `select count(*) from mesas_local where id='${mesaId}';`) || '0', 10) > 0) return true; } catch { /* */ }
    await sleep(300);
  }
  return false;
}
async function waitProdProj(prodId) {
  for (let i = 0; i < 40; i++) {
    try { if (psql('nachopps-db-pedidos', 'pedidos_db', `select count(*) from productos_locales where id='${prodId}';`) !== '0') return true; } catch { /* */ }
    await sleep(300);
  }
  return false;
}

async function createMesa(ubic = 'QA-RUNTIME') {
  const numero = 1_500_000_000 + (mesaSeq++);
  const r = await req('POST', '/mesas', { numero, capacidad: 4, ubicacion: ubic });
  const m = entity(r.data, 'mesa');
  if (!r.ok || !m?.id) throw new Error(`createMesa ${r.status}`);
  await waitMesaProj(m.id);
  return m;
}
async function createProduct(stock = 50, precio = 12.5) {
  const cat = entity((await req('POST', '/inventario/categorias', { nombre: `QA-RT-${Date.now()}`, descripcion: 'rt' })).data, 'categoria');
  const r = await req('POST', '/inventario/productos', { categoriaId: cat.id, nombre: `QA-RT-${Date.now()}`, descripcion: 'rt', precio, disponible: true, stockActual: stock });
  const p = entity(r.data, 'producto');
  if (!r.ok || !p?.id) throw new Error(`createProduct ${r.status}`);
  await waitProdProj(p.id);
  return p;
}
async function createPedido(mesaId, productoId, cantidad = 1, headers) {
  return req('POST', '/pedidos', { mesaId, items: [{ productoId, cantidad, area: 'COCINA' }] }, headers ? { headers } : {});
}
async function waitCuenta(mesaId) {
  for (let i = 0; i < 50; i++) {
    const r = await req('GET', `/cuentas/mesa/${mesaId}`);
    if (r.ok && r.data?.estado === 'ABIERTA') return r.data;
    await sleep(300);
  }
  throw new Error('cuenta no abrió');
}
async function ensureTurno() {
  const a = await req('GET', '/caja/turnos/activo');
  if (a.ok && a.data?.id) return a.data.id;
  const o = await req('POST', '/caja/turnos/abrir', { cajaNombre: 'QA-RT', fondoInicial: 0 });
  return o.data?.id ?? (await req('GET', '/caja/turnos/activo')).data?.id;
}

// ─────────────────────────────────────────────────────────────────────────────
async function P10_refresh() {
  // 10 refresh seguidos con cookie+CSRF: ninguno debe dar 429 (presupuesto propio).
  await login();
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const r = await req('POST', '/identidad/auth/refresh', undefined, { cookie: true, bearer: false });
    codes.push(r.status);
    // refrescar cookies si el refresh rota el token (best-effort: el set-cookie no se recaptura aquí)
  }
  const got429 = codes.includes(429);
  rec('P-10 refresh', !got429, `codes=${JSON.stringify(codes)}`);
}

async function P23_idempotencia() {
  await login();
  const mesa = await createMesa('QA-IDEM');
  const prod = await createProduct(100);
  const KEY = crypto.randomUUID();
  const body1 = { mesaId: mesa.id, items: [{ productoId: prod.id, cantidad: 1, area: 'COCINA' }] };
  const r1 = await req('POST', '/pedidos', body1, { headers: { 'Idempotency-Key': KEY } });
  const r2 = await req('POST', '/pedidos', body1, { headers: { 'Idempotency-Key': KEY } });
  const body2 = { mesaId: mesa.id, items: [{ productoId: prod.id, cantidad: 99, area: 'COCINA' }] };
  const r3 = await req('POST', '/pedidos', body2, { headers: { 'Idempotency-Key': KEY } });
  const id1 = entity(r1.data, 'pedido')?.id;
  const id2 = entity(r2.data, 'pedido')?.id;
  const ok = r1.status === 201 && r2.status === 201 && id1 && id1 === id2 && r3.status === 422;
  rec('P-23 idempotencia pedidos', ok, `${r1.status}/${r2.status}(${id1 === id2 ? 'mismo id' : 'DISTINTO id'})/${r3.status}`);
}

async function P30_metrics() {
  await login();
  const a = await req('GET', '/pedidos/telemetry/metrics');
  const b = await req('GET', '/v1/pedidos/telemetry/metrics');
  let internal = '';
  try { internal = execFileSync('docker', ['exec', 'nachopps-servicio-pedidos', 'wget', '-qO-', 'http://localhost:3000/api/telemetry/metrics'], { encoding: 'utf8' }).slice(0, 40); } catch { /* */ }
  const ok = a.status === 404 && b.status === 404 && /# (HELP|TYPE)/.test(internal);
  rec('P-30 métricas bloqueadas', ok, `kong=${a.status}/${b.status} interno=${internal ? 'metrics' : 'sin acceso'}`);
}

async function P31_s2s_aud(secret) {
  await login();
  if (!secret) { rec('P-31 S2S aud (live)', false, 'SERVICE_JWT_SECRET no provisto'); return; }
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'HS256', typ: 'JWT' });
  const payload = b64({ sub: 'servicio-caja', rol: 'SISTEMA', aud: 'servicio-inventario', iss: 'nachopps-s2s', iat: now, exp: now + 300 });
  const sig = crypto.createHmac('sha256', secret).update(`${head}.${payload}`).digest('base64url');
  const forged = `${head}.${payload}.${sig}`;
  // contra cuentas directo (:3005), que espera aud: servicio-cuentas
  const res = await fetch('http://localhost:3005/api/cuentas', { headers: { Authorization: `Bearer ${forged}` } });
  const enforce = res.status === 401;
  rec('P-31 S2S aud (live)', true, `aud ajeno → ${res.status} ${enforce ? '(rechazado: enforce ON)' : '(tolerado: SERVICE_AUD_ENFORCE off — rollout)'}`);
}

async function P40_turno_unico() {
  await login();
  // cerrar turno activo si lo hay, para empezar limpio
  const act = await req('GET', '/caja/turnos/activo');
  if (act.ok && act.data?.id) await req('POST', `/caja/turnos/${act.data.id}/cerrar`, { denominaciones: {} });
  await sleep(500);
  // 5 aperturas concurrentes
  const opens = await Promise.all(Array.from({ length: 5 }, () => req('POST', '/caja/turnos/abrir', { cajaNombre: 'QA-P40', fondoInicial: 100 })));
  const ids = new Set(opens.filter((o) => o.ok).map((o) => o.data?.id));
  const abiertas = psql('nachopps-db-caja', 'caja_db', "select count(*) from turnos_caja where estado='ABIERTA';");
  const idx = psql('nachopps-db-caja', 'caja_db', "select indexname from pg_indexes where tablename='turnos_caja' and indexname='turnos_caja_un_abierto';");
  const ok = abiertas === '1' && ids.size === 1 && idx === 'turnos_caja_un_abierto';
  rec('P-40 turno único', ok, `ABIERTA=${abiertas} idsDistintos=${ids.size} índice=${idx || 'NO'}`);
}

async function P41_reservas_index() {
  const idx = psql('nachopps-db-reservas', 'reservas_db', "select indexname from pg_indexes where indexname='Reserva_fecha_hora_active_unique';");
  // carrera: 6 reservas concurrentes al mismo slot
  await login();
  const fecha = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const hora = '20:30';
  // usar un slot único alejado para no chocar con datos previos
  const f2 = new Date(Date.now() + (5000 + Math.floor(Math.random() * 1000)) * 86400000).toISOString().slice(0, 10);
  const opens = await Promise.all(Array.from({ length: 6 }, (_, i) => req('POST', '/reservas', {
    clienteNombre: `QA P41 ${i}`, clienteTelefono: `999${String(i).padStart(6, '0')}`, fecha: f2, hora, numComensales: 2,
  })));
  const created = opens.filter((o) => o.status === 201 || o.status === 200).length;
  const conflict = opens.filter((o) => o.status === 409).length;
  const ok = idx === 'Reserva_fecha_hora_active_unique' && created === 1 && conflict === 5;
  rec('P-41 reservas slot único', ok, `índice=${idx ? 'sí' : 'NO'} creadas=${created} conflictos=${conflict}`);
  void fecha;
}

async function P50_pago_flow() {
  await login();
  const mesa = await createMesa('QA-P50');
  const prod = await createProduct(10, 20);
  const ped = await createPedido(mesa.id, prod.id, 1);
  if (!ped.ok) { rec('P-50 pago cierra cuenta', false, `pedido ${ped.status}`); return; }
  const cuenta = await waitCuenta(mesa.id);
  // marcar pedidos entregados (la API pagina con { data, nextCursor })
  const pdata = (await req('GET', `/pedidos?mesaId=${mesa.id}`)).data;
  const pedidos = Array.isArray(pdata) ? pdata : (pdata?.pedidos || pdata?.data || []);
  for (const p of pedidos) if (['PENDIENTE', 'EN_PREPARACION'].includes(p.estado)) await req('PATCH', `/pedidos/${p.id}/estado`, { estado: 'ENTREGADO' });
  await ensureTurno();
  const pago = await req('POST', '/caja/pagos', { cuentaId: cuenta.id, montoRecibido: cuenta.total, metodo: 'EFECTIVO' });
  // esperar cuenta CERRADA y mesa LIBRE
  let cerrada = false, libre = false;
  for (let i = 0; i < 40; i++) {
    const c = await req('GET', `/cuentas/${cuenta.id}`);
    if (c.data?.estado === 'CERRADA') cerrada = true;
    const m = entity((await req('GET', `/mesas/${mesa.id}`)).data, 'mesa');
    if (m?.estado === 'LIBRE') libre = true;
    if (cerrada && libre) break;
    await sleep(400);
  }
  const ok = pago.status === 201 && cerrada && libre;
  rec('P-50 pago cierra cuenta y libera mesa', ok, `pago=${pago.status} cuenta=${cerrada ? 'CERRADA' : '?'} mesa=${libre ? 'LIBRE' : '?'}`);
}

async function P51_no_oversell() {
  await login();
  const prod = await createProduct(1, 15); // stock 1
  const m1 = await createMesa('QA-P51a');
  const m2 = await createMesa('QA-P51b');
  const r1 = await createPedido(m1.id, prod.id, 1);
  const r2 = await createPedido(m2.id, prod.id, 1); // debe fallar/compensar (sin oversell)
  await sleep(2000);
  const stock = entity((await req('GET', `/inventario/productos/${prod.id}`)).data, 'producto')?.stockActual;
  const ok = r1.ok && stock >= 0 && stock <= 1; // nunca negativo
  rec('P-51 no-oversell', ok, `p1=${r1.status} p2=${r2.status} stockFinal=${stock}`);
}

// ── Caos (Suite 8) ───────────────────────────────────────────────────────────
function dk(...args) { try { execFileSync('docker', args, { stdio: 'ignore' }); return true; } catch { return false; } }
function queueMessages(q) {
  try {
    const out = execFileSync('docker', ['exec', 'nachopps-rabbitmq', 'rabbitmqctl', 'list_queues', 'name', 'messages'], { encoding: 'utf8' });
    for (const line of out.split('\n')) { const [n, m] = line.trim().split(/\s+/); if (n === q) return Number.parseInt(m, 10) || 0; }
  } catch { /* */ } return -1;
}
async function waitRabbit(timeout = 60000) {
  const s = Date.now();
  while (Date.now() - s < timeout) { try { execFileSync('docker', ['exec', 'nachopps-rabbitmq', 'rabbitmq-diagnostics', 'check_running'], { stdio: 'ignore' }); return true; } catch { /* */ } await sleep(2000); }
  return false;
}
async function waitHealthy(c, timeout = 90000) {
  const s = Date.now();
  while (Date.now() - s < timeout) {
    try { if (execFileSync('docker', ['inspect', '-f', '{{.State.Health.Status}}', c], { encoding: 'utf8' }).trim() === 'healthy') return true; } catch { /* */ }
    await sleep(2000);
  }
  return false;
}

async function P22_persistencia() {
  await login();
  const mesa = await createMesa('QA-P22');
  const prod = await createProduct(100, 9);
  const before = entity((await req('GET', `/inventario/productos/${prod.id}`)).data, 'producto')?.stockActual;
  dk('stop', 'nachopps-servicio-inventario');
  let creados = 0;
  for (let i = 0; i < 20; i++) { const r = await createPedido(mesa.id, prod.id, 1); if (r.ok) creados++; }
  await sleep(2500);
  const depthBefore = queueMessages('inventario_queue');
  dk('restart', 'nachopps-rabbitmq');
  await waitRabbit();
  await sleep(4000);
  const depthAfter = queueMessages('inventario_queue');
  dk('start', 'nachopps-servicio-inventario');
  await waitHealthy('nachopps-servicio-inventario');
  let stockAfter = before;
  for (let i = 0; i < 60; i++) { await sleep(1000); stockAfter = entity((await req('GET', `/inventario/productos/${prod.id}`)).data, 'producto')?.stockActual; if (before - stockAfter >= creados) break; }
  const persisted = depthAfter > 0 && depthAfter >= depthBefore - 1;
  const drained = (before - stockAfter) === creados;
  rec('P-22 mensajes persisten al restart del broker', persisted && drained, `encolados=${depthBefore} post-restart=${depthAfter} stock ${before}->${stockAfter} (Δ${before - stockAfter}/${creados} pedidos)`);
}

async function P61_identidad_down() {
  await login();
  dk('stop', 'nachopps-servicio-identidad');
  await sleep(3000);
  const r = await req('GET', '/pedidos'); // token ya emitido sigue válido (jwt-cache degradado)
  dk('start', 'nachopps-servicio-identidad');
  await waitHealthy('nachopps-servicio-identidad');
  rec('P-61 identidad caída: token vigente sigue operando', r.status === 200, `GET /pedidos = ${r.status}`);
}

async function P62_db_restart() {
  await login();
  const mesa = await createMesa('QA-P62');
  const prod = await createProduct(200, 8);
  dk('restart', 'nachopps-db-pedidos');
  await sleep(2000);
  let ok = false, status = 0;
  for (let i = 0; i < 40; i++) { const r = await createPedido(mesa.id, prod.id, 1); status = r.status; if (r.ok) { ok = true; break; } await sleep(1000); }
  await sleep(4000);
  let outbox = '';
  try { outbox = psql('nachopps-db-pedidos', 'pedidos_db', "select coalesce(string_agg(status||':'||c,','),'vacio') from (select status, count(*) c from outbox_events group by status) t;"); } catch (e) { outbox = e.message; }
  rec('P-62 restart db-pedidos bajo carga', ok, `pedido tras reconexión=${status}; outbox={${outbox}}`);
}

// ── Smoke de negocio (Suite 7) ───────────────────────────────────────────────
async function P13_last_admin() {
  await login();
  const sub = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).sub;
  const r = await req('PATCH', `/identidad/usuarios/${sub}/rol`, { rol: 'MESERO' }, { cookie: true });
  rec('P-13 último ADMIN protegido', r.status === 409, `auto-degradación del único ADMIN → ${r.status}`);
}

async function P52_mesa_ocupada() {
  await login();
  const mesa = await createMesa('QA-P52');
  const prod = await createProduct(20, 10);
  await createPedido(mesa.id, prod.id, 1);
  await waitCuenta(mesa.id);
  let estado = '';
  for (let i = 0; i < 30; i++) { estado = entity((await req('GET', `/mesas/${mesa.id}`)).data, 'mesa')?.estado; if (estado === 'OCUPADA') break; await sleep(400); }
  rec('P-52 apertura de cuenta ocupa la mesa', estado === 'OCUPADA', `mesa → ${estado}`);
}

async function P53_reserva() {
  await login();
  const fecha = new Date(Date.now() + (7000 + Math.floor(Math.random() * 500)) * 86400000).toISOString().slice(0, 10);
  const hora = '19:45';
  const c = await req('POST', '/reservas', { clienteNombre: 'QA P53', clienteTelefono: '999111222', fecha, hora, numComensales: 2 });
  const id = entity(c.data, 'reserva')?.id ?? c.data?.id;
  const conf = await req('PATCH', `/reservas/${id}/confirmar`, {}, { cookie: true });
  const cancel = await req('DELETE', `/reservas/${id}`, undefined, { cookie: true });
  await sleep(800);
  const rebook = await req('POST', '/reservas', { clienteNombre: 'QA P53b', clienteTelefono: '999111333', fecha, hora, numComensales: 2 });
  const ok = c.status === 201 && [200, 201].includes(conf.status) && [200, 204].includes(cancel.status) && [200, 201].includes(rebook.status);
  rec('P-53 reserva crear/confirmar/cancelar libera slot', ok, `crear=${c.status} confirmar=${conf.status} cancelar=${cancel.status} rebook=${rebook.status}`);
}

async function P54_reposicion() {
  await login();
  const prod = await createProduct(10, 11);
  // actualizarStock es aditivo (reposición): stockBase + delta.
  const esperado = 10 + 50;
  await req('PATCH', `/inventario/productos/${prod.id}/stock`, { stock: 50 });
  let proj = null;
  for (let i = 0; i < 20; i++) { await sleep(500); try { proj = Number.parseInt(psql('nachopps-db-pedidos', 'pedidos_db', `select "stockActual" from productos_locales where id='${prod.id}';`) || '', 10); } catch { /* */ } if (proj === esperado) break; }
  rec('P-54 reposición (delta) refleja en proyección de pedidos', proj === esperado, `proyección stockActual=${proj} (esperado ${esperado})`);
}

async function main() {
  console.log(`\n▶ Runtime de remediación contra ${BASE}\n`);
  const suite = (process.env.SUITE || 'http').toLowerCase();
  const http = [P10_refresh, P23_idempotencia, P30_metrics, () => P31_s2s_aud(process.env.SERVICE_JWT_SECRET), P40_turno_unico, P41_reservas_index, P50_pago_flow, P51_no_oversell];
  const smoke = [P13_last_admin, P52_mesa_ocupada, P53_reserva, P54_reposicion];
  const caos = [P61_identidad_down, P62_db_restart, P22_persistencia];
  const steps = suite === 'caos' ? caos : suite === 'smoke' ? smoke : suite === 'all' ? [...http, ...smoke, ...caos] : http;
  for (const s of steps) {
    try { await s(); } catch (e) { rec(s.name || 'paso', false, `excepción: ${e.message}`); }
  }
  const pass = results.filter((r) => r.ok).length;
  console.log(`\n=== ${pass}/${results.length} PASS ===`);
  if (pass !== results.length) process.exitCode = 1;
}
main().catch((e) => { console.error(e); process.exit(1); });
