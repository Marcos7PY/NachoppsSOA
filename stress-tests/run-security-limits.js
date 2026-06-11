#!/usr/bin/env node
/**
 * Targeted security and limit checks for NachoPps.
 *
 * Covers Kong rate limiting, CORS, JWT cookie auth, RBAC, direct-port bypass
 * and malformed client payloads. The script records expected findings instead
 * of assuming every behavior is already production-ready.
 */

const fs = require('node:fs');
const { execSync } = require('node:child_process');

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const REPORT_DIR = 'stress-tests/reports';
const PASSWORD = 'nachopps123';

const results = [];
let adminToken = '';
let adminCookie = '';

function redactToken(value) {
  return String(value || '').replace(/access_token=[^;\s"]+/g, 'access_token=...');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

async function req(method, url, body, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.cookie) headers.Cookie = options.cookie;

  const started = Date.now();
  try {
    const res = await fetch(url.startsWith('http') ? url : `${BASE}${url}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
    });
    const ms = Date.now() - started;
    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    return {
      ok: res.ok,
      status: res.status,
      ms,
      data,
      headers: Object.fromEntries(res.headers.entries()),
      setCookie: res.headers.getSetCookie ? res.headers.getSetCookie() : res.headers.get('set-cookie'),
    };
  } catch (error) {
    return { ok: false, status: 0, ms: Date.now() - started, error: error.message, headers: {} };
  }
}

async function login(email, password = PASSWORD) {
  const res = await req('POST', '/identidad/auth/login', { email, password });
  return res;
}

async function ensureAdmin() {
  const res = await login('admin@nachopps.pe');
  if (!res.ok || !res.data?.access_token) {
    throw new Error(`Admin login failed: ${res.status} ${JSON.stringify(res.data)}`);
  }
  adminToken = res.data.access_token;
  const cookieHeader = Array.isArray(res.setCookie) ? res.setCookie[0] : res.setCookie;
  adminCookie = cookieHeader?.split(';')[0] || `access_token=${adminToken}`;
}

async function ensureRoleUser(role, email) {
  const loginRes = await login(email);
  if (loginRes.ok && loginRes.data?.access_token) return loginRes.data.access_token;

  const createRes = await req('POST', '/identidad/usuarios', {
    nombre: `${role} Seguridad`,
    email,
    password: PASSWORD,
    rol: role,
  }, { token: adminToken });
  if (![200, 201, 409].includes(createRes.status)) {
    throw new Error(`Could not create ${role} user: ${createRes.status} ${JSON.stringify(createRes.data)}`);
  }

  const retry = await login(email);
  if (!retry.ok || !retry.data?.access_token) {
    throw new Error(`Could not login ${role} user: ${retry.status} ${JSON.stringify(retry.data)}`);
  }
  return retry.data.access_token;
}

function record(label, responses, invariant, details = {}, options = {}) {
  const latencies = responses.map((r) => r.ms).filter(Number.isFinite);
  const statuses = responses.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const result = {
    label,
    invariant,
    total: responses.length,
    statuses,
    latency: {
      p50: percentile(latencies, 0.5),
      p95: percentile(latencies, 0.95),
      max: latencies.length ? Math.max(...latencies) : 0,
    },
    details,
    skipped: Boolean(options.skipped),
  };
  results.push(result);
  console.log(`${result.skipped ? 'SKIP' : invariant ? 'OK' : 'FAIL'} ${label}: ${JSON.stringify(statuses)}`);
}

async function scenarioCookieAuth() {
  const me = await req('GET', '/identidad/auth/me', undefined, { cookie: adminCookie });
  const mesas = await req('GET', '/mesas', undefined, { cookie: adminCookie });
  const cookieHeader = adminCookie || '';
  record('JWT por cookie httpOnly', [me, mesas], me.ok && mesas.ok && cookieHeader.startsWith('access_token='), {
    cookieSeen: cookieHeader.replace(/=.*/, '=...'),
  });
}

async function scenarioCookieAttributes() {
  const res = await login('admin@nachopps.pe');
  const setCookie = Array.isArray(res.setCookie) ? res.setCookie.join('; ') : String(res.setCookie || '');
  const expected =
    /access_token=/.test(setCookie) &&
    /HttpOnly/i.test(setCookie) &&
    /SameSite=Strict/i.test(setCookie) &&
    /Path=\//i.test(setCookie);
  record('Cookie de login segura en dev', [res], expected, { setCookie: redactToken(setCookie) });
}

async function scenarioCors() {
  const allowed = await req('OPTIONS', '/mesas', undefined, {
    headers: {
      Origin: 'http://localhost:4200',
      'Access-Control-Request-Method': 'GET',
    },
  });
  const denied = await req('OPTIONS', '/mesas', undefined, {
    headers: {
      Origin: 'http://evil.localhost',
      'Access-Control-Request-Method': 'GET',
    },
  });
  const allowedOrigin = allowed.headers['access-control-allow-origin'];
  const deniedOrigin = denied.headers['access-control-allow-origin'];
  record(
    'CORS origen permitido vs no listado',
    [allowed, denied],
    allowedOrigin === 'http://localhost:4200' && deniedOrigin !== 'http://evil.localhost',
    { allowedOrigin, deniedOrigin: deniedOrigin || null },
  );
}

async function scenarioRoles() {
  const meseroToken = await ensureRoleUser('MESERO', 'mesero.seguridad@nachopps.pe');
  const create = await req('POST', '/identidad/usuarios', {
    nombre: 'Usuario No Permitido',
    email: `no-admin-${Date.now()}@nachopps.pe`,
    password: PASSWORD,
    rol: 'CAJERO',
  }, { token: meseroToken });
  const list = await req('GET', '/identidad/usuarios', undefined, { token: meseroToken });
  record('RBAC usuario no admin contra usuarios', [create, list], create.status === 403 && list.status === 403);
}

async function scenarioDirectPortsBypass() {
  const probes = [
    await req('GET', 'http://localhost:3002/api', undefined),
    await req('GET', 'http://localhost:3005/api', undefined),
    await req('GET', 'http://localhost:3007/api/productos', undefined),
  ];
  const allowClosedPorts = process.env.ALLOW_CLOSED_DIRECT_PORTS === 'true';
  const allClosed = probes.every((r) => r.status === 0);
  const allProtected = probes.every((r) => r.status === 401 || (allowClosedPorts && r.status === 0));
  record('Puertos directos sin token', probes, allProtected, {
    expected: allowClosedPorts
      ? '401 en puertos publicados o conexion rechazada si prod no publica puertos directos'
      : '401 en todos; si falla, hay exposicion por puertos host en dev',
    mode: allowClosedPorts && allClosed ? 'skipped: compose prod no publica puertos directos 3001-3010' : 'asserted',
  }, { skipped: allowClosedPorts && allClosed });
}

async function scenarioMalformedPayloads() {
  const probes = [
    await req('GET', '/mesas/nope', undefined, { token: adminToken }),
    await req('PATCH', '/mesas/00000000-0000-0000-0000-000000000000/estado', { estado: 'ROTA' }, { token: adminToken }),
    await req('POST', '/pedidos', { mesaId: '00000000-0000-0000-0000-000000000000', items: [] }, { token: adminToken }),
    await req('POST', '/inventario/productos/lote', { ids: ['no-uuid'] }, { token: adminToken }),
  ];
  record('Payloads invalidos no producen 5xx', probes, probes.every((r) => r.status >= 400 && r.status < 500), {
    statuses: probes.map((r) => r.status),
  });
}

async function scenarioRateLimitLogin() {
  const responses = [];
  for (let i = 0; i < 10; i += 1) {
    responses.push(await login('admin@nachopps.pe', `bad-${Date.now()}-${i}`));
    await sleep(50);
  }
  const hasUnauthorized = responses.some((r) => r.status === 401);
  const hasRateLimit = responses.some((r) => r.status === 429);
  record('Rate limit login por Kong', responses, hasUnauthorized && hasRateLimit, {
    note: 'Esperado: primeros intentos 401, luego 429 por limite de 5/min.',
  });
}

function renderReport() {
  const commit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  const passed = results.filter((r) => r.invariant && !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.invariant && !r.skipped).length;
  let md = `# Informe de seguridad y limites\n\n`;
  md += `- Fecha: ${new Date().toISOString()}\n`;
  md += `- Base URL: ${BASE}\n`;
  md += `- Rama: ${branch}\n`;
  md += `- Commit: ${commit}\n`;
  md += `- Resultado: ${passed} OK / ${skipped} SKIP / ${failed} FALLA\n\n`;
  md += `## Resumen\n\n`;
  md += `| Escenario | Invariante | Requests | Status | p95 |\n`;
  md += `|---|---:|---:|---|---:|\n`;
  for (const r of results) {
    md += `| ${r.label} | ${r.skipped ? 'SKIP' : r.invariant ? 'OK' : 'FALLA'} | ${r.total} | ${JSON.stringify(r.statuses)} | ${r.latency.p95}ms |\n`;
  }
  md += `\n## Detalle\n\n`;
  for (const r of results) {
    md += `### ${r.label}\n\n`;
    md += `- Invariante: ${r.skipped ? 'SKIP' : r.invariant ? 'OK' : 'FALLA'}\n`;
    md += `- Status: \`${JSON.stringify(r.statuses)}\`\n`;
    md += `- Latencia: p50=${r.latency.p50}ms, p95=${r.latency.p95}ms, max=${r.latency.max}ms\n`;
    md += `- Detalle: \`${JSON.stringify(r.details || {})}\`\n\n`;
  }
  return md;
}

async function main() {
  console.log('NachoPps targeted security/limits runner');
  console.log(`Base URL: ${BASE}`);
  await ensureAdmin();

  await scenarioCookieAuth();
  await scenarioCookieAttributes();
  await scenarioCors();
  await scenarioRoles();
  await scenarioDirectPortsBypass();
  await scenarioMalformedPayloads();
  await scenarioRateLimitLogin();

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const filename = `${REPORT_DIR}/security-limits-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
  fs.writeFileSync(filename, renderReport(), 'utf8');
  console.log(`Report saved to ${filename}`);

  if (results.some((r) => !r.invariant)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
