import axios from 'axios';

describe('GET /api', () => {
  it('debería exponer health check autenticado', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      message: 'Servicio de Inventario activo',
      service: 'servicio-inventario',
    });
  });
});
