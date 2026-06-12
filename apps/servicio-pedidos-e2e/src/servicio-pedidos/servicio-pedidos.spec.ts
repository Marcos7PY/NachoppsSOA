import axios from 'axios';

describe('POST /api', () => {
  it('debería devolver 400 Bad Request si el payload es inválido (ValidationPipe)', async () => {
    const payloadInvalido = {
      mesaId: 123, // debería ser string
      // falta 'items' u otros campos
    };

    try {
      await axios.post('/api', payloadInvalido);
      fail('Debería haber lanzado un error 400');
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) throw error;
      expect(error.response?.status).toBe(400);
      expect(error.response?.data.message).toBeInstanceOf(Array); // class-validator devuelve un array de mensajes
    }
  });

  it('debería devolver 400 Bad Request si el payload está vacío', async () => {
    try {
      await axios.post('/api', {});
      fail('Debería haber lanzado un error 400');
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) throw error;
      expect(error.response?.status).toBe(400);
      // GlobalExceptionFilter normaliza el cuerpo a { statusCode, timestamp, path, message }
      expect(error.response?.data.statusCode).toBe(400);
      expect(error.response?.data.path).toBe('/api');
    }
  });
});
