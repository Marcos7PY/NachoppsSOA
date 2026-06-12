import { waitForE2eTarget } from '../../../../tools/e2e/kong-axios-setup';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  await waitForE2eTarget();

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
