import { describe, it, expect, vi, afterEach } from 'vitest';
import { mapNotificacion, mapNotificaciones, mapSocketNotification } from './notificacion.mapper';

function dto(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'notif-1',
    eventoOrigen: 'pedido.creado',
    destinatario: 'user-1',
    canal: 'UI',
    contenido: 'Nuevo pedido recibido',
    estado: 'ENTREGADO',
    intentos: 1,
    timestamp: '2026-06-07T14:00:00.000Z',
    leida: true,
    ...overrides,
  };
}

describe('mapNotificacion', () => {
  it('mapea campos básicos', () => {
    const vm = mapNotificacion(dto());
    expect(vm.id).toBe('notif-1');
    expect(vm.titulo).toBe('Nuevo pedido');
    expect(vm.contenido).toBe('Nuevo pedido recibido');
    expect(vm.canal).toBe('UI');
    expect(vm.estado).toBe('ENTREGADO');
    expect(vm.timestamp).toBe('2026-06-07T14:00:00.000Z');
  });

  it('unread=false cuando leida=true y estado≠PENDIENTE', () => {
    const vm = mapNotificacion(dto({ leida: true, estado: 'ENTREGADO' }));
    expect(vm.unread).toBe(false);
  });

  it('unread=true cuando leida=false', () => {
    const vm = mapNotificacion(dto({ leida: false, estado: 'ENTREGADO' }));
    expect(vm.unread).toBe(true);
  });

  it('unread=true cuando estado=PENDIENTE aunque leida=true', () => {
    const vm = mapNotificacion(dto({ leida: true, estado: 'PENDIENTE' }));
    expect(vm.unread).toBe(true);
  });

  it('timestampLabel es una hora formateada HH:MM', () => {
    const vm = mapNotificacion(dto({ timestamp: '2026-06-07T14:30:00.000Z' }));
    expect(typeof vm.timestampLabel).toBe('string');
    expect(vm.timestampLabel.includes(':')).toBe(true);
  });
});

describe('mapNotificaciones', () => {
  it('mapea todos los DTOs', () => {
    const vms = mapNotificaciones([dto({ id: 'a' }), dto({ id: 'b' })]);
    expect(vms).toHaveLength(2);
    expect(vms[0].id).toBe('a');
  });

  it('devuelve array vacío para entrada vacía', () => {
    expect(mapNotificaciones([])).toHaveLength(0);
  });
});

describe('mapSocketNotification', () => {
  afterEach(() => vi.restoreAllMocks());

  it('usa un título entendible según el evento', () => {
    const vm = mapSocketNotification({ pattern: 'pedido.creado', data: {} });
    expect(vm.titulo).toBe('Nuevo pedido');
  });

  it('usa notificacionId del data como id si existe', () => {
    const vm = mapSocketNotification({
      pattern: 'test',
      data: { notificacionId: 'notif-99', contenido: 'Hola' },
    });
    expect(vm.id).toBe('notif-99');
  });

  it('genera id con pattern-timestamp cuando no hay notificacionId', () => {
    const vm = mapSocketNotification({ pattern: 'test', data: {} });
    expect(vm.id).toContain('test-');
  });

  it('usa contenido explícito si no hay formatter especializado', () => {
    const vm = mapSocketNotification({ pattern: 'ev', data: { contenido: 'Mensaje real' } });
    expect(vm.contenido).toBe('Mensaje real');
  });

  it('usa contenido genérico si data no tiene contenido', () => {
    const vm = mapSocketNotification({ pattern: 'ev', data: {} });
    expect(vm.contenido).toBe('Actualización recibida en tiempo real.');
  });

  it('unread siempre es true', () => {
    const vm = mapSocketNotification({ pattern: 'x', data: {} });
    expect(vm.unread).toBe(true);
  });

  it('estado siempre es PENDIENTE', () => {
    const vm = mapSocketNotification({ pattern: 'x', data: {} });
    expect(vm.estado).toBe('PENDIENTE');
  });

  it('canal siempre es UI', () => {
    const vm = mapSocketNotification({ pattern: 'x', data: {} });
    expect(vm.canal).toBe('UI');
  });

  it('funciona con pattern undefined (fallback "evento")', () => {
    const vm = mapSocketNotification({ data: {} });
    expect(vm.id).toContain('evento-');
  });

  it('funciona con data=null', () => {
    const vm = mapSocketNotification({ pattern: 'test', data: null });
    expect(vm.contenido).toBe('Actualización recibida en tiempo real.');
  });

  it('convierte mesa.actualizada con payload anidado en un mensaje útil', () => {
    const vm = mapSocketNotification({
      pattern: 'mesa.actualizada',
      data: {
        mesa: {
          id: '6e132441-8b97-4fd3-aa87-820d6cf564b7',
          numero: 3,
          capacidad: 4,
          ubicacion: 'Salón Principal',
          estado: 'LIBRE',
          cuentaAsociada: null,
          createdAt: '2026-06-07T08:07:28.610Z',
          updatedAt: '2026-06-08T21:08:57.006Z',
        },
      },
    });

    expect(vm.titulo).toBe('Mesa actualizada');
    expect(vm.contenido).toBe('Mesa 3 ahora está libre. · Salón Principal · 4 personas');
  });

  it('convierte contenido JSON persistido en un mensaje útil', () => {
    const vm = mapNotificacion(dto({
      eventoOrigen: 'mesa.actualizada',
      contenido: JSON.stringify({
        mesa: {
          numero: 3,
          capacidad: 4,
          ubicacion: 'Salón Principal',
          estado: 'LIBRE',
        },
      }),
    }));

    expect(vm.titulo).toBe('Mesa actualizada');
    expect(vm.contenido).toBe('Mesa 3 ahora está libre. · Salón Principal · 4 personas');
  });
});
