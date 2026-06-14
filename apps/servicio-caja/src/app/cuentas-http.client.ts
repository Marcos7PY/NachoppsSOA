import { Injectable } from '@nestjs/common';
import { ServiceTokenService } from '@org/shared-auth';
import { CircuitBreakerOptions } from '@org/resiliencia';
import axios from 'axios';

export interface CuentaRemota {
  id: string;
  mesaId: string;
  total: number;
  estado: string;
}

/**
 * T-40: cliente HTTP de caja→cuentas extraído del god-service. Encapsula el
 * token de servicio y las llamadas axios; el breaker conserva los umbrales que
 * ya tenía fetchCuenta dentro de AppService.
 */
@Injectable()
export class CuentasHttpClient {
  private readonly CUENTAS_URL =
    process.env['CUENTAS_SERVICE_URL'] ?? 'http://servicio-cuentas:3000/api';
  private readonly HTTP_TIMEOUT_MS = 5000;

  constructor(private readonly serviceTokenService: ServiceTokenService) {}

  private getServiceToken(): string {
    // Caja solo llama a cuentas → audiencia fija (T-17).
    return this.serviceTokenService.generateServiceToken('servicio-caja', 'servicio-cuentas');
  }

  @CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30_000 })
  async fetchCuenta(cuentaId: string): Promise<CuentaRemota> {
    const res = await axios.get<CuentaRemota>(`${this.CUENTAS_URL}/${cuentaId}`, {
      timeout: this.HTTP_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${this.getServiceToken()}` },
    });
    return res.data;
  }

  async cerrarCuenta(cuentaId: string, descuento: number) {
    const res = await axios.post(
      `${this.CUENTAS_URL}/${cuentaId}/cerrar`,
      { descuento },
      {
        timeout: this.HTTP_TIMEOUT_MS,
        headers: { Authorization: `Bearer ${this.getServiceToken()}` },
      },
    );
    return res.data as never;
  }
}
