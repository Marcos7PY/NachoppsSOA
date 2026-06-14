import { setupKongAxios } from '../../../../tools/e2e/kong-axios-setup';

module.exports = async function () {
  setupKongAxios('identidad');
  await Promise.resolve();
};
