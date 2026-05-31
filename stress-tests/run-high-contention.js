#!/usr/bin/env node
/**
 * High-contention orchestrator for stock and concurrency invariants.
 *
 * Runs D1c/R1 through the stock runner and C5/C6/C7 through the concurrency
 * runner at each requested concurrency level. Defaults are intentionally high
 * for final validation; override HIGH_CONTENTION_ITERATIONS locally for smoke.
 */

const { spawnSync } = require('node:child_process');

const levels = (process.env.HIGH_CONTENTION_LEVELS || '50,100,200')
  .split(',')
  .map((value) => Number.parseInt(value.trim(), 10))
  .filter(Number.isFinite);
const iterations = process.env.HIGH_CONTENTION_ITERATIONS || '100';

function run(label, command, args, env) {
  console.log(`\n==> ${label}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    process.exitCode = result.status || 1;
    throw new Error(`${label} failed with exit ${result.status}`);
  }
}

for (const level of levels) {
  run(
    `D1c/R1 stock high contention level=${level} iterations=${iterations}`,
    'node',
    ['stress-tests/run-stock-idempotency-dlq.js'],
    {
      STOCK_HIGH_CONTENTION: '1',
      STOCK_DUPLICATE_REDELIVERIES: String(level),
      STOCK_REVERSE_DUPLICATES: String(level),
      STOCK_ITERATIONS: iterations,
    },
  );

  run(
    `C5/C6/C7 concurrency level=${level} iterations=${iterations}`,
    'node',
    ['stress-tests/run-concurrency-limits.js'],
    {
      CONCURRENCY: String(level),
      ITERATIONS: iterations,
      SCENARIOS: 'C5,C6,C7',
    },
  );
}
