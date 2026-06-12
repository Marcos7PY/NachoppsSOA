// data/compras.mock.ts — Insumos, proveedores y órdenes de compra (datos mock).
// NOTA: no existe backend de compras/proveedores. Toda la pantalla de Compras
// es mock hasta que se exponga un endpoint. Punto único de reemplazo.

export type OCEstado = 'BORRADOR' | 'ENVIADA' | 'PARCIAL' | 'RECIBIDA';

export interface Insumo {
  id: string;
  n: string;
  uni: string;
  stock: number;
  min: number;
  costo: number;
  prov: string;
}

export interface ProveedorCompra {
  id: string;
  n: string;
  ruc: string;
  cat: string;
  contacto: string;
  tel: string;
  dias: string;
  credito: string;
}

export interface OCItem {
  n: string;
  q: number;
  uni: string;
  costo: number;
}

export interface OrdenCompra {
  id: string;
  prov: string;
  estado: OCEstado;
  fecha: string;
  entrega: string;
  items: OCItem[];
}

export const INSUMOS: Insumo[] = [
  { id: 'i-pescado', n: 'Pescado (lenguado)', uni: 'kg', stock: 8, min: 10, costo: 28, prov: 'Pesquera del Sur' },
  { id: 'i-pulpo', n: 'Pulpo', uni: 'kg', stock: 1.2, min: 3, costo: 42, prov: 'Pesquera del Sur' },
  { id: 'i-limon', n: 'Limón', uni: 'kg', stock: 4, min: 6, costo: 6, prov: 'Mercado Mayorista' },
  { id: 'i-aji', n: 'Ají amarillo', uni: 'kg', stock: 5, min: 4, costo: 9, prov: 'Mercado Mayorista' },
  { id: 'i-res', n: 'Lomo de res', uni: 'kg', stock: 12, min: 8, costo: 38, prov: 'Carnes El Roble' },
  { id: 'i-pollo', n: 'Pollo', uni: 'kg', stock: 18, min: 10, costo: 12, prov: 'Avícola San Fernando' },
  { id: 'i-arroz', n: 'Arroz extra', uni: 'kg', stock: 40, min: 20, costo: 4.2, prov: 'Distribuidora Lima' },
  { id: 'i-pisco', n: 'Pisco Quebranta', uni: 'bot', stock: 2, min: 5, costo: 32, prov: 'Bodega Tabernero' },
  { id: 'i-inca', n: 'Inca Kola 500ml', uni: 'pack', stock: 6, min: 8, costo: 18, prov: 'Distribuidora Lima' },
  { id: 'i-gas', n: 'Balón de gas', uni: 'und', stock: 2, min: 2, costo: 58, prov: 'Gas Barranco' },
];

export const PROVEEDORES_COMPRAS: ProveedorCompra[] = [
  { id: 'pr-1', n: 'Pesquera del Sur', ruc: '20488112345', cat: 'Pescados y mariscos', contacto: 'Sra. Rojas', tel: '987 100 200', dias: 'Mar · Vie', credito: '15 días' },
  { id: 'pr-2', n: 'Mercado Mayorista', ruc: '10456789012', cat: 'Verduras y frutas', contacto: 'Puesto 142', tel: '986 222 333', dias: 'Diario', credito: 'Contado' },
  { id: 'pr-3', n: 'Carnes El Roble', ruc: '20512334567', cat: 'Carnes', contacto: 'Sr. Mendoza', tel: '985 444 555', dias: 'Lun · Jue', credito: '30 días' },
  { id: 'pr-4', n: 'Avícola San Fernando', ruc: '20100110011', cat: 'Aves', contacto: 'Ventas', tel: '01 612 1000', dias: 'Lun a Sáb', credito: '15 días' },
  { id: 'pr-5', n: 'Distribuidora Lima', ruc: '20533445566', cat: 'Abarrotes y bebidas', contacto: 'Carlos P.', tel: '984 666 777', dias: 'Mié · Sáb', credito: '30 días' },
  { id: 'pr-6', n: 'Bodega Tabernero', ruc: '20131234599', cat: 'Licores', contacto: 'Distribución', tel: '01 700 2200', dias: 'Quincenal', credito: '30 días' },
];

export function buildOC(): OrdenCompra[] {
  return [
    { id: 'OC-1042', prov: 'Pesquera del Sur', estado: 'ENVIADA', fecha: '02 Jun', entrega: '04 Jun',
      items: [{ n: 'Pescado (lenguado)', q: 12, uni: 'kg', costo: 28 }, { n: 'Pulpo', q: 5, uni: 'kg', costo: 42 }] },
    { id: 'OC-1041', prov: 'Bodega Tabernero', estado: 'ENVIADA', fecha: '01 Jun', entrega: '05 Jun',
      items: [{ n: 'Pisco Quebranta', q: 12, uni: 'bot', costo: 32 }] },
    { id: 'OC-1040', prov: 'Mercado Mayorista', estado: 'RECIBIDA', fecha: '01 Jun', entrega: '01 Jun',
      items: [{ n: 'Limón', q: 20, uni: 'kg', costo: 6 }, { n: 'Ají amarillo', q: 8, uni: 'kg', costo: 9 }] },
    { id: 'OC-1039', prov: 'Carnes El Roble', estado: 'BORRADOR', fecha: '02 Jun', entrega: '—',
      items: [{ n: 'Lomo de res', q: 15, uni: 'kg', costo: 38 }] },
    { id: 'OC-1038', prov: 'Distribuidora Lima', estado: 'RECIBIDA', fecha: '31 May', entrega: '31 May',
      items: [{ n: 'Arroz extra', q: 50, uni: 'kg', costo: 4.2 }, { n: 'Inca Kola 500ml', q: 10, uni: 'pack', costo: 18 }] },
  ];
}
