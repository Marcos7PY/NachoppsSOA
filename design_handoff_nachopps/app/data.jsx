// data.jsx — mock domain data + helpers for NachoPps.
(function () {
  const fmt = (n) => 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtN = (n) => Number(n).toLocaleString('es-PE');

  // ---- status vocabularies ----
  const MESA_ST = {
    LIBRE:     { label: 'LIBRE',     cls: 'libre', badge: 'badge-ok' },
    OCUPADA:   { label: 'OCUPADA',   cls: 'ocup',  badge: 'badge-accent' },
    RESERVADA: { label: 'RESERVADA', cls: 'resv',  badge: 'badge-info' },
    LIMPIEZA:  { label: 'LIMPIEZA',  cls: 'limp',  badge: 'badge-warn' },
    BLOQUEADA: { label: 'BLOQUEADA', cls: 'bloq',  badge: 'badge-muted' },
  };
  const PED_ST = {
    PENDIENTE:      { label: 'PENDIENTE',      badge: 'badge-warn' },
    EN_PREPARACION: { label: 'EN PREPARACIÓN', badge: 'badge-info' },
    LISTO:          { label: 'LISTO',          badge: 'badge-ok' },
    ENTREGADO:      { label: 'ENTREGADO',      badge: 'badge-muted' },
    CANCELADO:      { label: 'CANCELADO',      badge: 'badge-danger' },
  };
  const CTA_ST = {
    ABIERTA: { label: 'ABIERTA', badge: 'badge-info' },
    CERRADA: { label: 'CERRADA', badge: 'badge-muted' },
    PAGADA:  { label: 'PAGADA',  badge: 'badge-ok' },
    ANULADA: { label: 'ANULADA', badge: 'badge-danger' },
  };
  const RES_ST = {
    PENDIENTE:  { label: 'PENDIENTE',  badge: 'badge-warn' },
    CONFIRMADA: { label: 'CONFIRMADA', badge: 'badge-ok' },
    CANCELADA:  { label: 'CANCELADA',  badge: 'badge-danger' },
  };

  // ---- productos / catálogo ----
  const productos = [
    { id: 'p1', nombre: 'Lomo Saltado', cat: 'Fondos', precio: 38, area: 'COCINA', stock: 24, ctrl: true, disp: true },
    { id: 'p2', nombre: 'Ají de Gallina', cat: 'Fondos', precio: 32, area: 'COCINA', stock: 18, ctrl: true, disp: true },
    { id: 'p3', nombre: 'Arroz con Mariscos', cat: 'Fondos', precio: 42, area: 'COCINA', stock: 6, ctrl: true, disp: true },
    { id: 'p4', nombre: 'Tacu Tacu con Lomo', cat: 'Fondos', precio: 45, area: 'COCINA', stock: 0, ctrl: true, disp: false },
    { id: 'p5', nombre: 'Ceviche Clásico', cat: 'Entradas', precio: 36, area: 'COCINA', stock: 12, ctrl: true, disp: true },
    { id: 'p6', nombre: 'Causa Limeña', cat: 'Entradas', precio: 24, area: 'COCINA', stock: 20, ctrl: true, disp: true },
    { id: 'p7', nombre: 'Anticuchos (2u)', cat: 'Entradas', precio: 28, area: 'COCINA', stock: 3, ctrl: true, disp: true },
    { id: 'p8', nombre: 'Chicharrón de Pollo', cat: 'Entradas', precio: 30, area: 'COCINA', stock: 15, ctrl: true, disp: true },
    { id: 'p9', nombre: 'Pisco Sour', cat: 'Tragos', precio: 22, area: 'BARRA', stock: 40, ctrl: true, disp: true },
    { id: 'p10', nombre: 'Chilcano', cat: 'Tragos', precio: 20, area: 'BARRA', stock: 38, ctrl: true, disp: true },
    { id: 'p11', nombre: 'Maracuyá Sour', cat: 'Tragos', precio: 24, area: 'BARRA', stock: 30, ctrl: true, disp: true },
    { id: 'p12', nombre: 'Cerveza Artesanal', cat: 'Bebidas', precio: 16, area: 'BARRA', stock: 2, ctrl: true, disp: true },
    { id: 'p13', nombre: 'Chicha Morada (jarra)', cat: 'Bebidas', precio: 18, area: 'BARRA', stock: 22, ctrl: true, disp: true },
    { id: 'p14', nombre: 'Limonada Clásica', cat: 'Bebidas', precio: 12, area: 'BARRA', stock: null, ctrl: false, disp: true },
    { id: 'p15', nombre: 'Agua San Mateo', cat: 'Bebidas', precio: 7, area: 'BARRA', stock: 60, ctrl: true, disp: true },
    { id: 'p16', nombre: 'Suspiro Limeño', cat: 'Postres', precio: 18, area: 'COCINA', stock: 9, ctrl: true, disp: true },
    { id: 'p17', nombre: 'Picarones (5u)', cat: 'Postres', precio: 16, area: 'COCINA', stock: 14, ctrl: true, disp: true },
    { id: 'p18', nombre: 'Crema Volteada', cat: 'Postres', precio: 15, area: 'COCINA', stock: 0, ctrl: true, disp: false },
    { id: 'p19', nombre: 'Piqueo Mixto (mitad y mitad)', cat: 'Entradas', precio: 48, area: 'COCINA', stock: 16, ctrl: true, disp: true },
  ];
  const cats = ['Entradas', 'Fondos', 'Tragos', 'Bebidas', 'Postres'];

  // ---- pedidos ----
  const pedidos = [
    { id: 'PED-2041', mesa: '06', estado: 'PENDIENTE', area: 'COCINA', mozo: 'Diego', min: 14, items: [{ q: 2, n: 'Lomo Saltado' }, { q: 1, n: 'Arroz con Mariscos', note: 'Sin culantro' }, { q: 1, n: 'Ceviche Clásico' }] },
    { id: 'PED-2040', mesa: '06', estado: 'PENDIENTE', area: 'BARRA', mozo: 'Diego', min: 14, items: [{ q: 3, n: 'Pisco Sour' }, { q: 2, n: 'Chicha Morada (jarra)' }] },
    { id: 'PED-2039', mesa: '02', estado: 'EN_PREPARACION', area: 'COCINA', mozo: 'Lucía', min: 22, items: [{ q: 1, n: 'Ají de Gallina' }, { q: 1, n: 'Causa Limeña', note: 'Extra ají' }] },
    { id: 'PED-2038', mesa: '08', estado: 'EN_PREPARACION', area: 'COCINA', mozo: 'Diego', min: 31, late: true, items: [{ q: 2, n: 'Anticuchos (2u)' }, { q: 1, n: 'Chicharrón de Pollo' }] },
    { id: 'PED-2037', mesa: '03', estado: 'LISTO', area: 'COCINA', mozo: 'Lucía', min: 4, items: [{ q: 1, n: 'Ceviche Clásico' }, { q: 1, n: 'Causa Limeña' }] },
    { id: 'PED-2036', mesa: '11', estado: 'LISTO', area: 'BARRA', mozo: 'Diego', min: 2, items: [{ q: 2, n: 'Chilcano' }] },
    { id: 'PED-2035', mesa: '02', estado: 'ENTREGADO', area: 'COCINA', mozo: 'Lucía', min: 48, items: [{ q: 1, n: 'Lomo Saltado' }] },
    { id: 'PED-2034', mesa: '08', estado: 'ENTREGADO', area: 'BARRA', mozo: 'Diego', min: 40, items: [{ q: 1, n: 'Maracuyá Sour' }] },
    { id: 'PED-2033', mesa: '06', estado: 'CANCELADO', area: 'COCINA', mozo: 'Diego', min: 35, items: [{ q: 1, n: 'Tacu Tacu con Lomo' }], cancel: 'Sin stock' },
    // --- canales: para llevar / delivery ---
    { id: 'LL-014', mesa: null, canal: 'LLEVAR', cliente: 'Sofía R.', estado: 'EN_PREPARACION', area: 'COCINA', mozo: 'Mostrador', min: 12, items: [{ q: 1, n: 'Lomo Saltado', mods: ['Papas + ensalada', 'Sin cebolla'] }, { q: 1, n: 'Chicha Morada (jarra)' }] },
    { id: 'DEL-021', mesa: null, canal: 'DELIVERY', prov: 'Rappi', cliente: 'M. Taboada', dir: 'Av. Grau 455, Barranco', estado: 'PENDIENTE', area: 'COCINA', mozo: 'App', min: 6, items: [{ q: 2, n: 'Ají de Gallina' }, { q: 1, n: 'Piqueo Mixto (mitad y mitad)', mods: ['Anticuchos', 'Chicharrón'] }] },
    { id: 'DEL-020', mesa: null, canal: 'DELIVERY', prov: 'PedidosYa', cliente: 'J. Salas', dir: 'Jr. Unión 120, Barranco', estado: 'LISTO', area: 'COCINA', mozo: 'App', min: 3, items: [{ q: 1, n: 'Arroz con Mariscos' }] },
    // --- despachados (entregados) ---
    { id: 'PED-2030', mesa: '14', canal: 'SALON', estado: 'ENTREGADO', area: 'COCINA', mozo: 'Lucía', min: 52, despachadoAt: '19:18', items: [{ q: 2, n: 'Ceviche Clásico' }, { q: 1, n: 'Pisco Sour' }] },
    { id: 'LL-012', mesa: null, canal: 'LLEVAR', cliente: 'P. Quiroz', estado: 'ENTREGADO', area: 'COCINA', mozo: 'Mostrador', min: 58, despachadoAt: '19:09', items: [{ q: 1, n: 'Chicharrón de Pollo' }] },
    { id: 'DEL-018', mesa: null, canal: 'DELIVERY', prov: 'Rappi', cliente: 'L. Fuentes', dir: 'Av. Bolognesi 78', estado: 'ENTREGADO', area: 'COCINA', mozo: 'App', min: 64, despachadoAt: '18:55', items: [{ q: 1, n: 'Lomo Saltado' }, { q: 1, n: 'Suspiro Limeño' }] },
  ];

  // ---- mesas ----
  const mesas = [
    { n: '01', estado: 'LIBRE', cap: 4, zona: 'Salón' },
    { n: '02', estado: 'OCUPADA', cap: 4, zona: 'Salón', total: 84.5, pend: 1, min: 42, cuenta: 'CTA-118', mozo: 'Lucía' },
    { n: '03', estado: 'OCUPADA', cap: 2, zona: 'Salón', total: 60, pend: 0, min: 18, cuenta: 'CTA-121', mozo: 'Lucía' },
    { n: '04', estado: 'RESERVADA', cap: 6, zona: 'Terraza', resv: '20:30 · Fam. Quispe' },
    { n: '05', estado: 'LIBRE', cap: 2, zona: 'Barra' },
    { n: '06', estado: 'OCUPADA', cap: 8, zona: 'Terraza', total: 312, pend: 2, min: 65, cuenta: 'CTA-115', mozo: 'Diego' },
    { n: '07', estado: 'LIMPIEZA', cap: 4, zona: 'Salón' },
    { n: '08', estado: 'OCUPADA', cap: 4, zona: 'Salón', total: 58, pend: 1, min: 27, cuenta: 'CTA-120', mozo: 'Diego' },
    { n: '09', estado: 'BLOQUEADA', cap: 4, zona: 'Salón' },
    { n: '10', estado: 'RESERVADA', cap: 4, zona: 'Terraza', resv: '21:00 · Núñez' },
    { n: '11', estado: 'OCUPADA', cap: 2, zona: 'Barra', total: 22.5, pend: 0, min: 9, cuenta: 'CTA-122', mozo: 'Diego' },
    { n: '12', estado: 'LIBRE', cap: 6, zona: 'Terraza' },
    { n: '13', estado: 'LIBRE', cap: 2, zona: 'Barra' },
    { n: '14', estado: 'OCUPADA', cap: 4, zona: 'Salón', total: 96, pend: 0, min: 51, cuenta: 'CTA-117', mozo: 'Lucía' },
  ];

  // ---- cuenta detail (for drawer) ----
  const cuentas = {
    'CTA-118': {
      id: 'CTA-118', mesa: '02', estado: 'ABIERTA', mozo: 'Lucía', abierta: '19:00',
      items: [
        { q: 1, n: 'Ají de Gallina', precio: 32, estado: 'ENTREGADO' },
        { q: 1, n: 'Causa Limeña', precio: 24, estado: 'EN_PREPARACION' },
        { q: 1, n: 'Pisco Sour', precio: 22, estado: 'ENTREGADO' },
        { q: 1, n: 'Lomo Saltado', precio: 38, estado: 'ENTREGADO' },
      ],
    },
  };

  // ---- reservas (hoy) ----
  const reservas = [
    { id: 'R-501', cliente: 'Familia Quispe', tel: '987 654 321', hora: '20:30', personas: 6, mesa: '04', estado: 'CONFIRMADA' },
    { id: 'R-502', cliente: 'Carlos Núñez', tel: '961 220 145', hora: '21:00', personas: 4, mesa: '10', estado: 'CONFIRMADA' },
    { id: 'R-503', cliente: 'Mariana Reyes', tel: '999 110 233', hora: '21:30', personas: 2, mesa: null, estado: 'PENDIENTE' },
    { id: 'R-504', cliente: 'Grupo Backus', tel: '954 770 881', hora: '22:00', personas: 10, mesa: null, estado: 'PENDIENTE' },
    { id: 'R-505', cliente: 'Ana Salcedo', tel: '942 668 109', hora: '19:30', personas: 3, mesa: '14', estado: 'CONFIRMADA' },
    { id: 'R-506', cliente: 'Pedro Lavalle', tel: '900 334 552', hora: '20:00', personas: 5, mesa: null, estado: 'CANCELADA' },
  ];

  // ---- transacciones ----
  const transacciones = [
    { id: 'TX-9920', mesa: '04', cuenta: 'CTA-110', metodo: 'YAPE', monto: 145.0, hora: '19:12', estado: 'PAGADA' },
    { id: 'TX-9919', mesa: '01', cuenta: 'CTA-109', metodo: 'EFECTIVO', monto: 88.5, hora: '19:05', estado: 'PAGADA' },
    { id: 'TX-9918', mesa: '07', cuenta: 'CTA-108', metodo: 'TARJETA', monto: 234.0, hora: '18:51', estado: 'PAGADA' },
    { id: 'TX-9917', mesa: '12', cuenta: 'CTA-107', metodo: 'TRANSFERENCIA', monto: 410.0, hora: '18:30', estado: 'PAGADA' },
    { id: 'TX-9916', mesa: '05', cuenta: 'CTA-106', metodo: 'TARJETA', monto: 62.0, hora: '18:14', estado: 'ANULADA' },
    { id: 'TX-9915', mesa: '03', cuenta: 'CTA-105', metodo: 'YAPE', monto: 120.0, hora: '17:58', estado: 'PAGADA' },
    { id: 'TX-9914', mesa: '09', cuenta: 'CTA-104', metodo: 'EFECTIVO', monto: 54.0, hora: '17:40', estado: 'PAGADA' },
  ];

  // ---- usuarios ----
  const usuarios = [
    { id: 'u1', nombre: 'Camila Rivas', email: 'camila@nachopps.pe', rol: 'Administrador', estado: 'ACTIVO', ultimo: 'Ahora' },
    { id: 'u2', nombre: 'Diego Carrión', email: 'diego@nachopps.pe', rol: 'Mesero', estado: 'ACTIVO', ultimo: 'Hace 2 min' },
    { id: 'u3', nombre: 'Lucía Fernández', email: 'lucia@nachopps.pe', rol: 'Mesero', estado: 'ACTIVO', ultimo: 'Hace 5 min' },
    { id: 'u4', nombre: 'Marco Tello', email: 'marco@nachopps.pe', rol: 'Cajero', estado: 'ACTIVO', ultimo: 'Hace 12 min' },
    { id: 'u5', nombre: 'Rosa Medina', email: 'rosa@nachopps.pe', rol: 'Cocina', estado: 'ACTIVO', ultimo: 'Hace 1 min' },
    { id: 'u6', nombre: 'Jorge Ponce', email: 'jorge@nachopps.pe', rol: 'Gerente', estado: 'INACTIVO', ultimo: 'Hace 3 días' },
    { id: 'u7', nombre: 'Elena Soto', email: 'elena@nachopps.pe', rol: 'Cajero', estado: 'INACTIVO', ultimo: 'Hace 1 semana' },
  ];
  const roles = {
    Administrador: ['Operación completa', 'Usuarios y permisos', 'Inventario', 'Reportes', 'Configuración', 'Observabilidad'],
    Gerente: ['Reportes y métricas', 'Inventario (lectura)', 'Ventas y cierre', 'Operación (lectura)'],
    Mesero: ['Mesas', 'Tomar pedidos', 'Consultar cuentas', 'Reservas básicas'],
    Cajero: ['Caja y cobros', 'Transacciones', 'Cierre operativo'],
    Cocina: ['KDS / Pedidos', 'Cambiar estados de preparación'],
  };

  // ---- servicios (observabilidad) ----
  const servicios = [
    { n: 'Identidad / Auth', key: 'identity', estado: 'OK', lat: '38 ms', up: '99.98%' },
    { n: 'Mesas', key: 'tables', estado: 'OK', lat: '41 ms', up: '99.95%' },
    { n: 'Pedidos', key: 'orders', estado: 'OK', lat: '52 ms', up: '99.91%' },
    { n: 'Cuentas', key: 'accounts', estado: 'DEGRADED', lat: '320 ms', up: '99.40%', msg: 'Latencia elevada · consistencia eventual' },
    { n: 'Caja / Pagos', key: 'payments', estado: 'OK', lat: '60 ms', up: '99.97%' },
    { n: 'Reservas', key: 'reservations', estado: 'OK', lat: '44 ms', up: '99.93%' },
    { n: 'Inventario', key: 'inventory', estado: 'OK', lat: '49 ms', up: '99.90%' },
    { n: 'Reportes', key: 'reports', estado: 'OK', lat: '110 ms', up: '99.80%' },
    { n: 'Notificaciones', key: 'notifications', estado: 'DOWN', lat: '—', up: '97.20%', msg: 'Sin respuesta · reintentando conexión' },
  ];

  // ---- notificaciones ----
  const notificaciones = [
    { id: 'n1', sev: 'warn', ic: 'inventario', titulo: 'Stock bajo: Arroz con Mariscos', detalle: 'Quedan 6 unidades.', time: 'Hace 2 min', read: false, modulo: 'inventario' },
    { id: 'n2', sev: 'ok', ic: 'cocina', titulo: 'Pedido listo · Mesa 03', detalle: 'PED-2037 listo para entregar.', time: 'Hace 4 min', read: false, modulo: 'cocina' },
    { id: 'n3', sev: 'danger', ic: 'estado', titulo: 'Error de sincronización', detalle: 'Servicio de notificaciones sin respuesta.', time: 'Hace 5 min', read: false, modulo: 'estado' },
    { id: 'n4', sev: 'info', ic: 'reservas', titulo: 'Reserva próxima · 20:30', detalle: 'Familia Quispe (6) — Mesa 04.', time: 'Hace 8 min', read: true, modulo: 'reservas' },
    { id: 'n5', sev: 'ok', ic: 'caja', titulo: 'Cuenta cerrada · Mesa 04', detalle: 'TX-9920 · YAPE · S/ 145.00', time: 'Hace 12 min', read: true, modulo: 'caja' },
    { id: 'n6', sev: 'danger', ic: 'queue', titulo: 'DLQ: 3 eventos en cola', detalle: 'Cola de pagos con reintentos pendientes.', time: 'Hace 15 min', read: true, modulo: 'estado', admin: true },
    { id: 'n7', sev: 'warn', ic: 'inventario', titulo: 'Stock bajo: Cerveza Artesanal', detalle: 'Quedan 2 unidades.', time: 'Hace 18 min', read: true, modulo: 'inventario' },
  ];

  // ---- reportes ----
  const ventasPorHora = [
    { h: '12', v: 420 }, { h: '13', v: 980 }, { h: '14', v: 1240 }, { h: '15', v: 610 },
    { h: '16', v: 380 }, { h: '17', v: 540 }, { h: '18', v: 1180 }, { h: '19', v: 1620 }, { h: '20', v: 1980 },
  ];
  const topProductos = [
    { n: 'Lomo Saltado', q: 42, v: 1596 }, { n: 'Pisco Sour', q: 38, v: 836 },
    { n: 'Ceviche Clásico', q: 31, v: 1116 }, { n: 'Ají de Gallina', q: 27, v: 864 },
    { n: 'Chilcano', q: 24, v: 480 },
  ];
  const metodoVentas = [
    { m: 'YAPE', v: 4120, pct: 38 }, { m: 'TARJETA', v: 3480, pct: 32 },
    { m: 'EFECTIVO', v: 2180, pct: 20 }, { m: 'TRANSFERENCIA', v: 1090, pct: 10 },
  ];

  window.DATA = {
    fmt, fmtN, MESA_ST, PED_ST, CTA_ST, RES_ST,
    productos, cats, pedidos, mesas, cuentas, reservas, transacciones,
    usuarios, roles, servicios, notificaciones,
    ventasPorHora, topProductos, metodoVentas,
    metodos: ['EFECTIVO', 'TARJETA', 'YAPE', 'TRANSFERENCIA'],
    local: { nombre: 'Resto Barranco', ciudad: 'Barranco · Lima', turno: 'Turno Noche' },
  };
})();
