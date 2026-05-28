import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AbrirCuentaCommand,
  CerrarCuentaCommand,
  DividirCuentaCommand
} from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return { status: 'OK', service: 'Cuentas' };
  }

  @Post()
  abrirCuenta(@Body() command: AbrirCuentaCommand) {
    return this.appService.abrirCuenta(command);
  }

  @Get('mesa/:mesaId')
  obtenerCuentaPorMesa(@Param('mesaId') mesaId: string) {
    return this.appService.obtenerCuentaPorMesa(mesaId);
  }

  @Get(':id')
  obtenerCuenta(@Param('id') id: string) {
    return this.appService.obtenerCuenta(id);
  }

  @Post(':id/dividir')
  dividirCuenta(@Param('id') id: string, @Body() command: DividirCuentaCommand) {
    return this.appService.dividirCuenta(id, command);
  }

  @Post(':id/cerrar')
  cerrarCuenta(@Param('id') id: string, @Body() command: CerrarCuentaCommand) {
    return this.appService.cerrarCuenta(id, command);
  }
}
