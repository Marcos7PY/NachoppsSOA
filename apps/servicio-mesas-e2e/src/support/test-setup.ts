import * as jwt from 'jsonwebtoken';
/* eslint-disable */
import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  axios.defaults.baseURL = `http://${host}:${port}`;

  const token = jwt.sign({ sub: 'e2e-tester', email: 'e2e@tester.com', rol: 'ADMIN' }, process.env.SERVICE_JWT_SECRET || 'nachopps_service_secret_dev', { expiresIn: '1h' });
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
