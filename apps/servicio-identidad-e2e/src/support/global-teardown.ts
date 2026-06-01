/* eslint-disable */

module.exports = async function () {
  // Nx stops continuous serve dependencies. Avoid killing externally managed ports.
  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
