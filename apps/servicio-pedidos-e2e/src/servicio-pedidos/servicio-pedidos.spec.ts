import axios from 'axios';

describe('POST /api/pedidos', () => {
  it('debería devolver 400 Bad Request si el payload es inválido (ValidationPipe)', async () => {
    // Faltan campos requeridos y tipos erróneos
    const payloadInvalido = {
      mesaId: 123, // debería ser string
      // falta 'items' u otros campos
    };

    try {
      await axios.post('/api/pedidos', payloadInvalido);
      fail('Debería haber lanzado un error 400');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBeInstanceOf(Array); // class-validator devuelve un array de mensajes
    }
  });

  it('debería devolver 400 Bad Request si el payload está vacío', async () => {
    try {
      await axios.post('/api/pedidos', {});
      fail('Debería haber lanzado un error 400');
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe('Bad Request');
    }
  });
});
