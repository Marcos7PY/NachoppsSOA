export interface StockBajoPayload {
  productoId: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

export interface StockDescontadoPayload {
  productoId: string;
  cantidad: number;
  motivo: string;
}
