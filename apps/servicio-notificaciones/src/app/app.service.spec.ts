import { beforeEach, describe, it, expect } from 'vitest';
import { AppService } from './app.service';

describe('AppService — Notificaciones', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  describe('getData', () => {
    it('debe retornar un mensaje', () => {
      const result = service.getData();
      expect(result.message).toBeDefined();
    });
  });
});
