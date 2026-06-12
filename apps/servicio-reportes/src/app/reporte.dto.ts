import { IsDateString, IsOptional } from 'class-validator';

/** Rango opcional para los reportes ricos (plan 6.3). ISO-8601. */
export class ReporteRangoQuery {
  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;
}
