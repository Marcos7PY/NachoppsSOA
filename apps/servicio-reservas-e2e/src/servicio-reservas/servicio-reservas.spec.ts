import axios from 'axios';

describe('GET /api', () => {
  it('debería listar reservas autenticado', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    // Respuesta paginada: { data: [...], nextCursor }
    expect(Array.isArray(res.data.data)).toBe(true);
  });
});
