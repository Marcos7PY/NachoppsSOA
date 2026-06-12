import axios from 'axios';

describe('GET /api', () => {
  it('debería listar mesas autenticado', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.mesas)).toBe(true);
  });
});
