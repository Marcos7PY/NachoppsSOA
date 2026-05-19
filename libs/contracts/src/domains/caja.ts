export interface PagoRegistradoPayload {
  movimientoId: string;
  cuentaId: string;
  monto: number;
  medio: string;
}

export interface ArqueoRealizadoPayload {
  turnoId: string;
  diferencia: number;
}
