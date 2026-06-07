#!/usr/bin/env node
/**
 * Prueba de caos de RabbitMQ (plan 3.6).
 *
 * Verifica que la caída del broker NO mata los procesos de los servicios y que,
 * al reanudarlo, las colas/bindings se reasientan (amqp-connection-manager +
 * transporte RMQ de Nest reconectan solos). No implementa nada: solo verifica.
 *
 * Pasos:
 *   1. Login (gateway + identidad vivos) y acción baseline.
 *   2. `docker kill` a RabbitMQ.
 *   3. Confirmar que los contenedores de servicio siguen vivos (sin reinicio) y
 *      que el plano HTTP sigue respondiendo.
 *   4. `docker start` a RabbitMQ y esperar healthy.
 *   5. Confirmar que las colas recuperan consumidores y que una mutación nueva
 *      (POST /pedidos) vuelve a funcionar.
 *
 * Requiere el stack `up`. Uso:  node stress-tests/run-rabbitmq-chaos.js
 */
const fs = require('node:fs');
const { execFileSync, execSync } = require('node:child_process');

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const RABBIT = process.env.RABBIT_CONTAINER || 'nachopps-rabbitmq';
const REPORT_DIR = 'stress-tests/reports';
const SERVICE_CONTAINERS = [
  'nachopps-servicio-identidad',
  'nachopps-servicio-pedidos',
  'nachopps-servicio-inventario',
  'nachopps-servicio-mesas',
  'nachopps-servicio-cuentas',
  'nachopps-servicio-caja',
  'nachopps-servicio-reservas',
  'nachopps-servicio-notificaciones',
  'nachopps-servicio-reportes',
];
const KEY_QUEUES = ['pedidos_queue', 'inventario_queue', 'mesas_queue', 'cuentas_queue'];

const results = [];
let token = '';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.token !== false && token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

async function login() {
  const res = await req('POST', '/identidad/auth/login', { email: 'admin@nachopps.pe', password: 'nachopps123' }, { token: false });
  if (!res.ok || !res.data?.access_token) throw new Error(`Login falló: ${res.status} ${JSON.stringify(res.data)}`);
  token = res.data.access_token;
}

function inspect(container, fmt) {
  return execFileSync('docker', ['inspect', '-f', fmt, container], { encoding: 'utf8' }).trim();
}
function restartCount(container) { return Number.parseInt(inspect(container, '{{.RestartCount}}'), 10); }
function isRunning(container) { return inspect(container, '{{.State.Running}}') === 'true'; }

function queueConsumers() {
  const out = execSync(`docker exec ${RABBIT} rabbitmqctl list_queues name consumers`, { encoding: 'utf8' });
  const map = {};
  for (const line of out.split('\n')) {
    const [name, consumers] = line.trim().split(/\s+/);
    if (name && consumers !== undefined && /^\d+$/.test(consumers)) map[name] = Number.parseInt(consumers, 10);
  }
  return map;
}

async function waitRabbitHealthy(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      execSync(`docker exec ${RABBIT} rabbitmq-diagnostics check_running`, { stdio: 'ignore' });
      return true;
    } catch { /* aún no */ }
    await sleep(2000);
  }
  return false;
}

async function createMesaYPedido(label) {
  const numero = 2000000000 + (Date.now() % 100000000);
  const mesa = await req('POST', '/mesas', { numero, capacidad: 4, zona: label });
  if (!mesa.ok || !mesa.data?.id) return { ok: false, detail: `mesa ${mesa.status}` };
  const pedido = await req('POST', '/pedidos', {
    mesaId: mesa.data.id,
    items: [{ productoId: '__inexistente__', cantidad: 1 }],
  });
  // 201 (creado) o 400 (validación de stock/producto) ambos prueban que el plano
  // HTTP + persistencia funcionan; lo que NO debe pasar es 502/503 (servicio caído).
  return { ok: pedido.status !== 502 && pedido.status !== 503, detail: `pedido ${pedido.status}` };
}

async function main() {
  console.log(`\n🐰 Prueba de caos RabbitMQ contra ${BASE}\n`);
  await login();
  record('Gateway + identidad responden (login)', true);

  const before = await createMesaYPedido('CAOS-BASELINE');
  record('Baseline: mutación HTTP responde', before.ok, before.detail);

  const restartsBefore = Object.fromEntries(SERVICE_CONTAINERS.map((c) => [c, restartCount(c)]));

  // 2) Matar RabbitMQ
  execFileSync('docker', ['kill', RABBIT], { stdio: 'ignore' });
  record('RabbitMQ detenido (docker kill)', true);
  await sleep(8000);

  // 3) Los procesos de servicio NO deben morir ni reiniciarse
  let survivors = 0;
  for (const c of SERVICE_CONTAINERS) {
    const running = isRunning(c);
    const reinicio = restartCount(c) > restartsBefore[c];
    if (running && !reinicio) survivors += 1;
    else record(`Servicio ${c} sobrevive a la caída del broker`, false, running ? 'reinició' : 'no running');
  }
  record('Todos los servicios sobreviven sin reiniciar', survivors === SERVICE_CONTAINERS.length, `${survivors}/${SERVICE_CONTAINERS.length}`);

  const duringHttp = await req('GET', '/pedidos');
  record('Plano HTTP sigue respondiendo con el broker caído', duringHttp.status !== 502 && duringHttp.status !== 503, `GET /pedidos ${duringHttp.status}`);

  // 4) Reanudar RabbitMQ
  execFileSync('docker', ['start', RABBIT], { stdio: 'ignore' });
  const healthy = await waitRabbitHealthy();
  record('RabbitMQ reanudado y healthy', healthy);

  // 5) Colas recuperan consumidores (bindings reasentados) + mutación funciona
  let consumersOk = false;
  for (let i = 0; i < 20 && !consumersOk; i += 1) {
    await sleep(3000);
    try {
      const cons = queueConsumers();
      consumersOk = KEY_QUEUES.every((q) => (cons[q] ?? 0) >= 1);
      if (consumersOk) record('Colas recuperan consumidores (bindings reasentados)', true, KEY_QUEUES.map((q) => `${q}=${cons[q] ?? 0}`).join(' '));
    } catch { /* broker aún estabilizando */ }
  }
  if (!consumersOk) record('Colas recuperan consumidores (bindings reasentados)', false, 'timeout esperando consumidores');

  const after = await createMesaYPedido('CAOS-POST');
  record('Mutación HTTP funciona tras la reconexión', after.ok, after.detail);

  // Reporte
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const passed = results.filter((r) => r.ok).length;
  const md = [
    `# Prueba de caos RabbitMQ — ${new Date().toISOString()}`,
    '',
    `Resultado: **${passed}/${results.length}** verificaciones OK`,
    '',
    '| Verificación | Resultado | Detalle |',
    '|---|---|---|',
    ...results.map((r) => `| ${r.name} | ${r.ok ? '✅' : '❌'} | ${r.detail ?? ''} |`),
    '',
  ].join('\n');
  const file = `${REPORT_DIR}/rabbitmq-chaos-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(file, md);
  console.log(`\n📄 Reporte: ${file}`);
  if (passed !== results.length) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
